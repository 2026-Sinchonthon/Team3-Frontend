import { Route, Routes } from "react-router-dom";
import MainLayout from "./common_ui/Layout/MainLayout";
import ProtectedRoute from "./common_ui/ProtectedRoute/ProtectedRoute";
import Editor from "./page/Editor/Editor";
import LoginPage from "./page/Login/LoginPage";
import MapPage from "./page/Map/MapPage";
import PlaceTips from "./page/Tips/PlaceTips";
import SearchResult from "./page/SearchResult/SearchResult";
import TipFeed from "./page/Tips/TipFeed";
import UserPage from "./page/User/UserPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<MapPage />} />
          <Route path="/search" element={<SearchResult />} />
          <Route path="/places/:placeId/tips" element={<PlaceTips />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/tips/:tipId" element={<TipFeed />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/user/:userId" element={<UserPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
