import ProductCategoryPage from './ProductCategoryPage'
import { productCategoryMap } from '../data/productCategories'

function OutdoorPlants() {
  return <ProductCategoryPage category={productCategoryMap['outdoor-plants']} />
}

export default OutdoorPlants
