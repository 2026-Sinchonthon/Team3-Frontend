import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import MapPage from "./pages/MapPage";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<MapPage />} />
      </Route>
    </Routes>
  );
}
