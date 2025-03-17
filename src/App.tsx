import { ThemeProviderCustom } from '../contexts/ThemeContext';  // Correct import
import MainComponent from './MainComponent';  // Correct import

const App: React.FC = () => {
    return (
        <ThemeProviderCustom>
            <MainComponent />
        </ThemeProviderCustom>
    );
};

export default App;
