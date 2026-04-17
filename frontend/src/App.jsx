import { useState } from 'react'
import { RouterProvider, createBrowserRouter } from "react-router"
import { NotificationProvider } from './context/NotificationContext'
import Login from "./pages/Login"
import ProtectedRoute from './pages/Home/ProtectedRoute'
import Home from './pages/Home/Home'
import DashBoard from './pages/DashBoard'
import Orders from './pages/Orders/Orders'
import Feedback from './pages/Feedback'
import Menu from "./pages/Menu/Menu"
import Settings from './pages/Settings'
import AdminHome from "./pages/Admin/AdminHome"
import AdminProtectedRoute from "./pages/Admin/AdminProtectedRoute"
import AdminDashboard from "./pages/admin_pages/AdminDashboard"
import AdminOrders from "./pages/admin_pages/AdminOrders"
import AdminMenu from "./pages/admin_pages/AdminMenu"
import AdminFeedback from "./pages/admin_pages/AdminFeedback"
import './App.css'

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />
    },
    {
      path: "/home",
      element: <ProtectedRoute><NotificationProvider><Home /></NotificationProvider></ProtectedRoute>,
      children: [
        { index: true, element: <DashBoard /> },
        { path: 'dashboard', element: <DashBoard /> },
        { path: 'orders', element: <Orders /> },
        { path: 'menu', element: <Menu /> },
        { path: 'feedback', element: <Feedback /> },
        { path: 'settings', element: <Settings /> }
      ]
    },
    {
      path: "/admin",
      element: <AdminProtectedRoute><AdminHome /></AdminProtectedRoute>,
      children: [
        { index: true, element: <AdminDashboard /> },
        { path: 'dashboard', element: <AdminDashboard /> },
        { path: 'orders', element: <AdminOrders /> },
        { path: 'menu', element: <AdminMenu /> },
        { path: 'feedback', element: <AdminFeedback /> }
      ]
    }
  ])

  return <RouterProvider router={router} />
}

export default App
