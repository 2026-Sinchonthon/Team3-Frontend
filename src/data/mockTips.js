/*
백엔드 ERD(places / tips / users)에 맞춘 목업 데이터입니다.
API 연동 전까지 홈 화면과 바텀시트가 실제 형태로 동작하도록 사용합니다.

place : { id, name, address, latitude, longitude }
tip   : { id, placeId, categoryId, title, content, likeCount, createdAt,
          author: { id, nickname, residenceYears, trustScore } }
*/

export const mockPlaces = [
  {
    id: 1,
    name: "연세대학교 정문",
    address: "서울 서대문구 연세로 50",
    latitude: 37.5657,
    longitude: 126.9386,
  },
  {
    id: 2,
    name: "신촌역 3번 출구",
    address: "서울 서대문구 신촌동 창천동",
    latitude: 37.5551,
    longitude: 126.9368,
  },
  {
    id: 3,
    name: "서강대학교 후문",
    address: "서울 마포구 백범로 35",
    latitude: 37.551,
    longitude: 126.94,
  },
  {
    id: 4,
    name: "이대역 스타광장",
    address: "서울 서대문구 대현동",
    latitude: 37.5568,
    longitude: 126.9463,
  },
  {
    id: 5,
    name: "창천동 먹자골목",
    address: "서울 서대문구 창천동",
    latitude: 37.557,
    longitude: 126.9355,
  },
];

const authors = {
  jachwi5: { id: 11, nickname: "자취 5년차", residenceYears: 5, trustScore: 90 },
  rookie: { id: 12, nickname: "신촌 뉴비", residenceYears: 0, trustScore: 15 },
  pro: { id: 13, nickname: "신촌 프로 자취러", residenceYears: 6, trustScore: 92 },
  saver: { id: 14, nickname: "짠내 대학생", residenceYears: 2, trustScore: 61 },
};

export const mockTips = [
  {
    id: 101,
    placeId: 1,
    categoryId: "FOOD_SAVING",
    title: "연세대 주변 맛집 1티어",
    content: "여기는 마제소바가 정말 맛있고 가성비도 좋아요",
    likeCount: 128,
    createdAt: "2026-08-20T09:00:00Z",
    author: authors.jachwi5,
  },
  {
    id: 102,
    placeId: 1,
    categoryId: "PART_TIME",
    title: "정문 앞 카페 주말 단기 알바 자주 뜸",
    content: "주말 오전 타임은 경쟁이 덜해서 붙기 쉬워요",
    likeCount: 44,
    createdAt: "2026-08-22T04:00:00Z",
    author: authors.saver,
  },
  {
    id: 103,
    placeId: 1,
    categoryId: "HEALTH",
    title: "친절히 진료해주는 안과 추천",
    content: "과잉진료 없이 필요한 설명 잘 해주세요",
    likeCount: 87,
    createdAt: "2026-08-18T11:30:00Z",
    author: authors.pro,
  },
  {
    id: 104,
    placeId: 2,
    categoryId: "HOUSEHOLD",
    title: "3번 출구 코인세탁소가 제일 쌉니다",
    content: "건조기 20분에 천원, 밤 10시 넘으면 자리 여유 있어요",
    likeCount: 71,
    createdAt: "2026-08-25T13:10:00Z",
    author: authors.jachwi5,
  },
  {
    id: 105,
    placeId: 2,
    categoryId: "FOOD_SAVING",
    title: "역 앞 빵집 마감 할인 시간",
    content: "밤 9시부터 반값, 10시엔 거의 다 팔려요",
    likeCount: 156,
    createdAt: "2026-08-26T10:00:00Z",
    author: authors.saver,
  },
  {
    id: 106,
    placeId: 3,
    categoryId: "FOOD_SAVING",
    title: "서강대 후문은 이대역에서 오는 게 빠름",
    content: "신촌역에서 걸으면 15분, 이대역에서는 8분이면 도착해요",
    likeCount: 203,
    createdAt: "2026-08-15T02:20:00Z",
    author: authors.pro,
  },
  {
    id: 107,
    placeId: 4,
    categoryId: "HEALTH",
    title: "이대역 근처 야간 진료 되는 내과",
    content: "평일 밤 9시까지 하고 대기도 짧은 편이에요",
    likeCount: 62,
    createdAt: "2026-08-24T08:45:00Z",
    author: authors.rookie,
  },
  {
    id: 108,
    placeId: 5,
    categoryId: "FOOD_SAVING",
    title: "먹자골목 대기 가장 짧은 시간",
    content: "평일 오후 5시 전에 가면 웨이팅 거의 없어요",
    likeCount: 98,
    createdAt: "2026-08-27T07:15:00Z",
    author: authors.jachwi5,
  },
  {
    id: 109,
    placeId: 5,
    categoryId: "HOUSEHOLD",
    title: "골목 안쪽 수선집 단추 수선 2천원",
    content: "당일에 바로 해주시고 학생증 보여주면 조금 깎아주세요",
    likeCount: 33,
    createdAt: "2026-08-28T05:05:00Z",
    author: authors.rookie,
  },
];

export default mockTips;
