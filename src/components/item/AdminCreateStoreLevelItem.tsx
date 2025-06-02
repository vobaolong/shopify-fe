import { useState } from 'react'
import { Button, Drawer } from 'antd'
import { useTranslation } from 'react-i18next'
import AdminStoreLevelForm from './form/AdminStoreLevelForm'
import useInvalidate from '../../hooks/useInvalidate'

const AdminCreateStoreLevelItem = () => {
  const { t } = useTranslation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const invalidate = useInvalidate()

  const handleSuccess = () => {
    invalidate({ queryKey: ['storeLevels'] })
    setDrawerOpen(false)
  }

  return (
    <>
      <Button
        type='primary'
        icon={<i className='fa-light fa-plus' />}
        onClick={() => setDrawerOpen(true)}
        className='flex items-center'
      >
        <span className='ml-2'>{t('button.addLevel')}</span>
      </Button>

      <Drawer
        title={t('dialog.createLevel')}
        placement='right'
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={400}
      >
        <AdminStoreLevelForm mode='create' onRun={handleSuccess} />
      </Drawer>
    </>
  )
}

export default AdminCreateStoreLevelItem
