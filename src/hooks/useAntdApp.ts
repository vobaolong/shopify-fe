import { App } from 'antd'

export const useAntdApp = () => {
  const { notification, message, modal } = App.useApp()
  return { notification, message, modal }
}
