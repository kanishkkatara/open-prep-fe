// src/index.tsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { UserProvider } from './context/UserContext';
import { PostHogProvider} from 'posthog-js/react'
import 'katex/dist/katex.min.css';

const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider 
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY || ''}
      options={options}
    >
      <BrowserRouter>
        <UserProvider>
          <App />
        </UserProvider>
      </BrowserRouter>
    </PostHogProvider>
  </StrictMode>
);
