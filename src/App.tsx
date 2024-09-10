import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import Router from "./router/Router";

function App() {
  return <RouterProvider router={Router} />;
}

export default App;
