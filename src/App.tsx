import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import PurchaseOrderPage from "./pages/Dashboard/PurchaseOrder";
import ProductionRemainingReportPage from "./pages/Dashboard/ProductionRemainingReport";
import StockPerfomanceReportPage from "./pages/Dashboard/StockPerfomanceReport";
import FileUploadPage from "./pages/Dashboard/FileUploadPage";
import SummaryDashboardPage from "./pages/Dashboard/SummaryDashboard";
import { FileUploadProvider } from "./context/FileUploadContext";

export default function App() {
  return (
    <>
      <FileUploadProvider>
        <Router>
          <ScrollToTop />
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
        </Router>
      </FileUploadProvider>
    </>
  );
}
