import './App.css';
import Navigation from './components/navigation/navigation';
import NotFound from './pages/notFound/notFound';
import Customers from './pages/customers/customers';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <Routes>
          <Route path='/' element={<Customers />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
