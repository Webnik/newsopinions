import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "@/pages/Index";
import ArticleDetail from "@/pages/ArticleDetail";
import ArticleEditor from "@/pages/ArticleEditor";
import Auth from "@/pages/Auth";
import UserProfile from "@/pages/UserProfile";
import AdminDashboard from "@/pages/AdminDashboard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    if (!session) {
      return <Navigate to="/auth" />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          {session && <AppSidebar />}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/article/:id" element={<ArticleDetail />} />
              <Route path="/dashboard/*" element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              } />
              <Route path="/new-article" element={
                <PrivateRoute>
                  <ArticleEditor />
                </PrivateRoute>
              } />
              <Route path="/edit-article/:id" element={
                <PrivateRoute>
                  <ArticleEditor />
                </PrivateRoute>
              } />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              } />
              <Route path="/admin/*" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </SidebarProvider>
    </Router>
  );
}

export default App;