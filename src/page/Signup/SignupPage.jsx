import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import AlertModal from "../../common_ui/Alert/Alert";
import { ArrowLeftIcon, CheckIcon } from "../../common_ui/Icon/Icons";
import { CATEGORIES } from "../../constants/categories";
import { submitOnboarding } from "../../util/UserAPI";

const RESIDENCE_OPTIONS = [
  { id: "PREPARING", label: "자취 준비중", years: 0 },
  { id: "YEAR_1", label: "1년차", years: 1 },
  { id: "YEAR_2_3", label: "2~3년차", years: 3 },
  { id: "YEAR_4_PLUS", label: "4년차 이상", years: 4 },
];

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: #f7f7f6;
  color: #000000;
`;

const TopBar = styled.header`
  display: grid;
  grid-template-columns: 2.5rem 1fr 2.5rem;
  align-items: center;
  height: 3.75rem;
  padding: 0 1rem;
  background: #f7f7f6;
  border-bottom: 0.0625rem solid #d9d9d9;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: transparent;
  color: #000000;
  cursor: pointer;
  border-radius: 50%;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const TopBarTitle = styled.h1`
  margin: 0;
  font-size: 1.75rem; /* 28px */
  font-weight: 700;
  text-align: center;
  line-height: 1.2;
`;

const ContentContainer = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 25rem;
  margin: 0 auto;
  padding: 2rem 1.25rem 6.5rem;
`;

const TitleSection = styled.section`
  margin-bottom: 2rem;
  text-align: center;
`;

const MainTitle = styled.h2`
  margin: 0 0 0.625rem;
  font-size: 1.5625rem; /* 25px */
  font-weight: 600;
  line-height: 1.35;
  text-align: center;
  word-break: keep-all;
`;

const SubTitle = styled.p`
  margin: 0;
  font-size: 0.9375rem; /* 15px */
  color: #000000;
  font-weight: 300;
  line-height: 1.4;
  text-align: left;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FieldLabel = styled.label`
  font-size: 0.9375rem; /* 15px */
  font-weight: 300;
  color: #000000;
  text-align: left;
`;

const TextInput = styled.input`
  width: 100%;
  height: 3.25rem;
  padding: 0 1rem;
  border: 0.0625rem solid #e7e7e7;
  border-radius: 0.625rem; /* 10px */
  background: #ffffff;
  font-size: 1.125rem;
  color: #000000;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s ease;

  &::placeholder {
    color: #9e9e9e;
    font-size: 1.125rem;
    font-weight: 400;
  }

  &:focus {
    border-color: #65a302;
  }
`;

const ChipContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ResidenceChip = styled.button`
  flex: 1 1 calc(50% - 0.25rem);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.75rem;
  padding: 0 0.75rem;
  border: 0.0625rem solid
    ${({ $isSelected }) => ($isSelected ? "#c0ee75" : "#e7e7e7")};
  border-radius: 3.75rem; /* 60px (pill) */
  background: ${({ $isSelected }) => ($isSelected ? "#c0ee75" : "#ffffff")};
  font-size: 0.9375rem; /* 15px */
  font-weight: 600;
  color: #000000;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ $isSelected }) => ($isSelected ? "#c0ee75" : "#f5f5f5")};
  }
`;

const AgreementBox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.25rem 0;
  cursor: pointer;
  user-select: none;
`;

const CustomCheckbox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.375rem;
  height: 1.375rem;
  border-radius: 0.3125rem;
  border: 0.0625rem solid
    ${({ $checked }) => ($checked ? "#65a302" : "#bebfc0")};
  background: ${({ $checked }) => ($checked ? "#65a302" : "#ffffff")};
  color: #ffffff;
  flex-shrink: 0;
  transition: all 0.15s ease;
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const AgreementText = styled.span`
  font-size: 0.9375rem; /* 15px */
  font-weight: 400;
  color: #000000;
  line-height: 1.4;
`;

const BottomActionArea = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem 1.25rem 1.5rem;
  background: #f7f7f6;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 100;
`;

const SubmitButton = styled.button`
  width: min(100%, 25rem);
  height: 3.25rem;
  border: none;
  border-radius: 0.625rem; /* 10px */
  background: ${({ $active }) => ($active ? "#c0ee75" : "#e9e9e9")};
  color: #000000;
  font-size: 1.0625rem; /* 17px */
  font-weight: 700;
  cursor: ${({ $active }) => ($active ? "pointer" : "default")};
  transition: all 0.15s ease;

  &:active {
    transform: ${({ $active }) => ($active ? "scale(0.98)" : "none")};
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  border: none;
  color: #6c6c6c;
  font-size: 0.8125rem; /* 13px */
  padding: 0.375rem 0.75rem;
  cursor: pointer;
  text-decoration: underline;
`;

/* Step 2 컴포넌트 */
const Step2Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 0.5rem;
`;

const TipCategoryGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TipCategoryChip = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 calc(50% - 0.25rem);
  height: 2.75rem;
  border-radius: 3.75rem; /* 60px */
  background: #ffffff;
  border: 0.0625rem solid #e7e7e7;
  color: #000000;
  font-size: 0.9375rem; /* 15px */
  font-weight: 600;

  &:first-child {
    background: #c0ee75;
    border-color: #c0ee75;
  }
`;

const GuideBox = styled.div`
  padding: 1.125rem 1rem;
  border-radius: 0.625rem; /* 10px */
  background: #e9e9e9;
`;

const GuideTitle = styled.p`
  margin: 0 0 0.5rem;
  font-size: 0.9375rem; /* 15px */
  font-weight: 400;
  color: #000000;
`;

const GuideContent = styled.p`
  margin: 0;
  font-size: 0.9375rem; /* 15px */
  font-weight: 300;
  line-height: 1.45;
  color: #000000;
`;

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState("");
  const [selectedResidence, setSelectedResidence] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const isStep1Valid =
    nickname.trim().length >= 1 && selectedResidence !== null && agreed;

  const handleStep1Submit = async () => {
    if (!isStep1Valid || isLoading) return;

    try {
      setIsLoading(true);
      await submitOnboarding({
        nickname: nickname.trim(),
        livingAloneYears: selectedResidence.years,
      });

      navigate("/start", {
        replace: true,
        state: {
          nickname: nickname.trim(),
          from: location.state?.from,
        },
      });
    } catch (error) {
      setAlert({
        color: "red",
        title: "온보딩 등록 실패",
        content:
          error.response?.data?.message ||
          error.message ||
          "온보딩 정보를 등록하지 못했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteAndGoEditor = () => {
    navigate("/editor", { replace: true });
  };

  const handleSkipToHome = () => {
    const from = location.state?.from || "/";
    navigate(from, { replace: true });
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigate(-1);
    }
  };

  return (
    <PageWrapper>
      <TopBar>
        <BackButton type="button" aria-label="뒤로가기" onClick={handleBack}>
          <ArrowLeftIcon />
        </BackButton>
        <TopBarTitle>{step === 1 ? "회원가입" : "시작하기"}</TopBarTitle>
        <div style={{ width: "2.5rem" }} />
      </TopBar>

      <ContentContainer>
        {step === 1 ? (
          <>
            <TitleSection>
              <MainTitle>신촌핑에서 어떻게 불러드릴까요?</MainTitle>
              <SubTitle>동네 사람들에게 보여질 이름이에요</SubTitle>
            </TitleSection>

            <FormSection>
              <FieldGroup>
                <FieldLabel htmlFor="nickname">닉네임</FieldLabel>
                <TextInput
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="예) 자취 5년차"
                  maxLength={15}
                  autoComplete="off"
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>자취 연차</FieldLabel>
                <ChipContainer>
                  {RESIDENCE_OPTIONS.map((option) => (
                    <ResidenceChip
                      key={option.id}
                      type="button"
                      $isSelected={selectedResidence?.id === option.id}
                      onClick={() => setSelectedResidence(option)}
                    >
                      {option.label}
                    </ResidenceChip>
                  ))}
                </ChipContainer>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>약관 동의</FieldLabel>
                <AgreementBox>
                  <HiddenCheckbox
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <CustomCheckbox $checked={agreed}>
                    {agreed && <CheckIcon />}
                  </CustomCheckbox>
                  <AgreementText>
                    이용 약관 및 개인정보 처리 방침 동의 (필수)
                  </AgreementText>
                </AgreementBox>
              </FieldGroup>
            </FormSection>
          </>
        ) : (
          <>
            <TitleSection>
              <MainTitle>{nickname}님, 반가워요!</MainTitle>
              <SubTitle>
                다른 사람들의 꿀팁을 보려면 먼저 내 꿀팁을 1개 이상
                등록해주세요
              </SubTitle>
            </TitleSection>

            <Step2Card>
              <FieldGroup>
                <FieldLabel>어떤 꿀팁인가요?</FieldLabel>
                <TipCategoryGrid>
                  {CATEGORIES.map((cat) => (
                    <TipCategoryChip key={cat.id}>{cat.tag}</TipCategoryChip>
                  ))}
                </TipCategoryGrid>
              </FieldGroup>

              <GuideBox>
                <GuideTitle>이런 팁이면 충분해요</GuideTitle>
                <GuideContent>
                  “서강대 후문 갈 땐 이대역에서 나오는게 3분 빨라요” 처럼
                  짧은 한 줄이면 OK
                </GuideContent>
              </GuideBox>
            </Step2Card>
          </>
        )}
      </ContentContainer>

      <BottomActionArea>
        {step === 1 ? (
          <SubmitButton
            type="button"
            $active={isStep1Valid}
            disabled={!isStep1Valid || isLoading}
            onClick={handleStep1Submit}
          >
            {isLoading ? "등록 중..." : "다음"}
          </SubmitButton>
        ) : (
          <>
            <SubmitButton
              type="button"
              $active={true}
              onClick={handleCompleteAndGoEditor}
            >
              첫 꿀팁 등록하러 가기
            </SubmitButton>
            <SecondaryButton type="button" onClick={handleSkipToHome}>
              나중에 등록하고 둘러보기
            </SecondaryButton>
          </>
        )}
      </BottomActionArea>

      {isLoading && (
        <AlertModal
          type="loading"
          title="등록 중"
          content="온보딩 정보를 저장하고 있습니다."
        />
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
    </PageWrapper>
  );
}
