import { useState, useEffect } from 'react';
import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from './layout/Navbar';
import axios from 'axios';

const VITE_APP_BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL

const getFeaturePostsAPI = () => {
  return axios.get(`${VITE_APP_BACKEND_URL}/posts/featured`)
  .then(response => response.data)
  .catch(error => console.log(error));
  }

const getTravelCategoryPostsAPI = () => {
  return axios.get(`${VITE_APP_BACKEND_URL}/posts?category=Travel`)
  .then(response => response.data)
  .catch(error => console.log(error))
}

const getCreditCardCategoryPostsAPI = () => {
  return axios.get(`${VITE_APP_BACKEND_URL}/posts?category=Credit%20Card`)
  .then(response => response.data)
  .catch(error => console.log(error))
}


const App: React.FC = () => {

  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);
  const [travelPosts, setTravelPosts] = useState<any[]>([]);
  const [creditCardPosts, setCreditCardPosts] = useState<any[]>([]);


  useEffect(() => {

  })

  return (
    <>
        <Navbar/>
        <header>I am Content</header>

    </>

  )
}

export default App
