import mockTipDetails from "../data/mockTipDetails";

export async function createTip(tip) {
  // TODO: API 명세 확정 후 axios 인스턴스를 이용한 요청으로 교체합니다.
  return { data: tip };
}

export async function getTipsByPlace() {
  // TODO: API 명세 확정 후 장소 ID를 이용한 조회 요청으로 교체합니다.
  return [];
}

export async function getTipById(tipId) {
  // TODO: API 명세 확정 후 게시글 ID를 이용한 상세 조회 요청으로 교체합니다.
  const tip = mockTipDetails.find(({ id }) => String(id) === String(tipId));

  if (!tip) throw new Error("존재하지 않는 팁입니다.");
  return tip;
}
