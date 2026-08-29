// 자취 연차 라벨. 온보딩에서 등록한 자취 연차를 배지 문구로 환산합니다.
const RESIDENCE_LEVELS = [
  { minYears: 5, label: "자취 5년 이상" },
  { minYears: 3, label: "자취 3년차" },
  { minYears: 1, label: "자취 1년차" },
  { minYears: 0, label: "자취 준비중" },
];

export default function getResidenceLabel(residenceYears) {
  const years = Number(residenceYears);

  if (!Number.isFinite(years)) return "자취 준비중";

  return RESIDENCE_LEVELS.find((level) => years >= level.minYears).label;
}
