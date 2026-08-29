// 바텀시트 / 게시판 정렬 로직 (constants/sortOptions.js의 id와 짝을 이룹니다)
const COMPARATORS = {
  TRUST: (a, b) => (b.author?.trustScore ?? 0) - (a.author?.trustScore ?? 0),
  LIKE: (a, b) => (b.likeCount ?? 0) - (a.likeCount ?? 0),
  RELEVANCE: (a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0),
};

export default function sortTips(tips, sortId) {
  const comparator = COMPARATORS[sortId];

  if (!comparator) return tips;

  return [...tips].sort(comparator);
}
