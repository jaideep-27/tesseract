import { NextPageContext } from 'next';
import { ErrorProps } from 'next/error';

interface CustomErrorProps extends ErrorProps {
  hasGetInitialPropsRun?: boolean;
  err?: Error;
}

function CustomError({ statusCode, hasGetInitialPropsRun, err }: CustomErrorProps) {
  // Don't show error page for browser extension errors
  if (err?.stack?.includes('chrome-extension://') ||
      err?.message?.includes('connectionId') ||
      err?.message?.includes('extension')) {
    // Redirect to home page instead of showing error
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl text-red-400 mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {statusCode === 404 ? 'Page Not Found' : 'Something went wrong'}
        </h1>
        <p className="text-gray-600 mb-4">
          {statusCode === 404 
            ? 'The page you are looking for does not exist.'
            : `An error ${statusCode} occurred on the server.`
          }
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

CustomError.getInitialProps = async (context: NextPageContext) => {
  const { res, err } = context;
  
  // Check if it's a browser extension error
  if (err?.stack?.includes('chrome-extension://') ||
      err?.message?.includes('connectionId') ||
      err?.message?.includes('extension')) {
    
    // Redirect to home page for extension errors
    if (res) {
      res.writeHead(302, { Location: '/' });
      res.end();
    }
    return { statusCode: 302 };
  }

  const statusCode = res ? res.statusCode : err ? err.statusCode ?? 500 : 404;

  return { statusCode, hasGetInitialPropsRun: true };
};

export default CustomError;