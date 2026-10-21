import ProductCategoryPage from './ProductCategoryPage'
import { productCategoryMap } from '../data/productCategories'

function PotsPlanters() {
  return <ProductCategoryPage category={productCategoryMap['pots-planters']} />
}

export default PotsPlanters
