import { useState } from 'react'
import EmailStep from './SignupSteps/EmailStep'
import OtpStep from './SignupSteps/OtpStep'
import InfoStep from './SignupSteps/InfoStep'

const SignupStepper = () => {
  const [step, setStep] = useState(0)
  const [email, setEmail] = useState('')

  if (step === 0) {
    return (
      <EmailStep
        onSuccess={(email) => {
          setEmail(email)
          setStep(1)
        }}
      />
    )
  }
  if (step === 1) {
    return <OtpStep email={email} onSuccess={() => setStep(2)} />
  }
  return <InfoStep email={email} />
}

export default SignupStepper
