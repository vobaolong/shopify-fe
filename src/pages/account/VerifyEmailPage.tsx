import { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { verifyEmail } from '../../apis/auth.api'
import Loading from '../../components/ui/Loading'
import Error from '../../components/ui/Error'

const VerifyEmailPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { emailCode } = useParams()

  const init = () => {
    setError('')
    setIsLoading(true)
    verifyEmail(emailCode)
      .then((data) => {
        if (data.error) setError('Verify email failed')
        else setSuccess(data.success)
        setIsLoading(false)
      })
      .catch((error) => {
        setError(error)
        setIsLoading(false)
      })
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <div className='d-flex m-5 w-100 h-100 position-relative'>
      {isLoading && <Loading />}
      {error && <Error msg={error} />}
      {success && <Navigate to='/account/profile' replace />}
    </div>
  )
}

export default VerifyEmailPage
