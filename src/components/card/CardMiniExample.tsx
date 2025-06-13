import React from 'react'
import CardMini from './CardMini'

// Example data
const sampleProduct = {
  _id: '1',
  name: 'iPhone 16 Pro Max 256GB | Chính hãng VN/A',
  slug: 'iphone-16-pro-max-256gb-chinh-hang-vn-a',
  description: 'Latest iPhone model with advanced features',
  price: { $numberDecimal: 34990000 },
  salePrice: { $numberDecimal: 30490000 },
  quantity: 100,
  sold: 150,
  isActive: true,
  isSelling: true,
  listImages: [
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'
  ],
  categoryId: {
    _id: 'cat1',
    name: 'Electronics',
    slug: 'electronics',
    image: '',
    categoryId: null,
    isDeleted: false
  },
  variantValueIds: [],
  storeId: 'store1',
  rating: 4.5,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z'
}

const CardMiniExample = () => {
  return (
    <div className='p-4 space-y-4'>
      <h2 className='text-xl font-bold mb-4'>CardMini Component Examples</h2>

      <div className='grid gap-4'>
        <div>
          <h3 className='text-lg font-semibold mb-2'>Default CardMini</h3>
          <CardMini product={sampleProduct} />
        </div>

        <div>
          <h3 className='text-lg font-semibold mb-2'>
            CardMini with custom class
          </h3>
          <CardMini
            product={sampleProduct}
            className='max-w-md border-2 border-blue-200'
          />
        </div>

        <div>
          <h3 className='text-lg font-semibold mb-2'>
            Multiple CardMini in list
          </h3>
          <div className='space-y-2'>
            <CardMini product={sampleProduct} />{' '}
            <CardMini
              product={{
                ...sampleProduct,
                _id: '2',
                name: 'Samsung Galaxy S24 Ultra 512GB | Chính hãng',
                price: { $numberDecimal: 29990000 },
                salePrice: { $numberDecimal: 25990000 }
              }}
            />
            <CardMini
              product={{
                ...sampleProduct,
                _id: '3',
                name: 'MacBook Pro 14" M3 Max 1TB | Chính hãng Apple',
                price: { $numberDecimal: 89990000 },
                salePrice: { $numberDecimal: 79990000 }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardMiniExample
