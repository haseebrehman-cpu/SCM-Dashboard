import { BrowserRouter as Router, Routes, Route } from "react-router";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { FileUploadProvider } from "./context/FileUploadContext";

import SignIn from "./pages/AuthPages/SignIn"
import SignUp from "./pages/AuthPages/SignUp"
import NotFound from "./pages/OtherPage/NotFound"
import Home from "./pages/Dashboard/Home"
import AppLayout from "./layout/AppLayout"
import UserProfiles from "./pages/UserProfiles";
import PurchaseOrderPage from "./pages/Dashboard/PurchaseOrder";
import ProductionRemainingReportPage from "./pages/Dashboard/ProductionRemainingReport";
import StockPerformanceReportPage from "./pages/Dashboard/StockPerformanceReport";
import FileUploadPage from "./pages/Dashboard/FileUploadPage";
import SummaryDashboardPage from "./pages/Dashboard/SummaryDashboard";
import StockReport from "./pages/Dashboard/StockReport";
import WHContainerReport from "./pages/Dashboard/WHContainerReport";
import CombinedReport from "./pages/Dashboard/CombinedReport";

export default function App() {
  return (
    <>
      <FileUploadProvider>
        <Router basename="/scm">
          <ScrollToTop />
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
          </Router>
        </FileUploadProvider>
      </>
    );
  }
