// 장소별로 꿀팁을 묶습니다.
// 홈 지도의 마커는 장소 단위로 찍고, 옆의 숫자 배지는 그 장소에 쌓인 팁 개수입니다.
// (1. Convention.md - 마커: 옆에 숫자 有 / 옆에 숫자 X)
export default function groupTipsByPlace(places, tips) {
  const tipsByPlaceId = tips.reduce((grouped, tip) => {
    const bucket = grouped.get(tip.placeId) ?? [];

    bucket.push(tip);
    grouped.set(tip.placeId, bucket);

    return grouped;
  }, new Map());

  return places
    .map((place) => ({ place, tips: tipsByPlaceId.get(place.id) ?? [] }))
    .filter(({ tips: placeTips }) => placeTips.length > 0);
}
