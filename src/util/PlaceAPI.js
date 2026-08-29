import api from "./axios";

function unwrapResponse(response, fallbackMessage) {
  const result = response.data;
  if (!result?.success) throw new Error(result?.message || fallbackMessage);
  return result.data;
}

export async function getMapPlaces({
  categoryId,
  userId,
  minLat,
  maxLat,
  minLng,
  maxLng,
} = {}) {
  const response = await api.get("/api/places/map", {
    params: { categoryId, userId, minLat, maxLat, minLng, maxLng },
  });
  const places = unwrapResponse(response, "지도 장소를 불러오지 못했습니다.");

  return (places ?? []).map((place) => ({
    id: place.id,
    name: place.name ?? "",
    latitude: Number(place.latitude),
    longitude: Number(place.longitude),
    categoryName: place.categoryName ?? "",
  }));
}

export async function getCategories() {
  const response = await api.get("/api/categories");
  return unwrapResponse(response, "카테고리를 불러오지 못했습니다.") ?? [];
}
