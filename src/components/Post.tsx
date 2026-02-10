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

const fetchSinglePostAPI = async (id: string): Promise<PostDetails | null> => {
 
  if (!id || id === "undefined") {
    console.error("fetchSinglePostAPI blocked: ID is undefined");
    return null;
  }

  try {
    const response = await axios.get(`${backendUrl}/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching single post:", error);
    return null;
  }
};

const emptyPost: PostDetails = {
    id: 0,
    title: 'Loading...',
    body: '',
    imageUrl: '',
    category: '',
    userId: ''
};

const PostDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>(); 
    const navigate = useNavigate();
    
    const [post, setPost] = useState<PostDetails>(emptyPost);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {

        if (!id || id === "undefined") {
            console.warn("Invalid ID detected in URL, redirecting...");
            navigate(-1); 
            return;
        }

        setLoading(true);
        fetchSinglePostAPI(id).then(data => {
            if (data) {
                setPost(data);
            } else {
            
                navigate('/');
            }
            setLoading(false);
        });
    }, [id, navigate]);

    if (loading) {
        return <div id="loading-spinner">Loading Post Content...</div>;
    }

    return (
        <main id="post-detail-layout">
            <header className="post-header-section">
                <h1 className="main-title">{post.title}</h1>
                <div className="post-info-line">
                    <span className="cat-badge">{post.category || 'Uncategorized'}</span>
                    <span className="user-id-text">Author ID: {post.userId || 'Anonymous'}</span>
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