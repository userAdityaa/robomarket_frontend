import { ethers } from "ethers";

export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  throw new Error('MetaMask is not installed');
};

export const getSigner = async () => {
  const provider = getProvider();
  await provider.send('eth_requestAccounts', []);
  return provider.getSigner();
};

export const getContract = (address, abi) => {
  const provider = getProvider();
  return new ethers.Contract(address, abi, provider.getSigner());
};