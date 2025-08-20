import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoadingScreen from "@/components/ui/loader/loadingScreen";
import MainLayout from "@layouts/MainLayout";
import AuthGuard from "@guards/AuthGuard";
import PublicGuard from "@guards/PublicGuard";

// Lazy-loaded components
const AdminLoginPage = lazy(() => import("@pages/auth/AdminLoginPage"));
const PropertyReviewPage = lazy(() => import("@pages/adminPanel/index"));

const ApprovalEstate = lazy(() => import("@pages/approvalEstate/index"));
const EditAdPage = lazy(() => import("@pages/approvalEstate/editAdsPage"));

const CategoryPage = lazy(() => import("@pages/categoryPage/index"));
const ExternalAds = lazy(() => import("@pages/externalAds/index"));
const BannerPage = lazy(() => import("@pages/bannersPage/index"));
const UserAdminstartion = lazy(() => import("@pages/userAdminstartion/index"));
const ReleaseVersionsPage = lazy(() => import("@pages/versionPage/index"));
const NotFoundPage = lazy(() => import("@pages/pageNotFound"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicGuard />}>
          <Route path="/admin/login" element={<AdminLoginPage />} />
        </Route>

        {/* Main App Routes */}
        <Route element={<AuthGuard />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<PropertyReviewPage />} />

            <Route path="/approved-estates" element={<ApprovalEstate />} />
            <Route path="/admin-panel/edit/:adId" element={<EditAdPage />} />

            <Route path="/external-ads" element={<ExternalAds />} />
            <Route path="/category-management" element={<CategoryPage />} />
            <Route path="/get-all-banners" element={<BannerPage />} />
            <Route path="/user/get-all-users" element={<UserAdminstartion />} />
            <Route path="/release-versions" element={<ReleaseVersionsPage />} />
          </Route>
        </Route>

        {/* Error Routes */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}
