import MainLayout from './MainLayout'
import StoreNav from './menu/StoreNav'
import Cover from '../image/Cover'
import AvatarComponent from '../image/Avatar'
import StoreStatusLabel from '../label/StoreStatusLabel'
import StoreLevelInfo from '../info/StoreLevelInfo'
import Breadcrumb from '../ui/Breadcrumb'

interface StoreLayoutProps {
  store: any
  children: React.ReactNode
  paths: any
}

const StoreLayout: React.FC<StoreLayoutProps> = ({
  store,
  children,
  paths
}) => {
  return (
    <MainLayout>
      <div className='pt-4'>
        <Breadcrumb paths={paths} />
        <div className='store-layout'>
          <div className='position-relative bg-white p-3 rounded-top-2'>
            <Cover cover={store.cover} alt={store.name} />
            <div className='avatar-absolute avatar-absolute--store'>
              <AvatarComponent avatar={store.avatar} alt={store.name} />
            </div>
            <div className='level-group-absolute res-hide bg-white w-50 h-100 p-2'>
              <StoreLevelInfo store={store} />
            </div>
          </div>
        </div>

        <StoreNav store={store} />

        <div className='store-page-main mt-3'>{children}</div>
      </div>
    </MainLayout>
  )
}
export default StoreLayout
