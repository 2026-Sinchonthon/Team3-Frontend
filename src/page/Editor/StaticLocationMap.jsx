import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import loadKakaoMap from "../../util/loadKakaoMap";

const MapContainer = styled.div`
  width: 100%;
  height: 12rem;
  margin-top: 0.875rem;
  overflow: hidden;
  border-radius: 0.5rem;
  background: #f3f3f3;
`;

const ErrorMessage = styled.p`
  display: grid;
  place-items: center;
  width: 100%;
  height: 12rem;
  margin: 0.875rem 0 0;
  border-radius: 0.5rem;
  background: #f3f3f3;
  color: #666;
  font-size: 0.875rem;
  text-align: center;
`;

export default function StaticLocationMap({ location }) {
  const mapContainerRef = useRef(null);
  const [error, setError] = useState("");
  const lat = Number(location?.lat);
  const lng = Number(location?.lng);
  const hasCoordinates = Number.isFinite(lat) && Number.isFinite(lng);

  useEffect(() => {
    let isActive = true;
    const mapContainer = mapContainerRef.current;

    if (!hasCoordinates || !mapContainer) return undefined;

    loadKakaoMap()
      .then((kakao) => {
        if (!isActive) return;

        const position = new kakao.maps.LatLng(lat, lng);
        new kakao.maps.StaticMap(mapContainer, {
          center: position,
          level: 3,
          marker: { position },
        });
      })
      .catch((loadError) => {
        if (isActive) setError(loadError.message);
      });

    return () => {
      isActive = false;
      mapContainer.replaceChildren();
    };
  }, [hasCoordinates, lat, lng]);

  if (!hasCoordinates) {
    return <ErrorMessage>표시할 위치 좌표가 없습니다.</ErrorMessage>;
  }

  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <MapContainer
      ref={mapContainerRef}
      role="img"
      aria-label={`${location.name} 위치 지도`}
    />
  );
}
