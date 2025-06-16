import logo from '../../../assets/ShopBase.svg'

const Logo = ({ width = '180px' }: { width?: string }) => (
  <img loading='lazy' src={logo} style={{ width: width }} alt='logo' />
)

export default Logo
