/*
홈 / 게시판이 함께 쓰는 꿀팁 목록 필터입니다.
카테고리 필터 + 검색어 필터 + 관련도 점수를 한 번에 처리하고,
정렬은 util/tipSort.js가 이어서 맡습니다.
*/

export function normalizeKeyword(keyword) {
  return String(keyword ?? "").trim().toLowerCase();
}

// 선택된 카테고리가 없으면 전체를 노출합니다.
function matchesCategory(tip, categoryIds) {
  return categoryIds.length === 0 || categoryIds.includes(tip.categoryId);
}

// 검색 대상은 제목 + 본문. 장소를 함께 넘기면 장소명 / 주소까지 봅니다(홈 화면).
function matchesKeyword(tip, keyword, place) {
  if (!keyword) return true;

  return [tip.title, tip.content, place?.name, place?.address]
    .filter(Boolean)
    .some((text) => text.toLowerCase().includes(keyword));
}

// 제목에 걸리면 2점, 본문에 걸리면 1점.
// (constants/sortOptions.js의 RELEVANCE, util/tipSort.js의 비교 함수와 짝을 이룹니다)
function getRelevanceScore(tip, keyword) {
  if (!keyword) return 0;

  return (
    Number(tip.title.toLowerCase().includes(keyword)) * 2 +
    Number(tip.content.toLowerCase().includes(keyword))
  );
}

// 카테고리 칩을 누를 때마다 선택 목록에 넣고 뺍니다.
export function toggleCategoryId(categoryIds, categoryId) {
  return categoryIds.includes(categoryId)
    ? categoryIds.filter((id) => id !== categoryId)
    : [...categoryIds, categoryId];
}

/*
사용법:
filterTips(tips, {
  keyword,
  categoryIds,
  getPlace: (tip) => placesById.get(tip.placeId), // 홈 화면만
})

props:
- keyword     : 검색어. 정규화 여부는 상관없습니다.
- categoryIds : 선택된 카테고리 id 배열. 빈 배열이면 전체
- getPlace    : 팁의 장소를 돌려주는 함수. 넘기면 장소명 / 주소도 검색합니다.

반환값에는 정렬용 relevanceScore가 붙습니다.
*/
export default function filterTips(
  tips,
  { keyword = "", categoryIds = [], getPlace } = {},
) {
  const normalized = normalizeKeyword(keyword);

  return tips
    .filter(
      (tip) =>
        matchesCategory(tip, categoryIds) &&
        matchesKeyword(tip, normalized, getPlace?.(tip)),
    )
    .map((tip) => ({
      ...tip,
      relevanceScore: getRelevanceScore(tip, normalized),
    }));
}
