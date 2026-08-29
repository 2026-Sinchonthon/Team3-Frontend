// 바텀시트 정렬 옵션. 관련도순은 검색 결과에서만 노출합니다.
// (2. Component Description.md - 정렬 선택)
export const SORT_OPTIONS = [
  { id: "TRUST", label: "신뢰도순" },
  { id: "LIKE", label: "좋아요순" },
  { id: "RELEVANCE", label: "관련도순", searchOnly: true },
];

export const DEFAULT_SORT = "TRUST";

export function getSortOptions({ isSearch = false } = {}) {
  return SORT_OPTIONS.filter((option) => isSearch || !option.searchOnly);
}
