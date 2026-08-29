const KAKAO_MAP_SCRIPT_ID = "kakao-map-sdk";

let kakaoMapPromise;

export default function loadKakaoMap() {
  if (window.kakao?.maps?.Map) return Promise.resolve(window.kakao);
  if (kakaoMapPromise) return kakaoMapPromise;

  const appKey = import.meta.env.VITE_JS_KAKAO_API_KEY;

  if (!appKey) {
    return Promise.reject(new Error("카카오맵 JavaScript 키가 설정되지 않았습니다."));
  }

  kakaoMapPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(KAKAO_MAP_SCRIPT_ID);
    const script = existingScript ?? document.createElement("script");

    const resolveKakaoMap = () => {
      if (!window.kakao?.maps) {
        reject(new Error("카카오맵 SDK가 올바르게 로드되지 않았습니다."));
        return;
      }

      window.kakao.maps.load(() => resolve(window.kakao));
    };

    script.addEventListener(
      "load",
      resolveKakaoMap,
      { once: true },
    );
    script.addEventListener(
      "error",
      () => reject(new Error("카카오맵을 불러오지 못했습니다.")),
      { once: true },
    );

    if (!existingScript) {
      script.id = KAKAO_MAP_SCRIPT_ID;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
      document.head.appendChild(script);
    } else if (window.kakao?.maps) {
      resolveKakaoMap();
    }
  }).catch((error) => {
    kakaoMapPromise = undefined;
    throw error;
  });

  return kakaoMapPromise;
}
