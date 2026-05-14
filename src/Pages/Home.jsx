import React from "react";
import { Header } from "../Components/Home-page/Header";  
import { SideBar } from "../Components/Home-page/SideBar";
import { Content } from "../Components/Home-page/Content";
import { Footer } from "../Components/Home-page/Footer";

const Home = () => {
  return (
    <div className="parent">
      <div className="header">
        <Header />
      </div>
      <div className="sidebar">
        <SideBar />
      </div>
      <div className="content">
        <Content />
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
