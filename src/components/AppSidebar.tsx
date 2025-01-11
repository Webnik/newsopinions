import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Home,
  PenSquare,
  FileText,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

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
        .single();
      if (error) throw error;
      return data;
    },
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const navigationItems = profile?.role === 'admin' ? [
    { title: "Home", url: "/", icon: Home },
    { title: "Admin Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "New Article", url: "/new-article", icon: PenSquare },
    { title: "Articles", url: "/admin/articles", icon: FileText },
  ] : [
    { title: "Home", url: "/", icon: Home },
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "New Article", url: "/new-article", icon: PenSquare },
    { title: "My Articles", url: "/dashboard/articles", icon: FileText },
  ];

  const isActiveRoute = (path: string) => {
    const currentPath = location.pathname;
    if (path === '/') {
      return currentPath === '/';
    }
    if (path === '/admin' || path === '/dashboard') {
      return currentPath.startsWith(path);
    }
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  if (!session) return null;

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"}>
      <div className="flex justify-end p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={isActiveRoute(item.url)}
                  >
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={location.pathname === '/profile'}
                >
                  <Link to="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {!isCollapsed && <span>{profile?.username || 'Profile'}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  {!isCollapsed && <span>Sign Out</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}