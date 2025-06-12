import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Typography, Space } from 'antd'
import notfoundImg from '../../assets/bgd-404.svg'
const { Title, Text } = Typography

const PageNotFound = () => {
  return (
    <div className='container py-10 flex justify-between items-center min-h-[80vh]'>
      <div className='col-md-6'>
        <Title level={1} className='text-3xl text-dark mb-4'>
          So Sorry!
        </Title>
        <Title level={2} className='text-lg mb-4'>
          The page you are looking for cannot be found
        </Title>

        <div className='mb-4'>
          <Title level={4} className='text-lg mb-2'>
            Possible Reasons
          </Title>
          <ul style={{ paddingLeft: '20px' }}>
            <li className='mb-2'>
              <Text>The address may have been typed incorrectly.</Text>
            </li>
            <li className='mb-2'>
              <Text>It may be a broken or outdated link.</Text>
            </li>
          </ul>
        </div>

        <Space>
          <Link to='/'>
            <Button type='primary' size='large' className='bg-primary border-0'>
              Back to Home
            </Button>
          </Link>
          <Link to='/support'>
            <Button size='large'>Help</Button>
          </Link>
        </Space>
      </div>

      <div className='col-md-5'>
        <img
          src={notfoundImg}
          className='img-fluid relative max-w-[500px]'
          alt='Page Not Found'
        />
      </div>
    </div>
  )
}

export default PageNotFound
