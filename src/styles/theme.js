// Figma `신촌톤` GUI에서 추출한 디자인 토큰입니다.
// 수치는 컨벤션(1. Convention.md)에 따라 rem 단위로 환산했습니다. (1rem = 16px)
const theme = {
  color: {
    brand: "#c0ee75", // 선택된 칩, 카테고리 태그, 마커 개수 배지
    brandSoft: "rgba(192, 238, 117, 0.5)", // 신뢰지수 배지
    brandStrong: "#65a302", // 하단 네비바 활성 상태
    marker: "#ca1619", // 지도 핀
    surface: "#ffffff",
    surfaceMuted: "#f7f7f6", // 비활성 칩, 하단 네비바 배경
    field: "#e9e9e9", // 검색창 배경
    border: "#e7e7e7", // 리스트 구분선
    handle: "#bebfc0", // 바텀시트 그래버
    text: "#000000",
    textMuted: "#6c6c6c",
    accent: "#0c79fe", // 현재 위치
  },
  radius: {
    sm: "0.3125rem", // 5px  - 배지, 태그
    md: "0.625rem", // 10px - 칩, 검색창
    lg: "1.5625rem", // 25px - 바텀시트
    pill: "6.25rem", // 100px - 개수 배지
  },
  font: {
    xs: "0.8125rem", // 13px - 본문 미리보기, 정렬 칩
    sm: "0.9375rem", // 15px - 제목, 카테고리 칩
    md: "1.0625rem", // 17px - 닉네임, 검색창
  },
  shadow: {
    card: "0 0 0.375rem rgba(0, 0, 0, 0.13)",
  },
  // 바텀시트 노출 높이(1단 / 2단 / 3단). BottomSheet가 px로 환산해 사용합니다.
  sheetStage: {
    collapsed: "4.5rem", // 그래버만 보이는 기본 상태
    half: "13rem", // 그래버 + 게시글 1개
    fullInset: "0.875rem", // 3단에서 상단에 남기는 여백
  },
  layer: {
    mapOverlay: 10,
    sheet: 20,
    fab: 15,
  },
};

export default theme;
