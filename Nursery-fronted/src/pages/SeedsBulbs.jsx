import ProductCategoryPage from './ProductCategoryPage'
import { productCategoryMap } from '../data/productCategories'

function SeedsBulbs() {
  return <ProductCategoryPage category={productCategoryMap['seeds-bulbs']} />
}

export default SeedsBulbs
