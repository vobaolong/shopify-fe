import * as XLSX from 'xlsx'
import { humanReadableDate } from '../helper/humanReadable'

export interface ExportProductData {
  _id: string
  name: string
  description?: string
  listImages?: string[]
  price?: { $numberDecimal: string }
  salePrice?: { $numberDecimal: string }
  quantity: number
  sold: number
  categoryId?: { name: string }
  rating: number
  isActive: boolean
  isSelling: boolean
  variantValueIds?: Array<{ name: string }>
  brandId?: { name: string }
  storeId?: { name: string }
  slug?: string
  createdAt: string
  updatedAt?: string
}

export const exportProductsToExcel = (
  products: ExportProductData[],
  fileName: string = 'Products'
): void => {
  if (!products.length) {
    console.warn('No products to export')
    return
  }

  const exportData = products.map((product, index) => ({
    No: index + 1,
    Name: product.name,
    Description: product.description || '',
    'Main Image': product.listImages?.[0] || 'No image',
    'All Images': product.listImages?.join(' | ') || 'No images',
    Price: product.price?.$numberDecimal,
    'Sale Price': product.salePrice?.$numberDecimal,
    Quantity: product.quantity,
    Sold: product.sold,
    Category: product.categoryId?.name || '-',
    Rating: product.rating,
    Active: product.isActive ? 'Yes' : 'No',
    Selling: product.isSelling ? 'Yes' : 'No',
    Values:
      product.variantValueIds?.map((value) => value.name).join(', ') || '-',
    Brand: product.brandId?.name || '-',
    Store: product.storeId?.name || '-',
    Slug: product.slug || '',
    'Created At': humanReadableDate(product.createdAt),
    'Updated At': product.updatedAt ? humanReadableDate(product.updatedAt) : '-'
  }))

  const worksheet = XLSX.utils.json_to_sheet(exportData)

  // Tự động điều chỉnh độ rộng cột
  const cols = [
    { wch: 5 }, // No
    { wch: 30 }, // Name
    { wch: 40 }, // Description
    { wch: 60 }, // Main Image
    { wch: 100 }, // All Images
    { wch: 15 }, // Price
    { wch: 15 }, // Sale Price
    { wch: 10 }, // Quantity
    { wch: 10 }, // Sold
    { wch: 20 }, // Category
    { wch: 10 }, // Rating
    { wch: 10 }, // Active
    { wch: 10 }, // Selling
    { wch: 30 }, // Values
    { wch: 20 }, // Brand
    { wch: 25 }, // Store
    { wch: 20 }, // Slug
    { wch: 20 }, // Created At
    { wch: 20 } // Updated At
  ]
  worksheet['!cols'] = cols

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')

  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')

  XLSX.writeFile(workbook, `${fileName}_${timestamp}.xlsx`)
}

export const exportProductsToExcelWithCallback = (
  products: ExportProductData[],
  onSuccess?: () => void,
  onError?: (error: string) => void,
  fileName: string = 'Products'
): void => {
  try {
    exportProductsToExcel(products, fileName)
    onSuccess?.()
  } catch (error) {
    onError?.('Có lỗi xảy ra khi xuất file Excel')
  }
}
