import styled from "styled-components";
import { WriteIcon } from "../../common_ui/Icon/Icons";

/*
목적: 홈 화면의 글쓰기 버튼 (IA - 홈 > 글쓰기 > 지도에서 위치 지정)
*/

const Fab = styled.button`
  position: absolute;
  right: 1rem;
  z-index: ${({ theme }) => theme.layer.fab};
  display: grid;
  place-items: center;
  width: 3.125rem;
  height: 3.125rem;
  border: 0;
  border-radius: 50%;
  background: ${({ theme }) => theme.color.brand};
  color: ${({ theme }) => theme.color.text};
  box-shadow: ${({ theme }) => theme.shadow.card};
  cursor: pointer;
  transition: bottom 0.25s ease;

  &:active {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 0.125rem solid ${({ theme }) => theme.color.brandStrong};
    outline-offset: 0.125rem;
  }
`;

export default function WriteFab({ bottom = "1rem", onClick }) {
  return (
    <Fab type="button" aria-label="꿀팁 글쓰기" style={{ bottom }} onClick={onClick}>
      <WriteIcon />
    </Fab>
  );
}
