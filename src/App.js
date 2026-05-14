import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { PortfolioProvider } from "../src/context/context";
import Login from "./Pages/Login";
import { ProtectedRoute } from "./Components/ProtectedRoute";

const Home = lazy(() => import("./Pages/Home"));
const Admin = lazy(() => import("./Pages/Admin"));
const ProjectDetailsPage = lazy(() => import("./Pages/ProjectDetailsPage"));

function App() {
  return (
    <PortfolioProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/commander"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="/projects/:id" element={<ProjectDetailsPage />} />
          </Routes>
        </Suspense>
      </Router>
    </PortfolioProvider>
  );
}

export default App;
