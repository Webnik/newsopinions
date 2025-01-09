import { Button } from "@/components/ui/button";
import { UserCircle, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export function Navigation() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="font-serif text-2xl font-bold">NewsOpinions</Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Politics
            </Link>
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Technology
            </Link>
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Culture
            </Link>
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Business
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <Button variant="ghost" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/auth">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Subscribe
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}