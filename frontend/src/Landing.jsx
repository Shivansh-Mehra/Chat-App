import NavBar from "./Components/NavBar";
import Footer from './Components/Footer';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  function handleViewChat() {
    navigate('/view');
  }
  return (
    <div>
        <NavBar />
        <div className="landing-container">
            <h1 className="text-4xl font-bold text-center mt-20">Chat App</h1>
            <p className="text-center mt-3 text-lg">Create personalised chat rooms and chat with your friends or co-workers</p>
            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mt-4"
            onClick={handleViewChat}>View Chat Rooms</button>
            <div className="image-container">
                <img className="landing-image" src="https://ideogram.ai/assets/progressive-image/balanced/response/-2VXsVQpTVmGLWKvHrYt6w" alt="" />
            </div>
    </div>
    <Footer />
    </div>
  );
}