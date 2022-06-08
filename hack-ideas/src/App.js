import './App.css';
import GlobalProfileContext from './contexts/profileContext';
import ErrorBoundary from './pages/ErrorBoundary';
import AppRoutes from './routes';

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <GlobalProfileContext>
          <AppRoutes />
        </GlobalProfileContext>
      </div>
    </ErrorBoundary>
  );
}

export default App;
