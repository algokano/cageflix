import { createBrowserRouter, Outlet } from "react-router-dom";
import MoviesPage from "../pages/Movies";
import { Header } from "../components";
import { useState } from "react";

const RootLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Outlet context={{ searchTerm, setSearchTerm }} />
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <MoviesPage />,
      },
    ],
  },
]);
