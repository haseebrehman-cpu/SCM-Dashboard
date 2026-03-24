import { useCallback } from "react";
import { useLocation } from "react-router";
import { HorizontaLDots } from "../icons";
import { useSidebar } from "../hooks/useSidebar";
import { navItems } from "../config/navigation";
import { useSubmenu } from "../hooks/useSubmenu";
import { SidebarHeader } from "../components/sidebar/SidebarHeader";
import { SidebarMenuItem } from "../components/sidebar/SidebarMenuItem";
import { useTheme } from "../hooks/useTheme";


const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen } = useSidebar();
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const {
    handleSubmenuToggle,
    getSubmenuHeight,
    isSubmenuOpen,
    setSubmenuRef,
  } = useSubmenu(navItems, isActive);
  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
    >
      <SidebarHeader
        isExpanded={isExpanded}
        isMobileOpen={isMobileOpen}
      />
      <div className="flex flex-col flex-1 overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded
                  || isMobileOpen ? (
                  " "
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              <ul className="flex flex-col gap-4">
                {navItems.map((nav, index) => (
                  <SidebarMenuItem
                    key={nav.name}
                    nav={nav}
                    isActive={isActive}
                    isExpanded={isExpanded}
                    isMobileOpen={isMobileOpen}
                    isSubmenuOpen={isSubmenuOpen("main", index)}
                    onSubmenuToggle={() => handleSubmenuToggle(index, "main")}
                    submenuHeight={getSubmenuHeight("main", index)}
                    setSubmenuRef={setSubmenuRef("main", index)}
                  />
                ))}
              </ul>

            </div>
          </div>
        </nav>
      </div>
      {isExpanded ? (
        <h1 className="flex items-center px-6 py-4 shrink-0" style={{ color: isDark ? "white" : "#000" }}>A solution by &nbsp;<span className="font-bold">AI Team</span></h1>
      ) : null}
    </aside>
  );
};

export default AppSidebar;
