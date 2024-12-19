import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
        setPost(res.data.post); // Ensure you access the `post` object in the response
      } catch (err) {
        console.error("Error fetching post", err);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        // Handle potential parsing errors gracefully (e.g., clear invalid data)
      }
    }
  }, []);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Post deleted successfully");
        navigate("/");
      } catch (err) {
        console.error("Error deleting post", err);
      }
    }
  };

  if (!post) return <div className="text-center text-gray-600">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-4xl font-semibold text-gray-800 mb-4">{post.title}</h2>
        {post.author && (
          <p className="text-gray-600 mb-4">
            By <span className="font-medium text-blue-600">{post.author.username}</span>
          </p>
        )}
        <p className="text-gray-500 text-sm mb-4">
          Published on: {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString()}
        </p>
        <p className="text-gray-700">{post.content}</p>
        {post && user && user.id === post.author._id && (
          <div className="mt-4">
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded mr-4"
            >
              Delete Post
            </button>
            <button
              onClick={() => navigate(`/edit/${post._id}`)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Edit Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostDetail;
