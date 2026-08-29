import { Route, Routes } from "react-router-dom";
import MainLayout from "./common_ui/Layout/MainLayout";
import MapPage from "./page/Map/MapPage";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<MapPage />} />
      </Route>
    </Routes>
  );
}
