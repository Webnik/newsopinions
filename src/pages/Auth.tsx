import { useState, useEffect } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's an existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        handleAuthChange('SIGNED_IN', session);
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuthChange = async (event: string, session: any) => {
    if (event === 'SIGNED_IN' && session) {
      setIsLoading(true);
      try {
        // First, check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!profile) {
          // If no profile exists, create one with default role
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([
              { 
                id: session.user.id,
                role: 'user',
                username: session.user.email?.split('@')[0], // Set a default username
                full_name: session.user.user_metadata?.full_name || null,
                avatar_url: session.user.user_metadata?.avatar_url || null
              }
            ]);

          if (insertError) {
            console.error('Error creating profile:', insertError);
            setErrorMessage("Error creating user profile. Please try again. Details: " + insertError.message);
            await supabase.auth.signOut();
            setIsLoading(false);
            return;
          }
        }

        // Redirect based on role
        if (profile?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/profile');
        }
      } catch (error: any) {
        console.error('Error handling user profile:', error);
        setErrorMessage("Error during login: " + error.message);
        // Sign out the user if there was an error
        await supabase.auth.signOut();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.code) {
        case 'invalid_credentials':
          return 'Invalid email or password. Please check your credentials and try again.';
        case 'email_not_confirmed':
          return 'Please verify your email address before signing in.';
        case 'user_not_found':
          return 'No user found with these credentials.';
        case 'invalid_grant':
          return 'Invalid login credentials.';
        default:
          return error.message;
      }
    }
    return error.message;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="font-serif text-3xl font-bold text-center mb-8">Welcome to NewsOpinions</h1>
          {isLoading && (
            <div className="flex justify-center mb-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <SupabaseAuth 
              supabaseClient={supabase}
              appearance={{ 
                theme: ThemeSupa,
                style: {
                  button: {
                    background: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                  },
                  anchor: {
                    color: 'hsl(var(--primary))',
                  },
                }
              }}
              theme="light"
              providers={[]}
              redirectTo={window.location.origin}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;