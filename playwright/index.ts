// Import styles, initialize component theme here.
// import '../src/common.css';
import '../src/index.scss';
import { createRoot } from 'react-dom/client';
import Site from '../src/index';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(Site());