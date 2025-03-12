import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import UserContextProvider from "./context/contextProvider";
import ReceiverPage from "./pages/ReceiverPage";
import SenderPage from "./pages/SenderPage";
import { SocketContextProvider } from "./context/SocketProvider";

export function App() {
  return (
    <UserContextProvider>
      <SocketContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/meeting" element={<SenderPage />} />
            <Route path="/receivestream" element={<ReceiverPage />} />
            {/* <Route path="/socket_demo" element={<Socketdemo />} /> */}
          </Routes>
        </BrowserRouter>
      </SocketContextProvider>
    </UserContextProvider>
  );
}

export default App;
