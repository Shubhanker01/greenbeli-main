import ProductCategoryPage from './ProductCategoryPage'
import { productCategoryMap } from '../data/productCategories'

function PlantCare() {
  return <ProductCategoryPage category={productCategoryMap['plant-care']} />
}

export default PlantCare
