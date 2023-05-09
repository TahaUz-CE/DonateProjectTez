import React from "react";
import "./App.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Referral from "./Pages/Referral";
import Dashboard from "./Pages/Dashboard";
import Foundation from "./Pages/Foundation";
import FoundationTransfer from "./Pages/FoundationTransfer";
import CodeSearch from "./Pages/CodeSearch";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./Pages/NotFound";
import BackgroundVideo from "../src/Assets/video.webm";


function App() {
  return (
    <div>
      <BrowserRouter>
        <ToastContainer />  

        <div className="videoWrapper">
          <video className="videoBg" autoPlay loop muted>
            <source src={BackgroundVideo} type="video/webm" />
          </video>
        </div>

        <Header />
        <Routes>
          <Route path="/" element={<Referral />} />
          <Route path="*" element={<NotFound />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="foundation" element={<Foundation />} />
          <Route path="foundationTracking" element={<FoundationTransfer />} />
          <Route path="codeSearch" element={<CodeSearch />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
