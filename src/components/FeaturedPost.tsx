import { useNavigate } from 'react-router-dom';
import type { FrontendPost } from '../types/PostType';
import './FeaturedPost.css';

interface Props {
  posts: FrontendPost[];
}

function FeaturedPost({ posts }: Props) {
  const navigate = useNavigate();

  return (
    <div className="featured-container">
      <div className="images-wrapper">
        {posts.slice(0, 3).map(post => (
          <img 
            key={post.id} 
            src={post.imageUrl} 
            alt={post.title}
            className="featured-image"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/posts/${post.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
export default FeaturedPost;