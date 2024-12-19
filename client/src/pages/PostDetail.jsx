import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("Error fetching post", err);
      }
    };
    fetchPost();
  }, [id]);

  if (!post) return <div className="text-center text-gray-600">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-4xl font-semibold text-gray-800 mb-4">{post.title}</h2>
        <p className="text-gray-600 mb-4">By <span className="font-medium text-blue-600">{post.author.username}</span></p>
        <p className="text-gray-700">{post.content}</p>
      </div>
    </div>
  );
}

export default PostDetail;
