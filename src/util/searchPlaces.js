import loadKakaoMap from "./loadKakaoMap";

export default async function searchPlaces(keyword) {
  const kakao = await loadKakaoMap();

  if (!kakao.maps.services?.Places) {
    throw new Error("카카오 장소 검색 서비스를 불러오지 못했습니다.");
  }

  const places = new kakao.maps.services.Places();

  return new Promise((resolve, reject) => {
    places.keywordSearch(keyword, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        resolve(
          result.map((place) => ({
            id: place.id,
            name: place.place_name,
            address: place.road_address_name || place.address_name,
            lat: Number(place.y),
            lng: Number(place.x),
            category: place.category_name,
            phone: place.phone,
            placeUrl: place.place_url,
          })),
        );
        return;
      }

      if (status === kakao.maps.services.Status.ZERO_RESULT) {
        resolve([]);
        return;
      }

      reject(new Error("장소 검색 중 오류가 발생했습니다."));
    });
  });
}
