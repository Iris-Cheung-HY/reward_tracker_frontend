import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./PostList.css"

export interface PostItem {
    id: number;
    title: string;
    body: string;
    imageUrl?: string; 
    category?: string;
    userId?: string;
    createdAt?: string;
}

interface PostListProps {
    title: string;
    categoryKey: string;
    isLoggedIn: boolean;
    posts: PostItem[];
}

const PostList: React.FC<PostListProps> = ({ title, categoryKey, isLoggedIn, posts }) => {
  const navigate = useNavigate();

  return (
    <div id="post-list-container">
      <div id="post-list-header">
        <h3 id="category-title">
            <i className={`bi ${categoryKey === 'Travel' ? 'bi-airplane' : 'bi-credit-card'}`}></i>
            {title}
        </h3> 
        
        {isLoggedIn && (
          <button 
            id="create-post-button"
            onClick={() => navigate(`/posts/new?category=${categoryKey}`)}
          >
            + Post
          </button>
        )}
      </div>
      
      <div id="posts-wrapper">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <div 
              key={post.id} 
              className="post-card" 
              onClick={() => {
                if(post.id) {
                  navigate(`/posts/${post.id}`);
                }
              }}
            >
              <div className="post-card-top">
                <span className="post-card-title">{post.title}</span>
                {post.createdAt && (
                    <small className="post-card-date">
                        {new Date(post.createdAt).toLocaleDateString()}
                    </small>
                )}
              </div>
              <p className="post-card-body">
                {post.body.substring(0, 60)}...
              </p>
            </div>
          ))
        ) : (
          <div id="empty-state">
            <p>No posts in {title} yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostList;