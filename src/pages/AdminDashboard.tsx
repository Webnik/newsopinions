import { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Overview } from "@/components/admin/Overview";
import { UserManagement } from "@/components/admin/UserManagement";
import { ArticleManagement } from "@/components/admin/ArticleManagement";
import { Analytics } from "@/components/admin/Analytics";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, FileText, BarChart } from "lucide-react";

export default function AdminDashboard() {
  const location = useLocation();
  const [currentPath] = useState(location.pathname);

  const navItems = [
    { path: "/admin", label: "Overview", icon: LayoutDashboard },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/articles", label: "Articles", icon: FileText },
    { path: "/admin/analytics", label: "Analytics", icon: BarChart },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <aside className="w-64 shrink-0">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      currentPath === item.path
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/articles" element={<ArticleManagement />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}