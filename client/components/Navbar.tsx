import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <nav className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="font-bold text-lg text-foreground hidden sm:inline">
                FinTrack
              </span>
            </Link>
            <div className="flex gap-4">
              <Link
                to="/login"
                className="px-4 py-2 text-foreground hover:text-primary transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">
              FinTrack
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8">
            <Link
              to="/dashboard"
              className="text-foreground hover:text-primary transition font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/transactions"
              className="text-foreground hover:text-primary transition font-medium"
            >
              Transactions
            </Link>
            <Link
              to="/budget"
              className="text-foreground hover:text-primary transition font-medium"
            >
              Budget
            </Link>
            <Link
              to="/goals"
              className="text-foreground hover:text-primary transition font-medium"
            >
              Goals
            </Link>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/profile"
              className="text-sm text-muted-foreground hover:text-primary transition font-medium"
            >
              👤 {user?.name}
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-foreground"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-border pt-4">
            <Link
              to="/dashboard"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/transactions"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Transactions
            </Link>
            <Link
              to="/budget"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Budget
            </Link>
            <Link
              to="/goals"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Goals
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
