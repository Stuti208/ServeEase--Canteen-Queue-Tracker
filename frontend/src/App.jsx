import { useState } from 'react'
import { RouterProvider, createBrowserRouter } from "react-router";
import Login from "./pages/Login"
import ProtectedRoute from './pages/Home/ProtectedRoute';
import Home from './pages/Home/Home';
import DashBoard from './pages/DashBoard';
import Orders from './pages/Orders/Orders';
import Feedback from './pages/Feedback';
import Menu from "./pages/Menu/Menu"
import './App.css'
import Settings from './pages/Settings';


function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login/>
    },

    {
      path: "/home",
      element: <ProtectedRoute><Home /></ProtectedRoute>,
      
      children: [
        { index:true, element: <DashBoard /> },
        { path:'dashboard', element: <DashBoard /> },
        { path: 'orders', element: <Orders /> },
        { path: 'menu', element: <Menu /> },
        { path: 'feedback', element: <Feedback /> },
        { path: 'settings', element: <Settings/> }
      ],
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
