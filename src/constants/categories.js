// 꿀팁 카테고리. Figma 홈 화면의 카테고리 필터 순서를 그대로 따릅니다.
// name : 지도 상단 필터 칩에 쓰는 라벨
// tag  : 바텀시트 리스트 항목의 카테고리 태그 라벨
export const CATEGORIES = [
  { id: "FOOD_SAVING", name: "식비방어", tag: "식비 방어" },
  { id: "HEALTH", name: "건강관리", tag: "건강 관리" },
  { id: "HOUSEHOLD", name: "생활가사", tag: "생활 가사" },
  { id: "PART_TIME", name: "급구알바", tag: "급구 알바" },
];

export function findCategory(categoryId) {
  return CATEGORIES.find((category) => category.id === categoryId) ?? null;
}
