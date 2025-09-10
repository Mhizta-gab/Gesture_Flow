// import React, { useState } from 'react';
import './index.css';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import LandingPage from './pages/LandingPage';

import Dashboard from './pages/Dashboard';
import DetectionPage from './pages/DetectionPage';
import HistoryPage from './pages/HistoryPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminCourseEditor from './pages/AdminCourseEditor';
// import { AuthProvider } from './context/AuthContext';/
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
// import { DetectionProvider } from './context/DetectionContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route
            path="/dashboard"
            element={
              <SignedIn>
                <Dashboard />
              </SignedIn>
            }
          />
          <Route
            path="/detection"
            element={
              <SignedIn>
                <DetectionPage />
              </SignedIn>
            }
          />
          <Route
            path="/history"
            element={
              <SignedIn>
                <HistoryPage />
              </SignedIn>
            }
          />
          <Route
            path="/admin"
            element={
              <SignedIn>
                <AdminDashboard />
              </SignedIn>
            }
          />
          <Route
            path="/admin/course/:courseId"
            element={
              <SignedIn>
                <AdminCourseEditor />
              </SignedIn>
            }
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </BrowserRouter>
      <ToastContainer 
        position="bottom-center" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover
        limit={1}
      />
    </>
  );
}

export default App;