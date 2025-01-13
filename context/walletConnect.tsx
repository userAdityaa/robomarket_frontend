'use client'
import React, { createContext, useContext, useState } from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  account: string | null;
  contract: ethers.Contract | null;
  setProvider: React.Dispatch<React.SetStateAction<ethers.BrowserProvider | null>>;
  setSigner: React.Dispatch<React.SetStateAction<ethers.JsonRpcSigner | null>>;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
  setContract: React.Dispatch<React.SetStateAction<ethers.Contract | null>>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  return (
    <WalletContext.Provider value={{ provider, signer, account, contract, setProvider, setSigner, setAccount, setContract }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
