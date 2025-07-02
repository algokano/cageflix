import { Link } from "react-router-dom";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const Header = ({ searchTerm, setSearchTerm }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-wide">
          Cageflix
        </Link>
        {/* <nav className="space-x-4">
          <Link to="/favorites" className="hover:underline">
            Favorites
          </Link>
        </nav> */}
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-1 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </header>
  );
};

export default Header;
