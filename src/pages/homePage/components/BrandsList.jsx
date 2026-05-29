import CardBrands from '../../../components/cards/cardBrand/CardBrand';
import { BRANDS } from '../../../constants/brands';
import '../home.scss';

export default function BrandsList() {
    return (
        <div className="brandsList">
            <div className="brandsTrack">
                {[...BRANDS, ...BRANDS].map((brand, index) => (
                    <CardBrands key={index} brand={brand} />
                ))}
            </div>
        </div>
    );
}
