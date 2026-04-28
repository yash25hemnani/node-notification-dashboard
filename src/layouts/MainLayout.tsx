import AppSidebar from "@/components/AppSidebar";
import { Box } from "@/components/ui/box";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <SidebarProvider open={openSidebar}>
      <AppSidebar setOpenSidebar={setOpenSidebar} />

      <main className="flex flex-col flex-1 min-h-screen min-w-0 overflow-y-auto">
        <Box className="flex flex-col flex-1 p-4">
          <Outlet />
        </Box>
      </main>
    </SidebarProvider>
  );
};

export default MainLayout;
