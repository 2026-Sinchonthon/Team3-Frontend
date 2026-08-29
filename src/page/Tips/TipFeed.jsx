import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import AlertModal from "../../common_ui/Alert/Alert";
import StaticLocationMap from "../../common_ui/StaticLocationMap/StaticLocationMap";
import { getTipById } from "../../util/TipAPI";

const Container = styled.article`
  width: min(100%, 40rem);
  margin: 0 auto;
  padding: 1.5rem 1rem;
`;

const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.5rem;
`;

const Nickname = styled.strong`
  font-size: 1rem;
`;

const TrustScore = styled.span`
  color: #666;
  font-size: 0.875rem;
`;

const Category = styled.span`
  display: inline-block;
  margin-bottom: 0.75rem;
  color: #666;
  font-size: 0.875rem;
`;

const Title = styled.h1`
  margin: 0 0 1rem;
  font-size: 1.5rem;
  overflow-wrap: anywhere;
`;

const Content = styled.p`
  margin: 0 0 2rem;
  font-size: 1rem;
  line-height: 1.7;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

const LocationSection = styled.section`
  padding: 1rem;
  border: 0.0625rem solid #dedede;
  border-radius: 0.5rem;
`;

const LocationHeading = styled.h2`
  margin: 0 0 0.75rem;
  font-size: 1rem;
`;

const LocationName = styled.strong`
  display: block;
  margin-bottom: 0.375rem;
`;

const LocationDetail = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.875rem;

  & + & {
    margin-top: 0.25rem;
  }
`;

const LoadingMessage = styled.p`
  margin: auto;
  color: #666;
`;

export default function TipFeed() {
  const { tipId } = useParams();
  const navigate = useNavigate();
  const [tipState, setTipState] = useState({
    tipId: "",
    tip: null,
    error: "",
  });
  const isCurrentTip = tipState.tipId === tipId;
  const tip = isCurrentTip ? tipState.tip : null;
  const error = isCurrentTip ? tipState.error : "";

  useEffect(() => {
    let isActive = true;

    getTipById(tipId)
      .then((tipDetail) => {
        if (isActive) {
          setTipState({ tipId, tip: tipDetail, error: "" });
        }
      })
      .catch((requestError) => {
        if (isActive) {
          setTipState({
            tipId,
            tip: null,
            error: requestError.message || "팁을 불러오지 못했습니다.",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [tipId]);

  if (!isCurrentTip) return <LoadingMessage>팁을 불러오는 중입니다.</LoadingMessage>;

  return (
    <Container>
      {tip && (
        <>
          <AuthorRow>
            <Nickname>{tip.author.nickname}</Nickname>
            <TrustScore>신뢰지수 {tip.author.trustScore}%</TrustScore>
          </AuthorRow>
          <Category>{tip.category}</Category>
          <Title>{tip.title}</Title>
          <Content>{tip.content}</Content>

          <LocationSection>
            <LocationHeading>위치</LocationHeading>
            <LocationName>{tip.location.name}</LocationName>
            <LocationDetail>{tip.location.address}</LocationDetail>
            <LocationDetail>
              {tip.location.lat}, {tip.location.lng}
            </LocationDetail>
            <StaticLocationMap location={tip.location} />
          </LocationSection>
        </>
      )}

      {error && (
        <AlertModal
          type="alert"
          color="red"
          title="팁 조회 실패"
          content={error}
          onConfirm={() => navigate("/")}
          onClose={() => navigate("/")}
        />
      )}
    </Container>
  );
}
