/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { changePassword } from '../../apis/auth.api'
import { Spin, Alert } from 'antd'
import Logo from '../../components/layout/menu/Logo'
import { Input } from 'antd'
import { regexTest } from '../../constants/regex.constant'
import { useTranslation } from 'react-i18next'
import checkImg from '../../assets/check.svg'
const ChangePasswordPage = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [redirect, setRedirect] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(true)

  const { passwordCode } = useParams()
  const [account, setAccount] = useState({
    password: '',
    isValidPassword: true,
    passwordCode: passwordCode
  })

  useEffect(() => {
    setAccount({
      ...account,
      passwordCode: passwordCode
    })
  }, [passwordCode])

  const handleChange = (name, isValidName, value) => {
    setAccount({
      ...account,
      [name]: value,
      [isValidName]: true
    })
  }

  const handleValidate = (isValidName, flag) => {
    setAccount({
      ...account,
      [isValidName]: flag
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!account.passwordCode || !account.password || !confirmPassword) {
      setAccount({
        ...account,
        isValidPassword: regexTest('password', account.password)
      })
      setIsValidConfirmPassword(false)
      return
    }

    if (!account.isValidPassword || !isValidConfirmPassword) {
      return
    }

    if (account.password !== confirmPassword) {
      setError('Mật khẩu không khớp, vui lòng thử lại!')
      setIsValidConfirmPassword(false)
      return
    }

    setError('')
    setSuccess('')
    setIsLoading(true)
    changePassword(passwordCode, { password: account.password })
      .then((data) => {
        if (data.error) setError(data.error)
        else setSuccess(data.success)
        setIsLoading(false)
        setTimeout(() => {
          setError('')
        }, 3000)
      })
      .catch((error) => {
        setError(error)
        setIsLoading(false)
      })
  }

  return (
    <div className='d-flex justify-content-center align-items-center mt-4'>
      <div
        className='position-relative'
        style={{ width: '460px', maxWidth: '100%' }}
      >
        {isLoading && <Spin size='large' />}
        {redirect && <Navigate to={redirect} />}

        {success ? (
          <div className='p-2 rounded bg-body text-center d-flex flex-column align-items-center gap-2 p-5 box-shadow mt-3'>
            <img src={checkImg} className='w-20 mt-4' alt='checkimg' />
            <span className='fs-4 mt-2'>Mật khẩu đã được cập nhật</span>
            <p className='mt-3 fs-9'>
              Mật khẩu của bạn đã được thay đổi thành công.
              <p>Sử dụng mật khẩu mới để đăng nhập</p>
            </p>
            <button
              className='btn btn-primary rounded-1 ripple w-100 mt-4 mb-3'
              onClick={() => setRedirect('/')}
            >
              {t('backToLogin')}
            </button>
          </div>
        ) : (
          <form
            className='border rounded-2 row mb-2 bg-body'
            onSubmit={handleSubmit}
          >
            <div className='col-12 bg-primary rounded-top-2 py-2'>
              <Logo navFor='user' />
              <p className='text-white fw-light'>{t('recoverPw')}</p>
            </div>{' '}
            <div className='col-12 mt-3'>
              <div className='mb-3'>
                <label className='form-label fw-medium'>
                  {t('newPw')} <span className='text-danger'>*</span>
                </label>
                <Input
                  type='password'
                  placeholder={t('newPw')}
                  value={account.password}
                  status={account.isValidPassword === false ? 'error' : ''}
                  onChange={(e) =>
                    handleChange('password', 'isValidPassword', e.target.value)
                  }
                  onBlur={(e) => {
                    const isValid = regexTest('password', e.target.value)
                    handleValidate('isValidPassword', isValid)
                  }}
                />
                {account.isValidPassword === false && (
                  <div className='text-danger mt-1 small'>
                    {t('passwordFeedback')}
                  </div>
                )}
              </div>
            </div>
            <div className='col-12 mt-3'>
              <div className='mb-3'>
                <label className='form-label fw-medium'>
                  {t('confirmPw')} <span className='text-danger'>*</span>
                </label>
                <Input
                  type='password'
                  placeholder={t('confirmPw')}
                  value={confirmPassword}
                  status={isValidConfirmPassword === false ? 'error' : ''}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={(e) => {
                    const isValid = regexTest('password', e.target.value)
                    setIsValidConfirmPassword(isValid)
                  }}
                />
                {isValidConfirmPassword === false && (
                  <div className='text-danger mt-1 small'>
                    {t('passwordFeedback')}
                  </div>
                )}
              </div>
            </div>
            {error && (
              <div className='col-12'>
                <Alert message={error} type='error' />
              </div>
            )}
            <div className='col-12 d-grid mt-4 mb-3'>
              <button
                type='submit'
                className='btn btn-primary ripple rounded-1'
                onClick={handleSubmit}
              >
                {t('button.save')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ChangePasswordPage
