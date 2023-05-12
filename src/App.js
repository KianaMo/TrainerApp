import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";
import "./index.css";
import Traininglist from './components/Traininglist';
import Customerlist from './components/Customerlist';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';


function App() {
  const location = useLocation();
  return (
    <div className="App">
      <AppBar position='static'>
        <Toolbar>
        </Toolbar>
      </AppBar>
      <Link to="/traininglist">List of All Trainings</Link>{' '}
      <Link to="/customerlist">List of Customers</Link>{' '}
      <Routes>
        <Route path="/traininglist" element={<Traininglist key={location.key} />} />
        <Route path="/customerlist" element={<Customerlist />} />
        <Route path="*" element={<Traininglist />} />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}


export default AppWrapper;
