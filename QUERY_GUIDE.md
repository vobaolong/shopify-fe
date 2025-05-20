# TanStack Query Implementation Guide

This document provides guidelines on how to use TanStack Query in this project, including the custom utilities created to enhance the developer experience.

## Table of Contents

1. [Query Structure](#query-structure)
2. [Custom Utilities](#custom-utilities)
3. [Factory Pattern Implementation](#factory-pattern-implementation)
4. [Naming Conventions](#naming-conventions)
5. [Best Practices](#best-practices)
6. [Examples](#examples)

## Query Structure

Each data domain has its own query key structure and specialized hooks:

```javascript
export const productKeys = {
  all: ['products'],
  lists: () => [...productKeys.all, 'list'],
  list: (filters) => [...productKeys.lists(), { filters }],
  details: () => [...productKeys.all, 'detail'],
  detail: (productId) => [...productKeys.details(), productId]
}
```

## Custom Utilities

### useInvalidate

The `useInvalidate` hook simplifies cache invalidation:

```javascript
import useInvalidate from './useInvalidate'

// Inside your component:
const invalidate = useInvalidate()
invalidate({ queryKey: ['products'] }) // Invalidate all product queries
invalidate({ queryKey: ['products', 'detail', productId] }) // Invalidate specific product
```

### useMutationFactory

The `useMutationFactory` creates mutation hooks with automatic cache invalidation:

```javascript
import { createMutationHook } from './useMutationFactory'

// Create a mutation hook
export const useAddProduct = createMutationHook(
  // Mutation function
  ({ productData }) => addProduct(productData),
  // Cache invalidation strategy
  (data, variables) => [
    { queryKey: ['products'] },
    { queryKey: ['categories', variables.productData.categoryId] }
  ]
)
```

## Factory Pattern Implementation

Our migration to TanStack Query includes a factory pattern for creating mutation hooks, which provides several benefits:

1. **Code Reusability**: Eliminates repetitive mutation configuration
2. **Consistent Cache Management**: Standardizes how we handle cache invalidation
3. **Type Safety**: Provides better TypeScript support and code completion
4. **Maintainability**: Centralizes mutation logic for easier updates

### How It Works

The factory pattern is implemented using the `createMutationHook` function which takes:

1. **mutationFn**: The API function to call
2. **getInvalidateFilters**: A strategy function that returns an array of query keys to invalidate
3. **options**: Additional mutation options (optional)

```javascript
export function createMutationHook(
  mutationFn,
  getInvalidateFilters,
  options = {}
) {
  return function useCustomMutation() {
    const invalidate = useInvalidate()

    return useMutation({
      mutationFn,
      ...options,
      onSuccess: (data, variables, context) => {
        // Invalidate all specified query filters
        const filters = getInvalidateFilters(data, variables, context)

        if (Array.isArray(filters)) {
          filters.forEach((filter) => invalidate(filter))
        }

        // Call the original onSuccess if provided
        if (options.onSuccess) {
          options.onSuccess(data, variables, context)
        }
      }
    })
  }
}
```

### Example Implementation

Here's how we've implemented this pattern in our `useCart` hooks:

```javascript
// Define query keys
export const cartKeys = {
  all: ['carts'],
  lists: () => [...cartKeys.all, 'list'],
  list: (userId, filters) => [...cartKeys.lists(), userId, { filters }],
  counts: () => [...cartKeys.all, 'count'],
  count: (userId) => [...cartKeys.counts(), userId]
}

// Create mutation hooks
export const useAddToCart = createMutationHook(
  ({ userId, cartItem }) => addToCart(userId, cartItem),
  (data, variables) => [
    { queryKey: cartKeys.count(variables.userId) },
    { queryKey: cartKeys.lists() }
  ]
)

export const useRemoveCartItem = createMutationHook(
  ({ userId, cartId }) => removeCartItem(userId, cartId),
  (data, variables) => [
    { queryKey: cartKeys.count(variables.userId) },
    { queryKey: cartKeys.lists() }
  ]
)
```

## Naming Conventions

We follow these naming conventions for TanStack Query implementation:

1. **Query Key Objects**: Named `entityKeys` (e.g., `productKeys`, `cartKeys`)
2. **Query Hooks**: Named `useEntityAction` (e.g., `useProducts`, `useProductDetail`)
3. **Mutation Hooks**: Named `useActionEntity` (e.g., `useAddProduct`, `useUpdateCart`)

## Best Practices

1. **Use Query Keys Consistently**: Always use the predefined query key structure
2. **Avoid Direct Cache Manipulation**: Use `useInvalidate()` instead
3. **Dependency Management**: Set `enabled` option for dependent queries
4. **Error Handling**: Implement consistent error handling with `onError` callbacks
5. **Stale Time Management**: Configure appropriate staleTime based on data freshness needs
6. **Prefetching Strategy**: Use query prefetching for anticipated user navigation

## Examples

### Component with Multiple Queries

```jsx
import React from 'react'
import { useProduct } from '../hooks/useProduct'
import { useAddToCart } from '../hooks/useCart'

const ProductActions = ({ productId }) => {
  // Query for product details
  const { data: product, isLoading, error } = useProduct(productId)

  // Mutation hook for adding to cart
  const { mutate: addToCart, isLoading: isAdding } = useAddToCart()

  const handleAddToCart = () => {
    addToCart({
      userId: currentUser.id,
      cartItem: {
        productId,
        quantity: 1
      }
    })
  }

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className='product-actions'>
      <h2>{product.name}</h2>
      <p>${product.price}</p>
      <button onClick={handleAddToCart} disabled={isAdding}>
        {isAdding ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  )
}

export default ProductActions
```

### Complex Query with Dependent Data

```jsx
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProduct } from '../apis/product'
import { getRelatedProducts } from '../apis/recommendation'

// Custom hook with dependent query
const useProductWithRecommendations = (productId) => {
  // Primary query
  const productQuery = useQuery({
    queryKey: ['products', 'detail', productId],
    queryFn: () => getProduct(productId),
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  // Dependent query - only runs when product data is available
  const recommendationsQuery = useQuery({
    queryKey: ['recommendations', productId],
    queryFn: () => getRelatedProducts(productId, productQuery.data.categoryId),
    enabled: !!productQuery.data?.categoryId,
    staleTime: 2 * 60 * 1000 // 2 minutes
  })

  return {
    product: productQuery.data,
    recommendations: recommendationsQuery.data,
    isLoading: productQuery.isLoading || recommendationsQuery.isLoading,
    error: productQuery.error || recommendationsQuery.error
  }
}
```

## Naming Conventions

- **Query Keys**:

  - Use plural for collections: `['products']`
  - Use singular with ID for individual items: `['products', 'detail', productId]`
  - Use action names for specific queries: `['products', 'featured']`

- **Hook Names**:
  - `useEntityName` for getting a single item
  - `useEntityNames` for getting a list
  - `useActionEntityName` for mutations (e.g., `useUpdateProduct`)

## Best Practices

1. **Define Query Keys at Module Level**:
   Keep query keys in a namespace to ensure consistency and make invalidation easier.

2. **Enable Condition**:
   Use the `enabled` option to prevent queries from running before dependencies are available.

3. **Invalidation Strategy**:

   - Be specific when possible (invalidate specific items)
   - Be broad when necessary (invalidate collections after mutations)
   - Consider side effects (invalidate related entities)

4. **Error Handling**:
   Use the built-in error states and implement global error handlers for common cases.

5. **Caching Strategy**:
   - Adjust `staleTime` and `cacheTime` based on data volatility
   - Use `initialData` when you have data available from another source

## Examples

### Basic Query

```javascript
export const useProducts = (filters) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => listProducts(filters),
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}
```

### Using Factory Pattern

```javascript
export const useCreateStore = createMutationHook(
  ({ userId, store }) => createStore(userId, store),
  (data, variables) => [
    { queryKey: storeKeys.lists() },
    { queryKey: ['user', variables.userId, 'stores'] }
  ]
)
```

### Conditional Query

```javascript
export const useUserOrders = (userId, enabled = true) => {
  return useQuery({
    queryKey: orderKeys.list(userId),
    queryFn: () => fetchUserOrders(userId, token),
    enabled: !!userId && !!token && enabled
  })
}
```

### Prefetching Example

```javascript
// In a product list component:
const queryClient = useQueryClient()

// Prefetch on hover
const prefetchProduct = (productId) => {
  queryClient.prefetchQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => getProduct(productId)
  })
}
```
