
import Combos from './ComboSection/Combos';
import HeroSection from './HeroSection/HeroSection';

import { getCombos, getProducts, getSliders } from '../../utils/apiActions';
import { expandProductsByColor } from '@/utils/productUtils';

import ProductsList from './ProductList/ProductList';









export default async function Home() {

  const banners = await getSliders("hero_home") || [];
  // const productsResult = await getProducts();
  // const products = expandProductsByColor(productsResult);
  const products = await getProducts();
  const combos = await getCombos();



  return (
    <div className="min-h-screen bg-background font-poppins">
      <HeroSection banners={banners} />
      <Combos combos={combos} />
      {/* <CustomCombo /> */}
      <ProductsList products={products} />


    </div>
  )
}
