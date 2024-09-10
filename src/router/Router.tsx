import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Main from "../page/main";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
]);

export default Router;
