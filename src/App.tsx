import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";
import { Toaster } from "@/components/ui/sonner";
import { getCurrentStaff } from "@/lib/staff-store";

// -- Lazy-loaded page components -----------------------------------------------
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Apply = lazy(() => import("@/pages/Apply"));
const Blog = lazy(() => import("@/pages/Blog"));
const Careers = lazy(() => import("@/pages/Careers"));
const Commission = lazy(() => import("@/pages/Commission"));
const Contact = lazy(() => import("@/pages/Contact"));
const DroneServices = lazy(() => import("@/pages/DroneServices"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const Pay = lazy(() => import("@/pages/Pay"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Products = lazy(() => import("@/pages/Products"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const Refund = lazy(() => import("@/pages/Refund"));
const Schemes = lazy(() => import("@/pages/Schemes"));
const Services = lazy(() => import("@/pages/Services"));
const Membership = lazy(() => import("@/pages/Membership"));
const Tools = lazy(() => import("@/pages/Tools"));
const ServiceDetail = lazy(() => import("@/pages/ServiceDetail"));
const Support = lazy(() => import("@/pages/Support"));
const Terms = lazy(() => import("@/pages/Terms"));
const FarmerLookup = lazy(() => import("@/pages/FarmerLookup"));

// -- Layouts / Auth sections ---------------------------------------------------
const AdminLogin = lazy(() => import("@/pages/admin/Login"));
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("@/pages/admin/Products"));
const AdminInventory = lazy(() => import("@/pages/admin/Inventory"));
const AdminOrders = lazy(() => import("@/pages/admin/Orders"));
const AdminDeliveries = lazy(() => import("@/pages/admin/Deliveries"));
const AdminPayments = lazy(() => import("@/pages/admin/Payments"));
const AdminTickets = lazy(() => import("@/pages/admin/Tickets"));
const AdminReports = lazy(() => import("@/pages/admin/Reports"));
const AdminCustomers = lazy(() => import("@/pages/admin/Customers"));
const AdminCustomerDetail = lazy(() => import("@/pages/admin/CustomerDetail"));
const AdminRequests = lazy(() => import("@/pages/admin/Requests"));
const AdminSubmissions = lazy(() => import("@/pages/admin/Submissions"));
const AdminStaff = lazy(() => import("@/pages/admin/Staff"));
const AdminRevenue = lazy(() => import("@/pages/admin/Revenue"));
const AdminSettings = lazy(() => import("@/pages/admin/Settings"));
const AdminContent = lazy(() => import("@/pages/admin/Content"));

const StaffLayout = lazy(() => import("@/pages/staff/StaffLayout"));
const StaffLogin = lazy(() => import("@/pages/staff/Login"));
const StaffDashboard = lazy(() => import("@/pages/staff/Dashboard"));
const StaffAddCustomer = lazy(() => import("@/pages/staff/AddCustomer"));
const StaffCustomers = lazy(() => import("@/pages/staff/Customers"));
const StaffCustomerDetail = lazy(() => import("@/pages/staff/CustomerDetail"));
const StaffSubmissions = lazy(() => import("@/pages/staff/Submissions"));
const StaffPlaceOrder = lazy(() => import("@/pages/staff/PlaceOrder"));

const PortalDashboard = lazy(() => import("@/pages/portal/Dashboard"));
const PortalBookings = lazy(() => import("@/pages/portal/Bookings"));
const PortalBook = lazy(() => import("@/pages/portal/Book"));

// -- Loading spinner -----------------------------------------------------------
function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

// -- Guard components ----------------------------------------------------------
function RequireAdmin() {
  const s = getCurrentStaff();
  if (!s) return <Navigate to="/admin/login" replace />;
  if (s.role !== "admin") return <Navigate to="/staff/dashboard" replace />;
  return <Outlet />;
}

function RequireStaff() {
  const s = getCurrentStaff();
  if (!s) return <Navigate to="/staff/login" replace />;
  if (s.role !== "employee") return <Navigate to="/staff/login" replace />;
  return <Outlet />;
}

// -- Not Found -----------------------------------------------------------------
function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

// -- Root layout ---------------------------------------------------------------
function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <FloatingContact />
      <Toaster />
    </div>
  );
}

// -- App -----------------------------------------------------------------------
export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Public pages */}
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="apply" element={<Apply />} />
        <Route path="blog" element={<Blog />} />
        <Route path="careers" element={<Careers />} />
        <Route path="commission" element={<Commission />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faq" element={<FAQ />} />
        {/* Farmer login/signup removed — farmers submit requests via /apply */}
        <Route path="login" element={<Navigate to="/apply" replace />} />
        <Route path="signup" element={<Navigate to="/apply" replace />} />
        <Route path="pay" element={<Pay />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:slug" element={<ProductDetail />} />
        <Route path="refund" element={<Refund />} />
        <Route path="schemes" element={<Schemes />} />
        <Route path="services" element={<Services />} />
        <Route path="membership" element={<Membership />} />
        <Route path="membership-plans" element={<Navigate to="/membership" replace />} />
        <Route path="services/:slug" element={<ServiceDetail />} />
        <Route path="drone-services" element={<DroneServices />} />
        <Route path="drones" element={<Navigate to="/drone-services" replace />} />
        <Route path="tools" element={<Tools />} />
        <Route path="support" element={<Support />} />
        <Route path="terms" element={<Terms />} />
        <Route path="farmer-lookup" element={<FarmerLookup />} />

        {/* Portal (farmer) */}
        <Route path="portal">
          <Route path="dashboard" element={<PortalDashboard />} />
          <Route path="bookings" element={<PortalBookings />} />
          <Route path="book" element={<PortalBook />} />
        </Route>

        {/* Staff login — no guard needed */}
        <Route path="staff/login" element={<StaffLogin />} />

        {/* Staff (employee) — guarded */}
        <Route path="staff" element={<RequireStaff />}>
          <Route element={<StaffLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StaffDashboard />} />
            <Route path="add-customer" element={<StaffAddCustomer />} />
            <Route path="customers" element={<StaffCustomers />} />
            <Route path="customers/:id" element={<StaffCustomerDetail />} />
            <Route path="submissions" element={<StaffSubmissions />} />
            <Route path="place-order" element={<StaffPlaceOrder />} />
          </Route>
        </Route>

        {/* Admin login — no guard */}
        <Route path="admin/login" element={<AdminLogin />} />

        {/* Admin — guarded */}
        <Route path="admin" element={<RequireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="deliveries" element={<AdminDeliveries />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="tickets" element={<AdminTickets />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="customers/:id" element={<AdminCustomerDetail />} />
            <Route path="requests" element={<AdminRequests />} />
            <Route path="submissions" element={<AdminSubmissions />} />
            <Route path="staff" element={<AdminStaff />} />
            <Route path="revenue" element={<AdminRevenue />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="content" element={<AdminContent />} />
          </Route>
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
