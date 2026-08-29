import loadKakaoMap from "./loadKakaoMap";

const ALLOWED_DONGS = new Set([
  "신촌동",
  "대현동",
  "창천동",
  "대흥동",
  "노고산동",
]);

const SEARCH_AREA = {
  southWest: { lat: 37.542, lng: 126.923 },
  northEast: { lat: 37.575, lng: 126.955 },
};

function getRegionCodes(kakao, geocoder, place) {
  return new Promise((resolve) => {
    geocoder.coord2RegionCode(place.x, place.y, (regions, status) => {
      if (status !== kakao.maps.services.Status.OK) {
        resolve([]);
        return;
      }

      resolve(regions);
    });
  });
}

function isAllowedRegion(regions) {
  return regions.some(
    (region) =>
      (region.region_type === "H" || region.region_type === "B") &&
      ALLOWED_DONGS.has(region.region_3depth_name),
  );
}

function normalizePlace(place) {
  return {
    id: place.id,
    name: place.place_name,
    address: place.road_address_name || place.address_name,
    lat: Number(place.y),
    lng: Number(place.x),
    category: place.category_name,
    phone: place.phone,
    placeUrl: place.place_url,
  };
}

export default async function searchPlaces(keyword) {
  const kakao = await loadKakaoMap();

  if (!kakao.maps.services?.Places || !kakao.maps.services?.Geocoder) {
    throw new Error("카카오 장소 검색 서비스를 불러오지 못했습니다.");
  }

  const places = new kakao.maps.services.Places();
  const geocoder = new kakao.maps.services.Geocoder();
  const bounds = new kakao.maps.LatLngBounds(
    new kakao.maps.LatLng(
      SEARCH_AREA.southWest.lat,
      SEARCH_AREA.southWest.lng,
    ),
    new kakao.maps.LatLng(
      SEARCH_AREA.northEast.lat,
      SEARCH_AREA.northEast.lng,
    ),
  );

  return new Promise((resolve, reject) => {
    const collectedPlaces = [];

    const handleSearchResult = async (result, status, pagination) => {
      if (status === kakao.maps.services.Status.ZERO_RESULT) {
        resolve([]);
        return;
      }

      if (status !== kakao.maps.services.Status.OK) {
        reject(new Error("장소 검색 중 오류가 발생했습니다."));
        return;
      }

      const placesWithRegions = await Promise.all(
        result.map(async (place) => ({
          place,
          regions: await getRegionCodes(kakao, geocoder, place),
        })),
      );

      collectedPlaces.push(
        ...placesWithRegions
          .filter(({ regions }) => isAllowedRegion(regions))
          .map(({ place }) => normalizePlace(place)),
      );

      if (pagination.hasNextPage) {
        pagination.nextPage();
        return;
      }

      resolve(collectedPlaces);
    };

    places.keywordSearch(keyword, handleSearchResult, { bounds });
  });
}
