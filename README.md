# Shopify Frontend Application

An E-commerce platform with multi-user roles including admin, seller, and buyer functionalities.

## Tech Stack

This application uses:

- **React 19** with Vite for fast development
- **Redux Toolkit** for state management (migrated from Redux)
- **Axios** for API requests (migrated from fetch)
- **TanStack Query** (React Query) for server state management
- **Ant Design** as the UI library, while retaining Bootstrap class naming conventions
- **Tailwind CSS** for styling utilities
- **i18n** for internationalization (Vietnamese and English)
- **Socket.io** for real-time features

## Migration Summary

The application has undergone several architectural upgrades:

1. **Redux to Redux Toolkit**

   - Converted reducers to slices using createSlice
   - Implemented modern Redux patterns with simplified syntax
   - Improved developer experience with built-in Immer integration

2. **Fetch API to Axios**

   - Added centralized axios client with interceptors
   - Simplified API request handling
   - Improved error handling
   - Automatic token management

3. **TanStack Query Integration**

   - Implemented custom hooks for data fetching patterns
   - Added automatic caching and background refetching
   - Created mutation hooks with query invalidation using factory patterns
   - Implemented optimization features like prefetching
   - Added utility hooks for better code reuse:
     - `useInvalidate` - simplifies cache invalidation with single function call
     - `useMutationFactory` - creates consistent mutation hooks with automatic cache invalidation
   - Applied DRY principles through a factory pattern:
     - Centralized mutation logic in reusable factory functions
     - Standardized cache invalidation strategies
     - Reduced boilerplate code across the application
     - Improved maintainability with consistent patterns
   - Built specialized hooks for all major features:
     - Products, Categories, Brands
     - Cart and Orders
     - Store and User profiles
     - Reviews, Reports and Notifications
     - Address and Location management
   - Added comprehensive documentation in `QUERY_GUIDE.md`

4. **UI Library Migration**

   - Migrated from Bootstrap to Ant Design components
   - Preserved existing Bootstrap class names for compatibility
   - Improved loading states with Skeleton components
   - Enhanced user experience with modern UI elements
   - Optimized rendering performance

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Developer Guide

### Redux Toolkit

The application uses Redux Toolkit for global state management:

```jsx
// Using a slice
import { useSelector } from 'react-redux'
import { addToCart, removeFromCart } from '../slices/cartSlice'

// Access state
const cart = useSelector((state) => state.cart)

// Dispatch actions
dispatch(addToCart(product))
```

### Axios Requests

API requests use the centralized axios client:

```jsx
// Direct API usage
import { getProduct } from '../apis/product.api'

// Inside an async function
const data = await getProduct(productId)
```

### TanStack Query Hooks

For data fetching, use the custom hooks:

```jsx
// Using a query hook
import { useProduct } from '../hooks/useProducts'

// In a component
const { data, isLoading, error } = useProduct(productId)

// Using a mutation hook
import { useAddToCart } from '../hooks/useCart'

const addToCart = useAddToCart()
addToCart.mutate({ product, quantity })
```

### Ant Design Components

UI components from Ant Design maintain Bootstrap class names:

```jsx
// Using Ant Design with Bootstrap classes
import { Card, Button } from 'antd'
;<Card className='card border-0 shadow-sm mb-3'>
  <Button type='primary' className='btn-sm'>
    Add to Cart
  </Button>
</Card>
```

For more detailed information, see the [MIGRATION_REPORT.md](./MIGRATION_REPORT.md) file.
