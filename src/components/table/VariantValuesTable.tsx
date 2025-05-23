/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, Fragment } from 'react'
import { getToken } from '../../apis/auth'
import {
  listValues,
  listActiveValues,
  removeValue,
  restoreValue
} from '../../apis/variant'
import DeletedLabel from '../label/DeletedLabel'
import Loading from '../ui/Loading'
import ConfirmDialog from '../ui/ConfirmDialog'
import Modal from '../ui/Modal'
import AddVariantValueItem from '../item/AddVariantValueItem'
import AdminEditVariantValueForm from '../item/form/AdminEditVariantValueForm'
import ActiveLabel from '../label/ActiveLabel'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { humanReadableDate } from '../../helper/humanReadable'
import Error from '../ui/Error'

const VariantValuesTable = ({
  heading = true,
  variantId = '',
  isActive = false
}) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [isConfirmingRestore, setIsConfirmingRestore] = useState(false)
  const [run, setRun] = useState(false)
  const [error, setError] = useState('')
  const [deletedVariantValue, setDeletedVariantValue] = useState({})
  const [restoredVariantValue, setRestoredVariantValue] = useState({})
  const [editedVariantValue, setEditedVariantValue] = useState({})
  const [variantValues, setVariantValues] = useState([])
  const [variant, setVariant] = useState({})
  const { _id } = getToken()

  useEffect(() => {
    setIsLoading(true)
    if (!isActive) {
      listValues(_id, variantId)
        .then((data) => {
          if (data.error) {
            setError(data.error)
          } else {
            setVariantValues(data.variantValues)
            setVariant(data.variant)
          }
          setIsLoading(false)
        })
        .catch(() => {
          setError('Server Error')
          setIsLoading(false)
        })
    } else {
      listActiveValues(variantId)
        .then((data) => {
          if (data.error) setError(data.error)
          else {
            setVariantValues(data.variantValues)
            setVariant(data.variant)
          }
          setIsLoading(false)
        })
        .catch(() => {
          setError('Server Error')
          setIsLoading(false)
        })
    }
  }, [variantId, run])

  const handleDelete = (variantValue) => {
    setDeletedVariantValue(variantValue)
    setIsConfirmingDelete(true)
  }

  const handleRestore = (variantValue) => {
    setRestoredVariantValue(variantValue)
    setIsConfirmingRestore(true)
  }

  const onSubmitDelete = () => {
    setIsLoading(true)
    removeValue(_id, deletedVariantValue._id)
      .then((data) => {
        if (data.error) setError(data.error)
        else {
          toast.success(t('toastSuccess.variantValue.delete'))
          setRun(!run)
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

  const onSubmitRestore = () => {
    setIsLoading(true)
    restoreValue(_id, restoredVariantValue._id)
      .then((data) => {
        if (data.error) setError(data.error)
        else {
          toast.success(t('toastSuccess.variantValue.restore'))
          setRun(!run)
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
      {error && <Error msg={error} />}
      {isConfirmingDelete && (
        <ConfirmDialog
          title={t('dialog.deleteValue')}
          color='danger'
          onSubmit={onSubmitDelete}
          onClose={() => setIsConfirmingDelete(false)}
        />
      )}
      {isConfirmingRestore && (
        <ConfirmDialog
          title={t('dialog.restoreValue')}
          onSubmit={onSubmitRestore}
          onClose={() => setIsConfirmingRestore(false)}
        />
      )}

      {isLoading && <Loading />}
      <div className='p-3 box-shadow bg-body rounded-2'>
        <div className=' d-flex align-items-center justify-content-between mb-3'>
          {heading && (
            <h5 className='text-start'>
              {t('variantDetail.value.valueOf')}{' '}
              <span className='text-primary'>{variant?.name}</span>
            </h5>
          )}
          <AddVariantValueItem
            variantId={variantId}
            variantName={variant?.name}
            onRun={() => setRun(!run)}
          />
        </div>
        <div className='table-scroll my-2'>
          <table className='table align-middle table-hover table-sm text-start'>
            <thead>
              <tr>
                <th scope='col' className='text-center'>
                  #
                </th>
                <th scope='col'>{t('variantDetail.value.name')}</th>
                {!isActive && (
                  <Fragment>
                    <th scope='col'>{t('status.status')}</th>
                    <th scope='col'>{t('createdAt')}</th>
                    <th scope='col'>
                      <span>{t('action')}</span>
                    </th>
                  </Fragment>
                )}
              </tr>
            </thead>
            <tbody>
              {variantValues.map((value, index) => (
                <tr key={index}>
                  <th scope='row' className='text-center'>
                    {index + 1}
                  </th>
                  <td>{value.name}</td>
                  {!isActive && (
                    <Fragment>
                      <td style={{ fontSize: '0.9rem' }}>
                        {value.isDeleted ? <DeletedLabel /> : <ActiveLabel />}
                      </td>
                      <td>{humanReadableDate(value.createdAt)}</td>
                      <td className='text-nowrap'>
                        <div className='position-relative d-inline-block'>
                          <button
                            type='button'
                            className='btn btn-sm btn-outline-primary ripple me-2 rounded-1 cus-tooltip'
                            data-bs-toggle='modal'
                            data-bs-target='#edit-variant-value-form'
                            onClick={() => setEditedVariantValue(value)}
                          >
                            <i className='fa-duotone fa-pen-to-square'></i>
                          </button>
                          <span className='cus-tooltip-msg'>
                            {t('button.edit')}
                          </span>
                        </div>
                        <div className='position-relative d-inline-block'>
                          {!value.isDeleted ? (
                            <button
                              type='button'
                              className='btn btn-sm btn-outline-danger ripple rounded-1 cus-tooltip'
                              onClick={() => handleDelete(value)}
                            >
                              <i className='fa-solid fa-trash-alt '></i>
                            </button>
                          ) : (
                            <button
                              type='button'
                              className='btn btn-sm btn-outline-success ripple'
                              onClick={() => handleRestore(value)}
                            >
                              <i className='fa-solid fa-trash-can-arrow-up'></i>
                            </button>
                          )}
                          <span className='cus-tooltip-msg'>
                            {!value.isDeleted
                              ? t('button.delete')
                              : t('button.restore')}
                          </span>
                        </div>
                      </td>
                    </Fragment>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='d-flex justify-content-between align-items-center px-4'>
          <small>
            {t('showing')} {variantValues.length || 0} {t('result')}
          </small>
        </div>
      </div>

      {!isActive && (
        <Modal
          id='edit-variant-value-form'
          hasCloseBtn={false}
          title={t('variantDetail.value.edit')}
        >
          <AdminEditVariantValueForm
            oldVariantValue={editedVariantValue}
            onRun={() => setRun(!run)}
          />
        </Modal>
      )}
    </div>
  )
}

export default VariantValuesTable
