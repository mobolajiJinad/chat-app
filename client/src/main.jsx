import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Signup from "./pages/Signup/Signup";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/auth/signup",
    element: <Signup />,
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
