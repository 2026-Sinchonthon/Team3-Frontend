import { Route, Routes } from "react-router-dom";
import MainLayout from "./common_ui/Layout/MainLayout";
import Editor from "./page/Editor/Editor";
import MapPage from "./page/Map/MapPage";
import SearchResult from "./page/SearchResult/SearchResult";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<MapPage />} />
        <Route path="/search" element={<SearchResult />} />
        <Route path="/editor" element={<Editor />} />
      </Route>
    </Routes>
  );
}
