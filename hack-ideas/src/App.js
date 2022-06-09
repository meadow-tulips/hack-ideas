import './App.css';
import GlobalProfileContext from './contexts/profileContext';
import ErrorBoundary from './pages/errorBoundary';
import AppRoutes from './routes';
import OverlayLoader from "./components/OverlayLoader"
import GlobalChallengesContext from './contexts/challengesContext';

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <GlobalProfileContext>
          <GlobalChallengesContext>
            <AppRoutes />
            <OverlayLoader />
          </GlobalChallengesContext>
        </GlobalProfileContext>
      </div>
    </ErrorBoundary>
  );
}

export default App;
