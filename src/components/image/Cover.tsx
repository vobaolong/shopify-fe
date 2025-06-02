import UserCoverUpload from './uploadButton/UserCoverUpload'
import StoreCoverUpload from './uploadButton/StoreCoverUpload'
import defaultCover from '../../assets/placeholderCover.webp'

const Cover = ({
  storeId = '',
  cover = '',
  alt = 'cover',
  isEditStore = false
}) => (
  <div className='!h-[110px] relative rounded-t-lg pb-[25%]'>
    <img
      loading='lazy'
      src={cover ? cover : defaultCover}
      className='w-full h-full absolute top-0 left-0 rounded-t-lg object-cover'
      alt={alt}
    />
    <div className='position-absolute overlay'></div>
    {isEditStore ? <StoreCoverUpload storeId={storeId} /> : <UserCoverUpload />}
  </div>
)

export default Cover
