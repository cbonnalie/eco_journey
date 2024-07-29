import { Routes, Route } from "react-router-dom";
import Login from "./Components/pages/Login";
import Register from "./Components/pages/Register";
import ForgotPassword from "./Components/pages/ForgotPassword";
import Home from "./Components/pages/Home";
const LoginPage = () => Login();
const ForgotPage = () => ForgotPassword();
const RegisterPage = () => Register();
const HomePage = () => Home();

export const AppRoutes = () => {
    return (
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/home" element={<HomePage />} />
            </Routes>
    );
};