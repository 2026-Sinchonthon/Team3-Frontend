import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import loadKakaoMap from "../../util/loadKakaoMap";

/*
목적: 좌표 하나를 정적 지도로 보여 주는 공용 컴포넌트 (글쓰기 미리보기 / 게시글 상세)

props:
- location : { name, lat, lng }
- height   : 지도 높이. 기본값 12rem (게시글 상세는 Figma 기준 8.125rem)
- gutter   : 위쪽 여백. 기본값 0.875rem
- radius   : 모서리 반경. 기본값 0.5rem
*/

const Frame = styled.div`
  width: 100%;
  height: ${({ $height }) => $height};
  margin-top: ${({ $gutter }) => $gutter};
  overflow: hidden;
  border-radius: ${({ $radius }) => $radius};
  background: #f3f3f3;
`;

const ErrorMessage = styled(Frame).attrs({ as: "p" })`
  display: grid;
  place-items: center;
  margin-right: 0;
  margin-bottom: 0;
  margin-left: 0;
  color: #666;
  font-size: 0.875rem;
  text-align: center;
`;

export default function StaticLocationMap({
  location,
  height = "12rem",
  gutter = "0.875rem",
  radius = "0.5rem",
}) {
  const mapContainerRef = useRef(null);
  const [error, setError] = useState("");
  const lat = Number(location?.lat);
  const lng = Number(location?.lng);
  const hasCoordinates = Number.isFinite(lat) && Number.isFinite(lng);
  const boxProps = { $height: height, $gutter: gutter, $radius: radius };

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
    return <ErrorMessage {...boxProps}>표시할 위치 좌표가 없습니다.</ErrorMessage>;
  }

  if (error) return <ErrorMessage {...boxProps}>{error}</ErrorMessage>;

  return (
    <Frame
      {...boxProps}
      ref={mapContainerRef}
      role="img"
      aria-label={`${location.name} 위치 지도`}
    />
  );
}
