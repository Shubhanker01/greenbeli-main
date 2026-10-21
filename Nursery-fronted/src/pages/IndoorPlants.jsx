import ProductCategoryPage from './ProductCategoryPage'
import { productCategoryMap } from '../data/productCategories'

function IndoorPlants() {
  return <ProductCategoryPage category={productCategoryMap['indoor-plants']} />
}

export default IndoorPlants
