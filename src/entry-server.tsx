import {renderToString} from 'react-dom/server';
import App from './App';
import {PerformanceProvider} from './Performance';
export function render(path:string){return renderToString(<PerformanceProvider><App initialPath={path} /></PerformanceProvider>);}
