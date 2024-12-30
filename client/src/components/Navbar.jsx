import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const profilePictureUrl = profilePicture ? `${apiUrl}${profilePicture}` : null;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.username);
      setProfilePicture(user.profilePicture);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUsername(null);
    setProfilePicture(null);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-semibold">
          MyBlog
        </Link>

        <ul className="flex items-center space-x-6 text-white">
          <li>
            <Link to="/" className="hover:text-gray-400 transition">
              Home
            </Link>
          </li>

          {!localStorage.getItem("token") ? (
            <>
              <li>
                <Link to="/login" className="hover:text-gray-400 transition">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-gray-400 transition">
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/create-post" className="hover:text-gray-400 transition">
                  Create Post
                </Link>
              </li>

              <li className="relative">
                <button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {profilePictureUrl && (
                    <img
                      src={profilePictureUrl}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-gray-700"
                    />
                  )}
                  <span className="text-gray-300 font-medium">
                    Hi, {username}!
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {menuOpen && (
                  <ul className="absolute right-0 mt-2 bg-gray-800 text-gray-300 shadow-md rounded-md w-40">
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-gray-700 transition"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-700 transition"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
