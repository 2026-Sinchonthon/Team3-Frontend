import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import AlertModal from "../../common_ui/Alert/Alert";
import { ArrowLeftIcon, CheckIcon } from "../../common_ui/Icon/Icons";
import { CATEGORIES } from "../../constants/categories";

const RESIDENCE_OPTIONS = [
  { id: "PREPARING", label: "자취 준비중", years: 0 },
  { id: "YEAR_1", label: "1년차", years: 1 },
  { id: "YEAR_2_3", label: "2~3년차", years: 2 },
  { id: "YEAR_4_PLUS", label: "4년차 이상", years: 4 },
];

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: ${({ theme }) => theme.color.surfaceMuted};
  color: ${({ theme }) => theme.color.text};
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  height: 3.5rem;
  padding: 0 1.25rem;
  background: ${({ theme }) => theme.color.surfaceMuted};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.color.text};
  cursor: pointer;
  border-radius: 50%;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
`;

const ContentContainer = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 30rem;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 6rem;
`;

const TitleSection = styled.section`
  margin-bottom: 2rem;
`;

const MainTitle = styled.h2`
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.35;
  word-break: keep-all;
`;

const SubTitle = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.sm};
  color: ${({ theme }) => theme.color.textMuted};
  font-weight: 400;
  line-height: 1.4;
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
  font-size: ${({ theme }) => theme.font.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.color.text};
`;

const TextInput = styled.input`
  width: 100%;
  height: 3.25rem;
  padding: 0 1rem;
  border: 0.0625rem solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.surface};
  font-size: 1.125rem;
  color: ${({ theme }) => theme.color.text};
  outline: none;
  transition: border-color 0.15s ease;

  &::placeholder {
    color: #9e9e9e;
    font-size: 1.125rem;
  }

  &:focus {
    border-color: ${({ theme }) => theme.color.brandStrong};
  }
`;

const ChipGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.625rem;
`;

const ResidenceChip = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  border: 0.0625rem solid
    ${({ $isSelected, theme }) =>
      $isSelected ? theme.color.brand : theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $isSelected, theme }) =>
    $isSelected ? theme.color.brand : theme.color.surface};
  font-size: ${({ theme }) => theme.font.sm};
  font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 500)};
  color: ${({ theme }) => theme.color.text};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ $isSelected, theme }) =>
      $isSelected ? theme.color.brand : "#f2f2f2"};
  }
`;

const AgreementContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
  cursor: pointer;
  user-select: none;
`;

const CustomCheckbox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 0.0625rem solid
    ${({ $checked, theme }) =>
      $checked ? theme.color.brandStrong : theme.color.border};
  background: ${({ $checked, theme }) =>
    $checked ? theme.color.brandStrong : theme.color.surface};
  color: #fff;
  transition: all 0.15s ease;
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const AgreementText = styled.span`
  font-size: ${({ theme }) => theme.font.sm};
  color: ${({ theme }) => theme.color.text};
  line-height: 1.4;
`;

const BottomActionArea = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem 1.25rem 1.5rem;
  background: linear-gradient(
    to top,
    ${({ theme }) => theme.color.surfaceMuted} 80%,
    transparent 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 100;
`;

const PrimaryButton = styled.button`
  width: min(100%, 27.5rem);
  height: 3.25rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $active, theme }) =>
    $active ? theme.color.brand : theme.color.field};
  color: ${({ $active, theme }) =>
    $active ? theme.color.text : theme.color.textMuted};
  font-size: 1.0625rem;
  font-weight: 700;
  cursor: ${({ $active }) => ($active ? "pointer" : "default")};
  box-shadow: ${({ $active, theme }) =>
    $active ? theme.shadow.card : "none"};
  transition: all 0.15s ease;

  &:active {
    transform: ${({ $active }) => ($active ? "scale(0.98)" : "none")};
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.color.textMuted};
  font-size: ${({ theme }) => theme.font.xs};
  padding: 0.375rem 0.75rem;
  cursor: pointer;
  text-decoration: underline;
`;

const Step2Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.25rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.surface};
  box-shadow: ${({ theme }) => theme.shadow.card};
  margin-top: 0.5rem;
`;

const TipCategoryGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TipCategoryChip = styled.span`
  padding: 0.5rem 0.875rem;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.color.surfaceMuted};
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.font.xs};
  font-weight: 600;
`;

const GuideBox = styled.div`
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: #fdfae5;
  border: 0.0625rem solid #faedd0;
`;

const GuideTitle = styled.p`
  margin: 0 0 0.375rem;
  font-size: ${({ theme }) => theme.font.sm};
  font-weight: 600;
  color: #7d5b00;
`;

const GuideContent = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.xs};
  line-height: 1.45;
  color: #555;
`;

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState("");
  const [residenceOption, setResidenceOption] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [alert, setAlert] = useState(null);

  const isStep1Valid =
    nickname.trim().length >= 1 && residenceOption !== "" && agreed;

  const handleStep1Submit = () => {
    if (!isStep1Valid) return;
    setStep(2);
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
      <Header>
        <BackButton type="button" aria-label="뒤로가기" onClick={handleBack}>
          <ArrowLeftIcon />
        </BackButton>
        <HeaderTitle>{step === 1 ? "회원가입" : "시작하기"}</HeaderTitle>
      </Header>

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
                <ChipGrid>
                  {RESIDENCE_OPTIONS.map((option) => (
                    <ResidenceChip
                      key={option.id}
                      type="button"
                      $isSelected={residenceOption === option.id}
                      onClick={() => setResidenceOption(option.id)}
                    >
                      {option.label}
                    </ResidenceChip>
                  ))}
                </ChipGrid>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>약관 동의</FieldLabel>
                <AgreementContainer>
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
                </AgreementContainer>
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
                  짧은 한 줄이면 OK!
                </GuideContent>
              </GuideBox>
            </Step2Card>
          </>
        )}
      </ContentContainer>

      <BottomActionArea>
        {step === 1 ? (
          <PrimaryButton
            type="button"
            $active={isStep1Valid}
            disabled={!isStep1Valid}
            onClick={handleStep1Submit}
          >
            다음
          </PrimaryButton>
        ) : (
          <>
            <PrimaryButton
              type="button"
              $active={true}
              onClick={handleCompleteAndGoEditor}
            >
              첫 꿀팁 등록하러 가기
            </PrimaryButton>
            <SecondaryButton type="button" onClick={handleSkipToHome}>
              나중에 등록하고 둘러보기
            </SecondaryButton>
          </>
        )}
      </BottomActionArea>

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
