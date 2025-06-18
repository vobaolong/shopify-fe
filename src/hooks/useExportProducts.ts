import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import {
  exportProductsToExcelWithCallback,
  ExportProductData
} from '../utils/exportExcel'

export const useExportProducts = () => {
  const { t } = useTranslation()

  const exportProducts = useCallback(
    (
      products: ExportProductData[],
      fileName: string = 'Products',
      showToast: boolean = true
    ) => {
      if (!products.length) {
        if (showToast) {
          toast.warning(
            t('message.noDataToExport') || 'Không có dữ liệu để xuất'
          )
        }
        return
      }

      exportProductsToExcelWithCallback(
        products,
        () => {
          if (showToast) {
            toast.success(
              t('message.exportSuccess') || 'Xuất file Excel thành công!'
            )
          }
        },
        (error) => {
          if (showToast) {
            toast.error(error)
          }
        },
        fileName
      )
    },
    [t]
  )

  return { exportProducts }
}
