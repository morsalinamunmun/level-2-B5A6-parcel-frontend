import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Package, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch } from "@/hooks/redux";
import { useToast } from "@/hooks/use-toast";
import { useLoginMutation } from "@/store/api/parcelApi";
import { setCredentials } from "@/store/slices/authSlice";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

//   const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   try {
//     const result = await login(formData).unwrap();

//     if (result.success && result.data) {
//       // const decoded: DecodedToken = jwtDecode(result.data.accessToken);
//       const token = result.data.accessToken;
// const decoded: DecodedToken = jwtDecode(token);

//       dispatch(setCredentials({
//         user: {
//           _id: decoded.userId,
//           email: decoded.email,
//           role: decoded.role as 'sender' | 'receiver' | 'admin',
//           name: decoded.email.split("@")[0],
//           status: "active",
//           createdAt: ""
//         },
//          token,
//       }));

//       toast({
//         title: "Login Successful",
//         description: `Welcome back, ${decoded.email}!`,
//       });

//       navigate(`/dashboard/${decoded.role}`);
//     }
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     toast({
//       title: "Login Failed",
//       description: error.data?.message || "Invalid credentials. Please try again.",
//       variant: "destructive",
//     });
//   }
// };
  
// pages/auth/Login.tsx
// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   try {
//     const result = await login(formData).unwrap();

//     if (result.success && result.data) {
//       const token = result.data.accessToken;
//       const decoded: DecodedToken = jwtDecode(token);
//       console.log(decoded, "decoded token");
//       dispatch(setCredentials({
//         user: {
//           _id: decoded.userId,
//           email: decoded.email,
//           role: decoded.role as 'sender' | 'receiver' | 'admin',
//           name: decoded.email.split("@")[0],
//           status: "active",
//           createdAt: ""
//         },
//         token: token, 
//       }));

//       // Also store directly (this will use the fixed tokenUtils)
//       localStorage.setItem('token', token);

//       toast({
//         title: "Login Successful",
//         description: `Welcome back, ${decoded.email}!`,
//       });

//       navigate(`/dashboard/${decoded.role}`);
//     }
//   } catch (error: any) {
//     toast({
//       title: "Login Failed",
//       description: error.data?.message || "Invalid credentials. Please try again.",
//       variant: "destructive",
//     });
//   }
// };


const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const result = await login(formData).unwrap()

      if (result.success && result.data) {
        const token = result.data.accessToken
        const decoded: DecodedToken = jwtDecode(token)

        dispatch(
          setCredentials({
            user: {
              _id: decoded.userId,
              email: decoded.email,
              role: decoded.role as "sender" | "receiver" | "admin",
              name: decoded.email.split("@")[0],
              isActive: "ACTIVE",
              createdAt: "",
            },
            token, // Pass original token - auth slice will clean it
          }),
        )

        toast({
          title: "Login Successful",
          description: `Welcome back, ${decoded.email}!`,
        })

        navigate(`/dashboard/${decoded.role}`)
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.data?.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      })
    }
  }
return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your ParcelStride account</p>
        </div>

        {/* Login Form */}
        <Card className="card-gradient shadow-elevated">
          <CardHeader>
            <CardTitle className="text-2xl text-primary text-center">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                    className="h-12 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-primary hover:opacity-90 shadow-primary"
                size="lg"
              >
                <LogIn className="w-5 h-5 mr-2" />
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Create Account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        {/* <Card className="mt-6 bg-muted/50">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Demo Credentials:</h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Sender:</strong> sender@demo.com / password123</p>
              <p><strong>Receiver:</strong> receiver@demo.com / password123</p>
              <p><strong>Admin:</strong> admin@demo.com / password123</p>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default Login;
