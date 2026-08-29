const mockTipDetails = [
  {
    id: 1,
    author: {
      nickname: "신촌자취생",
      livingYears: 3,
    },
    category: "교통",
    title: "서강대 후문으로 빠르게 가는 방법",
    content: "서강대 후문으로 갈 때는 이대역에서 내려오는 편이 더 빠릅니다.",
    location: {
      id: "sogang-back-gate",
      name: "서강대학교 후문",
      address: "서울 마포구 백범로 35",
      lat: 37.55,
      lng: 126.94,
    },
  },
  {
    id: 2,
    author: {
      nickname: "연세로주민",
      livingYears: 5,
    },
    category: "이동",
    title: "연세대 방향으로 갈 때 편한 출구",
    content: "신촌역에서 연세대학교 방향으로 이동할 때는 3번 출구가 편합니다.",
    location: {
      id: "sinchon-station",
      name: "신촌역",
      address: "서울 마포구 신촌로 90",
      lat: 37.555,
      lng: 126.936,
    },
  },
];

export default mockTipDetails;
