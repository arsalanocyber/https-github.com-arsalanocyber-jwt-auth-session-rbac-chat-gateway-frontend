// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Layout from "./components/Layout";
import { ChakraProvider } from "@chakra-ui/react";
import Products from "./components/Products";
import Chat from "./components/Chat";
import AdminPanel from "./components/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import SessionLogin from "./components/SessionLogin";
import SessionProducts from "./components/SessionProducts";
import MyRooms from "./components/MyRooms";

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/session-login" element={<SessionLogin />} />
            <Route path="/session-products" element={<SessionProducts />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/products" element={<Products />} />
            <Route path="/myrooms" element={<MyRooms />} />
            <Route path="/chat/:roomId" element={<Chat />} />
            <Route
              path="/adminpanel"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </ChakraProvider>
  );
};

export default App;
