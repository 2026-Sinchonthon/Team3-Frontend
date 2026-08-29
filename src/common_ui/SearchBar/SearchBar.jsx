import styled from "styled-components";
import { SearchIcon } from "../Icon/Icons";

/*
목적: 홈 / 게시판 상단 서치바 (IA - 상단 서치)

사용법:
<SearchBar value={keyword} onChange={setKeyword} onSubmit={handleSubmit} />

props:
- value       : 검색어
- onChange    : 검색어 변경 콜백(문자열을 인자로 받습니다)
- onSubmit    : 검색 실행 콜백(문자열을 인자로 받습니다)
- placeholder : 안내 문구. 기본값 "신촌 꿀팁 검색"
- readOnly    : true면 입력 대신 클릭만 받습니다(검색 페이지로 이동시킬 때 사용)
- onClick     : readOnly일 때의 클릭 콜백
*/

const Form = styled.form`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  width: 100%;
  height: 2.25rem;
  padding: 0 0.375rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.field};
`;

const IconSlot = styled.span`
  display: grid;
  flex: none;
  place-items: center;
  width: 1.25rem;
  height: 1.25rem;
  color: ${({ theme }) => theme.color.textMuted};
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.color.text};
  font: inherit;
  font-size: ${({ theme }) => theme.font.md};

  &::placeholder {
    color: ${({ theme }) => theme.color.textMuted};
  }

  &:focus {
    outline: none;
  }
`;

export default function SearchBar({
  value = "",
  onChange,
  onSubmit,
  placeholder = "신촌 꿀팁 검색",
  readOnly = false,
  onClick,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(value.trim());
  };

  return (
    <Form role="search" onSubmit={handleSubmit}>
      <IconSlot>
        <SearchIcon />
      </IconSlot>
      <Input
        type="search"
        value={value}
        placeholder={placeholder}
        enterKeyHint="search"
        aria-label="꿀팁 검색"
        readOnly={readOnly}
        onClick={onClick}
        onChange={(event) => onChange?.(event.target.value)}
      />
    </Form>
  );
}
