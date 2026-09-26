import React from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import App from './App';
import './styles.css';
const node=document.getElementById('root')!;
const state=JSON.parse(document.getElementById('page-state')?.textContent || '{}');
const app=<App initialPath={state.path || '/'} />;
if(node.innerHTML.includes('data-app')) hydrateRoot(node,app); else createRoot(node).render(app);
