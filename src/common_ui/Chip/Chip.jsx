import styled, { css } from "styled-components";

/*
목적: 선택 상태를 가지는 공용 칩 버튼

사용법:
<Chip size="md | sm" selected={true} onClick={() => {}}>식비방어</Chip>

props:
- size     : md(카테고리 필터) | sm(정렬 선택). 기본값 md
- selected : 선택 여부. 선택 시 브랜드 색으로 채워집니다.
*/

const SIZE_STYLE = {
  md: css`
    padding: 0.625rem;
    font-size: ${({ theme }) => theme.font.sm};
    font-weight: 700;
  `,
  sm: css`
    padding: 0.3125rem 0.625rem;
    font-size: ${({ theme }) => theme.font.xs};
    font-weight: 400;
  `,
};

const Chip = styled.button`
  flex: none;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $selected }) =>
    $selected ? theme.color.brand : theme.color.surfaceMuted};
  color: ${({ theme }) => theme.color.text};
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s ease;

  ${({ $size = "md" }) => SIZE_STYLE[$size]}

  &:focus-visible {
    outline: 0.125rem solid ${({ theme }) => theme.color.brandStrong};
    outline-offset: 0.125rem;
  }
`;

export default function ChipButton({
  size = "md",
  selected = false,
  children,
  ...rest
}) {
  return (
    <Chip type="button" $size={size} $selected={selected} aria-pressed={selected} {...rest}>
      {children}
    </Chip>
  );
}
