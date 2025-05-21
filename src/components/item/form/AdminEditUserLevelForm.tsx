import { useState, useEffect } from 'react'
import { getToken } from '../../../apis/auth'
import { updateUserLevel } from '../../../apis/level'
import { regexTest, numberTest } from '../../../helper/test'
import Input from '../../ui/Input'
import Error from '../../ui/Error'
import Loading from '../../ui/Loading'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

interface UserLevelType {
  _id: string
  name: string
  minPoint: number
  discount: { $numberDecimal: number }
  color: string
}

interface LevelState {
  name: string
  minPoint: number
  discount: number
  color: string
  isValidName: boolean
  isValidMinPoint: boolean
  isValidDiscount: boolean
  isValidColor: boolean
}

const AdminEditUserLevelForm = ({
  oldLevel,
  onRun = () => {}
}: {
  oldLevel?: UserLevelType
  onRun?: () => void
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { t } = useTranslation()
  const [level, setLevel] = useState<LevelState>({
    name: '',
    minPoint: 0,
    discount: 0,
    color: '',
    isValidName: true,
    isValidMinPoint: true,
    isValidDiscount: true,
    isValidColor: true
  })
  const { _id } = getToken()

  useEffect(() => {
    if (oldLevel) {
      setLevel({
        name: oldLevel.name || '',
        minPoint: oldLevel.minPoint || 0,
        discount: oldLevel.discount?.$numberDecimal || 0,
        color: oldLevel.color || '',
        isValidName: true,
        isValidMinPoint: true,
        isValidDiscount: true,
        isValidColor: true
      })
    }
  }, [oldLevel])

  const handleChange = (
    name: keyof LevelState,
    isValidName: keyof LevelState,
    value: string | number
  ) => {
    setLevel({
      ...level,
      [name]: value,
      [isValidName]: true
    })
  }

  const handleValidate = (isValidName: keyof LevelState, flag: boolean) => {
    setLevel({
      ...level,
      [isValidName]: flag
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { name, minPoint, discount, color } = level
    if (
      !name ||
      !Number.isFinite(minPoint) ||
      !Number.isFinite(discount) ||
      !color
    ) {
      setLevel({
        ...level,
        isValidName: regexTest('name', name),
        isValidMinPoint:
          numberTest('positive', minPoint) || numberTest('zero', minPoint),
        isValidDiscount: numberTest('zeroTo100', discount),
        isValidColor: regexTest('anything', color)
      })
      return
    }
    const { isValidName, isValidMinPoint, isValidDiscount, isValidColor } =
      level
    if (!isValidName || !isValidMinPoint || !isValidDiscount || !isValidColor)
      return
    onSubmit()
  }

  const onSubmit = () => {
    setError('')
    setIsLoading(true)
    updateUserLevel(oldLevel?._id || '', level)
      .then((data: any) => {
        if (data.error) setError(data.error)
        else {
          toast.success(t('toastSuccess.level.edit'))
          if (onRun) onRun()
        }
        setIsLoading(false)
        setTimeout(() => {
          setError('')
        }, 3000)
      })
      .catch(() => {
        setError('Sever error')
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
            type='text'
            label={t('levelDetail.name')}
            value={level.name}
            isValid={level.isValidName}
            feedback={t('levelDetail.validName')}
            validator='level'
            required={true}
            onChange={(value) => handleChange('name', 'isValidName', value)}
            onValidate={(flag) => handleValidate('isValidName', flag)}
          />
        </div>

        <div className='col-12'>
          <Input
            type='number'
            label={t('levelDetail.floorPoint')}
            value={level.minPoint.toString()}
            isValid={level.isValidMinPoint}
            feedback={t('levelDetail.validFloorPoint')}
            validator='positive|zero'
            required={true}
            onChange={(value) =>
              handleChange('minPoint', 'isValidMinPoint', value)
            }
            onValidate={(flag) => handleValidate('isValidMinPoint', flag)}
          />
        </div>

        <div className='col-12'>
          <Input
            type='number'
            label={`${t('levelDetail.discount')} (%)`}
            value={level.discount.toString()}
            isValid={level.isValidDiscount}
            feedback={t('levelDetail.validDiscount')}
            validator='zeroTo100'
            required={true}
            onChange={(value) =>
              handleChange('discount', 'isValidDiscount', value)
            }
            onValidate={(flag) => handleValidate('isValidDiscount', flag)}
          />
        </div>

        <div className='col-12'>
          <Input
            type='text'
            label={t('levelDetail.color')}
            value={level.color}
            isValid={level.isValidColor}
            feedback={t('levelDetail.validColor')}
            validator='anything'
            required={true}
            onChange={(value) => handleChange('color', 'isValidColor', value)}
            onValidate={(flag) => handleValidate('isValidDiscount', flag)}
          />
        </div>

        {error && (
          <div className='col-12'>
            <Error msg={error} />
          </div>
        )}

        <div className='col-12 d-grid mt-4'>
          <button type='submit' className='btn btn-primary ripple rounded-1'>
            {t('button.save')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminEditUserLevelForm
