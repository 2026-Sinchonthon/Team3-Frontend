import api from "./axios";

const GOOGLE_SCRIPT_ID = "google-identity-services";

let googleScriptPromise;
let currentCredentialCallback = null;
let authSession = null;
const googleButtonRenderTokens = new WeakMap();

function loadGoogleIdentityServices() {
  if (window.google?.accounts?.id) return Promise.resolve(window.google);
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);
    const script = existingScript ?? document.createElement("script");

    script.addEventListener(
      "load",
      () => resolve(window.google),
      { once: true },
    );
    script.addEventListener(
      "error",
      () => reject(new Error("Google 로그인 모듈을 불러오지 못했습니다.")),
      { once: true },
    );

    if (!existingScript) {
      script.id = GOOGLE_SCRIPT_ID;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      document.head.appendChild(script);
    }
  }).catch((error) => {
    googleScriptPromise = undefined;
    throw error;
  });

  return googleScriptPromise;
}

export async function renderGoogleLoginButton(
  container,
  onCredential,
  { signal } = {},
) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) throw new Error("Google Client ID가 설정되지 않았습니다.");
  if (!container) throw new Error("Google 로그인 버튼 영역이 없습니다.");
  if (signal?.aborted) return () => { };

  const google = await loadGoogleIdentityServices();

  if (signal?.aborted) return () => { };

  if (!google?.accounts?.id) {
    throw new Error("Google 로그인 모듈을 초기화하지 못했습니다.");
  }

  currentCredentialCallback = onCredential;

  google.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => {
      if (response?.credential) {
        currentCredentialCallback?.(response.credential);
      }
    },
    auto_select: false,
    use_fedcm_for_button: true,
    itp_support: true,
  });

  const renderToken = Symbol("google-login-button");
  googleButtonRenderTokens.set(container, renderToken);
  container.replaceChildren();
  const width = Math.floor(container.clientWidth);

  google.accounts.id.renderButton(container, {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "continue_with",
    shape: "pill",
    logo_alignment: "left",
    width,
  });

  return () => {
    if (currentCredentialCallback === onCredential) {
      currentCredentialCallback = null;
    }

    if (googleButtonRenderTokens.get(container) === renderToken) {
      googleButtonRenderTokens.delete(container);
      container.replaceChildren();
    }
  };
}

export async function loginWithGoogle(idToken) {
  if (!idToken) throw new Error("Google ID Token이 없습니다.");

  const response = await api.post(
    "/api/v1/auth/oauth/google",
    { idToken },
    { withCredentials: true },
  );

  const rawData = response.data?.data ?? response.data;
  const userId = rawData?.userId ?? rawData?.id ?? rawData?.user?.id;
  const accessToken = rawData?.accessToken ?? rawData?.token;
  const accessTokenExpiresIn =
    rawData?.accessTokenExpiresIn ?? rawData?.expiresIn;
  const isNewUser = Boolean(rawData?.isNewUser);

  if (!accessToken || userId == null) {
    throw new Error("로그인 응답 형식이 올바르지 않습니다.");
  }

  const loginData = {
    userId,
    accessToken,
    accessTokenExpiresIn,
    isNewUser,
    ...rawData,
  };

  authSession = loginData;
  api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

  return loginData;
}

export function getAuthenticatedUserId() {
  return authSession?.userId ?? null;
}

export function clearAuthSession() {
  authSession = null;
  delete api.defaults.headers.common.Authorization;
  window.google?.accounts?.id?.disableAutoSelect();
}

export async function refreshAccessToken() {
  const response = await api.post(
    "/api/v1/auth/token/refresh",
    null,
    { withCredentials: true },
  );
  const result = response.data;
  const accessToken = result?.data?.accessToken;

  if (!result?.success || !accessToken) {
    clearAuthSession();
    throw new Error(result?.message || "액세스 토큰을 재발급하지 못했습니다.");
  }

  authSession = {
    ...authSession,
    accessToken,
    accessTokenExpiresIn: result.data.accessTokenExpiresIn,
  };
  api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

  return result.data;
}

export async function logout() {
  const response = await api.post(
    "/api/v1/auth/logout",
    null,
    { withCredentials: true },
  );

  if (!response.data?.success || response.data?.code !== 200) {
    throw new Error(response.data?.message || "로그아웃에 실패했습니다.");
  }

  clearAuthSession();
  return response.data;
}
