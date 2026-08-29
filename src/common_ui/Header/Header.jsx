import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ArrowLeftIcon } from "../Icon/Icons";

/*

목적: 프로젝트 공용 상단 내비게이션 바 (Figma topBar)

구성: 뒤로가기 버튼 + 가운데 정렬된 화면 제목

홈 / 게시판 화면은 검색창과 카테고리 필터를 화면에 직접 띄우므로 상단 바를 쓰지 않습니다.
게시글 상세도 뒤로가기 버튼을 본문 안에 두는 디자인이라 제외합니다.
그 외 화면은 경로에 맞는 제목을 자동으로 붙입니다.
새 화면이 생기면 PAGE_TITLES 에 한 줄만 추가하면 됩니다.

*/

const PAGE_TITLES = [
  { pattern: /^\/editor$/, title: "글쓰기" },
  { pattern: /^\/search$/, title: "검색" },
  { pattern: /^\/places\/[^/]+\/tips$/, title: "꿀팁 목록" },
  { pattern: /^\/user(\/[^/]+)?$/, title: "마이페이지" },
];

const Bar = styled.header`
  position: relative;
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 3.5625rem;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radius.md} ${({ theme }) => theme.radius.md} 0 0;
  background: ${({ theme }) => theme.color.surfaceMuted};
`;

const BackButton = styled.button`
  position: absolute;
  left: 1rem;
  display: grid;
  place-items: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.color.text};
  cursor: pointer;

  &:focus-visible {
    outline: 0.125rem solid ${({ theme }) => theme.color.brandStrong};
    outline-offset: 0.25rem;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.color.text};
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.25;
`;

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (/^\/user(\/[^/]+)?$/.test(pathname)) return null;

  const matched = PAGE_TITLES.find(({ pattern }) => pattern.test(pathname));

  if (!matched) return null;

  return (
    <Bar>
      <BackButton type="button" aria-label="뒤로 가기" onClick={() => navigate(-1)}>
        <ArrowLeftIcon />
      </BackButton>
      <Title>{matched.title}</Title>
    </Bar>
  );
}
