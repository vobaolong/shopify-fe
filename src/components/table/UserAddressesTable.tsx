import { useState } from 'react'
import { getToken } from '../../apis/auth.api'
import useUpdateDispatch from '../../hooks/useUpdateDispatch'
import UserAddAddressItem from '../item/UserAddAddressItem'
import UserEditAddressForm from '../item/form/UserEditAddressForm'
import { useTranslation } from 'react-i18next'
import { deleteAddresses } from '../../apis/user.api'
import {
  Table,
  Button,
  Modal,
  Space,
  Spin,
  Alert,
  Popconfirm,
  Typography
} from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { useAntdApp } from '../../hooks/useAntdApp'

const { Text } = Typography

interface UserAddressesTableProps {
  addresses: string[]
}

const UserAddressesTable: React.FC<UserAddressesTableProps> = ({
  addresses = []
}) => {
  const { t } = useTranslation()
  const { notification } = useAntdApp()
  const [error, setError] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<{
    address: string
    index: number | null
  }>({
    address: '',
    index: null
  })
  const [updateDispatch] = useUpdateDispatch()
  const { _id } = getToken()

  const handleEditAddress = (address: string, index: number) => {
    setSelectedAddress({
      address,
      index
    })
    setIsEditModalOpen(true)
  }
  // Delete Address Mutation
  const deleteAddressMutation = useMutation({
    mutationFn: (index: number) => deleteAddresses(_id, index),
    onSuccess: (data) => {
      if (data.error) {
        setError(data.error)
      } else {
        updateDispatch('account', data.user)
        notification.success({ message: t('toastSuccess.address.delete') })
      }
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
    }
  })

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 50,
      render: (_: any, _record: any, index: number) => index + 1
    },
    {
      title: t('userDetail.address'),
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: t('action'),
      key: 'action',
      width: 150,
      render: (_: any, record: any, index: number) => (
        <Space>
          <Button
            type='primary'
            size='small'
            icon={<EditOutlined />}
            onClick={() => handleEditAddress(record.address, index)}
          >
            {t('button.edit')}
          </Button>
          <Popconfirm
            title={t('userDetail.delAddress')}
            description={record.address}
            onConfirm={() => deleteAddressMutation.mutate(index)}
            okText={t('button.yes')}
            cancelText={t('button.no')}
          >
            <Button
              type='primary'
              danger
              size='small'
              icon={<DeleteOutlined />}
            >
              {t('button.delete')}
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  const dataSource = addresses.map((address) => ({
    key: address,
    address
  }))

  const handleEditSuccess = () => {
    setIsEditModalOpen(false)
  }

  return (
    <div className='w-full'>
      <Spin spinning={deleteAddressMutation.isPending}>
        {error && (
          <Alert
            message={error}
            type='error'
            showIcon
            className='mb-4'
            closable
            onClose={() => setError('')}
          />
        )}

        <div className='flex justify-between items-center mb-4'>
          <UserAddAddressItem heading={true} count={addresses?.length || 0} />
        </div>

        {addresses.length === 0 ? (
          <div className='py-8 text-center'>
            <Text type='secondary' className='text-lg'>
              {t('userDetail.noAddress')}
            </Text>
          </div>
        ) : (
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            size='middle'
            footer={() => (
              <Text type='secondary'>
                {t('showing')} <Text strong>{addresses?.length || 0}</Text>{' '}
                {t('result')}
              </Text>
            )}
          />
        )}

        <Modal
          open={isEditModalOpen}
          onCancel={() => setIsEditModalOpen(false)}
          footer={null}
          title={t('userDetail.editAddress')}
          destroyOnClose
        >
          <UserEditAddressForm
            oldAddress={selectedAddress.address}
            index={selectedAddress.index}
            onSuccess={handleEditSuccess}
          />
        </Modal>
      </Spin>
    </div>
  )
}

export default UserAddressesTable
