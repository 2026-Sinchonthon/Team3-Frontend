import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AlertModal from "../../common_ui/Alert/Alert";
import { ArrowLeftIcon } from "../../common_ui/Icon/Icons";
import UserProfileCard from "../../common_ui/UserProfileCard/UserProfileCard";
import {
  getCurrentUserId,
  getMyTips,
  getUserProfile,
} from "../../util/UserAPI";

export default function UserPostsPage() {
  const navigate = useNavigate();
  const userId = getCurrentUserId();
  const [state, setState] = useState({
    profile: null,
    tips: [],
    pagination: null,
    isLoading: true,
    error: "",
  });

  useEffect(() => {
    let isActive = true;

    Promise.all([getUserProfile(userId), getMyTips({ page: 0, size: 20 })])
      .then(([profile, tipPage]) => {
        if (!isActive) return;
        setState({
          profile,
          tips: tipPage.tips,
          pagination: tipPage,
          isLoading: false,
          error: "",
        });
      })
      .catch((error) => {
        if (!isActive) return;
        setState({
          profile: null,
          tips: [],
          pagination: null,
          isLoading: false,
          error: error.message || "내 게시글을 불러오지 못했습니다.",
        });
      });

    return () => {
      isActive = false;
    };
  }, [userId]);

  return (
    <Page>
      <PageHeader>
        <BackButton type="button" aria-label="뒤로가기" onClick={() => navigate(-1)}>
          <ArrowLeftIcon />
        </BackButton>
        <PageTitle>마이페이지</PageTitle>
      </PageHeader>

      <Content>
        {state.isLoading && <StatusText>내 게시글을 불러오는 중입니다.</StatusText>}

        {state.profile && (
          <>
            <UserProfileCard profile={state.profile} />
            <ManageLabel>내 게시글 관리</ManageLabel>
          </>
        )}

        {!state.isLoading && state.tips.length === 0 && (
          <StatusText>작성한 꿀팁이 없습니다.</StatusText>
        )}

        {state.tips.length > 0 && (
          <TipsSection>
            <SectionTitle>작성한 꿀팁</SectionTitle>
            <TipList>
              {state.tips.map((tip) => (
                <li key={tip.tipId}>
                  <ManagedTip
                    type="button"
                    onClick={() => navigate(`/tips/${tip.tipId}`)}
                  >
                    <TipMeta>
                      <Category>{tip.category?.name || "카테고리 없음"}</Category>
                      <Status $active={tip.status === "ACTIVE"}>
                        {tip.status === "ACTIVE" ? "게시 중" : tip.status}
                      </Status>
                    </TipMeta>
                    <TipTitle>{tip.title}</TipTitle>
                    <TipContent>{tip.content}</TipContent>
                  </ManagedTip>
                </li>
              ))}
            </TipList>
          </TipsSection>
        )}
      </Content>

      {state.error && (
        <AlertModal
          type="alert"
          color="red"
          title="조회 실패"
          content={state.error}
          onConfirm={() => navigate("/user", { replace: true })}
          onClose={() => navigate("/user", { replace: true })}
        />
      )}
    </Page>
  );
}

const Page = styled.section`
  display: flex;
  flex: 0 1 23.4375rem;
  flex-direction: column;
  width: min(100%, 23.4375rem);
  min-height: 0;
  margin: 0 auto;
  background: ${({ theme }) => theme.color.surfaceMuted};
  color: ${({ theme }) => theme.color.text};
`;

const PageHeader = styled.header`
  position: relative;
  display: flex;
  flex: 0 0 3.5625rem;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const BackButton = styled.button`
  position: absolute;
  left: 1rem;
  display: grid;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  place-items: center;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 400;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  min-height: 0;
  padding: 1rem 0.75rem 1.5rem;
  overflow-x: hidden;
  overflow-y: auto;
`;

const ManageLabel = styled.p`
  width: min(100%, 18.75rem);
  margin: 1.25rem 0 0.625rem;
  padding: 0.3125rem 0.625rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.brand};
  font-size: ${({ theme }) => theme.font.xs};
`;

const TipsSection = styled.section`
  width: calc(100% + 1.5rem);
  margin-right: -0.75rem;
  margin-left: -0.75rem;
`;

const SectionTitle = styled.h2`
  margin: 0.625rem 0;
  font-size: ${({ theme }) => theme.font.md};
  font-weight: 300;
  text-align: center;
`;

const TipList = styled.ul`
  display: grid;
  gap: 0.3125rem;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const ManagedTip = styled.button`
  display: grid;
  gap: 0.375rem;
  width: 100%;
  padding: 0.75rem 0.9375rem;
  border: 0;
  border-top: 0.0625rem solid ${({ theme }) => theme.color.border};
  border-bottom: 0.0625rem solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.surface};
  color: ${({ theme }) => theme.color.text};
  text-align: left;
  cursor: pointer;
`;

const TipMeta = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Category = styled.span`
  padding: 0.125rem 0.25rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.brand};
  font-size: ${({ theme }) => theme.font.xs};
`;

const Status = styled.span`
  color: ${({ $active, theme }) =>
    $active ? theme.color.brandStrong : theme.color.textMuted};
  font-size: ${({ theme }) => theme.font.xs};
`;

const TipTitle = styled.strong`
  font-size: ${({ theme }) => theme.font.sm};
`;

const TipContent = styled.span`
  overflow: hidden;
  color: ${({ theme }) => theme.color.textMuted};
  font-size: ${({ theme }) => theme.font.xs};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StatusText = styled.p`
  margin: auto;
  color: ${({ theme }) => theme.color.textMuted};
  font-size: ${({ theme }) => theme.font.sm};
`;
