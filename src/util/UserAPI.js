import mockUserDetails from "../data/mockUserDetails";
import api from "./axios";
import { getAuthenticatedUserId } from "./AuthAPI";

const MOCK_CURRENT_USER_ID = -1;

export function getCurrentUserId() {
  // TODO: 로그인 구현 후 Auth Context 또는 인증 저장소의 사용자 ID로 교체합니다.
  return getAuthenticatedUserId() ?? MOCK_CURRENT_USER_ID;
}

export async function submitOnboarding({ nickname, livingAloneYears }) {
  if (!nickname) throw new Error("닉네임을 입력해 주세요.");
  if (livingAloneYears == null) throw new Error("자취 연차를 선택해 주세요.");

  const response = await api.patch(
    "/api/users/me/onboarding",
    {
      nickname: String(nickname).trim(),
      livingAloneYears: Number(livingAloneYears),
    },
    { withCredentials: true },
  );

  return response.data;
}

export async function searchUsers() {
  throw new Error("사용자 검색 API 명세가 필요합니다.");
}

export async function getUserProfile(userId) {
  // TODO: API 명세 확정 후 사용자 프로필 조회 요청을 구현합니다.
  const user = mockUserDetails.find(({ id }) => String(id) === String(userId));

  if (user) return user;

  return {
    id: userId,
    nickname: "신촌자취생",
    profileImageUrl: "/default-profile.svg",
    residenceYears: 0,
    trustScore: 0,
    postCount: 0,
    followerCount: 0,
    followingCount: 0,
    isFollowing: false,
    tips: [],
  };
}

export async function getMyTips({ page = 0, size = 20 } = {}) {
  const response = await api.get("/api/v1/users/me/tips", {
    params: { page, size },
    withCredentials: true,
  });
  const result = response.data;
  const data = result?.data;

  if (!result?.success || result.code !== 200 || !Array.isArray(data?.tips)) {
    throw new Error(result?.message || "내 게시글 응답 형식이 올바르지 않습니다.");
  }

  return data;
}

export async function followUser() {
  // TODO: API 명세 확정 후 팔로우 요청을 구현합니다.
}

export async function unfollowUser() {
  // TODO: API 명세 확정 후 언팔로우 요청을 구현합니다.
}
