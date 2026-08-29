import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Modal = styled.aside`
  position: absolute;
  top: 1rem;
  left: 50%;
  z-index: 10;
  width: min(calc(100% - 2rem), 22rem);
  padding: 1rem;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 0.25rem 1rem rgb(0 0 0 / 18%);
  transform: translateX(-50%);
`;

const Title = styled.h1`
  margin: 0 0 0.75rem;
  font-size: 1rem;
`;

const SearchButton = styled.button`
  width: 100%;
  height: 2.75rem;
  border: 0;
  border-radius: 0.5rem;
  background: #222;
  color: #fff;
  cursor: pointer;
`;

export default function SearchModal() {
  const navigate = useNavigate();

  return (
    <Modal role="dialog" aria-label="장소 검색">
      <Title>팁을 남길 장소를 찾아보세요.</Title>
      <SearchButton type="button" onClick={() => navigate("/search")}>
        장소 검색
      </SearchButton>
    </Modal>
  );
}
