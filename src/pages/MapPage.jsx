import KakaoMap from "../components/map/KakaoMap";
import mockTips from "../data/mockTips";

export default function MapPage() {
  return <KakaoMap tips={mockTips} />;
}
