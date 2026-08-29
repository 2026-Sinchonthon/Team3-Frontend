// 게시글 상세의 작성 일시 표기 (Figma: "26.08.29 17:17")
const pad = (value) => String(value).padStart(2, "0");

export default function formatTipDateTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const yy = pad(date.getFullYear() % 100);
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());

  return `${yy}.${mm}.${dd} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
