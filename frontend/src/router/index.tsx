import { createBrowserRouter, Outlet } from "react-router-dom";
import MoviesPage from "../pages/Movies";
import { Header } from "../components";

const RootLayout = () => (
  <div className="min-h-screen bg-gray-900 text-white">
    <Header />
    <Outlet />
  </div>
);

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
