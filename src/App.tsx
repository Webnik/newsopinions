import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import ArticleDetail from "@/pages/ArticleDetail";
import ArticleEditor from "@/pages/ArticleEditor";
import Auth from "@/pages/Auth";
import UserProfile from "@/pages/UserProfile";
import AdminDashboard from "@/pages/AdminDashboard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import "./App.css";

function App() {
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user?.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    if (!session || profile?.role !== 'admin') {
      return <Navigate to="/" />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/new-article" element={<ArticleEditor />} />
        <Route path="/edit-article/:id" element={<ArticleEditor />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route 
          path="/admin/*" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;