import Slider from 'react-slick'
import banner1 from '../../assets/1.png'
import banner2 from '../../assets/2.jpg'
const ListBanner = () => {
  const settings = {
    className: 'center',
    autoplay: true,
    autoplaySpeed: 6000,
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 2,
    centerPadding: '25%',
    dots: true
  }

  return (
    <div className='bg-body box-shadow rounded-3 p-3'>
      <Slider {...settings}>
        <div className='px-2'>
          <img
            className='w-100 rounded-2'
            src={banner1}
            alt='Banner 1'
            width='800'
            height='300'
            loading='eager'
          />
        </div>
        <div className='px-2'>
          <img
            className='w-100 rounded-2'
            src={banner2}
            alt='Banner 2'
            width='800'
            height='300'
            loading='eager'
          />
        </div>
        <div className='px-2'>
          <img
            className='w-100 rounded-2'
            src={banner2}
            alt='Banner 3'
            width='800'
            height='300'
            loading='eager'
          />
        </div>
        <div className='px-2'>
          <img
            className='w-100 rounded-2'
            src={banner1}
            alt='Banner 4'
            width='800'
            height='300'
            loading='eager'
          />
        </div>
        <div className='px-2'>
          <img
            className='w-100 rounded-2'
            src={banner2}
            alt='Banner 5'
            width='800'
            height='300'
            loading='eager'
          />
        </div>
        <div className='px-2'>
          <img
            className='w-100 rounded-2'
            src={banner2}
            alt='Banner 6'
            width='800'
            height='300'
            loading='eager'
          />
        </div>
      </Slider>
    </div>
  )
}

export default ListBanner
