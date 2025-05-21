import logo from '../../../assets/Buynow.svg'
import logoAdmin from '../../../assets/BuynowAdmin.svg'

const Logo = ({ width = '180px', navFor = '' }) => (
  <img
    loading='lazy'
    src={navFor !== 'user' ? logoAdmin : logo}
    style={{ width: width }}
    alt=''
  />
)

export default Logo
