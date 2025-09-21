import "@/styles/globals.css";
import "@meshsdk/react/styles.css";
import type { AppProps } from "next/app";
import { MeshProvider } from "@meshsdk/react";
import { useEffect } from "react";
import { setupGlobalErrorHandler, suppressExtensionErrors } from "../utils/errorHandler";
import { ErrorBoundary } from "../components/ErrorBoundary";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Set up global error handlers to prevent extension errors from crashing the app
    setupGlobalErrorHandler();
    suppressExtensionErrors();
  }, []);

  return (
    <ErrorBoundary>
      <MeshProvider>
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
      </MeshProvider>
    </ErrorBoundary>
  );
}
