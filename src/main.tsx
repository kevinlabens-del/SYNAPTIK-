import {createRoot} from 'react-dom/client';
import App from './app/App';
import './styles/main.css';
createRoot(document.getElementById('root')!).render(<App/>);
if('serviceWorker' in navigator&&import.meta.env.PROD){window.addEventListener('load',()=>{navigator.serviceWorker.register('./sw.js').then(reg=>{reg.addEventListener('updatefound',()=>{const sw=reg.installing;sw?.addEventListener('statechange',()=>{if(sw.state==='installed'&&navigator.serviceWorker.controller){const button=document.createElement('button');button.className='update-banner';button.textContent='Mise à jour prête · recharger après votre session';button.onclick=()=>{sw.postMessage('ACTIVATE');location.reload()};document.body.append(button)}})})}).catch(console.error)})}
