import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import AlertModal from "../../common_ui/Alert/Alert";
import { ArrowLeftIcon } from "../../common_ui/Icon/Icons";
import { getCategories } from "../../util/PlaceAPI";
import { createTip } from "../../util/TipAPI";
import loadKakaoMap from "../../util/loadKakaoMap";

const DEFAULT_POSITION = { latitude: 37.555134, longitude: 126.936893 };

export default function FirstReg() {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const mapContainerRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const nickname = routeLocation.state?.nickname || "자취 5년차";

  useEffect(() => {
    let active = true;

    getCategories()
      .then((items) => {
        if (!active) return;
        setCategories(items);
        setCategoryId(items[0]?.id ?? null);
      })
      .catch((error) => {
        if (active) {
          setAlert({
            color: "red",
            title: "카테고리 조회 실패",
            content: error.message,
          });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    let marker;

    loadKakaoMap()
      .then((kakao) => {
        if (!active || !mapContainerRef.current) return;
        const center = new kakao.maps.LatLng(
          DEFAULT_POSITION.latitude,
          DEFAULT_POSITION.longitude,
        );
        const map = new kakao.maps.Map(mapContainerRef.current, {
          center,
          level: 4,
        });

        kakao.maps.event.addListener(map, "click", (mouseEvent) => {
          const latitude = mouseEvent.latLng.getLat();
          const longitude = mouseEvent.latLng.getLng();

          if (!marker) {
            marker = new kakao.maps.Marker({ map, position: mouseEvent.latLng });
          } else {
            marker.setPosition(mouseEvent.latLng);
          }

          setSelectedLocation({
            name: "선택한 위치",
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            latitude,
            longitude,
          });
        });
      })
      .catch((error) => {
        if (!active) return;
        setAlert({
          color: "red",
          title: "지도 로딩 실패",
          content: error.message,
        });
      });

    return () => {
      active = false;
      marker?.setMap(null);
    };
  }, []);

  const isValid =
    categoryId !== null &&
    title.trim().length > 0 &&
    content.trim().length > 0 &&
    selectedLocation !== null;

  const handleSubmit = async () => {
    if (!isValid || submitting) return;

    try {
      setSubmitting(true);
      await createTip({
        categoryId,
        title: title.trim(),
        content: content.trim(),
        location: selectedLocation,
      });
      navigate("/", { replace: true });
    } catch (error) {
      setAlert({
        color: "red",
        title: "팁 등록 실패",
        content:
          error.response?.data?.message ||
          error.message ||
          "팁을 등록하지 못했습니다. 다시 시도해 주세요.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Viewport>
      <Page>
        <Header>
          <BackButton type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
            <ArrowLeftIcon />
          </BackButton>
          <HeaderTitle>시작하기</HeaderTitle>
          <HeaderSpacer aria-hidden="true" />
        </Header>

        <ScrollArea>
          <Intro>
            <IntroTitle>{nickname}님, 반가워요!</IntroTitle>
            <IntroDescription>
              다른 사람들의 꿀팁을 보려면 먼저 내 꿀팁을 <strong>1개 이상</strong>{" "}
              등록해주세요
            </IntroDescription>
          </Intro>

          <Section>
            <Label>어떤 꿀팁인가요?</Label>
            <CategoryList>
              {categories.map((category) => (
                <CategoryButton
                  key={category.id}
                  type="button"
                  $selected={categoryId === category.id}
                  onClick={() => setCategoryId(category.id)}
                >
                  {category.name}
                </CategoryButton>
              ))}
            </CategoryList>
          </Section>

          <ExampleBox>
            <ExampleTitle>이런 팁이면 충분해요</ExampleTitle>
            <ExampleText>
              “서강대 후문 갈 땐 이대역에서 나오는게 3분 빨라요” 처럼 짧은 한
              줄이면 OK
            </ExampleText>
          </ExampleBox>

          <Fields>
            <Field>
              <Label as="label" htmlFor="first-tip-title">제목</Label>
              <Input
                id="first-tip-title"
                value={title}
                placeholder="제목을 입력해 주세요"
                onChange={(event) => setTitle(event.target.value)}
              />
            </Field>
            <Field>
              <Label as="label" htmlFor="first-tip-content">내용</Label>
              <Input
                id="first-tip-content"
                value={content}
                placeholder="신촌에서 직접 겪은 꿀팁을 자세히 적어주세요"
                onChange={(event) => setContent(event.target.value)}
              />
            </Field>
          </Fields>

          <MapSection>
            <Label>지도에서 위치 지정</Label>
            <Map ref={mapContainerRef} aria-label="팁 위치 선택 지도" />
            <MapHint>
              {selectedLocation
                ? "위치가 선택되었습니다."
                : "지도를 눌러 위치를 선택해 주세요."}
            </MapHint>
          </MapSection>
        </ScrollArea>

        <BottomAction>
          <SubmitButton
            type="button"
            disabled={!isValid || submitting}
            onClick={handleSubmit}
          >
            {submitting ? "등록 중..." : "첫 꿀팁 등록하러 가기"}
          </SubmitButton>
        </BottomAction>
      </Page>

      {submitting && (
        <AlertModal type="loading" title="등록 중" content="첫 꿀팁을 저장하고 있습니다." />
      )}
      {alert && (
        <AlertModal
          type="alert"
          color={alert.color}
          title={alert.title}
          content={alert.content}
          onConfirm={() => setAlert(null)}
          onClose={() => setAlert(null)}
        />
      )}
    </Viewport>
  );
}

const Viewport = styled.div`
  width: 100%;
  min-height: 100dvh;
  background: ${({ theme }) => theme.color.surfaceMuted};
`;

const Page = styled.main`
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(100%, 23.4375rem);
  height: 100dvh;
  min-height: 35rem;
  margin: 0 auto;
  overflow: hidden;
  background: ${({ theme }) => theme.color.surfaceMuted};
  color: ${({ theme }) => theme.color.text};
`;

const Header = styled.header`
  display: grid;
  grid-template-columns: 2.5rem minmax(0, 1fr) 2.5rem;
  flex: 0 0 4.1875rem;
  align-items: center;
  padding: 0 1rem;
`;

const BackButton = styled.button`
  display: grid;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: inherit;
  cursor: pointer;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.25;
  text-align: center;
`;

const HeaderSpacer = styled.span`
  width: 2.5rem;
`;

const ScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  padding: 1.8125rem 0.625rem 7.25rem;
  overflow-y: auto;
  overscroll-behavior: contain;
`;

const Intro = styled.section`
  padding: 0 0.625rem;
`;

const IntroTitle = styled.h2`
  margin: 0;
  font-size: 1.5625rem;
  font-weight: 700;
  line-height: 1.24;
  word-break: keep-all;
`;

const IntroDescription = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.27;
  word-break: keep-all;
`;

const Section = styled.section`
  margin-top: 1.1875rem;
  padding: 0 0.625rem;
`;

const Label = styled.p`
  display: block;
  margin: 0 0 0.625rem;
  font-size: 0.9375rem;
  font-weight: 300;
  line-height: 1.27;
`;

const CategoryList = styled.div`
  display: flex;
  gap: 0.5625rem;
  width: max-content;
  min-width: 100%;

  @media (max-width: 22rem) {
    width: 100%;
    flex-wrap: wrap;
  }
`;

const CategoryButton = styled.button`
  flex: 0 0 auto;
  padding: 0.625rem 0.75rem;
  border: 0;
  border-radius: 3.75rem;
  background: ${({ $selected, theme }) =>
    $selected ? theme.color.brand : theme.color.surface};
  color: inherit;
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;
`;

const ExampleBox = styled.aside`
  margin-top: 1.1875rem;
  padding: 0.625rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.field};
`;

const ExampleTitle = styled.p`
  margin: 0 0 1.1875rem;
  font-size: 0.9375rem;
  line-height: 1.27;
`;

const ExampleText = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 300;
  line-height: 1.27;
`;

const Fields = styled.div`
  display: grid;
  gap: 0.625rem;
  width: calc(100% - 0.625rem);
  margin-top: 1.3125rem;
`;

const Field = styled.div`
  padding: 0 0.625rem;
`;

const Input = styled.input`
  width: 100%;
  height: 2.625rem;
  padding: 0.625rem;
  border: 0.0625rem solid ${({ theme }) => theme.color.textMuted};
  border-radius: ${({ theme }) => theme.radius.md};
  background: #f7f7f7;
  color: inherit;
  font: inherit;
  font-size: 0.9375rem;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.color.brandStrong};
  }

  &::placeholder {
    color: ${({ theme }) => theme.color.textMuted};
    opacity: 1;
  }
`;

const MapSection = styled.section`
  margin-top: 1.3125rem;
`;

const Map = styled.div`
  width: 100%;
  height: 8.125rem;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.md};
  background: #d9d9d9;
`;

const MapHint = styled.p`
  margin: 0.375rem 0 0;
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 0.75rem;
`;

const BottomAction = styled.footer`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  padding: 0.75rem max(1rem, env(safe-area-inset-right))
    max(1.25rem, env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-left));
  border-top: 0.01875rem solid ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.surfaceMuted};
`;

const SubmitButton = styled.button`
  width: min(100%, 18.75rem);
  height: 3.125rem;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.brand};
  color: inherit;
  font-size: 1.0625rem;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    background: ${({ theme }) => theme.color.field};
    cursor: default;
  }
`;
