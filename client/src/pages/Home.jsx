import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/posts`);
        setPosts(res.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${apiUrl}/api/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(posts.filter((post) => post._id !== postId));
        alert("Post deleted successfully");
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Blog Posts</h1>
      {loading ? (
        <p className="text-center text-gray-600">Loading posts...</p>
      ) : posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post._id} className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              <img
                  src={`${apiUrl}${post.image}`}
                  alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{post.content.substring(0, 100)}...</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-3 flex justify-between items-center">
                  <Link
                    to={`/posts/${post._id}`}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Read More
                  </Link>
                  {user && user.id === post.author._id && (
                    <div className="flex space-x-3">
                      <Link
                        to={`/edit/${post._id}`}
                        className="text-green-600 text-sm hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="text-red-600 text-sm hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600">
          {user ? (
            <>
              <p>No posts available. Create the first post now!</p>
              <Link
                to="/create"
                className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-500 transition"
              >
                Create Post
              </Link>
            </>
          ) : (
            <p>No posts available. Log in to create posts!</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
