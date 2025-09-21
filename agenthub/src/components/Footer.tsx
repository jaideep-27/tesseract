import { MeshBadge } from '@meshsdk/react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-700 bg-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-sky-400 mb-2">AgentHub</h3>
            <p className="text-gray-400 text-sm">
              AI Agent Marketplace powered by Cardano blockchain
            </p>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <MeshBadge isDark={true} />
            <p className="text-gray-500 text-xs">
              &copy; 2024 AgentHub. Built with MeshJS.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}