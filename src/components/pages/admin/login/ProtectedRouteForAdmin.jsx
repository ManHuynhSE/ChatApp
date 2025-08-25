import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../../../../firebase/FirebaseConfig"; // Đường dẫn đúng tới file firebase.js
import { onAuthStateChanged } from "firebase/auth";

const ProtectedRouteForAdmin = ({ children }) => {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) return null; // hoặc component loading

    if (user) {
        // Đã đăng nhập bằng firebase
        return children;
    } else {
        // Chưa đăng nhập
        return <Navigate to="/" replace />;
    }
};

export default ProtectedRouteForAdmin;