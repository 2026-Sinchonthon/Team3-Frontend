import api from "./axios";

const DEFAULT_PAGE_SIZE = 20;

function unwrapResponse(response, fallbackMessage) {
  const result = response.data;
  if (!result?.success) throw new Error(result?.message || fallbackMessage);
  return result.data;
}

function toPageParams({ page = 0, size = DEFAULT_PAGE_SIZE, ...params } = {}) {
  return {
    page: Math.max(0, Number(page) || 0),
    size: Math.max(1, Number(size) || DEFAULT_PAGE_SIZE),
    ...params,
  };
}

function mapAuthor(source) {
  return {
    id: source.writerId,
    nickname: source.writerNickname ?? "",
    trustScore: source.writerTrustScore ?? 0,
    residenceYears: source.writerLivingAloneYears ?? 0,
  };
}

function mapFeedTip(tip) {
  return {
    id: tip.tipId,
    title: tip.title ?? "",
    content: tip.content ?? "",
    categoryId: tip.categoryId,
    category: tip.categoryName ?? "",
    placeId: tip.placeId,
    placeName: tip.placeName ?? "",
    author: mapAuthor(tip),
    createdAt: tip.createdAt,
    likeCount: tip.likeCount ?? 0,
    isFiltered: Boolean(tip.isFiltered),
  };
}

function mapComment(comment) {
  return {
    id: comment.commentId,
    tipId: comment.tipId,
    writerId: comment.writerId,
    nickname: comment.writerNickname ?? "",
    trustScore: comment.writerTrustScore ?? 0,
    residenceYears: comment.writerLivingAloneYears ?? 0,
    content: comment.content ?? "",
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
}

function normalizeTipCreateRequest(tip) {
  const location = tip.location ?? {};
  const categoryId = Number(tip.categoryId);
  const kakaoPlaceId = String(
    tip.kakaoPlaceId ?? location.kakaoPlaceId ?? location.id ?? "",
  ).trim();
  const placeName = String(tip.placeName ?? location.name ?? "").trim();
  const placeAddress = String(
    tip.placeAddress ?? location.address ?? "",
  ).trim();
  const latitude = Number(tip.latitude ?? location.latitude ?? location.lat);
  const longitude = Number(tip.longitude ?? location.longitude ?? location.lng);
  const title = String(tip.title ?? "").trim();
  const content = String(tip.content ?? "").trim();

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    throw new Error("올바른 카테고리를 선택해 주세요.");
  }
  if (!kakaoPlaceId) throw new Error("카카오 장소 ID가 필요합니다.");
  if (!placeName) throw new Error("장소 이름이 필요합니다.");
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error("장소 좌표가 올바르지 않습니다.");
  }
  if (!title || !content) throw new Error("제목과 내용을 입력해 주세요.");

  return {
    categoryId,
    kakaoPlaceId,
    placeName,
    placeAddress,
    latitude,
    longitude,
    title,
    content,
  };
}

export async function createTip(tip) {
  const response = await api.post("/api/v1/tips", tip);
  return response.data;
}

export async function createTipFromPlace(tip) {
  const response = await api.post("/api/tips", normalizeTipCreateRequest(tip));
  return unwrapResponse(response, "팁을 등록하지 못했습니다.");
}

export async function getTips({
  categoryId,
  userId,
  keyword,
  sort = "latest",
  page = 0,
  size = DEFAULT_PAGE_SIZE,
} = {}) {
  const response = await api.get("/api/tips", {
    params: toPageParams({ categoryId, userId, keyword, sort, page, size }),
  });
  const data = unwrapResponse(response, "게시글을 불러오지 못했습니다.");
  return (data?.content ?? []).map(mapFeedTip);
}

export async function getTipsByPlace(
  placeId,
  { categoryId, sort = "latest", page = 0, size = DEFAULT_PAGE_SIZE } = {},
) {
  if (placeId == null || placeId === "") throw new Error("장소 ID가 필요합니다.");

  const response = await api.get(`/api/tips/place/${placeId}`, {
    params: toPageParams({ categoryId, sort, page, size }),
  });
  const data = unwrapResponse(response, "장소의 팁을 불러오지 못했습니다.");
  return (data?.content ?? []).map(mapFeedTip);
}

export async function getTipById(tipId) {
  if (tipId == null || tipId === "") throw new Error("팁 ID가 필요합니다.");

  const response = await api.get(`/api/tips/${tipId}`);
  const tip = unwrapResponse(response, "팁을 불러오지 못했습니다.");
  let location = tip.placeId == null
    ? null
    : { id: tip.placeId, name: tip.placeName ?? "" };

  if (location) {
    try {
      const placeResponse = await api.get("/api/places/map");
      const places = unwrapResponse(
        placeResponse,
        "장소 좌표를 불러오지 못했습니다.",
      );
      const place = places?.find(({ id }) => String(id) === String(tip.placeId));

      if (place) {
        location = {
          ...location,
          name: place.name ?? location.name,
          lat: Number(place.latitude),
          lng: Number(place.longitude),
        };
      }
    } catch {
      // 상세 본문은 표시하고, 좌표가 없으면 지도 컴포넌트가 안내 문구를 보여 줍니다.
    }
  }

  return {
    id: tip.tipId,
    author: mapAuthor(tip),
    categoryId: tip.categoryId,
    category: tip.categoryName ?? "",
    title: tip.title ?? "",
    content: tip.content ?? "",
    visitedAt: tip.visitedAt,
    validUntil: tip.validUntil,
    createdAt: tip.createdAt,
    updatedAt: tip.updatedAt,
    likeCount: tip.likeCount ?? 0,
    dislikeCount: tip.dislikeCount ?? 0,
    myReaction: tip.myReaction ?? null,
    isFiltered: Boolean(tip.isFiltered),
    location,
  };
}

export async function deleteTip(tipId) {
  const response = await api.delete(`/api/tips/${tipId}`);
  return unwrapResponse(response, "팁을 삭제하지 못했습니다.");
}

export async function reactToTip(tipId, isLike) {
  const response = await api.put(`/api/tips/${tipId}/reactions`, {
    isLike: Boolean(isLike),
  });
  return unwrapResponse(response, "반응을 저장하지 못했습니다.");
}

export async function cancelTipReaction(tipId) {
  const response = await api.delete(`/api/tips/${tipId}/reactions`);
  return unwrapResponse(response, "반응을 취소하지 못했습니다.");
}

export async function scrapTip(tipId) {
  const response = await api.post(`/api/tips/${tipId}/scraps`);
  return unwrapResponse(response, "스크랩하지 못했습니다.");
}

export async function cancelTipScrap(tipId) {
  const response = await api.delete(`/api/tips/${tipId}/scraps`);
  return unwrapResponse(response, "스크랩을 취소하지 못했습니다.");
}

export async function getComments(
  tipId,
  { page = 0, size = DEFAULT_PAGE_SIZE } = {},
) {
  const response = await api.get(`/api/tips/${tipId}/comments`, {
    params: toPageParams({ page, size }),
  });
  const data = unwrapResponse(response, "댓글을 불러오지 못했습니다.");
  return (data?.content ?? []).map(mapComment);
}

export async function createComment(tipId, content) {
  const trimmedContent = String(content ?? "").trim();
  if (!trimmedContent) throw new Error("댓글 내용을 입력해 주세요.");

  const response = await api.post(`/api/tips/${tipId}/comments`, {
    content: trimmedContent,
  });
  return mapComment(unwrapResponse(response, "댓글을 등록하지 못했습니다."));
}

export async function deleteComment(commentId) {
  const response = await api.delete(`/api/comments/${commentId}`);
  return unwrapResponse(response, "댓글을 삭제하지 못했습니다.");
}
