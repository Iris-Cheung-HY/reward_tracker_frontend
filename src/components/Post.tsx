import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Post.css';


const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

export interface PostDetails {
    id: number;
    title: string;
    body: string;
    imageUrl: string; 
    category: string;
    userId?: string; 
}

const fetchSinglePostAPI = (id: string) => {
  return axios.get(`${backendUrl}/posts/${id}`)
    .then(response => {
      return response.data; 
    })
    .catch(error => {
      console.log(error);
    });
};

const emptyPost: PostDetails = {
    id: 0,
    title: '',
    body: '',
    imageUrl: '',
    category: '',
    userId: ''
};

const PostDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<PostDetails>(emptyPost);

    useEffect(() => {
        if (!id) return;

        fetchSinglePostAPI(id).then(data => {
            if (data) {
                setPost(data);
            } else {
                navigate('/');
            }
        });
    }, [id]);

    if (!post) return <div id="loading-spinner">Loading...</div>;

    return (
        <main id="post-detail-layout">
        <header className="post-header-section">
            <h1 className="main-title">{post.title}</h1>
            <div className="post-info-line">
            <span className="cat-badge">{post.category}</span>
            <span className="user-id-text">User ID: {post.userId}</span>
            </div>
        </header>

        {post.imageUrl && (
            <div className="featured-image-box">
            <img src={post.imageUrl} alt={post.title} />
            </div>
        )}

        <article id="post-text-content">
            {post.body}
        </article>

        <div className="action-area">
            <button className="back-link-btn" onClick={() => navigate(-1)}>
            ← Back to Forum
            </button>
        </div>
        </main>
    );
    };

export default PostDetail;