import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import AlertModal from "../../common_ui/Alert/Alert";
import loadKakaoMap from "../../util/loadKakaoMap";
import theme from "../../styles/theme";
import mapPinUrl from "../../assets/icons/map-pin.svg";

/*
목적: 홈 화면의 지도 (IA - 홈 > 지도 탐색 / 핀 클릭)

마커는 "장소" 단위로 찍고, 그 장소에 팁이 2개 이상이면 핀 아래에 개수 배지를 붙입니다.
(1. Convention.md - 마커: 옆에 숫자 有 / 옆에 숫자 X)

props:
- placeGroups     : [{ place, tips }] 형태의 장소별 팁 묶음
- selectedPlaceId : 선택된 장소 id
- onSelectPlace   : 마커 클릭 시 place를 인자로 호출
- onClearSelection: 지도 빈 곳 클릭 시 호출
*/

const SINCHON_CENTER = { latitude: 37.5567, longitude: 126.9387 };
const PIN_SIZE = 25;
const BADGE_SIZE = 28;
const BADGE_GAP = 7;

const MapShell = styled.div`
  position: absolute;
  inset: 0;
`;

function createMarkerElement(place, tipCount) {
  const button = document.createElement("button");

  button.type = "button";
  button.setAttribute(
    "aria-label",
    `${place.name} 꿀팁 ${tipCount}개 보기`,
  );
  Object.assign(button.style, {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: `${BADGE_GAP}px`,
    width: `${BADGE_SIZE}px`,
    padding: "0",
    border: "0",
    background: "transparent",
    cursor: "pointer",
    transition: "transform 0.15s ease",
  });

  const pin = document.createElement("img");

  pin.src = mapPinUrl;
  pin.alt = "";
  Object.assign(pin.style, {
    display: "block",
    width: `${PIN_SIZE}px`,
    height: `${PIN_SIZE}px`,
  });
  button.appendChild(pin);

  if (tipCount >= 2) {
    const badge = document.createElement("span");

    badge.textContent = String(tipCount);
    Object.assign(badge.style, {
      display: "grid",
      placeItems: "center",
      width: `${BADGE_SIZE}px`,
      height: `${BADGE_SIZE}px`,
      borderRadius: theme.radius.pill,
      background: theme.color.brand,
      color: theme.color.text,
      fontSize: theme.font.sm,
      fontWeight: "600",
      lineHeight: "1",
    });
    button.appendChild(badge);
  }

  const contentHeight =
    tipCount >= 2 ? PIN_SIZE + BADGE_GAP + BADGE_SIZE : PIN_SIZE;

  return { element: button, yAnchor: PIN_SIZE / contentHeight };
}

export default function HomeMap({
  placeGroups,
  selectedPlaceId,
  onSelectPlace,
  onClearSelection,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef(new Map());
  const [isMapReady, setIsMapReady] = useState(false);
  const [error, setError] = useState("");

  // 1. 지도 생성 (최초 1회)
  useEffect(() => {
    let isActive = true;

    loadKakaoMap()
      .then((kakao) => {
        if (!isActive || !containerRef.current) return;

        mapRef.current = new kakao.maps.Map(containerRef.current, {
          center: new kakao.maps.LatLng(
            SINCHON_CENTER.latitude,
            SINCHON_CENTER.longitude,
          ),
          level: 4,
        });
        setIsMapReady(true);
      })
      .catch((loadError) => {
        if (isActive) setError(loadError.message);
      });

    return () => {
      isActive = false;
      mapRef.current = null;
      setIsMapReady(false);
    };
  }, []);

  // 2. 컨테이너 크기가 바뀌면 지도를 다시 그리고 중심을 유지합니다.
  useEffect(() => {
    const map = mapRef.current;
    const container = containerRef.current;

    if (!isMapReady || !map || !container) return undefined;

    const observer = new ResizeObserver(() => {
      const center = map.getCenter();

      map.relayout();
      map.setCenter(center);
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, [isMapReady]);

  // 3. 지도 빈 곳 클릭 시 선택 해제
  useEffect(() => {
    const map = mapRef.current;

    if (!isMapReady || !map) return undefined;

    const kakao = window.kakao;
    const handleMapClick = () => onClearSelection?.();

    kakao.maps.event.addListener(map, "click", handleMapClick);

    return () => {
      kakao.maps.event.removeListener(map, "click", handleMapClick);
    };
  }, [isMapReady, onClearSelection]);

  // 4. 장소 마커 생성 / 갱신
  useEffect(() => {
    const map = mapRef.current;

    if (!isMapReady || !map) return undefined;

    const kakao = window.kakao;
    const markers = markersRef.current;

    placeGroups.forEach(({ place, tips }) => {
      const { element, yAnchor } = createMarkerElement(place, tips.length);

      element.addEventListener("click", (event) => {
        event.stopPropagation();
        onSelectPlace?.(place);
      });

      const overlay = new kakao.maps.CustomOverlay({
        map,
        content: element,
        position: new kakao.maps.LatLng(place.latitude, place.longitude),
        clickable: true,
        yAnchor,
      });

      markers.set(place.id, { overlay, element });
    });

    return () => {
      markers.forEach(({ overlay }) => overlay.setMap(null));
      markers.clear();
    };
  }, [isMapReady, placeGroups, onSelectPlace]);

  // 5. 선택된 마커 강조
  useEffect(() => {
    markersRef.current.forEach(({ overlay, element }, placeId) => {
      const isSelected = placeId === selectedPlaceId;

      element.style.transform = isSelected ? "scale(1.25)" : "scale(1)";
      overlay.setZIndex(isSelected ? 2 : 1);
    });
  }, [selectedPlaceId, placeGroups]);

  // 6. 선택된 장소로 지도 이동
  useEffect(() => {
    const map = mapRef.current;

    if (!isMapReady || !map || !selectedPlaceId) return;

    const selected = placeGroups.find(
      ({ place }) => place.id === selectedPlaceId,
    );

    if (!selected) return;

    map.panTo(
      new window.kakao.maps.LatLng(
        selected.place.latitude,
        selected.place.longitude,
      ),
    );
  }, [isMapReady, selectedPlaceId, placeGroups]);

  return (
    <>
      <MapShell ref={containerRef} role="application" aria-label="신촌 꿀팁 지도" />

      {error && (
        <AlertModal
          type="alert"
          title="지도를 표시할 수 없습니다"
          content={error}
          onConfirm={() => setError("")}
          onClose={() => setError("")}
        />
      )}
    </>
  );
}
