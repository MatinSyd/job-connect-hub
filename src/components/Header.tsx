import { Link } from 'react-router-dom';
import { Briefcase, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            JobHub
          </span>
        </Link>
        
        <nav className="flex items-center gap-4">
          <Link to="/admin/login">
            <Button variant="outline" size="sm" className="gap-2">
              <Shield className="h-4 w-4" />
              Admin Login
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
