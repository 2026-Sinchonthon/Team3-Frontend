import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import AlertModal from "../../common_ui/Alert/Alert";
import {
  ArrowLeftIcon,
  ArrowUpIcon,
  HeartIcon,
  InboxIcon,
  MehIcon,
  MessageCircleIcon,
} from "../../common_ui/Icon/Icons";
import StaticLocationMap from "../../common_ui/StaticLocationMap/StaticLocationMap";
import getResidenceLabel from "../../constants/residence";
import formatTipDateTime from "../../util/formatDate";
import { createComment, getComments, getTipById } from "../../util/TipAPI";
import { followUser, unfollowUser } from "../../util/UserAPI";

/*
목적: 게시글 상세 화면 - Figma `게시글` (53:10401)
구성: 뒤로가기 + 팔로우 / 작성자·작성일시 / 제목 / 장소 바로가기 / 본문 /
      위치 지도 / 반응(좋아요·비추·댓글·스크랩) / 댓글 목록 / 댓글 입력

상단 바와 하단 네비바를 쓰지 않는 화면이라 MainLayout 밖의 라우트로 둡니다.
*/

const Page = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
  background: ${({ theme }) => theme.color.surface};
`;

const Scroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

const Article = styled.article`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 0.875rem 0.5625rem 1.25rem;
`;

const PostSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding-bottom: 0.9375rem;
  border-bottom: 0.0625rem solid ${({ theme }) => theme.color.textMuted};
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.875rem;
`;

const IconButton = styled.button`
  display: grid;
  place-items: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.color.text};
  cursor: pointer;

  &:focus-visible {
    outline: 0.125rem solid ${({ theme }) => theme.color.brandStrong};
    outline-offset: 0.25rem;
  }
`;

const FollowButton = styled.button`
  flex: none;
  padding: 0.3125rem;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $following }) =>
    $following ? theme.color.brand : theme.color.field};
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.font.sm};
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;

  &:focus-visible {
    outline: 0.125rem solid ${({ theme }) => theme.color.brandStrong};
    outline-offset: 0.125rem;
  }
`;

const PostBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.3125rem;
`;

const AuthorBlock = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.625rem;
`;

const Nickname = styled.strong`
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.font.md};
  font-weight: 700;
  line-height: 1.2;
`;

const TrustBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
  padding: 0.0625rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.brandSoft};
  font-size: ${({ theme }) => theme.font.xs};
  font-weight: 300;
  line-height: 1.2;
  white-space: nowrap;
`;

const CategoryTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.0625rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.brand};
  font-size: ${({ theme }) => theme.font.sm};
  font-weight: 300;
  line-height: 1.2;
  white-space: nowrap;
`;

const PostedAt = styled.time`
  padding: 0 0.3125rem;
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.font.sm};
  font-weight: 300;
  line-height: 1.4;
`;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.color.text};
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
  overflow-wrap: anywhere;
`;

const PlaceBanner = styled.button`
  margin: 0 0.625rem;
  padding: 0.625rem;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.field};
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.font.sm};
  line-height: 1.3;
  text-align: left;
  cursor: pointer;
  overflow-wrap: anywhere;

  &:focus-visible {
    outline: 0.125rem solid ${({ theme }) => theme.color.brandStrong};
    outline-offset: 0.125rem;
  }
`;

const Content = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.font.sm};
  font-weight: 300;
  line-height: 1.55;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

const MapSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.4375rem;
`;

const MapLabel = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.font.sm};
  font-weight: 300;
  line-height: 1.2;
`;

const Reactions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.9375rem;
`;

const Reaction = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme, $active }) =>
    $active ? theme.color.brandStrong : theme.color.text};
  font-size: ${({ theme }) => theme.font.sm};
  font-weight: 300;
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;

  &:focus-visible {
    outline: 0.125rem solid ${({ theme }) => theme.color.brandStrong};
    outline-offset: 0.125rem;
  }
`;

const CommentList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin: 0;
  padding: 0 0.625rem;
  list-style: none;
`;

const CommentAuthor = styled.strong`
  display: block;
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.font.sm};
  font-weight: 400;
  line-height: 1.4;
`;

const CommentText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.font.sm};
  font-weight: 300;
  line-height: 1.4;
  overflow-wrap: anywhere;
`;

const CommentForm = styled.form`
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  gap: 0.625rem;
  padding: 0.625rem 0.9375rem;
  border-top: 0.0625rem solid ${({ theme }) => theme.color.textMuted};
  background: ${({ theme }) => theme.color.surface};
`;

const CommentInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0.625rem;
  border: 0.0625rem solid ${({ theme }) => theme.color.textMuted};
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.color.surfaceMuted};
  color: ${({ theme }) => theme.color.text};
  font: inherit;
  font-size: ${({ theme }) => theme.font.sm};
  font-weight: 300;

  &::placeholder {
    color: ${({ theme }) => theme.color.text};
  }

  &:focus {
    border-color: ${({ theme }) => theme.color.brandStrong};
    outline: none;
  }
`;

const SendButton = styled.button`
  display: grid;
  flex: none;
  place-items: center;
  padding: 0.3125rem;
  border: 0.0625rem solid ${({ theme }) => theme.color.textMuted};
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.color.surfaceMuted};
  color: ${({ theme }) => theme.color.textMuted};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }

  &:not(:disabled):focus-visible {
    outline: 0.125rem solid ${({ theme }) => theme.color.brandStrong};
    outline-offset: 0.125rem;
  }
`;

const LoadingMessage = styled.p`
  margin: auto;
  padding: 2rem 1rem;
  color: ${({ theme }) => theme.color.textMuted};
  text-align: center;
`;

const withReaction = (count, isActive) => (count ?? 0) + (isActive ? 1 : 0);

// 댓글 / 반응 / 팔로우는 게시글마다 새로 시작해야 하므로 tipId를 함께 들고 다닙니다.
const EMPTY_THREAD = {
  tipId: "",
  comments: [],
  draft: "",
  isFollowing: false,
  reaction: { liked: false, disliked: false, scrapped: false },
};

export default function TipFeed() {
  const { tipId } = useParams();
  const navigate = useNavigate();
  const commentInputRef = useRef(null);
  const [tipState, setTipState] = useState({ tipId: "", tip: null, error: "" });
  const [threadState, setThreadState] = useState(EMPTY_THREAD);

  const isCurrentTip = tipState.tipId === tipId;
  const tip = isCurrentTip ? tipState.tip : null;
  const error = isCurrentTip ? tipState.error : "";
  const thread = threadState.tipId === tipId ? threadState : EMPTY_THREAD;
  const { comments, draft, isFollowing, reaction } = thread;

  // 이전 게시글의 입력이 남지 않도록, 갱신은 항상 지금 보고 있는 tipId에만 반영합니다.
  const updateThread = (updater) =>
    setThreadState((current) =>
      current.tipId === tipId ? updater(current) : current,
    );

  useEffect(() => {
    let isActive = true;

    getTipById(tipId)
      .then((tipDetail) => {
        if (!isActive) return null;

        setTipState({ tipId, tip: tipDetail, error: "" });
        setThreadState({
          ...EMPTY_THREAD,
          tipId,
          isFollowing: Boolean(tipDetail.author?.isFollowing),
        });

        return getComments(tipId);
      })
      .then((tipComments) => {
        if (!isActive || !tipComments) return;

        setThreadState((current) =>
          current.tipId === tipId
            ? { ...current, comments: tipComments }
            : current,
        );
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

  // TODO: 팔로우 / 반응 API 명세가 확정되면 서버 응답으로 상태를 되돌립니다.
  const handleToggleFollow = () => {
    const next = !isFollowing;

    updateThread((current) => ({ ...current, isFollowing: next }));
    (next ? followUser : unfollowUser)(tip?.author?.id);
  };

  const handleToggleLike = () =>
    updateThread((current) => ({
      ...current,
      reaction: {
        ...current.reaction,
        liked: !current.reaction.liked,
        disliked: current.reaction.liked ? current.reaction.disliked : false,
      },
    }));

  const handleToggleDislike = () =>
    updateThread((current) => ({
      ...current,
      reaction: {
        ...current.reaction,
        liked: current.reaction.disliked ? current.reaction.liked : false,
        disliked: !current.reaction.disliked,
      },
    }));

  const handleToggleScrap = () =>
    updateThread((current) => ({
      ...current,
      reaction: { ...current.reaction, scrapped: !current.reaction.scrapped },
    }));

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    const content = draft.trim();

    if (!content) return;

    const comment = await createComment(tipId, content);

    updateThread((current) => ({
      ...current,
      comments: [...current.comments, comment],
      draft: "",
    }));
  };

  if (!isCurrentTip && !error) {
    return <LoadingMessage>팁을 불러오는 중입니다.</LoadingMessage>;
  }

  const author = tip?.author ?? {};

  return (
    <Page>
      <Scroll>
        {tip && (
          <Article>
            <PostSection>
              <TopRow>
                <IconButton
                  type="button"
                  aria-label="뒤로 가기"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeftIcon />
                </IconButton>
                <FollowButton
                  type="button"
                  $following={isFollowing}
                  aria-pressed={isFollowing}
                  onClick={handleToggleFollow}
                >
                  {isFollowing ? "팔로잉" : "팔로우"}
                </FollowButton>
              </TopRow>

              <PostBody>
                <AuthorBlock>
                  <MetaRow>
                    <Nickname>{author.nickname}</Nickname>
                    <TrustBadge>
                      <span>{getResidenceLabel(author.residenceYears)}</span>
                      <span>{Math.round(Number(author.trustScore) || 0)}%</span>
                    </TrustBadge>
                    {tip.category && <CategoryTag>{tip.category}</CategoryTag>}
                  </MetaRow>
                  <PostedAt dateTime={tip.createdAt}>
                    {formatTipDateTime(tip.createdAt)}
                  </PostedAt>
                </AuthorBlock>

                <Title>{tip.title}</Title>

                {tip.location && (
                  <PlaceBanner
                    type="button"
                    onClick={() =>
                      navigate("/", { state: { focusPlaceId: tip.location.id } })
                    }
                  >
                    {tip.location.name} 지도에서 보기 →
                  </PlaceBanner>
                )}

                <Content>{tip.content}</Content>

                {tip.location && (
                  <MapSection>
                    <MapLabel>지도에서 위치 보기</MapLabel>
                    <StaticLocationMap
                      location={tip.location}
                      height="8.125rem"
                      gutter="0"
                      radius="0.625rem"
                    />
                  </MapSection>
                )}

                <Reactions>
                  <Reaction
                    type="button"
                    $active={reaction.liked}
                    aria-pressed={reaction.liked}
                    onClick={handleToggleLike}
                  >
                    <HeartIcon filled={reaction.liked} />
                    좋아요 {withReaction(tip.likeCount, reaction.liked)}
                  </Reaction>
                  <Reaction
                    type="button"
                    $active={reaction.disliked}
                    aria-pressed={reaction.disliked}
                    onClick={handleToggleDislike}
                  >
                    <MehIcon />
                    비추 {withReaction(tip.dislikeCount, reaction.disliked)}
                  </Reaction>
                  <Reaction
                    type="button"
                    onClick={() => commentInputRef.current?.focus()}
                  >
                    <MessageCircleIcon />
                    댓글 {comments.length}
                  </Reaction>
                  <Reaction
                    type="button"
                    $active={reaction.scrapped}
                    aria-pressed={reaction.scrapped}
                    onClick={handleToggleScrap}
                  >
                    <InboxIcon filled={reaction.scrapped} />
                    스크랩 {withReaction(tip.scrapCount, reaction.scrapped)}
                  </Reaction>
                </Reactions>
              </PostBody>
            </PostSection>

            {comments.length > 0 && (
              <CommentList>
                {comments.map((comment) => (
                  <li key={comment.id}>
                    <CommentAuthor>{comment.nickname}</CommentAuthor>
                    <CommentText>{comment.content}</CommentText>
                  </li>
                ))}
              </CommentList>
            )}
          </Article>
        )}
      </Scroll>

      <CommentForm onSubmit={handleSubmitComment}>
        <CommentInput
          ref={commentInputRef}
          type="text"
          value={draft}
          placeholder="댓글을 남겨보세요"
          aria-label="댓글 입력"
          enterKeyHint="send"
          onChange={(event) => {
            const { value } = event.target;

            setThreadState((current) => ({
              ...(current.tipId === tipId ? current : EMPTY_THREAD),
              tipId,
              draft: value,
            }));
          }}
        />
        <SendButton type="submit" aria-label="댓글 등록" disabled={!draft.trim()}>
          <ArrowUpIcon />
        </SendButton>
      </CommentForm>

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
    </Page>
  );
}
