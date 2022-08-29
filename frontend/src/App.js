// This is a React Router v6 app
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Auth from "./pages/Auth";
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
import MainNavigator from "./components/Navigation/MainNavigator";
import React from "react";

function App() {
  return (
    <BrowserRouter>
      <React.Fragment>
        <MainNavigator />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/bookings" element={null} />
            <Route path="/events" element={null} />
          </Routes>
        </main>
      </React.Fragment>
    </BrowserRouter>
  );
}
export default App