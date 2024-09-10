import React from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider } from "react-router-dom";
import Router from "./router/Router";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={Router} />
      {/*<ReactQueryDevtools initialIsOpen={true} />*/}
    </QueryClientProvider>
  );
}

export default App;
