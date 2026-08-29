import { useCallback, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import BottomSheet from "../../common_ui/BottomSheet/BottomSheet";
import CategoryFilter from "../../common_ui/CategoryFilter/CategoryFilter";
import SearchBar from "../../common_ui/SearchBar/SearchBar";
import SortTabs from "../../common_ui/SortTabs/SortTabs";
import TipListItem from "../../common_ui/TipListItem/TipListItem";
import { DEFAULT_SORT } from "../../constants/sortOptions";
import { mockPlaces, mockTips } from "../../data/mockTips";
import groupTipsByPlace from "../../util/placeTips";
import filterTips, {
  normalizeKeyword,
  toggleCategoryId,
} from "../../util/tipFilter";
import sortTips from "../../util/tipSort";
import theme from "../../styles/theme";
import HomeMap from "./HomeMap";
import LocateButton from "./LocateButton";
import WriteFab from "./WriteFab";

/*
목적: 홈 화면 (IA - 홈)
구성: 상단 서치 / 카테고리 필터 / 지도 + 핀 / 글쓰기 / 바텀시트

바텀시트 단계 규칙 (2. Component Description.md)
- 1단 : 기본 상태
- 2단 : 핀 클릭 시 해당 장소의 게시글이 1개
- 3단 : 핀 클릭 시 해당 장소의 게시글이 2개 이상
*/

const Container = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
`;

const MapOverlay = styled.div`
  position: absolute;
  top: 1rem;
  right: 1.125rem;
  left: 1.125rem;
  z-index: ${({ theme: t }) => t.layer.mapOverlay};
  display: flex;
  flex-direction: column;
  gap: 0.8125rem;
`;

const SheetTitle = styled.p`
  margin: 0 0 0.5rem;
  padding: 0 0.9375rem;
  color: ${({ theme: t }) => t.color.textMuted};
  font-size: ${({ theme: t }) => t.font.xs};
`;

const EmptyMessage = styled.p`
  margin: 2rem 0;
  color: ${({ theme: t }) => t.color.textMuted};
  font-size: ${({ theme: t }) => t.font.xs};
  text-align: center;
`;

const FAB_BOTTOM = {
  collapsed: `calc(${theme.sheetStage.collapsed} + 1rem)`,
  half: `calc(${theme.sheetStage.half} + 1rem)`,
};

export default function HomePage() {
  const navigate = useNavigate();
  // 게시글 상세의 "지도에서 보기"로 들어오면 해당 장소를 바로 펼쳐 줍니다.
  const focusPlaceId = useLocation().state?.focusPlaceId ?? null;
  const [keyword, setKeyword] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState(focusPlaceId);
  const [sheetStage, setSheetStage] = useState(focusPlaceId ? "half" : "collapsed");
  const [sortId, setSortId] = useState(DEFAULT_SORT);
  const [isLocating, setIsLocating] = useState(false);
  // HomeMap이 지도 조작 함수를 담아 주는 통로입니다.
  const mapControllerRef = useRef(null);

  const trimmedKeyword = normalizeKeyword(keyword);
  const isSearch = trimmedKeyword.length > 0;

  const placesById = useMemo(
    () => new Map(mockPlaces.map((place) => [place.id, place])),
    [],
  );

  // 홈은 장소명 / 주소까지 검색 대상에 넣습니다.
  const visibleTips = useMemo(
    () =>
      filterTips(mockTips, {
        keyword: trimmedKeyword,
        categoryIds: selectedCategoryIds,
        getPlace: (tip) => placesById.get(tip.placeId),
      }),
    [selectedCategoryIds, trimmedKeyword, placesById],
  );

  const placeGroups = useMemo(
    () => groupTipsByPlace(mockPlaces, visibleTips),
    [visibleTips],
  );

  const selectedGroup = useMemo(
    () => placeGroups.find(({ place }) => place.id === selectedPlaceId) ?? null,
    [placeGroups, selectedPlaceId],
  );

  const sheetTips = useMemo(
    () => sortTips(selectedGroup ? selectedGroup.tips : visibleTips, sortId),
    [selectedGroup, visibleTips, sortId],
  );

  const handleToggleCategory = useCallback((categoryId) => {
    setSelectedCategoryIds((current) => toggleCategoryId(current, categoryId));
    setSelectedPlaceId(null);
  }, []);

  // 핀 클릭: 게시글이 1개면 2단, 2개 이상이면 3단으로 엽니다.
  const handleSelectPlace = useCallback(
    (place) => {
      const group = placeGroups.find(({ place: item }) => item.id === place.id);

      setSelectedPlaceId(place.id);
      setSheetStage((group?.tips.length ?? 0) >= 2 ? "full" : "half");
    },
    [placeGroups],
  );

  const handleClearSelection = useCallback(() => {
    setSelectedPlaceId(null);
    setSheetStage("collapsed");
  }, []);

  const handleSelectTip = useCallback(
    (tip) => navigate(`/tips/${tip.id}`),
    [navigate],
  );

  const handleWrite = useCallback(
    () => navigate("/editor", { state: { place: selectedGroup?.place ?? null } }),
    [navigate, selectedGroup],
  );

  const handleLocate = useCallback(async () => {
    setIsLocating(true);
    await mapControllerRef.current?.moveToCurrentLocation();
    setIsLocating(false);
  }, []);

  return (
    <Container>
      <HomeMap
        placeGroups={placeGroups}
        selectedPlaceId={selectedPlaceId}
        onSelectPlace={handleSelectPlace}
        onClearSelection={handleClearSelection}
        controllerRef={mapControllerRef}
      />

      <MapOverlay>
        <SearchBar value={keyword} onChange={setKeyword} />
        <CategoryFilter
          selectedIds={selectedCategoryIds}
          onToggle={handleToggleCategory}
        />
      </MapOverlay>

      {sheetStage !== "full" && (
        <>
          <WriteFab bottom={FAB_BOTTOM[sheetStage]} onClick={handleWrite} />
          <LocateButton
            bottom={FAB_BOTTOM[sheetStage]}
            isLocating={isLocating}
            onClick={handleLocate}
          />
        </>
      )}

      <BottomSheet
        stage={sheetStage}
        onStageChange={setSheetStage}
        label={selectedGroup ? `${selectedGroup.place.name} 꿀팁` : "신촌 꿀팁"}
        header={
          <SortTabs value={sortId} onChange={setSortId} isSearch={isSearch} />
        }
      >
        {selectedGroup && <SheetTitle>{selectedGroup.place.name}</SheetTitle>}

        {sheetTips.length > 0 ? (
          sheetTips.map((tip) => (
            <TipListItem key={tip.id} tip={tip} onSelect={handleSelectTip} />
          ))
        ) : (
          <EmptyMessage>표시할 꿀팁이 없습니다.</EmptyMessage>
        )}
      </BottomSheet>
    </Container>
  );
}
