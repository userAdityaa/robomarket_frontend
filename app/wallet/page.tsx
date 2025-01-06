import React from 'react';
import { Card } from '@/components/ui/card';

const Wallet = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 border-none">
      <Card className="w-full max-w-md p-6 bg-gray-800 text-white border-none bg-opacity-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Connect wallet</h2>
          <button className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <button className="w-full flex items-center justify-center gap-3 bg-[#4a3f35] hover:bg-[#5a4f45] text-white p-4 rounded-lg transition">
            <img src="/images/Metamask.png" alt="Metamask" className="w-6 h-6" />
            <span>Metamask</span>
          </button>
        </div>

        <div className="flex justify-center gap-4 mt-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white transition">Privacy</a>
          <a href="#" className="hover:text-white transition">Terms</a>
        </div>
      </Card>
    </div>
  );
};

export default Wallet;