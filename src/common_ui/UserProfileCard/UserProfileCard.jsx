import styled from "styled-components";
import getResidenceLabel from "../../constants/residence";

export default function UserProfileCard({
  profile,
  showFollowButton = false,
  isFollowPending = false,
  onToggleFollow,
}) {
  const trustScore = Math.min(
    100,
    Math.max(0, Math.round(Number(profile.trustScore) || 0)),
  );

  return (
    <Card>
      <NameRow>
        <Nickname>{profile.nickname}</Nickname>
        <TrustBadge>
          <span>{getResidenceLabel(profile.residenceYears)}</span>
          <span>{trustScore}%</span>
        </TrustBadge>
      </NameRow>

      <TrustArea>
        <TrustLabel>
          신뢰도 <strong>{trustScore}%</strong>
        </TrustLabel>
        <TrustTrack
          role="progressbar"
          aria-label="사용자 신뢰도"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={trustScore}
        >
          <TrustFill $score={trustScore} />
        </TrustTrack>
      </TrustArea>

      <SummaryRow>
        <Stats>
          <Stat><span>게시글</span><strong>{profile.postCount ?? 0}</strong></Stat>
          <Stat><span>팔로워</span><strong>{profile.followerCount ?? 0}</strong></Stat>
          <Stat><span>팔로잉</span><strong>{profile.followingCount ?? 0}</strong></Stat>
        </Stats>

        {showFollowButton && (
          <FollowButton
            type="button"
            $following={profile.isFollowing}
            disabled={isFollowPending}
            onClick={onToggleFollow}
          >
            {profile.isFollowing ? "팔로잉" : "팔로우"}
          </FollowButton>
        )}
      </SummaryRow>
    </Card>
  );
}

const Card = styled.section`
  width: min(100%, 18.75rem);
  padding: 0.9375rem;
  border-top: 0.0625rem solid ${({ theme }) => theme.color.border};
  border-bottom: 0.0625rem solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.border};
`;

const NameRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
`;

const Nickname = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.font.md};
  line-height: 1.25;
`;

const TrustBadge = styled.span`
  display: inline-flex;
  gap: 0.3125rem;
  padding: 0.0625rem 0.3125rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.brandSoft};
  font-size: ${({ theme }) => theme.font.xs};
  font-weight: 300;
`;

const TrustArea = styled.div`
  display: grid;
  gap: 0.3125rem;
  margin-top: 0.625rem;
`;

const TrustLabel = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.xs};
  font-weight: 300;
`;

const TrustTrack = styled.div`
  height: 0.3125rem;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: #d9d9d9;
`;

const TrustFill = styled.div`
  width: ${({ $score }) => $score}%;
  height: 100%;
  border-radius: inherit;
  background: ${({ theme }) => theme.color.brand};
`;

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1.5625rem;
`;

const Stats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
`;

const Stat = styled.span`
  display: inline-flex;
  gap: 0.1875rem;
  font-size: ${({ theme }) => theme.font.xs};
  font-weight: 300;
`;

const FollowButton = styled.button`
  flex: none;
  padding: 0.3125rem;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $following, theme }) =>
    $following ? theme.color.brand : theme.color.handle};
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.font.sm};
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;
