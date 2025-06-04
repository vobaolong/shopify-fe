import logo from '../../../assets/ShopBase.svg'
import logoAdmin from '../../../assets/ShopBaseAdmin.svg'

interface LogoProps {
  width?: string
  navFor?: string
}

const Logo = ({ width = '180px', navFor = '' }: LogoProps) => (
  <img
    loading='lazy'
    src={navFor !== 'user' ? logoAdmin : logo}
    style={{ width: width }}
    alt=''
  />
)

export default Logo
