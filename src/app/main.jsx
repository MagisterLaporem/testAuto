import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { store } from './store.js';
import { PartsSearchPage } from '../pages/parts-search/index.js';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PartsSearchPage />
    </Provider>
  </StrictMode>,
);
