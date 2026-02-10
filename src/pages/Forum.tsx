import { useState, useEffect } from 'react';
import axios from 'axios';
import FeaturedPost from '../components/FeaturedPost';
import PostList from '../components/PostList';
import type { FrontendPost } from '../types/PostType';
import './Forum.css';

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

const convertPostFromAPI = (apiData: any): FrontendPost => {
  return {
    id: apiData.postId,
    title: apiData.title,
    body: apiData.body,
    imageUrl: apiData.imageUrl,
    category: apiData.category,
    userId: apiData.user_id,
    createdAt: apiData.createdAt
  };
};

const fetchPostsAPI = (endpoint: string) => {
  return axios.get(`${backendUrl}${endpoint}`)
    .then(response => {
      console.log(`>>> [DEBUG] Endpoint: ${endpoint}`);
      console.log(`>>> [TYPE]:`, typeof response.data);
      console.log(`>>> [DATA]:`, response.data); 

      const postData = response.data;

      if (postData && Array.isArray(postData)) {
        return postData.map(convertPostFromAPI);
      } 
      
      if (postData && typeof postData === 'object') {
        const nestedData = postData.posts || postData.data || [];
        console.log(`>>> [NESTED DATA FOUND]:`, nestedData);
        return nestedData.map(convertPostFromAPI);
      }

      return [];
    })
    .catch(error => {
      console.log(`>>> [ERROR] ${endpoint}:`, error);
      return [];
    });
};

// const fetchPostsAPI = (endpoint: string) => {
//   return axios.get(`${backendUrl}${endpoint}`)
//     .then(response => {
//       console.log(`--- Debug: Data from ${endpoint} ---`);
//       console.log(response.data);
//       const postData = response.data;
//       return postData.map(convertPostFromAPI);
//     })
//     .catch(error => {
//       console.log(error);
//       return [];
//     });
// };

const Forum: React.FC = () => {
  const [featuredPosts, setFeaturedPosts] = useState<FrontendPost[]>([]);
  const [travelPosts, setTravelPosts] = useState<FrontendPost[]>([]);
  const [creditCardPosts, setCreditCardPosts] = useState<FrontendPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const savedUser = localStorage.getItem('user');
  const isLoggedIn = !!savedUser;

useEffect(() => {
    setIsLoading(true);

    Promise.all([
        fetchPostsAPI('/posts/featured'),
        fetchPostsAPI('/posts/travel-preview'),
        fetchPostsAPI('/posts/creditcard-preview')
    ])
    .then(([featured, travel, creditcard]) => {
      setFeaturedPosts(featured);
      setTravelPosts(travel);
      setCreditCardPosts(creditcard);
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <div className="forum-loading">Loading...</div>;
  }

  return (
    <div className="forum-main-container">
      <section className="featured-section">
        <h2 className="section-header">Featured Posts</h2>
        <FeaturedPost posts={featuredPosts} />
      </section>

      <div className="forum-grid">
        <div className="grid-column">
          <PostList 
            title="Travel" 
            posts={travelPosts} 
            categoryKey="Travel" 
            isLoggedIn={isLoggedIn} 
          />
        </div>
        
        <div className="grid-column">
          <PostList 
            title="Credit Card" 
            posts={creditCardPosts} 
            categoryKey="Credit Card" 
            isLoggedIn={isLoggedIn} 
          />
        </div>
      </div>
    </div>
  );
}

export default Forum;