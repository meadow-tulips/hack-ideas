import { useContext } from 'react';
import { ProfileContext } from '../../contexts/profileContext';
import './index.css';

const OverlayLoader = () => {
    const _profileContext = useContext(ProfileContext);

    return _profileContext.loading ? <div className="overlay">
                <div className="overlay__inner">
                    <div className="overlay__content">
                        <span className="spinner"></span>
                    </div>
                </div>
        </div> : null
}

export default OverlayLoader;