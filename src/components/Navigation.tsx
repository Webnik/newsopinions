import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";

export function Navigation() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="font-serif text-2xl font-bold">NewsOpinions</h1>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Politics
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Technology
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Culture
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Business
            </a>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost">Sign In</Button>
          <Button>
            <UserCircle className="mr-2 h-4 w-4" />
            Subscribe
          </Button>
        </div>
      </div>
    </nav>
  );
}