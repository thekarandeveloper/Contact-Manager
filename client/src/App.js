import logo from './logo.svg';
import './App.css';
import HomePage from './pages/HomePage';
function App() {
  return (
    <div className="App">
     <HomePage/>
    </div>
  );
}

export default App;
// import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
// import HomePage from './pages/HomePage';
// import './App.css'

// function App() {
//   return(
//     <Router>
//       <Routes><Route path='/' element={<HomePage/>}/></Routes>
//     </Router>
//   )
// }

// export default App;