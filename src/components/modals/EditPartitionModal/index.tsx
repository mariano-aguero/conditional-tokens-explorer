import { useQuery } from '@apollo/react-hooks'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import { Button } from '../../buttons/Button'
import { ButtonControl, ButtonControlType } from '../../buttons/ButtonControl'
import { Modal, ModalProps } from '../../common/Modal'
import { Outcome } from '../../partitions/Outcome'
import { ButtonContainer } from '../../pureStyledComponents/ButtonContainer'
import { CardSubtitle } from '../../pureStyledComponents/CardSubtitle'
import { CardText } from '../../pureStyledComponents/CardText'
import {
  StripedList,
  StripedListEmpty,
  StripedListItemLessPadding,
} from '../../pureStyledComponents/StripedList'
import { TitleControlButton } from '../../pureStyledComponents/TitleControl'
import { InfoCard } from '../../statusInfo/InfoCard'
import { InlineLoading } from '../../statusInfo/InlineLoading'
import { TitleValue } from '../../text/TitleValue'

const DraggableCollection = styled(StripedListItemLessPadding)`
  &.dragOver {
    background-color: rgba(0, 156, 180, 0.15);
  }
`

const DraggableCollectionInner = styled.div`
  align-items: center;
  display: flex;
  flex-grow: 1;
  padding-right: 15px;
`

const DraggableOutcome = styled(Outcome)`
  cursor: pointer;

  &.isDragging {
    cursor: move;

    .outcomeHorizontalLine {
      display: none;
    }
  }
`

const AddableOutcome = styled(Outcome)`
  cursor: pointer;
  height: 28px;
  width: 28px;

  .outcomeHorizontalLine {
    display: none;
  }
`

export const EditPartitionModal: React.FC<ModalProps> = (props) => {
  const { onRequestClose, ...restProps } = props
  const dragOverClass = 'dragOver'

  // const isLoading = !conditionIdToSearch && loading
  // const isSearching = conditionIdToSearch && loading

  const mockedNumberedOutcomes = [[1, 4, 3], [2, 5], [10, 11], [6, 8, 9], [7]]
  const [allCollections, setAllCollections] = useState(mockedNumberedOutcomes)
  const [newCollection, setNewCollection] = useState<any>([])
  const [availableOutcomes, setAvailableOutcomes] = useState<any>([])
  const [removeCollectionsQueue, setRemoveCollectionsQueue] = useState([])
  const [draggedOutcome, setDraggedOutcome] = useState<any>()

  const resetClassName = (element: any, className: string) =>
    element.currentTarget.className.replace(className, '')

  const removeOutcomeFromCollection = useCallback(
    (collectionIndex, outcomeIndex) => {
      console.log(allCollections[collectionIndex][outcomeIndex])
      setAvailableOutcomes([...availableOutcomes, allCollections[collectionIndex][outcomeIndex]])

      allCollections[collectionIndex].splice(outcomeIndex, 1)

      setAllCollections([
        ...allCollections.filter((item) => {
          return item.length > 0
        }),
      ])
    },
    [availableOutcomes, allCollections]
  )

  const onDrop = useCallback(
    (e, collectionToIndex) => {
      const collectionFromIndex = e.dataTransfer.getData('collectionFromIndex')
      const outcomeIndex = e.dataTransfer.getData('outcomeIndex')

      e.currentTarget.className = resetClassName(e, dragOverClass)

      if (collectionToIndex === collectionFromIndex) return

      allCollections[collectionFromIndex].splice(outcomeIndex, 1)
      allCollections[collectionToIndex].push(draggedOutcome)
      setAllCollections([...allCollections.filter((collection) => collection.length > 0)])
    },
    [allCollections, draggedOutcome]
  )

  const onDragOver = useCallback((e) => {
    e.preventDefault()

    if (e.currentTarget.className.search(dragOverClass) === -1) {
      e.currentTarget.className = `${e.currentTarget.className} ${dragOverClass}`
    }
  }, [])

  const onDragLeave = useCallback((e) => {
    e.currentTarget.className = resetClassName(e, 'dragOver')
  }, [])

  const onDragStart = useCallback((e, collectionFromIndex, outcome, outcomeIndex) => {
    const draggingClass = 'isDragging'

    if (e.currentTarget.className.search(draggingClass) === -1) {
      e.currentTarget.className = `${e.currentTarget.className} ${draggingClass}`
    }

    e.dataTransfer.setData('collectionFromIndex', collectionFromIndex)
    e.dataTransfer.setData('outcomeIndex', outcomeIndex)
    setDraggedOutcome(outcome)
  }, [])

  const onDragEnd = useCallback((e) => {
    e.currentTarget.className = resetClassName(e, 'isDragging')
  }, [])

  const addOutcomeToNewCollection = useCallback(
    (outcomeIndex) => {
      setNewCollection([...newCollection, availableOutcomes[outcomeIndex]])
      availableOutcomes.splice(outcomeIndex, 1)
    },
    [newCollection, availableOutcomes]
  )

  const removeOutcomeFromNewCollection = useCallback(
    (outcomeIndex) => {
      setAvailableOutcomes([...availableOutcomes, newCollection[outcomeIndex]])
      newCollection.splice(outcomeIndex, 1)
    },
    [newCollection, availableOutcomes]
  )

  const addNewCollection = useCallback(() => {
    setAllCollections([[...newCollection], ...allCollections])
    newCollection.length = 0
  }, [newCollection, allCollections])

  const clearOutcomesFromNewCollection = useCallback(() => {
    setAvailableOutcomes([...availableOutcomes, ...newCollection])
    newCollection.length = 0
  }, [availableOutcomes, newCollection])

  const addAllAvailableOutcomesToNewCollection = useCallback(() => {
    setNewCollection([...newCollection, ...availableOutcomes])
    availableOutcomes.length = 0
  }, [availableOutcomes, newCollection])

  const notEnoughCollections = allCollections.length < 2

  return (
    <Modal title="Edit Partition" {...restProps}>
      <>
        <CardSubtitle>Add Outcomes To Collection</CardSubtitle>
        {availableOutcomes.length ? (
          <>
            <CardText>Click on an outcome to add it to the collection.</CardText>
            <div>
              {availableOutcomes.map((outcome: unknown | any, outcomeIndex: number) => {
                return (
                  <AddableOutcome
                    key={outcomeIndex}
                    onClick={() => {
                      addOutcomeToNewCollection(outcomeIndex)
                    }}
                    outcome={outcome}
                  />
                )
              })}
            </div>
          </>
        ) : (
          <CardText>
            No outcomes available. You can make them available by removing them from collections
            below.
          </CardText>
        )}
        <CardSubtitle>New Collection</CardSubtitle>
        <div>
          {newCollection.map((outcome: unknown | any, outcomeIndex: number) => {
            return (
              <DraggableOutcome
                key={outcomeIndex}
                onClick={() => {
                  removeOutcomeFromNewCollection(outcomeIndex)
                }}
                outcome={outcome}
              />
            )
          })}
        </div>
        <Button
          disabled={newCollection.length === 0}
          onClick={() => {
            addNewCollection()
          }}
          style={{ marginTop: 'auto' }}
        >
          Add
        </Button>
        <TitleValue
          title="Collections"
          titleControl={
            <TitleControlButton
              onClick={() => {
                console.error('Delete allllll')
              }}
            >
              Edit Partition
            </TitleControlButton>
          }
          value={
            <>
              <CardText>
                Click on an outcome to remove it from a collection. You can also drag outcomes
                across collections.
              </CardText>
              <StripedList>
                {allCollections.length > 0 ? (
                  allCollections.map((outcomeList: unknown | any, collectionIndex: number) => {
                    return (
                      <DraggableCollection
                        key={collectionIndex}
                        onDragLeave={onDragLeave}
                        onDragOver={onDragOver}
                        onDrop={(e) => onDrop(e, collectionIndex)}
                      >
                        <>
                          <DraggableCollectionInner>
                            {outcomeList.map((outcome: string, outcomeIndex: number) => (
                              <DraggableOutcome
                                draggable
                                key={outcomeIndex}
                                onClick={() => {
                                  removeOutcomeFromCollection(collectionIndex, outcomeIndex)
                                }}
                                onDragEnd={onDragEnd}
                                onDragStart={(e: any) => {
                                  onDragStart(e, collectionIndex, outcome, outcomeIndex)
                                }}
                                outcome={outcome}
                              />
                            ))}
                          </DraggableCollectionInner>
                          <ButtonControl buttonType={ButtonControlType.delete} />
                        </>
                      </DraggableCollection>
                    )
                  })
                ) : (
                  <StripedListEmpty>No collections.</StripedListEmpty>
                )}
              </StripedList>
            </>
          }
        />
        <ButtonContainer>
          <Button disabled={notEnoughCollections} onClick={onRequestClose}>
            Save
          </Button>
        </ButtonContainer>
      </>
      {/* )} */}
    </Modal>
  )
}
