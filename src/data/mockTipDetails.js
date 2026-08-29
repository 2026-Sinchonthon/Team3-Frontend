import { findCategory } from "../constants/categories";
import { getMockComments } from "./mockComments";
import { mockPlaces, mockTips } from "./mockTips";

/*
게시글 상세(TipFeed)용 목업

홈 화면 바텀시트 / 게시판에서 넘어온 팁도 상세가 열리도록,
지도용 목업(mockTips)에서 같은 데이터를 상세 형태로 파생
API가 붙으면 이 파일은 통째로 지우고 TipAPI에서 서버 응답을 그대로 쓰면 w됨

상세에서 추가로 필요한 값(작성 일시 / 반응 수)은 게시글 상세 Figma를 기준으로 채움
*/

const placesById = new Map(mockPlaces.map((place) => [place.id, place]));

// 서버 집계가 붙기 전까지 게시글마다 일정한 값이 나오도록 id에서 파생시킵니다.
const derivedCount = (id, seed) => (Math.abs(Number(id) || 0) + seed) % 4;

function toTipDetail(tip) {
  const place = placesById.get(tip.placeId);

  return {
    id: tip.id,
    author: {
      id: tip.author.id,
      nickname: tip.author.nickname,
      residenceYears: tip.author.residenceYears,
      trustScore: tip.author.trustScore,
      isFollowing: false,
    },
    categoryId: tip.categoryId,
    category: findCategory(tip.categoryId)?.tag ?? "",
    title: tip.title,
    content: tip.content,
    createdAt: tip.createdAt,
    likeCount: tip.likeCount,
    dislikeCount: derivedCount(tip.id, 1),
    scrapCount: derivedCount(tip.id, 2),
    commentCount: getMockComments(tip.id).length,
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
      id: -11,
      nickname: "신촌자취생",
      residenceYears: 3,
      trustScore: 92,
      isFollowing: false,
    },
    categoryId: "HOUSEHOLD",
    category: "생활 가사",
    title: "서강대 후문으로 빠르게 가는 방법",
    content: "서강대 후문으로 갈 때는 이대역에서 내려오는 편이 더 빠릅니다.",
    createdAt: "2026-08-29T17:17:00+09:00",
    likeCount: 1,
    dislikeCount: 1,
    scrapCount: 1,
    commentCount: 0,
    location: {
      id: "sogang-back-gate",
      name: "서강대학교 후문",
      address: "서울 마포구 백범로 35",
      lat: 37.55,
      lng: 126.94,
    },
  },
  {
    id: -101,
    author: { nickname: "자취 5년차", trustScore: 15 },
    category: "식비 방어",
    title: "연세대 주변 맛집 1티어",
    content: "여기는 마제소바가 정말 맛있고 가성비도 좋아요",
    location: {
      id: -11,
      name: "연세대학교 정문",
      address: "서울 서대문구 연세로 50",
      lat: 37.5657,
      lng: 126.9386,
    },
  },
  {
    id: -102,
    author: { nickname: "자취 5년차", trustScore: 50 },
    category: "건강 관리",
    title: "친절히 진료해주는 안과 추천",
    content: "과진료 없이 필요한 설명 잘 해주세요",
    location: {
      id: -12,
      name: "신촌역",
      address: "서울 서대문구 신촌동",
      lat: 37.5551,
      lng: 126.9368,
    },
  },
  {
    id: -201,
    author: { nickname: "자취 5년차", trustScore: 15 },
    category: "식비 방어",
    title: "연세대 주변 맛집 1티어",
    content: "여기는 마제소바가 정말 맛있고 가성비도 좋아요",
    location: {
      id: -21,
      name: "연세대학교 정문",
      address: "서울 서대문구 연세로 50",
      lat: 37.5657,
      lng: 126.9386,
    },
  },
  {
    id: -202,
    author: { nickname: "신촌 프로 자취러", trustScore: 90 },
    category: "건강 관리",
    title: "친절히 진료해주는 안과 추천",
    content: "과진료 없이 필요한 설명 잘 해주세요",
    location: {
      id: -22,
      name: "신촌역",
      address: "서울 서대문구 신촌동",
      lat: 37.5551,
      lng: 126.9368,
    },
  },
  ...mockTips.map(toTipDetail),
];

export default mockTipDetails;
