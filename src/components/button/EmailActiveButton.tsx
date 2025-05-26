import { useTranslation } from 'react-i18next'
import { getToken } from '../../apis/auth.api'
import { useSendConfirmationEmail } from '../../hooks/useSendConfirmationEmail'
import Loading from '../ui/Loading'
import { toast } from 'react-toastify'
import Error from '../ui/Error'
import { useCallback } from 'react'

const EmailActiveButton = ({
  email = '',
  isEmailActive = false,
  googleId = ''
}) => {
  const { t } = useTranslation()
  const { isPending, error, mutate } = useSendConfirmationEmail()
  const { _id } = getToken()

  const handleSendEmail = useCallback(() => {
    mutate(_id, {
      onSuccess: () => {
        toast.success(t('userDetail.sentVerifyEmailSuccess'))
      }
    })
  }, [mutate, _id, t])

  return (
    <div className='d-inline-flex flex-column'>
      {email && isEmailActive && (
        <div className='position-relative d-inline-block'>
          <span className='badge text-success cus-tooltip rounded-1 bg-success-rgba'>
            <i className='fa-regular fa-circle-check me-2'></i>
            {t('verified')}
          </span>
          <small className='cus-tooltip-msg'>Email {t('verified')}</small>
        </div>
      )}

      {googleId && (
        <div className='position-relative d-inline-block'>
          <span className='badge bg-primary d-inline-flex align-items-end cus-tooltip'>
            {googleId && (
              <img
                loading='lazy'
                className='social-img rounded-circle me-1 social-img--small'
                src='https://img.icons8.com/color/48/000000/google-logo.png'
                alt=''
              />
            )}
            linked
          </span>
          <small className='cus-tooltip-msg'>
            {t('userDetail.nonEditEmail')}
          </small>
        </div>
      )}

      {email && !isEmailActive && (
        <div className='position-relative d-inline-block'>
          {isPending && <Loading size='small' />}
          <button
            className='btn btn-warning btn-sm text-white cus-tooltip ripple'
            onClick={handleSendEmail}
            disabled={isPending}
          >
            <i className='fa-solid fa-envelope me-2'></i>
            {t('verifyNow')}!
          </button>
          <small className='cus-tooltip-msg'>{t('confirmEmail')}</small>
          {error && (
            <span>
              <Error
                msg={error instanceof Error ? error.message : String(error)}
              />
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default EmailActiveButton
