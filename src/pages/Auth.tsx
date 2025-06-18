
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Terminal, Chrome } from 'lucide-react';
import { Link } from 'react-router-dom';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
            <Terminal className="h-8 w-8" />
            <span className="text-2xl font-mono font-bold">apity</span>
          </Link>
          <h2 className="text-3xl font-bold text-black">Welcome back</h2>
          <p className="mt-2 text-gray-600">Sign in to access your API dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Choose your preferred method to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2"
              variant="outline"
            >
              <Chrome className="h-5 w-5" />
              <span>Continue with Google</span>
            </Button>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-600">
          <p>
            Don't have an account? Sign up automatically when you first sign in.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
