/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { Toast } from './components/Toast';

import { HomePage } from './pages/HomePage';
import { AllProductsPage } from './pages/AllProductsPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage, RefundPolicyPage } from './pages/PolicyPages';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

import { Home, Grid, ShoppingBag, Truck, Phone } from 'lucide-react';
import { toBengaliNumber } from './data/mockData';

const MainContent: React.FC = () => {
  const { activePage, cartCount, setIsCartDrawerOpen, navigate } = useStore();

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'products':
        return <AllProductsPage />;
      case 'category':
        return <CategoryPage />;
      case 'product-details':
        return <ProductDetailsPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-confirmation':
        return <OrderConfirmationPage />;
      case 'tracking':
        return <OrderTrackingPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'refund':
        return <RefundPolicyPage />;
      case 'admin':
        return <AdminDashboardPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1F2937] pb-16 lg:pb-0">
      <Header />
      
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      <Footer />
      <CartDrawer />
      <Toast />

      {/* Mobile Sticky Bottom Action Bar (<15% mobile viewport cap) */}
      <nav 
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E3D9] px-2 py-1.5 flex items-center justify-around text-center shadow-lg"
      >
        <button
          onClick={() => navigate('home')}
          className={`flex flex-col items-center justify-center p-1 min-w-[54px] ${
            activePage === 'home' ? 'text-[#14422D] font-bold' : 'text-[#7A6E5D]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">হোম</span>
        </button>

        <button
          onClick={() => navigate('products')}
          className={`flex flex-col items-center justify-center p-1 min-w-[54px] ${
            activePage === 'products' ? 'text-[#14422D] font-bold' : 'text-[#7A6E5D]'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">পণ্য</span>
        </button>

        {/* Center Cart Trigger */}
        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="relative flex flex-col items-center justify-center p-1 min-w-[54px] text-[#14422D]"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-[#14422D]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#C59B27] text-[#14422D] text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center tabular-nums">
                {toBengaliNumber(cartCount)}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-bold">ব্যাগ</span>
        </button>

        <button
          onClick={() => navigate('tracking')}
          className={`flex flex-col items-center justify-center p-1 min-w-[54px] ${
            activePage === 'tracking' ? 'text-[#14422D] font-bold' : 'text-[#7A6E5D]'
          }`}
        >
          <Truck className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">ট্র্যাক</span>
        </button>

        <a
          href="tel:01742578679"
          className="flex flex-col items-center justify-center p-1 min-w-[54px] text-[#7A6E5D] hover:text-[#14422D]"
        >
          <Phone className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">কল</span>
        </a>
      </nav>
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
