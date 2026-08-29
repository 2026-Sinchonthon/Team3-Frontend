import styled from "styled-components";

const Container = styled.footer`
  z-index: 10;
  min-height: 2.125rem;
  padding: 0.5rem 1rem;
  border-top: 0.0625rem solid #ececec;
  background: #fff;
  color: #777;
  font-size: 0.6875rem;
  text-align: center;
`;

export default function Footer() {
  return <Container>신촌의 생활 꿀팁을 지도에서 확인해 보세요.</Container>;
}
