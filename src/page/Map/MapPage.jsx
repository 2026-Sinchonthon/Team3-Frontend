import styled from "styled-components";
import mockTips from "../../data/mockTips";
import KakaoMap from "./KakaoMap";
import SearchModal from "./SearchModal";

const Container = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
`;

export default function MapPage() {
  return (
    <Container>
      <KakaoMap tips={mockTips} />
      <SearchModal />
    </Container>
  );
}
