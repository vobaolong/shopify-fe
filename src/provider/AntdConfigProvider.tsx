import { ConfigProvider, App } from 'antd'
import locale from 'antd/locale/en_US'
import dayjs from 'dayjs'
import 'dayjs/locale/en'
dayjs.locale('en')

export default function AntdConfigProvider({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ConfigProvider
      locale={locale}
      theme={{
        token: {
          colorPrimary: '#1677f4'
        },
        components: {
          Button: {
            borderRadius: 5,
            colorBgBase: '#1677f4',
            colorPrimaryText: '#FFF',
            colorText: '#0A0A0A',
            primaryShadow: 'none',
            defaultBorderColor: '#A0A0A0',
            controlHeight: 40
          },
          Input: {
            colorBorder: '#A0A0A0',
            colorTextPlaceholder: '#A0A0A0',
            borderRadius: 5,
            controlHeight: 40
          },
          InputNumber: {
            colorBorder: '#A0A0A0',
            borderRadius: 5,
            controlHeight: 40
          },
          Select: {
            colorBorder: '#A0A0A0',
            borderRadius: 5,
            controlHeight: 40
          },
          DatePicker: {
            colorBorder: '#A0A0A0',
            borderRadius: 5,
            controlHeight: 40
          }
        }
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  )
}
