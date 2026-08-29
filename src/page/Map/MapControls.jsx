import styled from "styled-components";

const Controls = styled.div`
  position: absolute;
  top: 50%;
  right: 0.75rem;
  z-index: 5;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 0.0625rem solid #dedede;
  border-radius: 0.625rem;
  background: #fff;
  box-shadow: 0 0.1875rem 0.625rem rgb(0 0 0 / 14%);
  transform: translateY(-50%);
`;

const ControlButton = styled.button`
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  border: 0;
  background: #fff;
  color: #222;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;

  & + & {
    border-top: 0.0625rem solid #e8e8e8;
  }

  &:active {
    background: #f3f3f3;
  }
`;

export default function MapControls({ onZoomIn, onZoomOut }) {
  return (
    <Controls aria-label="지도 확대 및 축소">
      <ControlButton type="button" aria-label="지도 확대" onClick={onZoomIn}>
        +
      </ControlButton>
      <ControlButton type="button" aria-label="지도 축소" onClick={onZoomOut}>
        −
      </ControlButton>
    </Controls>
  );
}
