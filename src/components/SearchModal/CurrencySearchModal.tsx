import { Currency } from '@pancakeswap-libs/sdk'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../state'
import { selectList } from '../../state/lists/actions'
import useLast from '../../hooks/useLast'
import { useSelectedListUrl } from '../../state/lists/hooks'
import Modal from '../Modal'
import { CurrencySearch } from './CurrencySearch'
import { ListSelect } from './ListSelect'

interface CurrencySearchModalProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  // eslint-disable-next-line react/no-unused-prop-types
  showCommonBases?: boolean
  currencyType?: string
}

export default function CurrencySearchModal({
  isOpen,
  onDismiss,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  currencyType = '',
}: CurrencySearchModalProps) {
  const [listView, setListView] = useState<boolean>(false)
  const lastOpen = useLast(isOpen)
  const dispatch = useDispatch<AppDispatch>()

  const setList = useCallback(() => {
      dispatch(selectList(currencyType))
    },
    [dispatch, currencyType])

  useEffect(() => {
    if (isOpen && !lastOpen) {
      setList()
      setListView(false)
    }
  }, [isOpen, lastOpen, setList])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
      onDismiss()
    },
    [onDismiss, onCurrencySelect]
  )

  const handleClickChangeList = useCallback(() => {
    setListView(true)
  }, [])
  const handleClickBack = useCallback(() => {
    setListView(false)
  }, [])

  const selectedListUrl = useSelectedListUrl()
  const noListSelected = !selectedListUrl

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90} minHeight={listView ? 40 : noListSelected ? 0 : 80}>
      {listView ? (
        <ListSelect onDismiss={onDismiss} onBack={handleClickBack} />
      ) : noListSelected ? (
        <CurrencySearch
          isOpen={isOpen}
          onDismiss={onDismiss}
          onCurrencySelect={handleCurrencySelect}
          onChangeList={handleClickChangeList}
          selectedCurrency={selectedCurrency}
          otherSelectedCurrency={otherSelectedCurrency}
          showCommonBases={false}
          currencyType={currencyType}
        />
      ) : (
        <CurrencySearch
          isOpen={isOpen}
          onDismiss={onDismiss}
          onCurrencySelect={handleCurrencySelect}
          onChangeList={handleClickChangeList}
          selectedCurrency={selectedCurrency}
          otherSelectedCurrency={otherSelectedCurrency}
          showCommonBases={false}

        />
      )}
    </Modal>
  )
}
