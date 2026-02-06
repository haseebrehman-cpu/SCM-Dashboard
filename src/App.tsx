import { BrowserRouter as Router, Routes, Route } from "react-router";
import { Suspense, lazy } from "react";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { FileUploadProvider } from "./context/FileUploadContext";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Lazy load pages for better performance and code splitting
const SignIn = lazy(() => import("./pages/AuthPages/SignIn"));
const SignUp = lazy(() => import("./pages/AuthPages/SignUp"));
const NotFound = lazy(() => import("./pages/OtherPage/NotFound"));
const UserProfiles = lazy(() => import("./pages/UserProfiles"));
const AppLayout = lazy(() => import("./layout/AppLayout"));
const Home = lazy(() => import("./pages/Dashboard/Home"));
const PurchaseOrderPage = lazy(() => import("./pages/Dashboard/PurchaseOrder"));
const ProductionRemainingReportPage = lazy(() => import("./pages/Dashboard/ProductionRemainingReport"));
const StockPerfomanceReportPage = lazy(() => import("./pages/Dashboard/StockPerfomanceReport"));
const FileUploadPage = lazy(() => import("./pages/Dashboard/FileUploadPage"));
const SummaryDashboardPage = lazy(() => import("./pages/Dashboard/SummaryDashboard"));

export default function App() {
  return (
    <>
      <FileUploadProvider>
        <Router>
          <ScrollToTop />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Dashboard Layout */}
              <Route element={<AppLayout />}>
                <Route index path="/" element={<Home />} />
                <Route path="/purchase-order" element={<PurchaseOrderPage />} />
                <Route path="/file-upload" element={<FileUploadPage />} />
                <Route path="/production-remaining-report" element={<ProductionRemainingReportPage />} />
                <Route path="/stock-perfomance-report" element={<StockPerfomanceReportPage />} />
                <Route path="/summary-dashboard" element={<SummaryDashboardPage />} />
                <Route path="/profile" element={<UserProfiles />} />
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
