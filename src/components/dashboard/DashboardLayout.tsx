import { Routes, Route, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserDashboard } from "./UserDashboard";
import { ArticleManagement } from "@/components/admin/ArticleManagement";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function DashboardLayout() {
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user?.id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <Alert>
        <AlertDescription>Profile not found. Please try logging in again.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Routes>
      <Route index element={<UserDashboard />} />
      <Route path="articles" element={<ArticleManagement />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}