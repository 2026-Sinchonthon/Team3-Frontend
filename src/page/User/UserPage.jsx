import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import AlertModal from "../../common_ui/Alert/Alert";
import {
  followUser,
  getUserProfile,
  unfollowUser,
} from "../../util/UserAPI";

const DEFAULT_PROFILE = {
  nickname: "닉네임",
  profileImageUrl: "/default-profile.svg",
  followerCount: 0,
  isFollowing: false,
};

const Container = styled.section`
  width: min(100%, 40rem);
  margin: 0 auto;
  padding: 1.5rem 1rem;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProfileImage = styled.img`
  flex: none;
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const Nickname = styled.h1`
  margin: 0 0 0.375rem;
  font-size: 1.25rem;
  overflow-wrap: anywhere;
`;

const FollowerCount = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.875rem;
`;

const FollowButton = styled.button`
  flex: none;
  min-width: 5.5rem;
  height: 2.5rem;
  padding: 0 0.875rem;
  border: 0.0625rem solid #222;
  border-radius: 0.5rem;
  background: ${({ $isFollowing }) => ($isFollowing ? "#fff" : "#222")};
  color: ${({ $isFollowing }) => ($isFollowing ? "#222" : "#fff")};
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const LoadingMessage = styled.p`
  margin: auto;
  color: #666;
`;

export default function UserPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userState, setUserState] = useState({
    userId: "",
    profile: null,
    error: "",
  });
  const [isFollowPending, setIsFollowPending] = useState(false);
  const isCurrentUser = userState.userId === userId;
  const profile = isCurrentUser ? userState.profile : null;
  const error = isCurrentUser ? userState.error : "";

  useEffect(() => {
    let isActive = true;

    getUserProfile(userId)
      .then((userProfile) => {
        if (isActive) {
          setUserState({
            userId,
            profile: { ...DEFAULT_PROFILE, ...userProfile },
            error: "",
          });
        }
      })
      .catch((requestError) => {
        if (isActive) {
          setUserState({
            userId,
            profile: null,
            error: requestError.message || "사용자 정보를 불러오지 못했습니다.",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [userId]);

  const toggleFollow = async () => {
    if (!profile || isFollowPending) return;

    try {
      setIsFollowPending(true);

      if (profile.isFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }

      setUserState((current) => ({
        ...current,
        profile: {
          ...current.profile,
          isFollowing: !profile.isFollowing,
          followerCount: Math.max(
            0,
            profile.followerCount + (profile.isFollowing ? -1 : 1),
          ),
        },
      }));
    } catch (requestError) {
      setUserState((current) => ({
        ...current,
        error: requestError.message || "팔로우 상태를 변경하지 못했습니다.",
      }));
    } finally {
      setIsFollowPending(false);
    }
  };

  if (!isCurrentUser) {
    return <LoadingMessage>사용자 정보를 불러오는 중입니다.</LoadingMessage>;
  }

  return (
    <Container>
      {profile && (
        <Profile>
          <ProfileImage
            src={profile.profileImageUrl || "/default-profile.svg"}
            alt={`${profile.nickname} 프로필`}
            onError={(event) => {
              event.currentTarget.src = "/default-profile.svg";
            }}
          />
          <UserInfo>
            <Nickname>{profile.nickname}</Nickname>
            <FollowerCount>팔로워 {profile.followerCount}명</FollowerCount>
          </UserInfo>
          <FollowButton
            type="button"
            $isFollowing={profile.isFollowing}
            disabled={isFollowPending}
            onClick={toggleFollow}
          >
            {profile.isFollowing ? "팔로잉" : "팔로우"}
          </FollowButton>
        </Profile>
      )}

      {error && (
        <AlertModal
          type="alert"
          color="red"
          title="요청 실패"
          content={error}
          onConfirm={() => navigate("/")}
          onClose={() => navigate("/")}
        />
      )}
    </Container>
  );
}
