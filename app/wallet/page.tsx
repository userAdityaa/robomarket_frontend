'use client'
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { getProvider, getSigner } from '../hooks/useMetaMask'
import { useCallback } from 'react';
import { ethers } from 'ethers';
import { JsonRpcSigner } from 'ethers';
import { BrowserProvider } from 'ethers';

export interface AccountType { 
  address?: string;
  balance?: string; 
  chainId?: string; 
  network?: string;
  signer?: JsonRpcSigner;
  provider?:BrowserProvider;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

const Wallet = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [accountData, setAccountData] = useState<AccountType>({});
  const router = useRouter();

  const connectWallet = useCallback(async () => {
    const ethereum = window.ethereum;
    if (!ethereum) {
      alert("MetaMask not installed");
      return;
    }
  
    try {
      await ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
  
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        
        const address = accounts[0];
        const provider = new ethers.BrowserProvider(ethereum);
        const balance = await provider.getBalance(address);
        const network = await provider.getNetwork();
        
        localStorage.setItem("walletAddress", address);
        localStorage.setItem('walletData', JSON.stringify({
          address,
          balance: ethers.formatEther(balance),
          chainId: network.chainId.toString(),
          network: network.name
        }));
        
        router.push('/home');
      } catch (error) {
        console.error("error", error)
      }
    } catch (error: any) {
      if (error.code === -32002) {
        alert("Please check MetaMask for a pending connection request.");
      } else {
        console.error("Error connecting to MetaMask:", error);
        alert(`Error connecting to MetaMask: ${error.message || error}`);
      }
    }
  }, []);
  
  
  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await connectWallet();
    } catch (error: any) {
      console.error('Error connecting to MetaMask:', error);
      if (error.code === -32002) {
        alert('Please check MetaMask for pending connection request');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 border-none max-phone:items-end">
      <Card className="w-full max-w-md p-6 bg-gray-800 text-white border-none bg-opacity-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Connect Wallet</h2>
          <button
            className="text-gray-400 hover:text-white"
            onClick={() => router.push("/")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <button
            className="w-full flex items-center justify-center gap-3 bg-[#4a3f35] hover:bg-[#5a4f45] text-white p-4 rounded-lg transition"
            onClick={handleConnect}
            disabled={isLoading}
          >
            <img
              src="/images/Metamask.png"
              alt="Metamask"
              className="w-6 h-6"
            />
            <span>{isLoading ? 'Connecting...' : 'Connect MetaMask'}</span>
          </button>
        </div>

        <div className="flex justify-center gap-4 mt-6 text-sm text-gray-400 max-phone:justify-start">
          <a href="#" className="hover:text-white transition">
            Privacy
          </a>
          <a href="#" className="hover:text-white transition">
            Terms
          </a>
        </div>
      </Card>
    </div>
  );
};

export default Wallet;
