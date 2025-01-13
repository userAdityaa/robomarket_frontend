import { ethers } from "ethers";

export const getProvider = async () => {
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      const response = await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });

      console.log(response);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      console.log("MetaMask permissions granted:", response);
      return new ethers.BrowserProvider(window.ethereum);
    } catch (error) {
      console.error("MetaMask connection failed:", error);
      throw error;
    }
  }
  throw new Error("MetaMask is not installed or available.");
};


export const getSigner = async () => {
  const provider = await getProvider();
  // Get the signer
  const signer = await provider.getSigner();
  await signer.getAddress(); // Ensure the signer is valid by fetching the address
  return signer;
};

export const getContract = async (address, abi) => {
  const signer = await getSigner();
  return new ethers.Contract(address, abi, signer);
};
