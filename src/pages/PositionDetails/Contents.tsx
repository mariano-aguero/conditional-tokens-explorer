import { truncateStringInTheMiddle } from 'util/tools'

import React from 'react'
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
import { Web3ContextStatus, useWeb3Context } from '../../contexts/Web3Context'
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
  const { status } = useWeb3Context()

  const [collateralSymbol, setCollateralSymbol] = React.useState('')

  const { collateralToken, id, indexSets } = position

  const numberedOutcomes = indexSets.map((indexSet: string) => {
    return Number(indexSet)
      .toString(2)
      .split('')
      .reverse()
      .map((value, index) => (value === '1' ? index + 1 : 0))
      .filter((n) => !!n)
  })
  const dropdownItems = [
    {
      onClick: () => {
        logger.log('Redeem')
      },
      text: 'Redeem',
    },
    {
      onClick: () => {
        logger.log('Split')
      },
      text: 'Split',
    },
  ]

  // TODO: refactoring this to make work wrap and unwrap
  const ERC20Amount = 100
  const ERC1155Amount = 0

  React.useEffect(() => {
    try {
      if (
        status._type === Web3ContextStatus.Infura ||
        status._type === Web3ContextStatus.Connected
      ) {
        const { networkConfig } = status
        const tokenSymbol = networkConfig.getTokenFromAddress(collateralToken.id).symbol
        setCollateralSymbol(tokenSymbol)
      }
    } catch (error) {
      logger.error(error)
    }
  }, [collateralToken.id, status])

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
        <TitleValue title="Partition" value={<PartitionStyled collections={numberedOutcomes} />} />
      </Row>
    </CenteredCard>
  )
}
