import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import ProductCategoryPage from './ProductCategoryPage'

// Generic category route so navbar can link to any backend category slug.
function ProductCategoryRoute() {
  const { categorySlug } = useParams()

  const category = useMemo(() => {
    return {
      slug: categorySlug,
      // ProductCategoryPage will fetch the real category details from the API by `category.slug`.
    }
  }, [categorySlug])

  return <ProductCategoryPage category={category} />
}

export default ProductCategoryRoute

