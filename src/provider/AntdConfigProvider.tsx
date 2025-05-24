import { ConfigProvider } from 'antd'
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
            borderRadius: 4,
            colorBgBase: '#1677f4',
            colorPrimaryText: '#FFF',
            colorText: '#0A0A0A',
            primaryShadow: 'none',
            defaultBorderColor: '#A0A0A0'
          },
          Input: {
            colorBorder: '#A0A0A0',
            colorTextPlaceholder: '#A0A0A0',
            borderRadius: 4
          },
          InputNumber: {
            colorBorder: '#A0A0A0',
            borderRadius: 4
          },
          Select: {
            colorBorder: '#A0A0A0',
            borderRadius: 4
          },
          DatePicker: {
            colorBorder: '#A0A0A0',
            borderRadius: 4
          }
        }
      }}
    >
      {children}
    </ConfigProvider>
  )
}
