import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-semibold">MyBlog</Link>
        
        <ul className="flex space-x-6 text-white">
          <li>
            <Link to="/" className="hover:text-gray-300 transition duration-200">Home</Link>
          </li>
          
          {!localStorage.getItem("token") ? (
            <>
              <li>
                <Link to="/login" className="hover:text-gray-300 transition duration-200">Login</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-gray-300 transition duration-200">Register</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/create-post" className="hover:text-gray-300 transition duration-200">Create Post</Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:text-gray-300 transition duration-200 bg-red-500 py-1 px-4 rounded-md text-white"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;