import { Toaster } from "@/components/ui/sonner";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router";
import AddOrderPage from "./pages/AddOrderPage";
import DashboardPage from "./pages/DashboardPage";
import DeliveredPage from "./pages/DeliveredPage";
import LoginPage from "./pages/LoginPage";
import OrdersPage from "./pages/OrdersPage";
import PendingPage from "./pages/PendingPage";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LoginPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const addOrderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/add-order",
  component: AddOrderPage,
});

const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders",
  component: OrdersPage,
});

const pendingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pending",
  component: PendingPage,
});

const deliveredRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/delivered",
  component: DeliveredPage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  dashboardRoute,
  addOrderRoute,
  ordersRoute,
  pendingRoute,
  deliveredRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
