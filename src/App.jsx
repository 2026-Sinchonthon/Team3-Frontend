import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import MainLayout from "./common_ui/Layout/MainLayout";
import ProtectedRoute from "./common_ui/ProtectedRoute/ProtectedRoute";
import ComingSoon from "./page/ComingSoon/ComingSoon";
import Editor from "./page/Editor/Editor";
import HomePage from "./page/Home/HomePage";
import LoginPage from "./page/Login/LoginPage";
import SignupPage from "./page/Signup/SignupPage";
import PlaceTips from "./page/Tips/PlaceTips";
import SearchResult from "./page/SearchResult/SearchResult";
import TipFeed from "./page/Tips/TipFeed";
import UserPage from "./page/User/UserPage";
import UserPostsPage from "./page/User/UserPostsPage";
import theme from "./styles/theme";
import FirstReg from "./page/Signup/FirstReg";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/start" element={<FirstReg />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResult />} />
            <Route path="/places/:placeId/tips" element={<PlaceTips />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/tips/:tipId" element={<TipFeed />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/user/posts" element={<UserPostsPage />} />
            <Route path="/user/:userId" element={<UserPage />} />
            {/* 게시판이 붙기 전까지의 임시 안내 */}
            <Route path="*" element={<ComingSoon />} />
          </Route>
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
