# 🗺️ 신촌 꿀팁 지도 — 신촌 생활, 아는 사람만 아는 방법

**Frontend**

> 신촌 생활권 자취 대학생을 위한 지도 기반 생활 꿀팁 공유 서비스

<!-- 서비스 대표 이미지 / 로고 -->
<!--
<p align="center">
  <img src="" width="600" alt="신촌 꿀팁 지도" />
</p>
-->

<p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/React_Router-7-CA4245?style=flat-square&logo=reactrouter&logoColor=white" />
  <img src="https://img.shields.io/badge/styled--components-6-DB7093?style=flat-square&logo=styledcomponents&logoColor=white" />
  <img src="https://img.shields.io/badge/Axios-1.20-5A29E4?style=flat-square&logo=axios&logoColor=white" />
  <img src="https://img.shields.io/badge/Kakao_Maps-FEE500?style=flat-square&logo=kakao&logoColor=black" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" />
</p>

***

## 📖 프로젝트 개요

네이버지도·카카오맵은 **장소와 리뷰** 중심이라, 자취생에게 정작 필요한 생활 정보 — 어느 빨래방이 밤 늦게까지 여는지, 어느 식당이 몇 시에 줄이 가장 짧은지, 서강대 후문은 이대역으로 나가는 게 빠른지 — 를 찾기 어렵습니다. 이런 정보는 각 학교 커뮤니티에 흩어져 있지만, **학교별로 커뮤니티가 분리**되어 있어 같은 신촌 생활권을 공유하면서도 정보는 격리되어 있습니다.

**신촌 꿀팁 지도**는 단순 장소 리뷰가 아니라 **"신촌을 실제로 이용하는 방법"을 장소에 연결해 축적**하는 서비스입니다. 지도와 게시판을 연동해, 학교 경계를 넘어 신촌 생활정보를 집단지성으로 쌓아 갑니다.

> 여기서 **신촌**은 서대문구 신촌동·대현동·창천동, 마포구 노고산동·대흥동을 아우르는 생활권을 뜻합니다.

***

## 🎯 프로젝트 목표

- 학교별로 흩어진 신촌 생활정보를 **하나의 지도** 위에 모읍니다.
- 팁을 **장소에 고정**해, 위치와 정보를 한 번에 확인할 수 있게 합니다.
- **신뢰지수와 자취 연차**를 드러내 정보의 신뢰도를 가늠할 수 있게 합니다.

***

## 🌟 주요 기능

### 🏠 홈 — 지도 탐색
- 카카오맵 위에 꿀팁이 등록된 장소를 **마커로 표시**
- 줌 레벨에 따라 **마커 ↔ 클러스터 자동 전환** (`kakao.maps.MarkerClusterer`)
- **카테고리 필터** — 🍚 식비 방어 · 🏥 건강 관리 · 🏠 생활 가사 · 💼 급구 알바
- 마커/클러스터 클릭 시 **바텀시트**로 해당 장소의 꿀팁 목록 노출
- 현재 위치로 이동하는 **로케이트 버튼**, 글쓰기 **플로팅 버튼**

### 📋 게시판 — 꿀팁 피드
- 전체 꿀팁 피드 조회 및 **페이지네이션**
- **정렬** — 신뢰도순 · 좋아요순 · 관련도순(검색 시)
- **키워드 검색** 및 카테고리별 필터링

### 📝 꿀팁 상세 · 등록
- 작성자 **신뢰지수 / 자취 연차 배지**와 함께 상세 내용 확인
- **추천 / 비추천** 등록 · 변경 · 취소
- **스크랩** 등록 · 취소
- **댓글** 작성 · 조회 · 삭제
- 본인이 쓴 글 **삭제**
- 카카오 장소 검색으로 위치를 지정해 **꿀팁 등록**

### 👤 마이페이지
- 구글 계정 기반 프로필, **로그아웃**
- 내가 **작성한 꿀팁 관리**
- 다른 유저 프로필 조회

### 🔐 온보딩
- **Google 소셜 로그인** (Google Identity Services)
- 최초 로그인 시 **닉네임 · 자취 연차** 등록

***

## 🛠️ 기술 스택

### Frontend
| 구분 | 사용 기술 |
|:---|:---|
| Core | React 19, React Compiler |
| Build | Vite 8 |
| Routing | React Router 7 |
| Styling | styled-components 6 (`rem` 단위 기준) |
| HTTP | Axios 1.20 |
| Map | Kakao Maps JavaScript SDK (`services`, `clusterer`) |
| Auth | Google Identity Services (GSI) |
| Lint | ESLint 10 |
| Deploy | Vercel |

### Backend
> [2026-Sinchonthon/Team3-Backend](https://github.com/2026-Sinchonthon/Team3-Backend)

| 구분 | 사용 기술 |
|:---|:---|
| Language | Java 21 |
| Framework | Spring Boot 4.1.x |
| Data | Spring Data JPA, PostgreSQL |
| Auth | Spring Security, OAuth2 Resource Server, JWT (jjwt) |
| Docs | springdoc-openapi (Swagger UI) |
| Build | Gradle 8.x |
| Infra | Docker |

***

## 🚀 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/2026-Sinchonthon/Team3-Frontend.git
cd Team3-Frontend
```

### 2. 의존성 설치

```bash
npm install
```


### 4. 개발 서버 실행

```bash
npm run dev
```

> ⚠️ 개발 서버 포트는 **3000** 으로 고정되어 있습니다.
> 백엔드 `SecurityConfig` 의 CORS 허용 출처가 `app.frontend-origin`(기본 `http://localhost:3000`) 한 곳뿐이기 때문입니다.
> 다른 포트를 쓰려면 백엔드의 `FRONTEND_ORIGIN` 환경변수도 함께 바꿔 주세요.

### 5. 기타 명령어

```bash
npm run build     # 프로덕션 빌드
npm run preview   # 빌드 결과 미리보기
npm run lint      # ESLint 검사
```

***

## 🏗️ 프로젝트 구조

```
src/
├── App.jsx                 # 라우팅 정의
├── main.jsx
│
├── page/                   # 페이지 단위 컴포넌트
│   ├── Login/              # 구글 로그인
│   ├── Signup/             # 회원가입 · 온보딩(닉네임/자취연차)
│   ├── Home/               # 지도 홈 (HomeMap, LocateButton, WriteFab)
│   ├── Board/              # 꿀팁 피드 게시판
│   ├── SearchResult/       # 키워드 검색 결과
│   ├── Tips/               # 꿀팁 상세(TipFeed), 장소별 목록(PlaceTips)
│   ├── Editor/             # 꿀팁 작성
│   ├── User/               # 마이페이지 · 작성글 관리
│   └── Map/                # 지도 관련 컴포넌트
│
├── common_ui/              # 공통 UI 컴포넌트
│   ├── Layout/             # MainLayout, MobileFrame
│   ├── Header/ Footer/     # 상단바 · 하단 내비게이션
│   ├── BottomSheet/        # 3단 바텀시트
│   ├── Alert/              # 다목적 알럿 (경고/로딩/확인)
│   ├── CategoryFilter/     # 카테고리 필터 칩
│   ├── SortTabs/           # 정렬 탭
│   ├── TipListItem/        # 꿀팁 리스트 항목
│   ├── UserProfileCard/    # 신뢰지수·자취연차 배지 포함 프로필
│   ├── SearchBar/ Chip/ Icon/ StaticLocationMap/
│   └── ProtectedRoute/     # 인증 가드
│
├── util/                   # API 클라이언트 · 헬퍼
│   ├── axios.js            # 공통 인스턴스, 토큰 자동 재발급 인터셉터
│   ├── authSession.js      # 액세스 토큰 세션 관리
│   ├── AuthAPI.js          # 구글 로그인 / 로그아웃
│   ├── TipAPI.js           # 꿀팁 CRUD · 반응 · 스크랩 · 댓글
│   ├── UserAPI.js          # 온보딩 · 프로필 · 내 글
│   ├── PlaceAPI.js         # 지도 장소 · 카테고리
│   ├── loadKakaoMap.js     # 카카오 SDK 동적 로더
│   └── searchPlaces.js  tipFilter.js  tipSort.js  normalize.js  formatDate.js
│
├── constants/              # 카테고리 · 정렬 옵션 · 자취연차 라벨
├── hooks/                  # useCategories 등
├── styles/theme.js         # styled-components 테마
└── data/                   # 목업 데이터
```

### 라우트

| 경로 | 화면 |
|:---|:---|
| `/login` `/signup` | 구글 로그인 · 회원가입 |
| `/start` | 온보딩 (닉네임 · 자취 연차) |
| `/` | 홈 (지도) |
| `/board` | 꿀팁 게시판 |
| `/search` | 검색 결과 |
| `/places/:placeId/tips` | 장소별 꿀팁 목록 |
| `/tips/:tipId` | 꿀팁 상세 · 댓글 |
| `/editor` | 꿀팁 작성 |
| `/user` `/user/posts` `/user/:userId` | 마이페이지 · 작성글 · 유저 프로필 |

***

## 🔑 인증 흐름

```
① 구글 로그인 버튼 (GSI)  →  idToken 발급
② POST /api/v1/auth/oauth/google  { idToken }
③ 응답: accessToken (메모리 보관) + refresh_token (HttpOnly 쿠키)
④ 이후 요청: Authorization: Bearer {accessToken}
⑤ 만료 시 인터셉터가 POST /api/v1/auth/token/refresh 로 자동 재발급 후 원요청 재시도
⑥ 재발급 실패 → 세션 정리 → ProtectedRoute 가 로그인 화면으로 이동
```

- 동시에 여러 요청이 만료되어도 **재발급 요청은 한 번만** 나가도록 처리했습니다.
- `refresh_token` 쿠키를 주고받기 위해 axios 는 `withCredentials: true` 로 설정되어 있습니다.
- 구글 로그인 팝업을 위해 배포 시 `Cross-Origin-Opener-Policy: same-origin-allow-popups` 헤더를 적용합니다. (`vercel.json`)

***

## 🎨 UI 가이드

- **모바일 퍼스트** — `MobileFrame` 으로 데스크톱에서도 모바일 뷰포트를 유지합니다.
- **단위** — 모든 UI 치수는 `rem` 을 사용합니다.
- **테마** — 색상·타이포그래피는 `src/styles/theme.js` 의 토큰을 통해서만 사용합니다.
- **바텀시트 3단 구성**
  - 1단 — 기본 상태
  - 2단 — 핀 클릭 시 꿀팁이 1개인 경우
  - 3단 — 핀 클릭 시 꿀팁이 2개 이상인 경우

<!-- 화면 스크린샷 -->
<!--
| 홈 (지도) | 게시판 | 꿀팁 상세 | 마이페이지 |
|:---:|:---:|:---:|:---:|
| <img src="" width="200" /> | <img src="" width="200" /> | <img src="" width="200" /> | <img src="" width="200" /> |
-->

***

## 📡 API 연동

| 도메인 | 메서드 | 엔드포인트 | 설명 |
|:---|:---|:---|:---|
| Auth | `POST` | `/api/v1/auth/oauth/google` | 구글 소셜 로그인 |
| Auth | `POST` | `/api/v1/auth/token/refresh` | 액세스 토큰 재발급 |
| Auth | `POST` | `/api/v1/auth/logout` | 로그아웃 |
| User | `PATCH` | `/api/users/me/onboarding` | 닉네임 · 자취 연차 등록 |
| Place | `GET` | `/api/places/map` | 지도 표시용 장소 목록 |
| Place | `GET` | `/api/categories` | 카테고리 목록 |
| Tip | `GET` | `/api/tips` | 꿀팁 피드 (카테고리 · 유저 · 검색 · 정렬 · 페이징) |
| Tip | `GET` | `/api/tips/{tipId}` | 꿀팁 상세 |
| Tip | `POST` | `/api/v1/tips` | 꿀팁 등록 |
| Tip | `DELETE` | `/api/tips/{tipId}` | 꿀팁 삭제 |
| Reaction | `PUT` | `/api/tips/{tipId}/reactions` | 추천 / 비추천 등록 · 변경 |
| Reaction | `DELETE` | `/api/tips/{tipId}/reactions` | 추천 / 비추천 취소 |
| Scrap | `POST` `DELETE` | `/api/tips/{tipId}/scraps` | 스크랩 등록 · 취소 |
| Comment | `GET` `POST` | `/api/tips/{tipId}/comments` | 댓글 조회 · 작성 |
| Comment | `DELETE` | `/api/comments/{commentId}` | 댓글 삭제 |

- 모든 응답은 공통 봉투 `{ success, code, message, data }` 형태이며, `util/axios.js` 의 `unwrap()` 이 `data` 만 벗겨 반환합니다.
- 카테고리 `id` 는 백엔드 DB 가 소유하므로 프런트에 하드코딩하지 않고 언제나 `GET /api/categories` 로 받아 씁니다.
- 마이페이지의 "내가 쓴 글"과 유저 프로필은 전용 엔드포인트 대신 `GET /api/tips?userId=` 피드로 대체 구현되어 있습니다.

***

## 🌱 개발 컨벤션

### 브랜치
- 기본 작업 브랜치는 `develop` 이며, 여기서 체크아웃해 사용합니다.
- `종류/기능명` 형태로 생성합니다. — `feature/tip-detail`, `fix/login`, `docs/readme`
- `main` 브랜치가 Vercel 에 연결되어 CI/CD 가 동작합니다.

### 커밋 메시지
```text
태그: 변경 내용 요약
ex) fix: 구글 로그인 버튼 클릭 흐름 복구
```

***

## 🗓️ 개발 예정

- [ ] 팔로우 / 언팔로우 (백엔드 미구현, `UserAPI.IS_FOLLOW_AVAILABLE` 플래그로 비활성)
- [ ] 유저별 지도 필터링
- [ ] 신고 기능
- [ ] 비추천이 누적된 꿀팁 자동 필터링
- [ ] 스폰서 팁 상단 노출
- [ ] 교환학생 · 유학생을 위한 번역 기능

***

## 👥 개발 팀

**2026 신촌톤 (Sinchonthon) Team 3**

| 역할 | 이름 | 소속 |GitHub | 담당 |
|:---:|:---:|:---:|:---:|:---|
| PM & Design | 이가영 | 연세대 |  |  |
| Frontend | 김태성 | 서강대 |  |  |
| Frontend | 김민혜 | 이화여대 |  |  |
| Backend | 고선태 | 연세대 |  |  |
| Backend | 김태희 | 서강대 |  |  |
| Backend | 원지현 | 홍익대 |  |  |

***

## 🔗 관련 저장소

| 저장소 | 링크 |
|:---|:---|
| Frontend | https://github.com/2026-Sinchonthon/Team3-Frontend |
| Backend | https://github.com/2026-Sinchonthon/Team3-Backend |
