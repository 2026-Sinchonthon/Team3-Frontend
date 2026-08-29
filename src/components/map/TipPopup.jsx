import styled from "styled-components";

const Card = styled.article`
  position: relative;
  width: min(16.25rem, calc(100vw - 3rem));
  padding: 1rem 2.625rem 1rem 1rem;
  border: 0.0625rem solid #e5e5e5;
  border-radius: 0.875rem;
  background: #fff;
  box-shadow: 0 0.5rem 1.5rem rgb(0 0 0 / 16%);
`;

const Title = styled.h2`
  margin: 0 0 0.4375rem;
  color: #202124;
  font-size: 0.9375rem;
  line-height: 1.4;
`;

const Content = styled.p`
  margin: 0;
  color: #555;
  font-size: 0.8125rem;
  line-height: 1.55;
  overflow-wrap: anywhere;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: #777;
  font-size: 1.3125rem;
  cursor: pointer;
`;

export default function TipPopup({ tip, onClose }) {
  return (
    <Card>
      <CloseButton type="button" aria-label="팁 닫기" onClick={onClose}>
        ×
      </CloseButton>
      <Title>{tip.title}</Title>
      <Content>{tip.content}</Content>
    </Card>
  );
}
