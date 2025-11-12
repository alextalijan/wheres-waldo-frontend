import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import PlayPage from './components/PlayPage/PlayPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play/:pictureName" element={<PlayPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
