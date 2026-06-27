import { LogOut, User, LayoutDashboard, Building2, DoorOpen, Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
    mobileOpen: boolean;
    setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const navigation = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
    },
    {
        label: "Properties",
        icon: Building2,
        href: "/properties",
    },
    {
        label: "Gates",
        icon: DoorOpen,
        href: "/gates",
    },
    {
        label: "Visitors",
        icon: Users,
        href: "/visitors",
    },
    {
        label: "Users",
        icon: Users,
        href: "/users",
    },
];

export default function AppSidebar({
    mobileOpen,
    setMobileOpen,
}: AppSidebarProps) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error: any) {
            console.error("Logout execution failed, forcing reload:", error);
            // Fallback only if the context state execution completely locks up
            window.location.href = "/auth/login";
        }
    };

    const sidebarContent = (
        <div className="flex h-full flex-col justify-between">
            {/* TOP */}
            <div>
                {/* APP LOGO */}
                <div className="border-b px-6 py-5">
                    <h1 className="text-xl font-bold tracking-tight">
                        Gate Entry
                    </h1>

                    <p className="text-xs text-muted-foreground">
                        Visitor Management
                    </p>
                </div>

                {/* NAVIGATION */}
                <nav className="space-y-1 p-3">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            onClick={() =>
                                setMobileOpen(false)
                            }
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted"
                                )
                            }
                        >
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* BOTTOM */}
            <div className="border-t p-3">
                <Button
                    variant="ghost"
                    className="mb-2 w-full justify-start"
                    onClick={() => {
                        navigate("/profile");
                        setMobileOpen(false);
                    }}
                >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                </Button>

                <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );

    return (
        <>
            {/* DESKTOP */}
            <aside className="hidden h-screen w-64 border-r bg-background lg:flex lg:flex-col">
                {sidebarContent}
            </aside>

            {/* MOBILE DRAWER */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.aside
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{
                            duration: 0.25,
                        }}
                        className="fixed left-0 top-0 z-50 h-screen w-64 border-r bg-background shadow-xl lg:hidden"
                    >
                        {sidebarContent}
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
}