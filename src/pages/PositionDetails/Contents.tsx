import { positionString, truncateStringInTheMiddle } from 'util/tools'
import { Token } from 'util/types'

import { useBalanceForPosition } from 'hooks/useBalanceForPosition'
import { useCollateral } from 'hooks/useCollateral'
import { useLocalStorage } from 'hooks/useLocalStorageValue'
import React, { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { Button } from '../../components/buttons/Button'
import { ButtonCopy } from '../../components/buttons/ButtonCopy'
import { ButtonDropdownCircle } from '../../components/buttons/ButtonDropdownCircle'
import { CenteredCard } from '../../components/common/CenteredCard'
import { Dropdown, DropdownItem, DropdownPosition } from '../../components/common/Dropdown'
import { SetAllowance } from '../../components/common/SetAllowance'
import { TokenIcon } from '../../components/common/TokenIcon'
import { Partition } from '../../components/partitions/Partition'
import { Row } from '../../components/pureStyledComponents/Row'
import { StripedList, StripedListItem } from '../../components/pureStyledComponents/StripedList'
import { TitleValue } from '../../components/text/TitleValue'
import { useWeb3ConnectedOrInfura } from '../../contexts/Web3Context'
import { GetPosition_position as Position } from '../../types/generatedGQL'
import { getLogger } from '../../util/logger'

const CollateralText = styled.span`
  color: ${(props) => props.theme.colors.darkerGray};
  font-size: 15px;
  font-weight: 400;
  line-height: 1.2;
  text-align: left;
`

const CollateralTextStrong = styled.span`
  font-weight: 600;
`

const CollateralTextAmount = styled.span<{ italic?: boolean }>`
  font-style: ${(props) => (props.italic ? 'italic' : 'normal')};
`

const CollateralWrapButton = styled(Button)`
  font-size: 14px;
  font-weight: 600;
  height: 24px;
  width: 80px;
`

const StripedListStyled = styled(StripedList)`
  margin-top: 6px;
`

const PartitionStyled = styled(Partition)`
  margin-top: 6px;
`

const logger = getLogger('ConditionDetails')

interface Props {
  position: Position
}

export const Contents = ({ position }: Props) => {
  const { networkConfig } = useWeb3ConnectedOrInfura()
  const history = useHistory()
  const { setValue } = useLocalStorage('positionid')
  const { balance, error, loading } = useBalanceForPosition(position.id)

  const positionCollateral = useCollateral(position ? position.collateralToken.id : '')
  const [collateralSymbol, setCollateralSymbol] = React.useState('')
  const { collateralToken, id, indexSets } = position

  const dropdownItems = useMemo(() => {
    return [
      {
        onClick: () => {
          setValue(id)
          history.push(`/redeem`)
        },
        text: 'Redeem',
      },
      {
        onClick: () => {
          setValue(id)
          history.push(`/split`)
        },
        text: 'Split',
      },
    ]
  }, [id, history, setValue])

  // TODO: refactoring this to make work wrap and unwrap
  const ERC20Amount = 100
  const ERC1155Amount = 0

  const positionPreview = React.useMemo(() => {
    if (positionCollateral && !loading && !error && balance) {
      return positionString(position.conditionIds, position.indexSets, balance, positionCollateral)
    }
  }, [positionCollateral, position, loading, error, balance])

  React.useEffect(() => {
    if (positionCollateral) {
      setCollateralSymbol(positionCollateral.symbol)
    } else {
      setCollateralSymbol('')
    }
  }, [positionCollateral])

  return (
    <CenteredCard
      dropdown={
        <Dropdown
          dropdownButtonContent={<ButtonDropdownCircle />}
          dropdownPosition={DropdownPosition.right}
          items={dropdownItems.map((item, index) => (
            <DropdownItem key={index} onClick={item.onClick}>
              {item.text}
            </DropdownItem>
          ))}
        />
      }
    >
      <Row marginBottomXL>
        <TitleValue
          title="Position Id"
          value={
            <>
              {truncateStringInTheMiddle(id, 8, 6)}
              <ButtonCopy value={id} />
            </>
          }
        />
        <TitleValue title="Collateral Token" value={<TokenIcon symbol={collateralSymbol} />} />
        <TitleValue
          title="Contract Address"
          value={
            <>
              {truncateStringInTheMiddle(collateralToken.id, 8, 6)}
              <ButtonCopy value={collateralToken.id} />
            </>
          }
        />
      </Row>
      <SetAllowance
        collateral={collateralToken}
        fetching={false}
        finished={false}
        onUnlock={() => {
          return 1
        }}
      />
      <Row cols="1fr" marginBottomXL>
        <TitleValue
          title="Collateral Wrapping"
          value={
            <StripedListStyled>
              <StripedListItem>
                <CollateralText>
                  <CollateralTextStrong>ERC20:</CollateralTextStrong>{' '}
                  <CollateralTextAmount>
                    {ERC20Amount} {collateralSymbol}
                  </CollateralTextAmount>
                </CollateralText>
                <CollateralWrapButton>Wrap</CollateralWrapButton>
              </StripedListItem>
              <StripedListItem>
                <CollateralText>
                  <CollateralTextStrong>ERC1155:</CollateralTextStrong>{' '}
                  <CollateralTextAmount>
                    {ERC1155Amount
                      ? `${ERC1155Amount} ${collateralSymbol}`
                      : 'No unwrapper collateral yet.'}
                  </CollateralTextAmount>
                </CollateralText>
                <CollateralWrapButton disabled={!ERC1155Amount}>Unwrap</CollateralWrapButton>
              </StripedListItem>
            </StripedListStyled>
          }
        />
      </Row>
      <Row cols="1fr" marginBottomXL>
        {/* <TitleValue title="Partition" value={<PartitionStyled collections={numberedOutcomes} />} /> */}
        <TitleValue
          title="Position"
          value={<StripedListItem>{positionPreview || ''} </StripedListItem>}
        />
      </Row>
    </CenteredCard>
  )
}
