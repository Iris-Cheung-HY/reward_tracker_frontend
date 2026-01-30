import type { FrontendPost } from './types/PostType';
import './FeaturedPost.css';

interface Props {
  posts: FrontendPost[];
}

function FeaturedPost({posts}: Props) {
  return (
    <div className="featured-container">
      <div className="images-wrapper">
        {posts.slice(0,3).map(post => (
          <img 
            key={post.id} 
            src={post.imageUrl} 
            alt={post.title}
            className="featured-image"
          />
        ))}
      </div>
    </div>
  );
}

export default FeaturedPost;
