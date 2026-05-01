import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

import apiClient from "@/api/apiClient";
import { useAlertStore } from "@/stores/alertStore";
import { useAuthStore } from "@/stores/authStore";
import { extractApiError } from "@/utils/extractApiError";
import { Home, KeySquare, LayoutTemplate, LogOut } from "lucide-react";
import { Box } from "./ui/box";
import { Button } from "./ui/button";

const navItems = [
  { to: "/", icon: Home, label: "Dashboard" },
  { to: "/templates", icon: LayoutTemplate, label: "Templates" },
  { to: "/api-keys", icon: KeySquare, label: "API Keys" },
];

const AppSidebar = ({
  setOpenSidebar,
}: {
  setOpenSidebar: (open: boolean) => void;
}) => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { state } = useSidebar(); // "expanded" | "collapsed"
  const showAlert = useAlertStore((s) => s.showAlert)

  const isCollapsed = state === "collapsed";
  const initials = user?.username?.[0]?.toUpperCase() ?? "U";

  const handleLogout = async () => {
    try {
      const response = await apiClient.post("/auth/logout");

      // Most logout endpoints return 200 or 204
      if (response.status === 200 || response.status === 204) {
        // Clear auth state 
        logout()

        showAlert(
          "Logged out",
          "You have been logged out successfully",
          "success",
        );
      }
    } catch (error: any) {
      const { code, message } = extractApiError(error);

      showAlert(code.split("_").join(" "), message, "error");
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      onMouseEnter={() => setOpenSidebar(true)}
      onMouseLeave={() => setOpenSidebar(false)}
    >
      <SidebarHeader />

      <SidebarContent>
        <SidebarGroup>
          {/* 
          <SidebarGroupLabel>
            Menu
          </SidebarGroupLabel> 
          */}

          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navItems.map(({ to, icon: Icon, label }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton asChild className="text-base">
                    <Link to={to}>
                      <Icon className="mr-2 h-5 w-5" />
                      {label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        {isCollapsed ? (
          // Collapsed: avatar only, centered, with border
          <Box className="flex flex-col items-center gap-3 py-1">
            <Box className="h-9 w-9 rounded-full border-2 border-border bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0 ring-offset-background transition-all hover:ring-2 hover:ring-primary/30 hover:ring-offset-2">
              {initials}
            </Box>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </Box>
        ) : (
          // Expanded: user info card with border only around user info, logout outside
          <Box className="flex flex-col gap-1">
            {/* User info — bordered */}
            <Box className="rounded-xl border border-border bg-muted/30 p-3 flex items-center gap-3 min-w-0">
              <Box className="h-9 w-9 rounded-full border-2 border-border bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                {initials}
              </Box>
              <Box className="flex flex-col overflow-hidden min-w-0">
                <span className="text-sm font-medium truncate leading-tight">
                  {user?.username ?? "User"}
                </span>
                <span className="text-xs text-muted-foreground truncate leading-tight">
                  {user?.email ?? ""}
                </span>
              </Box>
            </Box>

            {/* Logout — outside the card, subtle */}
            <Button
              variant="ghost"
              onClick={() => handleLogout()}
              className="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors px-3 h-8"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              Logout
            </Button>
          </Box>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
