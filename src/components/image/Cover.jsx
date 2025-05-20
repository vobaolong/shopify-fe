import UserCoverUpload from './uploadButton/UserCoverUpload'
import StoreCoverUpload from './uploadButton/StoreCoverUpload'
import defaultCover from '../../assets/placeholderCover.webp'
const IMG = import.meta.env.VITE_STATIC_URL

const Cover = ({
  storeId = '',
  cover = '',
  alt = 'cover',
  isEditable = false
}) => (
  <div className='cus-cover-wrap'>
    <div className='cus-cover'>
      <img
        loading='lazy'
        src={cover ? IMG + cover : defaultCover}
        className='cus-cover-img'
        alt={alt}
      />

      <div className='position-absolute overlay'></div>
      {isEditable === 'user' && <UserCoverUpload />}
      {isEditable === 'store' && <StoreCoverUpload storeId={storeId} />}
    </div>
  </div>
)

export default Cover
