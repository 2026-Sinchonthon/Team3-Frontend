import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import AlertModal from "../../common_ui/Alert/Alert";
import loadKakaoMap from "../../util/loadKakaoMap";
import MapControls from "./MapControls";
import TipPopup from "./TipPopup";

const MapShell = styled.section`
  position: relative;
  flex: 1;
  width: 100%;
  height: 100%;
  min-height: 0;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export default function KakaoMap({ tips }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const overlayRef = useRef(null);
  const [selectedTip, setSelectedTip] = useState(null);
  const [overlayContainer, setOverlayContainer] = useState(null);
  const [error, setError] = useState("");

  const closePopup = () => {
    overlayRef.current?.setMap(null);
    setSelectedTip(null);
  };

  useEffect(() => {
    let isActive = true;
    let markers = [];
    let mapClickHandler;

    loadKakaoMap()
      .then((kakao) => {
        if (!isActive || !mapContainerRef.current) return;

        const map = new kakao.maps.Map(mapContainerRef.current, {
          center: new kakao.maps.LatLng(37.5551, 126.9368),
          level: 4,
        });
        const content = document.createElement("div");
        const overlay = new kakao.maps.CustomOverlay({
          content,
          clickable: true,
          yAnchor: 1.2,
          zIndex: 10,
        });

        mapRef.current = map;
        overlayRef.current = overlay;
        setOverlayContainer(content);

        markers = tips.map((tip) => {
          const position = new kakao.maps.LatLng(tip.lat, tip.lng);
          const marker = new kakao.maps.Marker({ map, position });

          kakao.maps.event.addListener(marker, "click", () => {
            setSelectedTip(tip);
            overlay.setPosition(position);
            overlay.setMap(map);
          });

          return marker;
        });

        mapClickHandler = () => {
          overlay.setMap(null);
          setSelectedTip(null);
        };
        kakao.maps.event.addListener(map, "click", mapClickHandler);
      })
      .catch((loadError) => {
        if (isActive) setError(loadError.message);
      });

    return () => {
      isActive = false;
      markers.forEach((marker) => marker.setMap(null));

      if (mapRef.current && mapClickHandler && window.kakao?.maps) {
        window.kakao.maps.event.removeListener(
          mapRef.current,
          "click",
          mapClickHandler,
        );
      }

      overlayRef.current?.setMap(null);
      mapRef.current = null;
      overlayRef.current = null;
    };
  }, [tips]);

  const zoomIn = () => {
    const map = mapRef.current;
    if (map) map.setLevel(Math.max(1, map.getLevel() - 1));
  };

  const zoomOut = () => {
    const map = mapRef.current;
    if (map) map.setLevel(map.getLevel() + 1);
  };

  return (
    <MapShell aria-label="신촌 꿀팁 지도">
      <MapContainer ref={mapContainerRef} />
      <MapControls onZoomIn={zoomIn} onZoomOut={zoomOut} />

      {selectedTip &&
        overlayContainer &&
        createPortal(
          <TipPopup tip={selectedTip} onClose={closePopup} />,
          overlayContainer,
        )}

      {error && (
        <AlertModal
          type="alert"
          title="지도를 표시할 수 없습니다"
          content={error}
          onConfirm={() => setError("")}
          onClose={() => setError("")}
        />
      )}
    </MapShell>
  );
}
