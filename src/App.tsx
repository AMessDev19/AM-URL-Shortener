import { ThemeProviderCustom } from '../contexts/ThemeContext';
import MainComponent from './MainComponent';

const App: React.FC = () => {
    return (
        <ThemeProviderCustom>
            <MainComponent />
        </ThemeProviderCustom>
    );
};

export default App;
