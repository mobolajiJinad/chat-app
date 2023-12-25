import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Root from "./pages/Root/Root";
import Index from "./pages/Root/Index";
import Chat from "./pages/Root/Chat";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Index /> },
      { path: "chat/:chatID", element: <Chat /> },
    ],
  },
  {
    path: "/auth/signup",
    element: <Signup />,
  },
  {
    path: "/auth/login",
    element: <Login />,
  },
  // {
  //   path: "*",
  //   element: <PageNotFound />,
  // },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
