import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { signin, setToken, forgotPassword } from '../../../apis/auth'
import { regexTest } from '../../../helper/test'
import Input from '../../ui/Input'
import Loading from '../../ui/Loading'
import { useTranslation } from 'react-i18next'
import { AxiosResponse } from 'axios'
import { useMutation } from '@tanstack/react-query'
import { notification } from 'antd'
// import SocialForm from './SocialForm'

interface SigninFormProps {
  onSwap?: () => void
}

interface AccountState {
  username: string
  password: string
  isValidUsername: boolean
  isValidPassword: boolean
}

const SigninForm = ({ onSwap = () => {} }: SigninFormProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [account, setAccount] = useState<AccountState>({
    username: '',
    password: '',
    isValidUsername: true,
    isValidPassword: true
  })

  const signinMutation = useMutation({
    mutationFn: async (user: Record<string, string>) => {
      const res = await signin(user)
      return (res as AxiosResponse<any>).data || res
    },
    onSuccess: (data) => {
      if (data.error) {
        notification.error({ message: data.error })
      } else {
        const { accessToken, refreshToken, _id, role } = data
        setToken({ accessToken, refreshToken, _id, role }, () => {
          if (role === 'admin') navigate('/admin/dashboard')
          else {
            notification.success({ message: t('toastSuccess.signIn') })
            navigate(0)
          }
        })
      }
    },
    onError: () => {
      notification.error({ message: 'Server error' })
    }
  })

  const handleChange = (
    name: keyof AccountState,
    isValidName: keyof AccountState,
    value: string
  ) => {
    setAccount({
      ...account,
      [name]: value,
      [isValidName]: true
    })
  }

  const handleValidate = (isValidName: keyof AccountState, flag: boolean) => {
    setAccount({
      ...account,
      [isValidName]: flag
    })
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { username, password } = account
    if (!username || !password) {
      setAccount({
        ...account,
        isValidUsername:
          regexTest('email', username) || regexTest('phone', username),
        isValidPassword: regexTest('password', password)
      })
      return
    }
    const { isValidUsername, isValidPassword } = account
    if (!isValidUsername || !isValidPassword) return
    const user: Record<string, string> = { password }
    if (regexTest('email', username)) user.email = username
    if (regexTest('phone', username)) user.phone = username
    signinMutation.mutate(user)
  }

  const handleForgotPassword = () => {
    const { username } = account
    if (!username) {
      setAccount({
        ...account,
        isValidUsername:
          regexTest('email', username) || regexTest('phone', username)
      })
      return
    }
    const { isValidUsername } = account
    if (!isValidUsername) return
    if (regexTest('phone', username)) {
      notification.error({ message: t('notAvailable') })
    } else {
      // Optionally: refactor forgotPassword to useMutation if needed
      forgotPassword(username)
        .then((res: AxiosResponse<any> | { error: any }) => {
          const data = (res as AxiosResponse<any>).data || res
          if (data.error) notification.error({ message: data.error })
          else notification.success({ message: t('toastSuccess.signIn') })
          setTimeout(() => {
            notification.error({ message: '' })
          }, 5000)
        })
        .catch(() => {
          notification.error({ message: 'Server error' })
        })
    }
  }

  return (
    <div className='position-relative'>
      {signinMutation.isPending && <Loading />}
      <form className='mb-2 row' onSubmit={handleFormSubmit}>
        <div className='col-12'>
          <Input
            type='text'
            label={t('signInForm.emailLabel')}
            value={account.username}
            isValid={account.isValidUsername}
            feedback={t('signInForm.emailFeedback')}
            validator='email|phone'
            required={true}
            placeholder='Ví dụ: example@gmail.com'
            onChange={(value) =>
              handleChange('username', 'isValidUsername', value)
            }
            onValidate={(flag) => handleValidate('isValidUsername', flag)}
          />
        </div>
        <div className='col-12 mt-3'>
          <Input
            type='password'
            label={t('signInForm.passwordLabel')}
            validator='password'
            value={account.password}
            isValid={account.isValidPassword}
            required={true}
            feedback={t('signInForm.passwordFeedback')}
            onChange={(value) =>
              handleChange('password', 'isValidPassword', value)
            }
            onValidate={(flag) => handleValidate('isValidPassword', flag)}
          />
        </div>
        <div className='col-12 d-grid mt-4'>
          <button
            type='submit'
            className='btn btn-primary ripple fw-bold rounded-1'
          >
            {t('button.signIn')}
          </button>
        </div>
        {/*
        <div className='col-12 mt-4 cus-decoration-paragraph'>
          <p className='text-center text-muted cus-decoration-paragraph-p unselect text-uppercase'>
            {t('or')}
          </p>
        </div>
        <div className='col-12 d-grid gap-2 mt-4'>
          <SocialForm />
        </div> */}
        <div className='col-12 mt-4'>
          <small className='text-center d-block text-muted'>
            {t('button.forgotPW')}?{' '}
            <span
              className='pointer text-primary text-decoration-underline'
              onClick={handleForgotPassword}
            >
              {t('button.sendEmail')}
            </span>
          </small>
          <small className='text-center d-block text-muted'>
            {t('signInForm.dontHaveAccount')}{' '}
            <span
              className='text-primary pointer text-decoration-underline'
              onClick={onSwap}
            >
              {t('button.signUp')}
            </span>
          </small>
        </div>
      </form>
    </div>
  )
}

export default SigninForm
