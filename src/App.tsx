import { BrowserRouter as Router, Routes, Route } from "react-router";
import { Suspense, lazy } from "react";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { FileUploadProvider } from "./context/FileUploadContext";
import LoadingSpinner from "./components/common/LoadingSpinner";

import SignIn from "./pages/AuthPages/SignIn"
import SignUp from "./pages/AuthPages/SignUp"
import NotFound from "./pages/OtherPage/NotFound"
import Home from "./pages/Dashboard/Home"

// Lazy load pages for better performance and code splitting
const UserProfiles = lazy(() => import("./pages/UserProfiles"));
const AppLayout = lazy(() => import("./layout/AppLayout"));
const PurchaseOrderPage = lazy(() => import("./pages/Dashboard/PurchaseOrder"));
const ProductionRemainingReportPage = lazy(() => import("./pages/Dashboard/ProductionRemainingReport"));
const StockPerformanceReportPage = lazy(() => import("./pages/Dashboard/StockPerformanceReport"));
const FileUploadPage = lazy(() => import("./pages/Dashboard/FileUploadPage"));
const SummaryDashboardPage = lazy(() => import("./pages/Dashboard/SummaryDashboard"));
const StockReport = lazy(() => import("./pages/Dashboard/StockReport"));
const WHContainerReport = lazy(() => import("./pages/Dashboard/WHContainerReport"));
const CombinedReport = lazy(() => import("./pages/Dashboard/CombinedReport"));

export default function App() {
  return (
    <>
      <FileUploadProvider>
        <Router basename="/scm">
          <ScrollToTop />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Dashboard Layout */}
              <Route element={<AppLayout />}>
                <Route index path="/" element={<Home />} />
                <Route path="/purchase-order" element={<PurchaseOrderPage />} />
                <Route path="/file-upload" element={<FileUploadPage />} />
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
    </>
  );
}
