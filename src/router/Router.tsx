import React from "react";
import { createHashRouter } from "react-router-dom";
import Main from "../page/main";

const Router = createHashRouter([
  {
    path: "/",
    element: <Main />,
  },
]);

export default Router;
