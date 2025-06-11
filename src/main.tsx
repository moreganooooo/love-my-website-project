import 'intersection-observer'; // Polyfill for Safari & older browsers
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
