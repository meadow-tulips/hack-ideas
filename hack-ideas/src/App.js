import './App.css';
import GlobalProfileContext from './contexts/profileContext';
import AppRoutes from './routes';

function App() {
  return (
    <div className="App">
      <GlobalProfileContext>
        <AppRoutes />
      </GlobalProfileContext>
    </div>
  );
}

export default App;
