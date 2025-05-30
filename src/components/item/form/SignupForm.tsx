import { useState } from 'react'
import { Link } from 'react-router-dom'
import { signup } from '../../../apis/auth.api'
import { regexTest } from '../../../helper/test'
import Input from '../../ui/Input'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
// import SocialForm from './SocialForm'
import { notification } from 'antd'
import { useMutation } from '@tanstack/react-query'

interface SignupFormProps {
  onSwap?: () => void
}

interface AccountState {
  userName: string
  name: string
  username: string
  password: string
  isValidFirstName: boolean
  isValidLastName: boolean
  isValidUsername: boolean
  isValidPassword: boolean
}

const SignupForm = ({ onSwap = () => {} }: SignupFormProps) => {
  const { t } = useTranslation()
  const [isConfirming, setIsConfirming] = useState(false)
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [isValidPasswordConfirmation, setIsValidPasswordConfirmation] =
    useState(true)
  const [account, setAccount] = useState<AccountState>({
    userName: '',
    name: '',
    username: '',
    password: '',
    isValidFirstName: true,
    isValidLastName: true,
    isValidUsername: true,
    isValidPassword: true
  })

  const signupMutation = useMutation({
    mutationFn: (user: Record<string, string>) => signup(user),
    onSuccess: (res: any) => {
      const data = res.data || res
      if (data.error) {
        notification.error({ message: data.error })
      } else {
        setAccount({
          ...account,
          userName: '',
          name: '',
          username: '',
          password: ''
        })
        notification.success({ message: t('toastSuccess.signUp') })
        setIsConfirming(false)
      }
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
      setIsConfirming(false)
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
  const handleChangePasswordConfirmation = (value: string) => {
    setPasswordConfirmation(value)
  }

  const handleValidatePasswordConfirmation = (flag: boolean) => {
    setIsValidPasswordConfirmation(flag)
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { userName, name, username, password } = account
    if (password !== passwordConfirmation) {
      notification.error({ message: 'Mật khẩu không khớp, vui lòng thử lại!' })
      return
    }
    if (!userName || !name || !username || !password || !passwordConfirmation) {
      setAccount({
        ...account,
        isValidFirstName: regexTest('name', userName),
        isValidLastName: regexTest('name', name),
        isValidUsername:
          regexTest('email', username) || regexTest('phone', username),
        isValidPassword: regexTest('password', password)
      })
      return
    }
    if (
      !account.isValidFirstName ||
      !account.isValidLastName ||
      !account.isValidUsername ||
      !account.isValidPassword ||
      !isValidPasswordConfirmation ||
      password !== passwordConfirmation
    )
      return
    setIsConfirming(true)
  }

  const onSignupSubmit = () => {
    const { userName, name, username, password } = account
    const user: Record<string, string> = { userName, name, password }
    if (regexTest('email', username)) user.email = username
    if (regexTest('phone', username)) user.phone = username
    signupMutation.mutate(user)
  }

  return (
    <div className='sign-up-form-wrap position-relative'>
      {signupMutation.isPending && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('dialog.signUp')}
          message={t('signInForm.agreeBy') + ' ' + t('footer.policy')}
          onSubmit={onSignupSubmit}
          onClose={() => setIsConfirming(false)}
        />
      )}

      <form className='sign-up-form mb-2 row' onSubmit={handleSubmit}>
        <div className='col-6'>
          <Input
            type='text'
            label={t('userDetail.userName')}
            value={account.userName}
            isValid={account.isValidFirstName}
            feedback={t('userDetail.validFirstName')}
            placeholder='Nguyen Van'
            required={true}
            validator='name'
            onChange={(value) =>
              handleChange('userName', 'isValidFirstName', value)
            }
            onValidate={(flag) => handleValidate('isValidFirstName', flag)}
          />
        </div>

        <div className='col-6'>
          <Input
            type='text'
            label={t('userDetail.name')}
            value={account.name}
            isValid={account.isValidLastName}
            feedback={t('userDetail.validLastName')}
            validator='name'
            placeholder='A'
            required={true}
            onChange={(value) => handleChange('name', 'isValidLastName', value)}
            onValidate={(flag) => handleValidate('isValidLastName', flag)}
          />
        </div>

        <div className='col-12 mt-3'>
          <Input
            type='text'
            label={t('signInForm.emailLabel')}
            value={account.username}
            isValid={account.isValidUsername}
            feedback={t('signInForm.emailFeedback')}
            validator='email|phone'
            required={true}
            placeholder='Ví dụ: example@gmail.com hoặc 098***3434'
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
            value={account.password}
            isValid={account.isValidPassword}
            feedback={t('passwordFeedback')}
            validator='password'
            required={true}
            onChange={(value) =>
              handleChange('password', 'isValidPassword', value)
            }
            onValidate={(flag) => handleValidate('isValidPassword', flag)}
          />
        </div>
        <div className='col-12 mt-3'>
          <Input
            type='password'
            label={t('confirmPw')}
            value={passwordConfirmation}
            isValid={isValidPasswordConfirmation}
            feedback={t('passwordFeedback')}
            validator='password'
            required={true}
            onChange={(value) => handleChangePasswordConfirmation(value)}
            onValidate={(flag) => handleValidatePasswordConfirmation(flag)}
          />
        </div>

        <div className='col-12 d-grid mt-4'>
          <button
            type='submit'
            className='btn btn-primary ripple fw-bold rounded-1'
            // onClick={handleSubmit}
          >
            {t('button.signUp')}
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
            {t('signInForm.haveAnAccount')}{' '}
            <span
              className='sign-in-item text-primary text-decoration-underline pointer'
              onClick={onSwap}
            >
              {t('button.signIn')}
            </span>
          </small>
        </div>
        <div className='col-12 mt-1'>
          <small className='text-center d-block mx-4'>
            <span className='text-muted'>{t('signInForm.agreeBy')} </span>
            <Link className='text-primary' to='/legal/privacy' target='_blank'>
              {t('footer.policy')}
            </Link>
          </small>
        </div>
      </form>
    </div>
  )
}

export default SignupForm
