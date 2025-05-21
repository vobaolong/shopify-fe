import UserCoverUpload from './uploadButton/UserCoverUpload'
import StoreCoverUpload from './uploadButton/StoreCoverUpload'
import defaultCover from '../../assets/placeholderCover.webp'

const Cover = ({
  storeId = '',
  cover = '',
  alt = 'cover',
  isEditStore = false
}) => (
  <div className='cus-cover-wrap'>
    <div className='cus-cover'>
      <img
        loading='lazy'
        src={cover ? cover : defaultCover}
        className='cus-cover-img'
        alt={alt}
      />

      <div className='position-absolute overlay'></div>
      {isEditStore ? (
        <StoreCoverUpload storeId={storeId} />
      ) : (
        <UserCoverUpload />
      )}
    </div>
  </div>
)

export default Cover
