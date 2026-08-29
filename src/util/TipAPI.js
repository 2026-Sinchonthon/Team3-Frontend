import { getMockComments } from "../data/mockComments";
import mockTipDetails from "../data/mockTipDetails";
import { mockTips } from "../data/mockTips";
import api from "./axios";

export async function createTip(tip) {
  const response = await api.post("/api/v1/tips", tip);
  return response.data;
}

export async function getTips() {
  // TODO: API 명세 확정 후 게시판 목록 조회 요청으로 교체합니다.
  return mockTips;
}

export async function getTipsByPlace() {
  // TODO: API 명세 확정 후 장소 ID를 이용한 조회 요청으로 교체합니다.
  return mockTipDetails;
}

export async function getTipById(tipId) {
  // TODO: API 명세 확정 후 게시글 ID를 이용한 상세 조회 요청으로 교체합니다.
  const tip = mockTipDetails.find(({ id }) => String(id) === String(tipId));

  if (!tip) throw new Error("존재하지 않는 팁입니다.");
  return tip;
}

export async function getComments(tipId) {
  // TODO: 댓글 API 명세 확정 후 서버 조회로 교체합니다.
  return getMockComments(tipId);
}

export async function createComment(tipId, content) {
  // TODO: 댓글 API 명세 확정 후 서버 등록 요청으로 교체합니다.
  return {
    id: `local-${Date.now()}`,
    tipId,
    nickname: "익명의 신촌인",
    content,
    createdAt: new Date().toISOString(),
  };
}
