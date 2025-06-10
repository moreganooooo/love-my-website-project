
import { useState } from 'react';
import { Menu, X, Home, FolderOpen, User, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Sample Project', href: '/sample-project', icon: FolderOpen },
    { name: 'About', href: '/#about', icon: User },
    { name: 'Contact', href: '/#contact', icon: Mail },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={toggleMenu}
        className="fixed top-6 right-6 z-50 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-slate-800" />
        ) : (
          <Menu className="h-6 w-6 text-slate-800" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={closeMenu}
        />
      )}

      {/* Menu Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-lg shadow-2xl z-45 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-8 pt-20">
          <nav className="space-y-6">
            {navItems.map((item) => {
              const isActive = item.href === '/' ? 
                location.pathname === '/' : 
                location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={closeMenu}
                  className={cn(
                    "flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 group",
                    isActive
                      ? "bg-gradient-to-r from-orange-100 to-purple-100 text-orange-700"
                      : "hover:bg-gradient-to-r hover:from-orange-50 hover:to-purple-50 text-slate-700 hover:text-orange-600"
                  )}
                >
                  <item.icon className={cn(
                    "h-6 w-6 transition-colors duration-300",
                    isActive ? "text-orange-600" : "text-slate-500 group-hover:text-orange-500"
                  )} />
                  <span className="text-lg font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-12 p-6 bg-gradient-to-br from-orange-50 to-purple-50 rounded-2xl">
            <h3 className="font-bold text-slate-800 mb-2">Let's Connect</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Ready to bring your next project to life? I'd love to hear about your vision.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
