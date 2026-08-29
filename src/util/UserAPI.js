import mockUserDetails from "../data/mockUserDetails";
import { getAuthenticatedUserId } from "./AuthAPI";
import { getTips } from "./TipAPI";

const MOCK_CURRENT_USER_ID = -1;

export function getCurrentUserId() {
  // TODO: 로그인 구현 후 Auth Context 또는 인증 저장소의 사용자 ID로 교체합니다.
  return getAuthenticatedUserId() ?? MOCK_CURRENT_USER_ID;
}

export async function submitOnboarding({ nickname, livingAloneYears }) {
  if (!nickname) throw new Error("닉네임을 입력해 주세요.");
  if (livingAloneYears == null) throw new Error("자취 연차를 선택해 주세요.");
  throw new Error("온보딩 API가 현재 Swagger 명세에 없습니다.");
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
  const userId = getAuthenticatedUserId();
  if (userId == null) throw new Error("로그인 사용자 정보가 필요합니다.");

  const tips = await getTips({ userId, page, size });

  return {
    tips: tips.map((tip) => ({
      tipId: tip.id,
      category: { id: tip.categoryId, name: tip.category },
      title: tip.title,
      content: tip.content,
      status: "ACTIVE",
      createdAt: tip.createdAt,
    })),
    page,
    size,
    totalElements: tips.length,
    totalPages: tips.length > 0 ? 1 : 0,
    hasNext: false,
  };
}

export async function followUser() {
  throw new Error("팔로우 API가 현재 Swagger 명세에 없습니다.");
}

export async function unfollowUser() {
  throw new Error("언팔로우 API가 현재 Swagger 명세에 없습니다.");
}
