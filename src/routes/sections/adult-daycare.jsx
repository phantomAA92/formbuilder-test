import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/global-config';
import AdultDaycareLayout from 'src/layouts/adult-daycare-layout';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

import { usePathname } from '../hooks';

// ----------------------------------------------------------------------

const AdultDaycareDashboard = lazy(() => import('src/pages/dashboard/adult-daycare'));
const CustomFormPage = lazy(() => import('src/pages/custom-form'));
const FormsListPage = lazy(() => import('src/pages/forms-list'));
const FormViewPage = lazy(() => import('src/pages/form-view'));
const FormPreviewPage = lazy(() => import('src/pages/form-preview'));

// ----------------------------------------------------------------------

function SuspenseOutlet() {
  const pathname = usePathname();
  return (
    <Suspense key={pathname} fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

const adultDaycareLayout = () => (
  <AdultDaycareLayout>
    <SuspenseOutlet />
  </AdultDaycareLayout>
);

export const adultDaycareRoutes = [
  {
    path: '/',
    element: CONFIG.auth.skip ? adultDaycareLayout() : <AuthGuard>{adultDaycareLayout()}</AuthGuard>,
    children: [
      { element: <AdultDaycareDashboard />, index: true },
      { path: 'dashboard', element: <AdultDaycareDashboard /> },
      { path: 'custom-form', element: <CustomFormPage /> },
      { path: 'custom-form/:formId', element: <CustomFormPage /> },
      { path: 'forms-list', element: <FormsListPage /> },
      { path: 'form-view/:formId', element: <FormViewPage /> },
      { path: 'form-preview', element: <FormPreviewPage /> },
    ],
  },
]; 