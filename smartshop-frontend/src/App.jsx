import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout';
import {
  DashboardPage,
  NotFoundPage,
  ProductsPage,
  ProductFormPage,
  ProductDetailPage,
  CustomersPage,
  CustomerFormPage,
  CustomerDetailPage,
  OrdersPage,
  OrderFormPage,
  OrderDetailPage,
  PaymentsPage,
  PaymentFormPage,
  PromoCodesPage,
  PromoCodeFormPage,
} from './pages';

const App = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <MainLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />

          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/new" element={<ProductFormPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/products/:id/edit" element={<ProductFormPage />} />

          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/new" element={<CustomerFormPage />} />
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
          <Route path="/customers/:id/edit" element={<CustomerFormPage />} />

          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/new" element={<OrderFormPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />

          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/payments/new" element={<PaymentFormPage />} />

          <Route path="/promo-codes" element={<PromoCodesPage />} />
          <Route path="/promo-codes/new" element={<PromoCodeFormPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default App;
