import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { LogOut, CheckSquare, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const logoutButtonRef = useRef<HTMLButtonElement>(null);

  const handleLogout = () => {
    if (logoutButtonRef.current) {
      gsap.to(logoutButtonRef.current, {
        scale: 0.95,
        duration: 0.1,
        onComplete: () => {
          logout();
          navigate('/login');
        },
      });
    } else {
      logout();
      navigate('/login');
    }
  };

  const handleLogoutHover = (isEntering: boolean) => {
    if (logoutButtonRef.current) {
      gsap.to(logoutButtonRef.current, {
        scale: isEntering ? 1.05 : 1,
        duration: 0.2,
        ease: 'power2.out',
      });
    }
  };

  return (
    <nav className="glass-card border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <CheckSquare className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">TaskFlow</span>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50">
              {isAdmin ? (
                <Shield className="h-4 w-4 text-accent" />
              ) : (
                <User className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm font-medium text-foreground">
                {user?.name}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                {isAdmin ? 'Admin' : 'User'}
              </span>
            </div>
            
            <Button
              ref={logoutButtonRef}
              variant="ghost"
              onClick={handleLogout}
              onMouseEnter={() => handleLogoutHover(true)}
              onMouseLeave={() => handleLogoutHover(false)}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
