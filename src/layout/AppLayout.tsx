import { SidebarProvider } from "../context/SidebarContext";
import { useSidebar } from "../hooks/useSidebar";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { useTheme } from "../hooks/useTheme";

const LayoutContent: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out min-w-0 ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
          } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 md:p-6 w-full max-w-full overflow-hidden">
          <Outlet />
        </div>
        <h1 className="flex items-end px-6 py-4" style={{ color: isDark ? "white" : "#000" }} >A solution by &nbsp;<span className="font-bold">AI Team</span></h1>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
