import styled from "styled-components";

const Container = styled.header`
  z-index: 10;
  display: flex;
  align-items: center;
  min-height: 3.25rem;
  padding: 0 1rem;
  border-bottom: 0.0625rem solid #ececec;
  background: #fff;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.03em;
`;

export default function Header() {
  return (
    <Container>
      <Title>신촌 꿀팁 지도</Title>
    </Container>
  );
}
