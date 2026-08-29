/*
게시글 상세(TipFeed)의 댓글 목업입니다.
댓글 API 명세가 확정되면 이 파일은 지우고 TipAPI에서 서버 응답을 그대로 씁니다.

comment : { id, tipId, nickname, content, createdAt }
*/

const mockComments = [
  {
    id: 9001,
    tipId: 101,
    nickname: "익명의 신촌인",
    content: "저도 저번주에 갔는데 진짜 빨랐어요",
    createdAt: "2026-08-29T17:17:00+09:00",
  },
  {
    id: 9002,
    tipId: 103,
    nickname: "익명의 신촌인",
    content: "여기 진짜 설명 자세히 해주셔서 좋았어요",
    createdAt: "2026-08-28T10:02:00+09:00",
  },
  {
    id: 9003,
    tipId: 106,
    nickname: "익명의 신촌인",
    content: "이대역 루트 몰랐는데 덕분에 시간 아꼈습니다",
    createdAt: "2026-08-27T21:40:00+09:00",
  },
];

export function getMockComments(tipId) {
  return mockComments.filter((comment) => String(comment.tipId) === String(tipId));
}

export default mockComments;
