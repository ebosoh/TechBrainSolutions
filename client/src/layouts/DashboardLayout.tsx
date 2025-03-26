import React, { useState, ReactNode } from 'react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare, 
  Briefcase, 
  Settings,
  LogOut,
  Menu,
  ChevronLeft
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleLogout = () => {
    // In a real app, this would clear the auth token/session
    // For demo purposes, just redirect to home
    window.location.href = '/';
  };

  const navItems = [
    {
      label: 'Overview',
      href: '/dashboard',
      icon: <LayoutDashboard className="w-4 h-4 mr-2" />,
      active: location === '/dashboard',
    },
    {
      label: 'Users',
      href: '/dashboard/users',
      icon: <Users className="w-4 h-4 mr-2" />,
      active: location === '/dashboard/users',
    },
    {
      label: 'Enquiries',
      href: '/dashboard/enquiries',
      icon: <MessageSquare className="w-4 h-4 mr-2" />,
      active: location === '/dashboard/enquiries',
    },
    {
      label: 'Content',
      href: '/dashboard/content',
      icon: <FileText className="w-4 h-4 mr-2" />,
      active: location === '/dashboard/content',
    },
    {
      label: 'Careers',
      href: '/dashboard/careers',
      icon: <Briefcase className="w-4 h-4 mr-2" />,
      active: location === '/dashboard/careers',
    },
    {
      label: 'Settings',
      href: '/dashboard/settings',
      icon: <Settings className="w-4 h-4 mr-2" />,
      active: location === '/dashboard/settings',
    },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center text-2xl font-bold">
          <span className="text-primary">Tech</span>
          <span className="text-orange-600">Brain</span>
          <span className="text-xs ml-1 font-normal text-muted-foreground">Admin</span>
        </div>
      </div>
      <ScrollArea className="flex-1 px-4">
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={item.active ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                {item.icon}
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-100"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Desktop sidebar */}
      {!isMobile && (
        <div className={`bg-background border-r w-64 transition-all duration-300 ${sidebarOpen ? 'block' : 'hidden'}`}>
          <SidebarContent />
        </div>
      )}

      {/* Mobile sidebar */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-background border-b h-14 flex items-center px-4 sticky top-0 z-10">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center">
              {isMobile ? (
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="mr-2"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              )}
              <h1 className="text-xl font-semibold text-primary">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="font-medium">Admin User</div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}