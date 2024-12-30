import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/posts/${id}`);
        setTitle(res.data.post.title);
        setContent(res.data.post.content);
        if (res.data.post.image) {
          setImagePreview(`${apiUrl}${res.data.post.image}`);
        }
        setLastUpdated(res.data.post.updatedAt || res.data.post.createdAt);
      } catch (err) {
        console.error("Error fetching post", err);
      }
    };
    fetchPost();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      await axios.put(`${apiUrl}/api/posts/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Post updated successfully");
      navigate("/");
    } catch (err) {
      console.error("Error updating post:", err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${apiUrl}/api/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Post deleted successfully");
        navigate("/");
      } catch (err) {
        console.error("Error deleting post:", err);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <form onSubmit={handleUpdate} className="bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-white mb-4">Edit Post</h2>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-700 focus:ring focus:ring-purple-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-700 focus:ring focus:ring-purple-500"
            rows="5"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Image</label>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Selected Preview"
              className="w-full h-40 object-cover mb-2 rounded-md"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 rounded-md border border-gray-700 focus:ring focus:ring-purple-500"
          />
        </div>
        {lastUpdated && (
          <p className="text-gray-400 text-sm mb-4">
            Last updated: {new Date(lastUpdated).toLocaleDateString()} at {" "}
            {new Date(lastUpdated).toLocaleTimeString()}
          </p>
        )}
        <div className="flex justify-between">
          <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-500">
            Update
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPost;
