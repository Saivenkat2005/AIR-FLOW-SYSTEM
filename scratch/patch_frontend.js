const fs = require('fs');
const path = require('path');

const baseDir = "c:\\Resume\\ECommerce\\Airline-Booking 2 - Copy";
const frontendDir = path.join(baseDir, "Frontend");
const srcDir = path.join(frontendDir, "src");

if (!fs.existsSync(srcDir)) {
    console.error("Frontend/src directory not found! Please ensure the React source code is available.");
    process.exit(1);
}

const contextDir = path.join(srcDir, "context");
if (!fs.existsSync(contextDir)) fs.mkdirSync(contextDir, { recursive: true });

fs.writeFileSync(path.join(contextDir, "AuthContext.jsx"), `import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:4000/api/auth/me', { headers: { Authorization: \`Bearer \${token}\` } })
                .then(res => setUser(res.data))
                .catch(() => {
                    localStorage.removeItem('token');
                    setUser(null);
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const res = await axios.post('http://localhost:4000/api/auth/login', { email, password });
        localStorage.setItem('token', res.data.accessToken);
        setUser(res.data);
    };

    const signup = async (username, email, password, phone) => {
        await axios.post('http://localhost:4000/api/auth/signup', { username, email, password, phone, role: ['USER'] });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
`);

console.log("AuthContext created in Frontend/src/context/AuthContext.jsx");
