import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { FileUploadProvider } from "./context/FileUploadContext";
import { useTheme } from "./hooks/useTheme";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const SignIn = lazy(() => import("./pages/AuthPages/SignIn"));
const SignUp = lazy(() => import("./pages/AuthPages/SignUp"));
const NotFound = lazy(() => import("./pages/OtherPage/NotFound"));
const AppLayout = lazy(() => import("./layout/AppLayout"));
const UserProfiles = lazy(() => import("./pages/UserProfiles"));
const PurchaseOrderPage = lazy(() => import("./pages/Dashboard/PurchaseOrder"));
const ProductionRemainingReportPage = lazy(() => import("./pages/Dashboard/ProductionRemainingReport"));
const StockPerformanceReportPage = lazy(() => import("./pages/Dashboard/StockPerformanceReport"));
const FileUploadPage = lazy(() => import("./pages/Dashboard/FileUploadPage"));
const SummaryDashboardPage = lazy(() => import("./pages/Dashboard/SummaryDashboard"));
const StockReport = lazy(() => import("./pages/Dashboard/StockReport"));
const WHContainerReport = lazy(() => import("./pages/Dashboard/WHContainerReport"));
const CombinedReport = lazy(() => import("./pages/Dashboard/CombinedReport"));
const getAssetPath = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export default function App() {
  const { theme } = useTheme();
  const isDark = theme === "dark"; return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <FileUploadProvider>
          <Router basename="/scm/">
          <ScrollToTop />
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen text-sm text-gray-600 dark:text-gray-200">
                <div className="animate-pulse flex flex-col items-center">
                  <img
                    src={getAssetPath(isDark ? "logos/Dark1.svg" : "logos/Light1.svg")}
                    alt="Loading..."
                    width={120}
                    height={100}
                  />
                  <span className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Loading SCM Dashboard...
                  </span>
                </div>
              </div>
            }
          >
            <Routes>
              {/* Dashboard Layout */}
              <Route element={<AppLayout />}>
                <Route index element={<FileUploadPage />} />
                <Route path="/purchase-order" element={<PurchaseOrderPage />} />
                <Route path="/production-remaining-report" element={<ProductionRemainingReportPage />} />
                <Route path="/stock-performance-report" element={<StockPerformanceReportPage />} />
                <Route path="/summary-dashboard" element={<SummaryDashboardPage />} />
                <Route path="/profile" element={<UserProfiles />} />
                <Route path="/stock-report" element={<StockReport />} />
                <Route path="/wh-container-report" element={<WHContainerReport />} />
                <Route path="/combined-report" element={<CombinedReport />} />
              </Route>

              {/* Auth Layout */}
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />

              {/* Fallback Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          </Router>
        </FileUploadProvider>
      </LocalizationProvider>
    </>
  );
}
