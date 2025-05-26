/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../../apis/auth.api'
import { updateVariant, getVariantById } from '../../../apis/variant.api'
import { regexTest } from '../../../helper/test'
import Input from '../../ui/Input'
import Loading from '../../ui/Loading'
import Error from '../../ui/Error'
import MultiCategorySelector from '../../selector/MultiCategorySelector'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

interface VariantType {
  _id: string
  name: string
  categoryIds: { _id: string }[]
}

interface VariantState {
  name: string
  categoryIds: string[]
  defaultParentCategories: { _id: string }[]
  isValidName: boolean
}

const AdminEditVariantForm = ({ variantId = '' }: { variantId?: string }) => {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [newVariant, setNewVariant] = useState<VariantState>({
    name: '',
    categoryIds: [],
    defaultParentCategories: [],
    isValidName: true
  })
  const { _id } = getToken()

  const init = () => {
    setError('')
    setIsLoading(true)
    getVariantById(_id, variantId)
      .then((res: { data: { error?: string; variant?: VariantType } }) => {
        if (res.data.error) {
          setError(res.data.error)
        } else if (res.data.variant) {
          setNewVariant({
            name: res.data.variant.name,
            defaultParentCategories: res.data.variant.categoryIds,
            categoryIds: res.data.variant.categoryIds.map(
              (category) => category._id
            ),
            isValidName: true
          })
        }
        setIsLoading(false)
      })
      .catch(() => {
        setError('Server Error')
        setIsLoading(false)
      })
  }

  useEffect(() => {
    init()
  }, [variantId])

  const handleChange = (
    name: keyof VariantState,
    isValidName: keyof VariantState,
    value: string | string[]
  ) => {
    setNewVariant({
      ...newVariant,
      [name]: value,
      [isValidName]: true
    })
  }

  const handleValidate = (isValidName: keyof VariantState, flag: boolean) => {
    setNewVariant({
      ...newVariant,
      [isValidName]: flag
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { name, categoryIds, isValidName } = newVariant
    if (!name || !categoryIds || categoryIds.length === 0) {
      setNewVariant({
        ...newVariant,
        isValidName: regexTest('anything', name)
      })
      return
    }
    if (!isValidName) return
    onSubmit()
  }

  const onSubmit = () => {
    setError('')
    setIsLoading(true)
    updateVariant(_id, variantId, newVariant)
      .then((res: { data: { error?: string } }) => {
        if (res.data.error) setError(res.data.error)
        else toast.success(t('toastSuccess.variant.update'))
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
    <div className='container-fluid position-relative'>
      {isLoading && <Loading />}

      <form
        className='border bg-body rounded-1 row mb-2'
        onSubmit={handleSubmit}
      >
        <div className='col-12 bg-primary rounded-top-1 px-4 py-3'>
          <h1 className='text-white fs-5 m-0'>{t('variantDetail.edit')}</h1>
        </div>

        <div className='col-12 mt-4 px-4'>
          <MultiCategorySelector
            label={t('categoryDetail.chosenParentCategory')}
            isActive={false}
            isRequired={true}
            defaultValue={newVariant.defaultParentCategories as any}
            onSet={(categories) =>
              setNewVariant({
                ...newVariant,
                categoryIds: categories
                  ? categories.map((category) => category._id)
                  : []
              })
            }
          />
        </div>

        <div className='col-12 px-4 mt-2'>
          <Input
            type='text'
            required={true}
            label={t('variantDetail.name')}
            value={newVariant.name}
            isValid={newVariant.isValidName}
            feedback={t('categoryValid.validVariant')}
            validator='anything'
            onChange={(value) => handleChange('name', 'isValidName', value)}
            onValidate={(flag) => handleValidate('isValidName', flag)}
          />
        </div>

        {error && (
          <div className='col-12 px-4'>
            <Error msg={error} />
          </div>
        )}

        <div className='col-12 px-4 pb-3 d-flex justify-content-between align-items-center mt-4 res-flex-reverse-md'>
          <Link
            to='/admin/variant'
            className='text-decoration-none cus-link-hover res-w-100-md my-2'
          >
            <i className='fa-solid fa-angle-left'></i> {t('button.back')}
          </Link>
          <button
            type='submit'
            className='btn btn-primary ripple res-w-100-md rounded-1'
            style={{ width: '300px', maxWidth: '100%' }}
          >
            {t('button.save')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminEditVariantForm
