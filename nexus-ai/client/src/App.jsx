import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Agent from './pages/Agent';
import ProjectBuilder from './pages/ProjectBuilder';
import ProjectDetails from './pages/ProjectDetails';
import Settings from './pages/Settings';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    return user ? (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />
            <main className="flex-1">
                {children}
            </main>
        </div>
    ) : <Navigate to="/login" />;
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/agent" element={<PrivateRoute><Agent /></PrivateRoute>} />
                    <Route path="/build" element={<PrivateRoute><ProjectBuilder /></PrivateRoute>} />
                    <Route path="/projects/:id" element={<PrivateRoute><ProjectDetails /></PrivateRoute>} />
                    <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                    
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
