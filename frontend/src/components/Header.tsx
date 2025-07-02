import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-wide">
          Cageflix
        </Link>
        <nav className="space-x-4">
          <Link to="/favorites" className="hover:underline">
            Favorites
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
