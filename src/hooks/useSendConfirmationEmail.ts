import { useMutation } from '@tanstack/react-query'
import { sendConfirmationEmail } from '../apis/auth.api'

export function useSendConfirmationEmail() {
  return useMutation({
    mutationFn: (userId: string) => sendConfirmationEmail(userId)
  })
}
