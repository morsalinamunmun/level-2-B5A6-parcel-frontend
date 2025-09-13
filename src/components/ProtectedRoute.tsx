// import { Navigate } from "react-router-dom";
// import { useAppSelector } from "@/hooks/redux";
// import { ReactNode } from "react";

// interface ProtectedRouteProps {
//   children: ReactNode;
//   requiredRole?: string;
// }

// const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
//   const { user, isAuthenticated } = useAppSelector((state) => state.auth);

//   if (!isAuthenticated || !user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (requiredRole && user.role !== requiredRole) {
//     return <Navigate to={`/dashboard/${user.role}`} replace />;
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;

// components/ProtectedRoute.tsx
// import { Navigate } from "react-router-dom";
// import { useAppSelector } from "@/hooks/redux";
// import { ReactNode, useEffect, useState } from "react";
// import { jwtDecode } from "jwt-decode";

// interface ProtectedRouteProps {
//   children: ReactNode;
//   requiredRole?: string;
// }

// interface DecodedToken {
//   exp: number;
// }

// const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
//   const { user, isAuthenticated, token } = useAppSelector((state) => state.auth);
//   const [isTokenValid, setIsTokenValid] = useState(true);

//   useEffect(() => {
//     if (token) {
//       try {
//         const decoded: DecodedToken = jwtDecode(token);
//         const currentTime = Date.now() / 1000;
        
//         if (decoded.exp < currentTime) {
//           setIsTokenValid(false);
//           // Optionally dispatch logout action here
//         }
//       } catch (error) {
//         setIsTokenValid(false);
//       }
//     }
//   }, [token]);

//   if (!isAuthenticated || !user || !isTokenValid) {
//     return <Navigate to="/login" replace />;
//   }

//   if (requiredRole && user.role !== requiredRole) {
//     return <Navigate to={`/dashboard/${user.role}`} replace />;
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;


import { Navigate } from "react-router-dom"
import { useAppSelector } from "@/hooks/redux"
import { type ReactNode, useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: string
}

interface DecodedToken {
  exp: number
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated, token } = useAppSelector((state) => state.auth)
  const [isTokenValid, setIsTokenValid] = useState(true)

  useEffect(() => {
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token)
        const currentTime = Date.now() / 1000

        if (decoded.exp < currentTime) {
          setIsTokenValid(false)
          // Optionally dispatch logout action here
        }
      } catch (error) {
        setIsTokenValid(false)
      }
    }
  }, [token])

  if (!isAuthenticated || !user || !isTokenValid) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={`/dashboard/${user.role}`} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
