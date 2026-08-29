import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AlertModal from "../../common_ui/Alert/Alert";
import CategoryFilter from "../../common_ui/CategoryFilter/CategoryFilter";
import SearchBar from "../../common_ui/SearchBar/SearchBar";
import SortTabs from "../../common_ui/SortTabs/SortTabs";
import TipListItem from "../../common_ui/TipListItem/TipListItem";
import { DEFAULT_SORT } from "../../constants/sortOptions";
import { getCategories } from "../../util/PlaceAPI";
import { getTips } from "../../util/TipAPI";
import filterTips, {
  normalizeKeyword,
  toggleCategoryId,
} from "../../util/tipFilter";
import sortTips from "../../util/tipSort";

/*
목적: 게시판(게시글 목록) 화면 - Figma `게시판` (53:10151 / 53:11190)
구성: 상단 서치 / 카테고리 필터 / 정렬 선택 / 꿀팁 리스트
      상단 바는 두지 않고, 하단 네비바는 MainLayout이 그려 줍니다.

리스트 항목은 바텀시트와 같은 TipListItem을 그대로 씁니다.
(2. Component Description.md - 리스트 항목)
*/

const Container = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  min-height: 0;
  background: ${({ theme }) => theme.color.surface};
`;

const Filters = styled.div`
  display: flex;
  flex: none;
  flex-direction: column;
  gap: 0.8125rem;
  padding: 1rem 1.09375rem 0;
`;

const SortRow = styled.div`
  padding: 0.625rem 0;
`;

const List = styled.ul`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.625rem;
  min-height: 0;
  margin: 0;
  padding: 0 0 1rem;
  overflow-y: auto;
  list-style: none;
`;

const Message = styled.p`
  margin: 2rem 0;
  color: ${({ theme }) => theme.color.textMuted};
  font-size: ${({ theme }) => theme.font.xs};
  text-align: center;
`;

export default function BoardPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [sortId, setSortId] = useState(DEFAULT_SORT);
  const [boardState, setBoardState] = useState({
    isLoaded: false,
    tips: [],
    categories: [],
    error: "",
  });

  const trimmedKeyword = normalizeKeyword(keyword);
  const isSearch = trimmedKeyword.length > 0;

  useEffect(() => {
    let isActive = true;

    Promise.all([getTips(), getCategories()])
      .then(([tips, categories]) => {
        if (isActive) {
          setBoardState({ isLoaded: true, tips, categories, error: "" });
        }
      })
      .catch((requestError) => {
        if (isActive) {
          setBoardState({
            isLoaded: true,
            tips: [],
            categories: [],
            error: requestError.message || "게시글을 불러오지 못했습니다.",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  // 게시판은 장소를 넘기지 않으므로 제목 / 본문만 검색합니다.
  const visibleTips = useMemo(
    () =>
      sortTips(
        filterTips(boardState.tips, {
          keyword: trimmedKeyword,
          categoryIds: selectedCategoryIds,
        }),
        sortId,
      ),
    [boardState.tips, selectedCategoryIds, trimmedKeyword, sortId],
  );

  const handleToggleCategory = (categoryId) => {
    setSelectedCategoryIds((current) => toggleCategoryId(current, categoryId));
  };

  return (
    <Container>
      <Filters>
        <SearchBar value={keyword} onChange={setKeyword} />
        <CategoryFilter
          categories={boardState.categories}
          selectedIds={selectedCategoryIds}
          onToggle={handleToggleCategory}
        />
        <SortRow>
          <SortTabs value={sortId} onChange={setSortId} isSearch={isSearch} />
        </SortRow>
      </Filters>

      {!boardState.isLoaded ? (
        <Message>게시글을 불러오는 중입니다.</Message>
      ) : visibleTips.length > 0 ? (
        <List>
          {visibleTips.map((tip) => (
            <li key={tip.id}>
              <TipListItem
                tip={tip}
                onSelect={() => navigate(`/tips/${tip.id}`)}
              />
            </li>
          ))}
        </List>
      ) : (
        <Message>표시할 꿀팁이 없습니다.</Message>
      )}

      {boardState.error && (
        <AlertModal
          type="alert"
          color="red"
          title="게시글 조회 실패"
          content={boardState.error}
          onConfirm={() => navigate("/")}
          onClose={() => navigate("/")}
        />
      )}
    </Container>
  );
}
