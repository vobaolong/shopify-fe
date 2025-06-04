export interface AuthResponse {
  accessToken: string
  refreshToken: string
  _id: string
  role: string
}
export interface AuthRequest {
  identifier: string
  password: string
  email?: string
  phone?: string
}
