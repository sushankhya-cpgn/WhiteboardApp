import { BrowserRouter, Route, Routes } from "react-router-dom";
import DrawingPage from "./pages/DrawingPage";
import LandingPage from "./pages/LandingPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/meeting" element={<DrawingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
