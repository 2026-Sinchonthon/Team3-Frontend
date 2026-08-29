import mockTips from "../../data/mockTips";
import KakaoMap from "./KakaoMap";

export default function MapPage() {
  return <KakaoMap tips={mockTips} />;
}
