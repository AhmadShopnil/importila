
import Combos from './ComboSection/Combos';
import HeroSection from './HeroSection/HeroSection';
import CustomCombo from './CustomComboBanner/CustomCombo';
import { getCombos, getProducts, getSliders } from '../../utils/apiActions';









export default async function Home() {

  const banners = await getSliders("hero_home") || [];
  const products = await getProducts();
  const combos = await getCombos();


  // console.log("banners",banners)



  return (
    <div className="min-h-screen bg-background font-poppins">
      <HeroSection banners={banners} />
      <Combos combos={combos} />
      {/* <CustomCombo /> */}
      {/* <ProductsByGender products={products} /> */}


    </div>
  )
}
