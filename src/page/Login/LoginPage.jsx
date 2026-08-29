import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import AlertModal from "../../common_ui/Alert/Alert";
import {
  getAuthenticatedUserId,
  loginWithGoogle,
  renderGoogleLoginButton,
} from "../../util/AuthAPI";

const Container = styled.section`
  display: grid;
  place-items: center;

  width: 100%;
  min-height: 100dvh;

  padding: 1.5rem 1rem;

  background: #f7f7f7;
`;

const LoginBox = styled.div`
  width: min(100%, 22rem);
  padding: 1.25rem;

  border: 0.0625rem solid #e5e7eb;
  border-radius: 1.5rem;

  background: #fff;

  box-shadow: 0 0.75rem 2rem rgb(0 0 0 / 12%);
`;

const Title = styled.h1`
  margin: 0 0 1.5rem;

  font-size: 1.5rem;
  text-align: center;
`;

const GoogleButtonContainer = styled.div`
  display: flex;
  justify-content: center;

  min-height: 2.75rem;

  overflow: hidden;

  border-radius: 1.5rem;
`;

export default function LoginPage() {
  const googleButtonRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    /*
     * 이미 현재 SPA 세션에서 인증된 사용자라면
     * Google 로그인 버튼을 다시 렌더하지 않고 바로 이동합니다.
     */
    const authenticatedUserId = getAuthenticatedUserId();

    if (authenticatedUserId != null) {
      const requestedPath = location.state?.from;

      const destination =
        typeof requestedPath === "string" &&
          requestedPath.startsWith("/") &&
          requestedPath !== "/login"
          ? requestedPath
          : "/";

      navigate(destination, {
        replace: true,
      });

      return;
    }

    let cleanupButton;
    let isActive = true;

    const abortController = new AbortController();

    const handleCredential = async (idToken) => {
      try {
        setIsLoading(true);

        const loginData = await loginWithGoogle(idToken);

        if (!isActive) return;

        setAlert({
          color: "green",
          title: "로그인 완료",
          content: loginData.isNewUser
            ? "회원가입과 Google 로그인이 완료되었습니다."
            : "Google 로그인이 완료되었습니다.",
          userId: loginData.userId,
          isNewUser: Boolean(loginData.isNewUser),
        });
      } catch (error) {
        if (!isActive) return;

        setAlert({
          color: "red",
          title: "로그인 실패",
          content:
            error.message ||
            "Google 로그인에 실패했습니다.",
        });
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    renderGoogleLoginButton(
      googleButtonRef.current,
      handleCredential,
      {
        signal: abortController.signal,
      },
    )
      .then((cleanup) => {
        if (isActive) {
          cleanupButton = cleanup;
        } else {
          cleanup();
        }
      })
      .catch((error) => {
        if (
          isActive &&
          !abortController.signal.aborted
        ) {
          setAlert({
            color: "red",
            title: "로그인 준비 실패",
            content: error.message,
          });
        }
      });

    return () => {
      isActive = false;

      abortController.abort();

      cleanupButton?.();
    };
  }, [location.state?.from, navigate]);

  const closeAlert = () => {
    setAlert(null);
  };

  const confirmAlert = () => {
    /*
     * 로그인 성공
     */
    if (alert?.userId != null) {
      /*
       * 신규 사용자
       */
      if (alert.isNewUser) {
        navigate("/signup", {
          replace: true,
          state: {
            from: location.state?.from,
          },
        });

        return;
      }

      /*
       * 기존 사용자
       */
      const requestedPath = location.state?.from;

      const destination =
        typeof requestedPath === "string" &&
          requestedPath.startsWith("/") &&
          requestedPath !== "/login"
          ? requestedPath
          : "/";

      navigate(destination, {
        replace: true,
      });

      return;
    }

    /*
     * 로그인 실패 등의 알림
     */
    closeAlert();
  };

  return (
    <Container>
      <LoginBox>
        <Title>로그인</Title>

        <GoogleButtonContainer
          ref={googleButtonRef}
        />
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
          onClose={
            alert.userId != null
              ? confirmAlert
              : closeAlert
          }
        />
      )}
    </Container>
  );
}