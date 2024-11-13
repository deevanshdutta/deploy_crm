import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Segments from './pages/Segments';
import Campaigns from './pages/Campaigns';
import Customers from './pages/Customers';
import Login from './pages/login';
import ProtectedRoute from './components/protectedRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <GoogleOAuthProvider clientId="596567276646-lsn3nh5g4bqhg01a1oi25ilvq1fmr8b9.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <main className="container mx-auto px-4 py-8">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/segments" element={<Segments />} />
                        <Route path="/campaigns" element={<Campaigns />} />
                        <Route path="/customers" element={<Customers />} />
                      </Routes>
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;