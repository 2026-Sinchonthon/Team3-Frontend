import mockUserDetails from "../data/mockUserDetails";
import { getAuthenticatedUserId } from "./AuthAPI";

const MOCK_CURRENT_USER_ID = -1;

export function getCurrentUserId() {
  // TODO: 로그인 구현 후 Auth Context 또는 인증 저장소의 사용자 ID로 교체합니다.
  return getAuthenticatedUserId() ?? MOCK_CURRENT_USER_ID;
}

export async function searchUsers() {
  throw new Error("사용자 검색 API 명세가 필요합니다.");
}

export async function getUserProfile(userId) {
  // TODO: API 명세 확정 후 사용자 프로필 조회 요청을 구현합니다.
  const user = mockUserDetails.find(({ id }) => String(id) === String(userId));

  if (!user) throw new Error("존재하지 않는 사용자입니다.");
  return user;
}

export async function followUser() {
  // TODO: API 명세 확정 후 팔로우 요청을 구현합니다.
}

export async function unfollowUser() {
  // TODO: API 명세 확정 후 언팔로우 요청을 구현합니다.
}
