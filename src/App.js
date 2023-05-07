import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";
import "./index.css";
import Traininglist from './components/Traininglist';
import Customerlist from './components/Customerlist';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';


function App() {
  return (
    <div className="App">
      <AppBar position='static'>
        <Toolbar>
        </Toolbar>
      </AppBar>
      <BrowserRouter>
        <Link to="/traininglist">Traininglist</Link>{' '}
        <Link to="/customerlist">Customerlist</Link>{' '}
        <Routes>
          <Route path="/traininglist" element={<Traininglist />} />
          <Route path="/customerlist" element={<Customerlist />} />
          <Route path="*" element={<Traininglist />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}


export default App;
