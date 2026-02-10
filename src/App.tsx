import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from './layout/Navbar';
import axios from 'axios';
import Forum from './pages/Forum';
import Summary from './pages/Summary';
import CardDetail from './pages/CardDetail';
import Post from './components/Post'
import NewPostForm from './components/NewPostForm';


const App: React.FC = () => {

  return (
    <>
    <main className="maincontent">
      <Router>
        <Navbar/>
        <Routes>
          <Route path ="/" element={<Forum />} />
          <Route path="/posts/new" element={<NewPostForm />} />
          <Route path="/posts/:id" element={<Post />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/card/:cardId" element={<CardDetail />} />
        </Routes>
      </Router>
    </main>
    </>

  );
};

export default App;