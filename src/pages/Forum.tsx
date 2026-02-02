import { useState, useEffect } from 'react';
import axios from 'axios';
import FeaturedPost from '../components/FeaturedPost';
import type { FrontendPost } from '../types/PostType';

const VITE_APP_BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

const Forum: React.FC = () => {
  const [featuredPosts, setFeaturedPosts] = useState<FrontendPost[]>([]);
  const [travelPosts, setTravelPosts] = useState<FrontendPost[]>([]);
  const [creditCardPosts, setCreditCardPosts] = useState<FrontendPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      const fetchPosts = async (endpoint: string) => {
        try {
          const response = await axios.get(`${VITE_APP_BACKEND_URL}${endpoint}`);
          return response.data.content || [];
        } catch (error) {
          console.error(error);
          return [];
        }
      };
      
      const [featured, travel, credit] = await Promise.all([
        fetchPosts('/posts/featured'),
        fetchPosts('/posts/travel-preview'),
        fetchPosts('/posts/creditcard-preview')
      ]);
      setFeaturedPosts(featured);
      setTravelPosts(travel);
      setCreditCardPosts(credit);
      setIsLoading(false);
    };
    loadAllData();
  }, []);

  if (isLoading) return <div className="text-center mt-5">Loading posts...</div>;

  return (
    <div className="all-session" style={{ marginTop: '80px' }}>
        <div className="feature-post-session">
            <h1>Featured Posts</h1>
            <FeaturedPost posts={featuredPosts} />
        </div>

        <div className="sub-session">
            <div className="travel-post-container">
                <h1>Travel</h1>
                <button>+</button>
                {travelPosts.length > 0 ? (
                  travelPosts.map((post) => (
                    <div key={post.id}>
                      <ul>{post.title}</ul>
                    </div>
                  ))
                ) : <p>No travel posts found.</p>}
            </div>

            <div className="credit-card-post-container">
                <h1>Credit Card</h1>
                <button>+</button>
                {creditCardPosts.length > 0 ? (
                  creditCardPosts.map((post) => (
                    <div key={post.id}>
                      <ul>{post.title}</ul>
                    </div>
                  ))
                ) : <p>No credit card posts found.</p>}
            </div>
        </div>
    </div>
  );
};

export default Forum;