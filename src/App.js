import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './Home';
import Details from './components/Details';
import Login from './Login';
import Register from './Register';
import Cart from './components/cart';
import ListIPhone from './components/ListIPhone';
import ListiPad from './components/ListiPad';
import ListDongHo from './components/ListDongho';
function App() {
  return (
    <div className="App">
      <BrowserRouter basename='/'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:type" element={<Home />} />
          <Route path="/product/:name" element={<Details />} /> 
          <Route path="/iPhone" element={<ListIPhone/>} />
          <Route path="/iPad" element={<ListiPad/>} />
          <Route path="/AppleWatch" element={<ListDongHo/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
