import { useState } from 'react'
import { RouterProvider, createBrowserRouter } from "react-router";
import Login from "./pages/Login"
import ProtectedRoute from './pages/Home/ProtectedRoute';
import Home from './pages/Home/Home';
import './App.css'


function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login/>
    },

    {
      path: "/home",
      element: <ProtectedRoute><Home/></ProtectedRoute>
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
