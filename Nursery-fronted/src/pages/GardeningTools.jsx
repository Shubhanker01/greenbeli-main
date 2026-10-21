import ProductCategoryPage from './ProductCategoryPage'
import { productCategoryMap } from '../data/productCategories'

function GardeningTools() {
  return <ProductCategoryPage category={productCategoryMap['gardening-tools']} />
}

export default GardeningTools
