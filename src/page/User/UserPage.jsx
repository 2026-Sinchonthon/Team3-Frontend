import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import AlertModal from "../../common_ui/Alert/Alert";
import { ArrowLeftIcon } from "../../common_ui/Icon/Icons";
import TipListItem from "../../common_ui/TipListItem/TipListItem";
import UserProfileCard from "../../common_ui/UserProfileCard/UserProfileCard";
import { logout } from "../../util/AuthAPI";
import {
  followUser,
  getCurrentUserId,
  getUserProfile,
  unfollowUser,
} from "../../util/UserAPI";

const DEFAULT_PROFILE = {
  nickname: "닉네임",
  residenceYears: 0,
  trustScore: 0,
  postCount: 0,
  followerCount: 0,
  followingCount: 0,
  isFollowing: false,
  tips: [],
};

const ACCOUNT_GROUPS = [
  ["계정 관리", "로그인 정보", "닉네임 변경", "로그아웃", "계정삭제"],
  ["팔로잉 관리"],
];

export default function UserPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUserId = getCurrentUserId();
  const targetUserId = userId ?? currentUserId;
  const isOwnProfile = userId == null;
  const [userState, setUserState] = useState({
    userId: "",
    profile: null,
    error: "",
  });
  const [isFollowPending, setIsFollowPending] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [alert, setAlert] = useState(null);
  const isCurrentUser = String(userState.userId) === String(targetUserId);
  const profile = isCurrentUser ? userState.profile : null;

  useEffect(() => {
    let isActive = true;

    getUserProfile(targetUserId)
      .then((userProfile) => {
        if (!isActive) return;
        setUserState({
          userId: targetUserId,
          profile: { ...DEFAULT_PROFILE, ...userProfile },
          error: "",
        });
      })
      .catch((requestError) => {
        if (!isActive) return;
        setUserState({
          userId: targetUserId,
          profile: null,
          error: requestError.message || "사용자 정보를 불러오지 못했습니다.",
        });
      });

    return () => {
      isActive = false;
    };
  }, [targetUserId]);

  const toggleFollow = async () => {
    if (!profile || isFollowPending) return;

    try {
      setIsFollowPending(true);
      if (profile.isFollowing) await unfollowUser(targetUserId);
      else await followUser(targetUserId);

      setUserState((current) => ({
        ...current,
        profile: {
          ...current.profile,
          isFollowing: !current.profile.isFollowing,
          followerCount: Math.max(
            0,
            current.profile.followerCount +
              (current.profile.isFollowing ? -1 : 1),
          ),
        },
      }));
    } catch (requestError) {
      setAlert({
        color: "red",
        title: "요청 실패",
        content: requestError.message || "팔로우 상태를 변경하지 못했습니다.",
      });
    } finally {
      setIsFollowPending(false);
    }
  };

  const handleAccountMenu = async (label) => {
    if (label !== "로그아웃") return;

    try {
      setIsLoggingOut(true);
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      setAlert({
        color: "red",
        title: "로그아웃 실패",
        content: error.message || "로그아웃하지 못했습니다.",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!isCurrentUser) {
    return <LoadingMessage>사용자 정보를 불러오는 중입니다.</LoadingMessage>;
  }

  return (
    <Page>
      <PageHeader>
        {!isOwnProfile && (
          <BackButton type="button" aria-label="뒤로가기" onClick={() => navigate(-1)}>
            <ArrowLeftIcon />
          </BackButton>
        )}
        <PageTitle>{isOwnProfile ? "마이페이지" : profile?.nickname}</PageTitle>
      </PageHeader>

      {profile && (
        <Content>
          <UserProfileCard
            profile={profile}
            showFollowButton={!isOwnProfile}
            isFollowPending={isFollowPending}
            onToggleFollow={toggleFollow}
          />

          {isOwnProfile ? (
            <MyPageMenus>
              <MenuGroup>
                <MenuButton type="button" onClick={() => navigate("/user/posts")}>
                  내 게시글 관리
                </MenuButton>
              </MenuGroup>
              {ACCOUNT_GROUPS.map((group, groupIndex) => (
                <MenuGroup key={groupIndex}>
                  {group.map((label) => (
                    <MenuButton
                      key={label}
                      type="button"
                      disabled={isLoggingOut && label === "로그아웃"}
                      onClick={() => handleAccountMenu(label)}
                    >
                      {isLoggingOut && label === "로그아웃" ? "로그아웃 중..." : label}
                    </MenuButton>
                  ))}
                </MenuGroup>
              ))}
            </MyPageMenus>
          ) : (
            <TipsSection>
              <SectionTitle>작성한 꿀팁</SectionTitle>
              <TipList>
                {profile.tips.map((tip) => (
                  <li key={tip.id}>
                    <TipListItem
                      tip={tip}
                      onSelect={() => navigate(`/tips/${tip.id}`)}
                    />
                  </li>
                ))}
              </TipList>
            </TipsSection>
          )}
        </Content>
      )}

      {(userState.error || alert) && (
        <AlertModal
          type="alert"
          color={alert?.color || "red"}
          title={alert?.title || "요청 실패"}
          content={alert?.content || userState.error}
          onConfirm={() => {
            setAlert(null);
            setUserState((current) => ({ ...current, error: "" }));
          }}
          onClose={() => {
            setAlert(null);
            setUserState((current) => ({ ...current, error: "" }));
          }}
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
  max-width: calc(100% - 5rem);
  margin: 0;
  overflow: hidden;
  font-size: 1.25rem;
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
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

const MyPageMenus = styled.div`
  display: grid;
  gap: 0.625rem;
  width: min(100%, 18.75rem);
  margin-top: 1.25rem;
`;

const MenuGroup = styled.div`
  display: grid;
  gap: 0.625rem;
  padding: 0.625rem 0;
  border-top: 0.0625rem solid ${({ theme }) => theme.color.textMuted};
  border-bottom: 0.0625rem solid ${({ theme }) => theme.color.textMuted};
`;

const MenuButton = styled.button`
  width: 100%;
  min-height: 1.875rem;
  padding: 0.3125rem 0.625rem;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.field};
  color: inherit;
  font-size: ${({ theme }) => theme.font.xs};
  font-weight: 300;
  text-align: left;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
`;

const TipsSection = styled.section`
  width: calc(100% + 1.5rem);
  margin-right: -0.75rem;
  margin-left: -0.75rem;
  margin-top: 3.375rem;
`;

const SectionTitle = styled.h2`
  margin: 0 0 0.625rem;
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

const LoadingMessage = styled.p`
  margin: auto;
  color: ${({ theme }) => theme.color.textMuted};
`;
