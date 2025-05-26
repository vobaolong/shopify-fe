import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { CategoryType } from '../../@types/entity.types'
import { getToken } from '../../apis/auth.api'
import { getVariantById, updateVariant } from '../../apis/variant.api'
import { regexTest } from '../../helper/test'
import ConfirmDialog from '../ui/ConfirmDialog'
import Loading from '../ui/Loading'
import MultiCategorySelector from './MultiCategorySelector'
import { Input } from 'antd'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface NewVariantState {
  name: string
  categoryIds: string[] | ''
  defaultParentCategories: CategoryType[]
  isValidName: boolean
}

const AdminEditVariantForm = ({ variantId = '' }: { variantId?: string }) => {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [isConfirming, setIsConfirming] = useState(false)
  const queryClient = useQueryClient()
  const { _id } = getToken()

  const [newVariant, setNewVariant] = useState<NewVariantState>({
    name: '',
    categoryIds: '',
    defaultParentCategories: [],
    isValidName: true
  })

  const {
    data: variantData,
    isLoading,
    error: queryError
  } = useQuery({
    queryKey: ['variant', variantId],
    queryFn: () => getVariantById(_id, variantId),
    enabled: !!variantId
  })

  useEffect(() => {
    if (variantData) {
      const data = variantData.data || variantData
      if (data.error) {
        setError(data.error)
      } else {
        setNewVariant({
          name: data.variant.name,
          defaultParentCategories: data.variant.categoryIds,
          categoryIds: data.variant.categoryIds.map(
            (category: CategoryType) => category._id
          ),
          isValidName: true
        })
      }
    }
    if (queryError) {
      setError('Server Error')
    }
  }, [variantData, queryError])

  const updateVariantMutation = useMutation({
    mutationFn: () => updateVariant(_id, variantId, newVariant),
    onSuccess: (res) => {
      const data = res.data || res
      if (data.error) {
        setError(data.error)
      } else {
        toast.success(t('toastSuccess.variant.update'))
        queryClient.invalidateQueries({ queryKey: ['variant', variantId] })
      }
      setTimeout(() => {
        setError('')
      }, 3000)
    },
    onError: () => {
      setError('Server error')
      setTimeout(() => {
        setError('')
      }, 3000)
    }
  })

  const handleChange = (
    name: keyof NewVariantState,
    isValidName: keyof NewVariantState,
    value: string
  ) => {
    setNewVariant({
      ...newVariant,
      [name]: value,
      [isValidName]: true
    })
  }

  const handleValidate = (
    isValidName: keyof NewVariantState,
    flag: boolean
  ) => {
    setNewVariant({
      ...newVariant,
      [isValidName]: flag
    })
  }

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault()

    const { name, categoryIds } = newVariant
    if (!name || !categoryIds || categoryIds.length === 0) {
      setNewVariant({
        ...newVariant,
        isValidName: regexTest('anything', name)
      })
      return
    }

    const { isValidName } = newVariant
    if (!isValidName) return

    setIsConfirming(true)
  }

  const onSubmit = () => {
    setError('')
    updateVariantMutation.mutate()
  }

  return (
    <div className='container-fluid position-relative'>
      {isLoading && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('categoryDetail.edit')}
          onSubmit={onSubmit}
          message={t('message.edit')}
          onClose={() => setIsConfirming(false)}
        />
      )}

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
            defaultValue={newVariant.defaultParentCategories}
            onSet={(categories) =>
              setNewVariant({
                ...newVariant,
                categoryIds:
                  categories && Array.isArray(categories)
                    ? (categories as CategoryType[]).map(
                        (category) => category._id
                      )
                    : ''
              })
            }
          />
        </div>

        <div className='col-12 px-4 mt-2'>
          <Input
            type='text'
            required={true}
            placeholder={t('variantDetail.name')}
            value={newVariant.name}
            onChange={(e) =>
              handleChange('name', 'isValidName', e.target.value)
            }
          />
          {!newVariant.isValidName && (
            <div className='text-danger'>{t('categoryValid.validVariant')}</div>
          )}
        </div>

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
            onClick={handleSubmit}
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
