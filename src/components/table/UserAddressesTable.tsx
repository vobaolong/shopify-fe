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
  Typography,
  Tooltip
} from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
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
  const { notification, message } = useAntdApp()
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
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })

  const handleEditAddress = (address: string, index: number) => {
    setSelectedAddress({
      address,
      index
    })
    setIsEditModalOpen(true)
  }

  const deleteAddressMutation = useMutation({
    mutationFn: (index: number) => deleteAddresses(_id, index),
    onSuccess: (data) => {
      if (data.error) {
        message.error(data.error)
      } else {
        updateDispatch('account', data.user)
        notification.success({ message: t('toastSuccess.address.delete') })
      }
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
    }
  })

  const showDeleteConfirm = (address: string, index: number) => {
    Modal.confirm({
      title: t('userDetail.delAddress'),
      content: <Text>{address}</Text>,
      okText: t('button.confirm'),
      cancelText: t('button.cancel'),
      okType: 'danger',
      onOk: () => deleteAddressMutation.mutate(index)
    })
  }

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 50,
      align: 'center' as const,
      render: (_: any, _record: any, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1
    },
    {
      title: t('userDetail.address'),
      dataIndex: 'address',
      key: 'address',
      render: (text: string) => <Text>{text}</Text>
    },
    {
      title: t('action'),
      key: 'action',
      width: 150,
      align: 'center' as const,
      render: (_: any, record: any, index: number) => (
        <Space>
          <Tooltip title={t('userDetail.editAddress')}>
            <Button
              size='small'
              icon={<EditOutlined />}
              onClick={() =>
                handleEditAddress(
                  record.address,
                  (pagination.current - 1) * pagination.pageSize + index
                )
              }
            />
          </Tooltip>
          <Tooltip title={t('userDetail.deleteAddress')}>
            <Button
              danger
              size='small'
              icon={<DeleteOutlined />}
              onClick={() =>
                showDeleteConfirm(
                  record.address,
                  (pagination.current - 1) * pagination.pageSize + index
                )
              }
            />
          </Tooltip>
        </Space>
      )
    }
  ]

  const dataSource = addresses.map((address, idx) => ({
    key: idx,
    address
  }))

  const handleEditSuccess = () => {
    setIsEditModalOpen(false)
  }

  return (
    <div className='w-full bg-white rounded-lg shadow-md p-4'>
      <Spin spinning={deleteAddressMutation.isPending}>
        <div className='flex justify-between items-center mb-4'>
          <UserAddAddressItem heading={true} count={addresses?.length || 0} />
        </div>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{
            ...pagination,
            total: addresses.length,
            showTotal: (total) => `${t('showing')} ${total} ${t('result')}`,
            onChange: (page, pageSize) =>
              setPagination({ current: page, pageSize })
          }}
          locale={{
            emptyText: (
              <Text type='secondary' className='text-lg'>
                {t('userDetail.noAddress')}
              </Text>
            )
          }}
          scroll={{ x: 'max-content' }}
        />

        <Modal
          open={isEditModalOpen}
          onCancel={() => setIsEditModalOpen(false)}
          footer={null}
          title={t('userDetail.editAddress')}
          destroyOnHidden
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
