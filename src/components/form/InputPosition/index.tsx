import { positionString } from 'util/tools'
import { Errors } from 'util/types'

import { Error, ErrorContainer } from 'components/pureStyledComponents/Error'
import { Textfield } from 'components/pureStyledComponents/Textfield'
import { useBatchBalanceContext } from 'contexts/BatchBalanceContext'
import { useMultiPositionsContext } from 'contexts/MultiPositionsContext'
import { useWeb3ConnectedOrInfura } from 'contexts/Web3Context'
import { BigNumber } from 'ethers/utils'
import { SplitPositionFormMethods } from 'pages/SplitPosition/Form'
import React, { useEffect } from 'react'
import { FormContextValues } from 'react-hook-form'
import { GetMultiPositions_positions } from 'types/generatedGQL'

const isDataInSync = (
  positionsLoading: boolean,
  balancesLoading: boolean,
  positions: GetMultiPositions_positions[],
  balances: BigNumber[]
) => {
  return (
    !positionsLoading &&
    !balancesLoading &&
    positions.length &&
    balances.length &&
    balances.length === positions.length
  )
}

export interface InputPositionProps {
  barebones?: boolean
  formMethods: FormContextValues<SplitPositionFormMethods>
  onPositionChange: (position: Maybe<GetMultiPositions_positions>) => void
  splitFromPosition: boolean
}

export const InputPosition = ({
  barebones = false,
  formMethods: { register, setValue },
  onPositionChange,
  splitFromPosition,
  ...restProps
}: InputPositionProps) => {
  const { networkConfig } = useWeb3ConnectedOrInfura()
  const {
    errors: positionsErrors,
    loading: positionsLoading,
    positionIds,
    positions,
  } = useMultiPositionsContext()

  const { balances, errors: balancesErrors, loading: balancesLoading } = useBatchBalanceContext()

  const [positionToDisplay, setPositionToDisplay] = React.useState('')

  useEffect(() => {
    register('positionId', { required: splitFromPosition })
  }, [register, splitFromPosition])

  React.useEffect(() => {
    if (positionIds.length > 0) {
      if (isDataInSync(positionsLoading, balancesLoading, positions, balances)) {
        const token = networkConfig.getTokenFromAddress(positions[0].collateralToken.id)
        setPositionToDisplay(
          positionString(positions[0].conditionIds, positions[0].indexSets, balances[0], token)
        )
        onPositionChange(positions[0])
        setValue('positionId', positions[0].id, true)
      }
    } else {
      setPositionToDisplay('')
      onPositionChange(null)
      setValue('positionId', '', true)
    }
  }, [
    balances,
    networkConfig,
    positions,
    positionsLoading,
    balancesLoading,
    positionIds,
    onPositionChange,
    setValue,
  ])

  const errors = React.useMemo(() => [...positionsErrors, ...balancesErrors], [
    positionsErrors,
    balancesErrors,
  ])

  return (
    <>
      <Textfield
        disabled={true}
        error={!!errors.length}
        placeholder={'Please select a position...'}
        type="text"
        value={positionToDisplay}
        {...restProps}
      />
      {!!errors && (
        <ErrorContainer>
          {errors.map((error: Errors, index: number) => (
            <Error key={index}>{error}</Error>
          ))}
        </ErrorContainer>
      )}
    </>
  )
}
