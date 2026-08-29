import { useLocation } from "react-router-dom";
import styled from "styled-components";

/*
목적: 아직 만들지 않은 화면(게시판 / 마이페이지 / 게시글 상세)으로 이동했을 때의 임시 안내.
홈 화면의 링크가 빈 화면으로 끝나지 않게 하려고 둔 안전망이므로,
해당 화면이 실제로 붙으면 App.jsx의 * 라우트와 함께 지워 주세요.
*/

const Container = styled.section`
  display: grid;
  flex: 1;
  place-items: center;
  padding: 2rem 1rem;
  text-align: center;
`;

const Message = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.color.textMuted};
  font-size: ${({ theme }) => theme.font.sm};
  line-height: 1.6;
`;

export default function ComingSoon() {
  const { pathname } = useLocation();

  return (
    <Container>
      <Message>
        아직 준비 중인 화면입니다.
        <br />
        <code>{pathname}</code>
      </Message>
    </Container>
  );
}
