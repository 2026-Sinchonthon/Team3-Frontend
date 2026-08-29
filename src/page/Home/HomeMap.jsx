import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import AlertModal from "../../common_ui/Alert/Alert";
import loadKakaoMap from "../../util/loadKakaoMap";
import theme from "../../styles/theme";
import mapPinUrl from "../../assets/icons/map-pin-filled.svg";

/*
목적: 홈 화면의 지도 (IA - 홈 > 지도 탐색 / 핀 클릭)

마커는 "장소" 단위로 찍고, 그 장소에 팁이 2개 이상이면 핀 오른쪽 위에 개수 배지를 붙입니다.
(1. Convention.md - 마커: 옆에 숫자 有 / 옆에 숫자 X)

조작 (Figma 홈 화면 기준)
- 한 손가락 드래그 / 두 손가락 동시 드래그 : 상하좌우 이동
- 두 손가락을 벌리거나 오므리기(핀치)     : 확대 / 축소
  트랙패드의 두 손가락 스크롤은 브라우저가 wheel 이벤트로 주기 때문에,
  기본 휠 확대(scrollwheel)를 끄고 이동과 확대를 직접 나눠 처리합니다.

props:
- placeGroups     : [{ place, tips }] 형태의 장소별 팁 묶음
- selectedPlaceId : 선택된 장소 id
- onSelectPlace   : 마커 클릭 시 place를 인자로 호출
- onClearSelection: 지도 빈 곳 클릭 시 호출
- controllerRef   : { moveToCurrentLocation } 를 담아 주는 ref (현위치 버튼용)
*/

const SINCHON_CENTER = { latitude: 37.5567, longitude: 126.9387 };

// Figma 마커(50 x 53) 기준 수치입니다.
const MARKER = {
  width: 50,
  height: 53,
  pinSize: 32,
  pinLeft: 5,
  pinTop: 14,
  badgeSize: 17,
  badgeLeft: 25,
  badgeTop: 3,
};

// 핀 svg 안에서 뾰족한 끝이 위치하는 비율(30.667 / 32)입니다.
const PIN_TIP_RATIO = 30.667 / 32;
const MARKER_X_ANCHOR = (MARKER.pinLeft + MARKER.pinSize / 2) / MARKER.width;
const MARKER_Y_ANCHOR =
  (MARKER.pinTop + MARKER.pinSize * PIN_TIP_RATIO) / MARKER.height;

const ZOOM_INTERVAL_MS = 180;

const MapShell = styled.div`
  position: absolute;
  inset: 0;
`;

function createMarkerElement(place, tipCount) {
  const button = document.createElement("button");

  button.type = "button";
  button.setAttribute("aria-label", `${place.name} 꿀팁 ${tipCount}개 보기`);
  Object.assign(button.style, {
    position: "relative",
    width: `${MARKER.width}px`,
    height: `${MARKER.height}px`,
    padding: "0",
    border: "0",
    background: "transparent",
    cursor: "pointer",
    transformOrigin: `${MARKER_X_ANCHOR * 100}% ${MARKER_Y_ANCHOR * 100}%`,
    transition: "transform 0.15s ease",
  });

  const pin = document.createElement("img");

  pin.src = mapPinUrl;
  pin.alt = "";
  Object.assign(pin.style, {
    position: "absolute",
    left: `${MARKER.pinLeft}px`,
    top: `${MARKER.pinTop}px`,
    width: `${MARKER.pinSize}px`,
    height: `${MARKER.pinSize}px`,
  });
  button.appendChild(pin);

  if (tipCount >= 2) {
    const badge = document.createElement("span");

    badge.textContent = String(tipCount);
    Object.assign(badge.style, {
      position: "absolute",
      left: `${MARKER.badgeLeft}px`,
      top: `${MARKER.badgeTop}px`,
      display: "grid",
      placeItems: "center",
      width: `${MARKER.badgeSize}px`,
      height: `${MARKER.badgeSize}px`,
      borderRadius: theme.radius.pill,
      background: theme.color.brand,
      color: theme.color.text,
      fontSize: "0.625rem",
      fontWeight: "700",
      lineHeight: "1",
    });
    button.appendChild(badge);
  }

  return button;
}

export default function HomeMap({
  placeGroups,
  selectedPlaceId,
  onSelectPlace,
  onClearSelection,
  controllerRef,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef(new Map());
  const lastZoomAtRef = useRef(0);
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
          // 휠 / 트랙패드 두 손가락 스크롤은 아래에서 직접 처리합니다.
          scrollwheel: false,
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

  // 2. 휠 / 트랙패드 제스처
  //    - 핀치(브라우저가 ctrlKey를 붙여 줍니다) : 확대 / 축소
  //    - 그 외 두 손가락 스크롤               : 상하좌우 이동
  useEffect(() => {
    const container = containerRef.current;

    if (!isMapReady || !container) return undefined;

    const handleWheel = (event) => {
      const map = mapRef.current;

      if (!map) return;

      event.preventDefault();

      if (event.ctrlKey) {
        const now = Date.now();

        if (now - lastZoomAtRef.current < ZOOM_INTERVAL_MS) return;
        lastZoomAtRef.current = now;

        map.setLevel(map.getLevel() + (event.deltaY > 0 ? 1 : -1), {
          animate: true,
        });
        return;
      }

      map.panBy(event.deltaX, event.deltaY);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => container.removeEventListener("wheel", handleWheel);
  }, [isMapReady]);

  // 3. 컨테이너 크기가 바뀌면 지도를 다시 그리고 중심을 유지합니다.
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

  // 4. 지도 빈 곳 클릭 시 선택 해제
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

  // 5. 장소 마커 생성 / 갱신
  useEffect(() => {
    const map = mapRef.current;

    if (!isMapReady || !map) return undefined;

    const kakao = window.kakao;
    const markers = markersRef.current;

    placeGroups.forEach(({ place, tips }) => {
      const element = createMarkerElement(place, tips.length);

      element.addEventListener("click", (event) => {
        event.stopPropagation();
        onSelectPlace?.(place);
      });

      const overlay = new kakao.maps.CustomOverlay({
        map,
        content: element,
        position: new kakao.maps.LatLng(place.latitude, place.longitude),
        clickable: true,
        xAnchor: MARKER_X_ANCHOR,
        yAnchor: MARKER_Y_ANCHOR,
      });

      markers.set(place.id, { overlay, element });
    });

    return () => {
      markers.forEach(({ overlay }) => overlay.setMap(null));
      markers.clear();
    };
  }, [isMapReady, placeGroups, onSelectPlace]);

  // 6. 선택된 마커 강조
  useEffect(() => {
    markersRef.current.forEach(({ overlay, element }, placeId) => {
      const isSelected = placeId === selectedPlaceId;

      element.style.transform = isSelected ? "scale(1.25)" : "scale(1)";
      overlay.setZIndex(isSelected ? 2 : 1);
    });
  }, [selectedPlaceId, placeGroups]);

  // 7. 선택된 장소로 지도 이동
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

  // 8. 현위치 버튼이 쓸 수 있도록 지도 조작 함수를 ref에 심어 둡니다.
  const moveToCurrentLocation = useCallback(
    () =>
      new Promise((resolve) => {
        const map = mapRef.current;

        if (!map) {
          resolve();
          return;
        }

        if (!navigator.geolocation) {
          setError("이 브라우저에서는 현재 위치를 사용할 수 없습니다.");
          resolve();
          return;
        }

        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            map.panTo(
              new window.kakao.maps.LatLng(coords.latitude, coords.longitude),
            );
            resolve();
          },
          () => {
            setError(
              "현재 위치를 가져오지 못했습니다. 위치 권한을 확인해 주세요.",
            );
            resolve();
          },
          { enableHighAccuracy: true, timeout: 10000 },
        );
      }),
    [],
  );

  useEffect(() => {
    if (!controllerRef) return undefined;

    controllerRef.current = { moveToCurrentLocation };

    return () => {
      controllerRef.current = null;
    };
  }, [controllerRef, moveToCurrentLocation]);

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
