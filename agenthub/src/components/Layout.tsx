import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { ErrorBoundary } from './ErrorBoundary';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ErrorBoundary>
      <div className="bg-gray-900 min-h-screen text-white">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}