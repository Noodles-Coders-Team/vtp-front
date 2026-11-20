import {createRoot} from 'react-dom/client'
import {BrowserRouter} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/js/dist/drawer.js";
import "bootstrap/js/dist/tooltip.js";
import "bootstrap/js/dist/combobox.js";
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>,
)
