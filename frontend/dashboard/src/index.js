import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css';
import App from './App';
import LoginForm from '../src/Register/LoginForm';
import RegisterForm from './Register/RegisterForm';
import UserProfile from './Register/UserProfile';
import Dashboard from './PrincipalDashboard/Dashboard';
import Sidebar from './SideBar/Sidebar';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <App/>
    ),
  },
  {
    path: "RegisterForm",
    element: <RegisterForm/>
  },
  {
    path: "LoginForm",
    element: <LoginForm/>
  },
  {
    path: "UserProfile",
    element: <UserProfile/>
  },
  {
    path: "Dashboard",
    element: <Dashboard/>
  },
  {
    path: "Sidebar",
    element: <Sidebar/>
  }

])


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
