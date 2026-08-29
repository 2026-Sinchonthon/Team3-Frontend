import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AlertModal from "../../common_ui/Alert/Alert";
import {
  loginWithGoogle,
  renderGoogleLoginButton,
} from "../../util/AuthAPI";

const Container = styled.section`
  display: grid;
  flex: 1;
  place-items: center;
  width: 100%;
  padding: 1.5rem 1rem;
`;

const LoginBox = styled.div`
  width: min(100%, 22rem);
`;

const Title = styled.h1`
  margin: 0 0 1.5rem;
  font-size: 1.5rem;
  text-align: center;
`;

const GoogleButtonContainer = styled.div`
  display: flex;
  min-height: 2.75rem;
  justify-content: center;
`;

export default function LoginPage() {
  const googleButtonRef = useRef(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    let cleanupButton;
    let isActive = true;

    const handleCredential = async (idToken) => {
      try {
        setIsLoading(true);
        const loginData = await loginWithGoogle(idToken);

        if (isActive) {
          setAlert({
            color: "green",
            title: "로그인 완료",
            content: loginData.isNewUser
              ? "회원가입과 Google 로그인이 완료되었습니다."
              : "Google 로그인이 완료되었습니다.",
            userId: loginData.userId,
          });
        }
      } catch (error) {
        if (isActive) {
          setAlert({
            color: "red",
            title: "로그인 실패",
            content: error.message || "Google 로그인에 실패했습니다.",
          });
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    renderGoogleLoginButton(googleButtonRef.current, handleCredential)
      .then((cleanup) => {
        if (isActive) cleanupButton = cleanup;
        else cleanup();
      })
      .catch((error) => {
        if (isActive) {
          setAlert({
            color: "red",
            title: "로그인 준비 실패",
            content: error.message,
          });
        }
      });

    return () => {
      isActive = false;
      cleanupButton?.();
    };
  }, []);

  const closeAlert = () => setAlert(null);
  const confirmAlert = () => {
    if (alert?.userId != null) {
      navigate("/user");
      return;
    }

    closeAlert();
  };

  return (
    <Container>
      <LoginBox>
        <Title>로그인</Title>
        <GoogleButtonContainer ref={googleButtonRef} />
      </LoginBox>

      {isLoading && (
        <AlertModal
          type="loading"
          title="로그인 중"
          content="Google 계정을 확인하고 있습니다."
        />
      )}

      {alert && (
        <AlertModal
          type="alert"
          color={alert.color}
          title={alert.title}
          content={alert.content}
          onConfirm={confirmAlert}
          onClose={alert.userId != null ? confirmAlert : closeAlert}
        />
      )}
    </Container>
  );
}
