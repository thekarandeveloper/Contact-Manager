import "./App.css";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import Modal from "./components/Modal"
import './index.css';
function App() {
  return (
    <div className="App">
      <Navbar />
      <HomePage />
      <Modal/>
    </div>
  );
}

export default App;
