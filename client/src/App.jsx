import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
// import Socketdemo from "./pages/Socketdemo";
import DrawingPage from "./pages/DrawingPage";
import UserContextProvider from "./context/contextProvider";

export function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/meeting" element={<DrawingPage />} />
          {/* <Route path="/socket_demo" element={<Socketdemo />} /> */}
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
