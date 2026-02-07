import { useState, useEffect } from 'react';
import axios from 'axios';
import FeaturedPost from '../components/FeaturedPost';
import PostList from '../components/PostList';
import type { FrontendPost } from '../types/PostType';

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

const Forum: React.FC = () => {
  const [featuredPosts, setFeaturedPosts] = useState<FrontendPost[]>([]);
  const [travelPosts, setTravelPosts] = useState<FrontendPost[]>([]);
  const [creditCardPosts, setCreditCardPosts] = useState<FrontendPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const savedUser = localStorage.getItem('user');
  const isLoggedIn = !!savedUser;

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      const fetchPosts = async (endpoint: string) => {
        try {
          const response = await axios.get(`${backendUrl}${endpoint}`);
          return response.data.content || response.data || [];
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
    <div className="container" style={{ marginTop: '100px' }}>
      <section className="feature-post-session mb-5">
        <h1 className="mb-4">Featured Posts</h1>
        <FeaturedPost posts={featuredPosts} />
      </section>

      <section className="sub-session row">
        <div className="col-md-6">
          <PostList 
            title="Travel" 
            posts={travelPosts} 
            categoryKey="Travel" 
            isLoggedIn={isLoggedIn} 
          />
        </div>
        <div className="col-md-6">
          <PostList 
            title="Credit Card" 
            posts={creditCardPosts} 
            categoryKey="Credit Card" 
            isLoggedIn={isLoggedIn} 
          />
        </div>
      </section>
    </div>
  );
};

export default Forum;