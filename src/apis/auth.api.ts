import axiosClient from './client.api'

export const setToken = (data: any, next: () => void) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jwt', JSON.stringify(data))
    next()
  }
}

export const getToken = () => {
  if (typeof window == 'undefined') {
    return false
  }

  if (localStorage.getItem('jwt')) {
    return JSON.parse(localStorage.getItem('jwt') || '{}')
  }
  return false
}

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt')
  }
}

export const refreshTokenApi = async (
  refreshToken: string,
  userId: string,
  role: string
) => {
  try {
    const res = await axiosClient.post('/auth/refresh-token', { refreshToken })
    if (res.data.error) {
      signout(refreshToken, () => {})
    } else {
      setToken(
        {
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
          _id: userId,
          role
        },
        () => {}
      )
    }
  } catch (error: any) {
    signout(refreshToken, () => {})
    console.log(error)
  }
}

//auth apis
export const signup = async (user: any) => {
  return await axiosClient.post('/auth/signup', user)
}

export const signin = async (user: any) => {
  return await axiosClient.post('/auth/signin', user)
}

export const signout = async (refreshToken: string, next: () => void) => {
  try {
    await axiosClient.post('/auth/signout', { refreshToken })
  } catch (error: any) {
    console.log(error)
  } finally {
    removeToken()
    next()
  }
}

export const authSocial = async (user: any) => {
  return await axiosClient.post('/auth/social', user)
}

export const forgotPassword = async (username: string) => {
  return await axiosClient.post('/auth/forgot-password', username)
}

export const changePassword = async (
  passwordCode: string,
  newPassword: string
) => {
  return await axiosClient.put(
    `/auth/change-password/${passwordCode}`,
    newPassword
  )
}

// Kiểm tra email đã tồn tại chưa
export const checkEmailExists = async (email: string): Promise<boolean> => {
  const res = (await axiosClient.post('/auth/check-email', { email })) as {
    exists: boolean
  }
  return res?.exists || false
}

// Gửi OTP về email
export const sendOtpToEmail = async (email: string): Promise<any> => {
  return await axiosClient.post('/auth/send-otp', { email })
}

// Xác thực OTP
export const verifyOtp = async (email: string, otp: string): Promise<any> => {
  return await axiosClient.post('/auth/verify-otp', { email, otp })
}
