import { SidebarProvider } from "../context/SidebarContext";
import { useSidebar } from "../hooks/useSidebar";
import { Outlet, useNavigate, useLocation } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { useEffect } from "react";
import { usePermissions } from "../hooks/usePermissions";
import secureStorage from "../utils/secureStorage";

const LayoutContent: React.FC = () => {
  const { isExpanded, isMobileOpen } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const { isFactory } = usePermissions();

  useEffect(() => {
    if (!secureStorage.isAuthenticated()) {
      navigate("/signin");
    } else if (isFactory) {
      if (location.pathname === "/") {
        navigate("/summary-dashboard", { replace: true });
        return;
      }
      
      const allowedPaths = ["/summary-dashboard", "/profile", "/access-denied"];
      if (!allowedPaths.includes(location.pathname)) {
        // Map paths to friendly names for the error message
        const featureMap: Record<string, string> = {
          "/purchase-order": "Purchase Order Report",
          "/production-remaining-report": "Production Remaining Report",
          "/stock-performance-report": "Stock Performance Report",
          "/stock-report": "Stock Report",
          "/wh-container-report": "WH Container Report",
          "/combined-report": "Combined Report",
        };

        const featureName = featureMap[location.pathname] || "this feature";
        navigate("/access-denied", { 
          replace: true,
          state: { feature: featureName }
        });
      }
    }
  }, [navigate, isFactory, location.pathname]);

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex flex-col flex-1 h-screen transition-all duration-300 ease-in-out min-w-0 ${isExpanded ? "lg:ml-[290px]" : "lg:ml-[90px]"
          } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="flex-1 min-h-0 p-4 md:p-6 w-full max-w-full overflow-auto">
          <Outlet />
        </div>
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
