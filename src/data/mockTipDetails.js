import { findCategory } from "../constants/categories";
import { mockPlaces, mockTips } from "./mockTips";

/*
게시글 상세(TipFeed)용 목업입니다.

홈 화면 바텀시트에서 넘어온 팁도 상세가 열리도록,
지도용 목업(mockTips)에서 같은 데이터를 상세 형태로 파생시킵니다.
API가 붙으면 이 파일은 통째로 지우고 TipAPI에서 서버 응답을 그대로 쓰면 됩니다.
*/

const placesById = new Map(mockPlaces.map((place) => [place.id, place]));

function toTipDetail(tip) {
  const place = placesById.get(tip.placeId);

  return {
    id: tip.id,
    author: {
      nickname: tip.author.nickname,
      trustScore: tip.author.trustScore,
    },
    category: findCategory(tip.categoryId)?.tag ?? "",
    title: tip.title,
    content: tip.content,
    location: place
      ? {
          id: place.id,
          name: place.name,
          address: place.address,
          lat: place.latitude,
          lng: place.longitude,
        }
      : null,
  };
}

const mockTipDetails = [
  {
    id: -1,
    author: {
      nickname: "신촌자취생",
      trustScore: 92,
    },
    category: "교통",
    title: "서강대 후문으로 빠르게 가는 방법",
    content: "서강대 후문으로 갈 때는 이대역에서 내려오는 편이 더 빠릅니다.",
    location: {
      id: "sogang-back-gate",
      name: "서강대학교 후문",
      address: "서울 마포구 백범로 35",
      lat: 37.55,
      lng: 126.94,
    },
  },
  ...mockTips.map(toTipDetail),
];

export default mockTipDetails;
