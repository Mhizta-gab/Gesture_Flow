
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import { DetectionProvider } from './context/DetectionContext';

const clerkFrontendApi = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY; // Get this from Clerk dashboard

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ClerkProvider publishableKey={clerkFrontendApi}>
    <DetectionProvider>
      <App />
    </DetectionProvider>
  </ClerkProvider>
);