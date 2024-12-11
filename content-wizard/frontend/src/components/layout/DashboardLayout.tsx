import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  Menu as MenuIcon,
  User as UserIcon,
  LayoutDashboard as DashboardIcon,
  PenTool as CreateIcon,
  Calendar as ScheduleIcon,
  Settings as SettingsIcon,
  LogOut as LogOutIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const drawerWidth = 240;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  title: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: <DashboardIcon className="h-4 w-4" />,
    href: "/dashboard",
  },
  {
    title: "Create Content",
    icon: <CreateIcon className="h-4 w-4" />,
    href: "/dashboard/create",
  },
  {
    title: "Schedule",
    icon: <ScheduleIcon className="h-4 w-4" />,
    href: "/dashboard/schedule",
  },
  {
    title: "Settings",
    icon: <SettingsIcon className="h-4 w-4" />,
    href: "/dashboard/settings",
  },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center justify-between px-4 py-4">
        <h2 className={cn("text-lg font-semibold transition-all duration-300", 
          isCollapsed ? "opacity-0 w-0" : "opacity-100")}>
          Content Wizard
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <Separator />
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground justify-start",
                {
                  "bg-accent text-accent-foreground": window.location.pathname === item.href,
                }
              )}
              onClick={() => navigate(item.href)}
            >
              {item.icon}
              <span className={cn("transition-all duration-300",
                isCollapsed ? "opacity-0 w-0" : "opacity-100")}>
                {item.title}
              </span>
            </Button>
          ))}
        </nav>
      </div>
      <Separator />
      <div className="p-4">
        <div className="flex items-center gap-2 rounded-lg bg-muted p-4">
          <UserIcon className="h-4 w-4" />
          <div className={cn("flex-1 truncate transition-all duration-300",
            isCollapsed ? "opacity-0 w-0" : "opacity-100")}>
            <p className="text-sm font-medium">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleLogout}
          >
            <LogOutIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className={cn(
        "hidden border-r md:flex flex-col transition-all duration-300",
        isCollapsed ? "w-[80px]" : "w-[240px]"
      )}>
        <NavContent />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[240px] p-0">
          <NavContent />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1">
        {/* Top bar */}
        <header className="flex h-14 items-center border-b px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon className="h-6 w-6" />
          </Button>
          <div className="ml-auto flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <UserIcon className="h-6 w-6" />
            </Button>
          </div>
        </header>
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
} 