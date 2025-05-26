import { useState } from 'react'
import { getToken } from '../../../apis/auth.api'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import { createTransactionByStore } from '../../../apis/transaction.api'
import { regexTest, numberTest } from '../../../helper/test'
import Input from '../../ui/Input'
import Loading from '../../ui/Loading'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Error from '../../ui/Error'

interface TransactionState {
  isUp: string
  amount: number
  currentPassword: string
  isValidAmount: boolean
  isValidCurrentPassword: boolean
}

interface CreateDepositTransactionFormProps {
  eWallet: number | string
  storeId?: string
  onRun?: () => void
}

const CreateDepositTransactionForm = ({
  eWallet,
  storeId = '',
  onRun
}: CreateDepositTransactionFormProps) => {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [updateDispatch] = useUpdateDispatch()

  const { _id: userId } = getToken()

  const [transaction, setTransaction] = useState<TransactionState>({
    isUp: 'true',
    amount: 10000000,
    currentPassword: '',
    isValidAmount: true,
    isValidCurrentPassword: true
  })

  const handleChange = (
    name: keyof TransactionState,
    isValidName: keyof TransactionState,
    value: string | number
  ) => {
    setTransaction({
      ...transaction,
      [name]: value,
      [isValidName]: true
    })
  }

  const handleValidate = (
    isValidName: keyof TransactionState,
    flag: boolean
  ) => {
    if (isValidName === 'isValidAmount') {
      setTransaction({
        ...transaction
      })
    } else
      setTransaction({
        ...transaction,
        [isValidName]: flag
      })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { amount, currentPassword } = transaction

    if (!userId || !storeId || !amount || !currentPassword) {
      setTransaction({
        ...transaction,
        isValidAmount:
          numberTest('positive', amount) &&
          parseFloat(transaction.amount.toString()) <=
            parseFloat(eWallet.toString()),
        isValidCurrentPassword: regexTest('password', currentPassword)
      })
      return
    }

    if (!transaction.isValidAmount || !transaction.isValidCurrentPassword)
      return

    onSubmit()
  }

  const onSubmit = () => {
    setError('')
    setIsLoading(true)
    createTransactionByStore(userId, transaction, storeId)
      .then((res: { data: { error?: string; store?: any } }) => {
        if (res.data.error) setError(res.data.error)
        else {
          setTransaction({
            ...transaction,
            amount: 100000,
            currentPassword: '',
            isValidAmount: true,
            isValidCurrentPassword: true
          })
          updateDispatch('seller', res.data.store)
          toast.success(t('toastSuccess.withdraw'))
          if (onRun) onRun()
        }
        setIsLoading(false)
        setTimeout(() => {
          setError('')
        }, 3000)
      })
      .catch(() => {
        setError('Server Error')
        setIsLoading(false)
        setTimeout(() => {
          setError('')
        }, 3000)
      })
  }

  return (
    <div className='position-relative'>
      {isLoading && <Loading />}

      <form className='row mb-2' onSubmit={handleSubmit}>
        <div className='col-12'>
          <Input
            type='number'
            label={`${t('transactionDetail.amount')} (₫)`}
            value={transaction.amount.toString()}
            isValid={transaction.isValidAmount}
            required={true}
            feedback={t('transactionDetail.amountValid')}
            validator='positive'
            onChange={(value) => handleChange('amount', 'isValidAmount', value)}
            onValidate={(flag) => handleValidate('isValidAmount', flag)}
          />
        </div>

        <div className='col-12'>
          <Input
            type='password'
            label={t('transactionDetail.currentPw')}
            value={transaction.currentPassword}
            required={true}
            isValid={transaction.isValidCurrentPassword}
            feedback={t('transactionDetail.currentPwValid')}
            validator='password'
            onChange={(value) =>
              handleChange('currentPassword', 'isValidCurrentPassword', value)
            }
            onValidate={(flag) =>
              handleValidate('isValidCurrentPassword', flag)
            }
          />
        </div>

        {error && (
          <div className='col-12'>
            <Error msg={error} />
          </div>
        )}

        <div className='col-12 d-grid mt-4'>
          <button type='submit' className='btn btn-primary ripple rounded-1'>
            {t('button.submit')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateDepositTransactionForm
