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
import TrainingCalendar from './components/TrainingCalendar';
import { AppBar, Toolbar, Button } from '@mui/material';


function App() {
  const location = useLocation();
  return (
    <div className="App">
      <AppBar position='static'>
        <Toolbar>
          <Button component={Link} to="/traininglist" color="inherit">
            Trainings
          </Button>
          <Button component={Link} to="/customerlist" color="inherit">
            Customers
          </Button>
          <Button component={Link} to="/trainingCalendar" color="inherit">
            Calendar
          </Button>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/traininglist" element={<Traininglist key={location.key} />} />
        <Route path="/customerlist" element={<Customerlist />} />
        <Route path="/trainingCalendar" element={<TrainingCalendar />} />
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
