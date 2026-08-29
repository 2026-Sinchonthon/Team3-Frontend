import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import AlertModal from "../../common_ui/Alert/Alert";
import { getTipsByPlace } from "../../util/TipAPI";

const Container = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: min(100%, 40rem);
  min-height: 0;
  margin: 0 auto;
  padding: 1.5rem 1rem;
`;

const PageHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
`;

const PlaceName = styled.h1`
  margin: 0;
  font-size: 1.25rem;
  overflow-wrap: anywhere;
`;

const WriteButton = styled.button`
  flex: none;
  padding: 0.625rem 0.875rem;
  border: 0;
  border-radius: 0.5rem;
  background: #222;
  color: #fff;
  cursor: pointer;
`;

const TipList = styled.ul`
  display: grid;
  margin: 0;
  padding: 0;
  gap: 0.75rem;
  list-style: none;
`;

const TipItem = styled.button`
  width: 100%;
  padding: 1rem;
  border: 0.0625rem solid #dedede;
  border-radius: 0.5rem;
  background: #fff;
  text-align: left;
  cursor: pointer;
`;

const TipTitle = styled.h2`
  margin: 0 0 0.5rem;
  font-size: 1rem;
`;

const TipContent = styled.p`
  margin: 0;
  color: #555;
  font-size: 0.875rem;
  line-height: 1.6;
  overflow-wrap: anywhere;
`;

const EmptyState = styled.div`
  display: grid;
  flex: 1;
  place-items: center;
  min-height: 18rem;
`;

const LargeWriteButton = styled.button`
  width: min(100%, 20rem);
  min-height: 7rem;
  padding: 1.5rem;
  border: 0;
  border-radius: 0.75rem;
  background: #222;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
`;

const LoadingMessage = styled.p`
  margin: auto;
  color: #666;
`;

export default function PlaceTips() {
  const { placeId } = useParams();
  const routeLocation = useLocation();
  const navigate = useNavigate();
  const location = routeLocation.state?.location ?? {
    id: placeId,
    name: "선택한 장소",
  };
  const [tipState, setTipState] = useState({
    placeId: "",
    tips: [],
    error: "",
  });
  const isCurrentPlace = tipState.placeId === placeId;
  const isLoading = !isCurrentPlace;
  const tips = isCurrentPlace ? tipState.tips : [];
  const error = isCurrentPlace ? tipState.error : "";

  useEffect(() => {
    let isActive = true;

    getTipsByPlace(placeId)
      .then((placeTips) => {
        if (isActive) {
          setTipState({ placeId, tips: placeTips, error: "" });
        }
      })
      .catch((requestError) => {
        if (isActive) {
          setTipState({
            placeId,
            tips: [],
            error: requestError.message || "팁 목록을 불러오지 못했습니다.",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [placeId]);

  const openEditor = () => {
    navigate("/editor", { state: { location } });
  };

  return (
    <Container>
      <PageHeader>
        <PlaceName>{location.name}</PlaceName>
        <WriteButton type="button" onClick={openEditor}>
          글쓰기
        </WriteButton>
      </PageHeader>

      {isLoading ? (
        <LoadingMessage>팁 목록을 불러오는 중입니다.</LoadingMessage>
      ) : tips.length > 0 ? (
        <TipList>
          {tips.map((tip) => (
            <li key={tip.id}>
              <TipItem
                type="button"
                onClick={() => navigate(`/tips/${tip.id}`)}
              >
                <TipTitle>{tip.title}</TipTitle>
                <TipContent>{tip.content}</TipContent>
              </TipItem>
            </li>
          ))}
        </TipList>
      ) : (
        <EmptyState>
          <LargeWriteButton type="button" onClick={openEditor}>
            첫 번째 팁 작성하기
          </LargeWriteButton>
        </EmptyState>
      )}

      {error && (
        <AlertModal
          type="alert"
          color="red"
          title="팁 조회 실패"
          content={error}
          onConfirm={() => navigate("/search")}
          onClose={() => navigate("/search")}
        />
      )}
    </Container>
  );
}
