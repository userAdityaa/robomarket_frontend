'use client';
import { useEffect, useState } from "react";
import { BrowserProvider, Contract, ethers, JsonRpcSigner } from "ethers";
import FileUpload from "./FileUpload";
import { Archivo } from "next/font/google";
import { AccountType } from "../wallet/page";
import contractABI from '../artifacts/contracts/NFT.sol/NFTMarketplaceToken.json';
import { toast } from "react-hot-toast";

const archivo = Archivo({
  weight: "900",
  subsets: ["latin"],
});

interface FormErrors {
  name?: string;
  owner?: string;
  price?: string;
  image?: string;
}

interface NFTMetadata {
  id: string;
  name: string;
  description: string;
  imageData: string;
  owner: string;
  price: string;
  createdAt: number;
  txHash?: string;
}

export default function CreateNFT() {
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageData, setImageData] = useState<string>("");
  const [contract, setContract] = useState<Contract>();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [accountData, setAccountData] = useState<AccountType | null>(null);

  const contractAddress = "0x5AaA1c838039a4dD3C8E4fc86BB9c5b4387f40Ee";

  useEffect(() => {
    const initializeProvider = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const balance = await provider.getBalance(address);

          const accountData = {
            address,
            balance: ethers.formatEther(balance)
          };
          setAccountData(accountData);
          setProvider(provider);
          setSigner(signer);
        } catch (error) {
          console.error('Error initializing provider:', error);
        }
      }
    };

    initializeProvider();
  }, []);

  useEffect(() => {
    if (!provider || !signer) return;

    const initialize = async () => {
      try {
        const code = await provider.getCode(contractAddress);
        if (code === '0x') {
          console.error('No contract found at address:', contractAddress);
          return;
        }

        const nftContract = new ethers.Contract(
          contractAddress,
          contractABI.abi,
          signer
        );

        setContract(nftContract);
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initialize();
  }, [provider, signer]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!owner.trim()) {
      newErrors.owner = "Owner address is required";
    } else if (!ethers.isAddress(owner)) {
      newErrors.owner = "Invalid Ethereum address";
    }

    if (!price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (!imageData) {
      newErrors.image = "Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveNFTToLocalStorage = (nftData: NFTMetadata) => {
    const existingNFTs = JSON.parse(localStorage.getItem('userNFTs') || '[]');
    existingNFTs.push(nftData);
    localStorage.setItem('userNFTs', JSON.stringify(existingNFTs));
  };

  const handleCreateNFT = async () => {
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    if (!signer || !provider) {
      toast.error('Wallet not connected');
      return;
    }

    setIsLoading(true);

    try {
      // Convert price to wei
      const priceInWei = ethers.parseEther(price);

      // Call the createNFT function
      const tx = await contract!.createNFT(name, priceInWei);
      await tx.wait();

      // Save NFT metadata to local storage
      const nftData: NFTMetadata = {
        id: tx.hash, // Use transaction hash as a temporary ID
        name,
        description,
        imageData,
        owner,
        price,
        createdAt: Date.now(),
        txHash: tx.hash,
      };
      saveNFTToLocalStorage(nftData);

      // Show success toast
      toast.success('NFT created successfully!');

      // Reset form state
      resetForm();

      console.log('NFT created with transaction hash:', tx.hash);
    } catch (error) {
      console.error('Error creating NFT:', error);
      toast.error('Failed to create NFT');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setOwner("");
    setPrice("");
    setDescription("");
    setImageData("");
    setErrors({});
  };

  const handleImageUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) { 
      toast.error('File size too large. Please upload an image under 10MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a JPEG, PNG, or GIF');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageData(base64String);
        setErrors(prev => ({ ...prev, image: undefined }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image');
    }
  };

  return (
    <div className="p-6 bg-[#111111] min-h-screen">
      <h2 className={`text-white text-3xl mb-2 ${archivo.className}`}>Create an NFT</h2>
      <p className="mb-8 text-gray-400">
        Once your item is minted you will not be able to change any of its information.
      </p>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <FileUpload onFileSelect={handleImageUpload} />
          {errors.image && <p className="text-red-500 mt-2">{errors.image}</p>}
        </div>

        <div className="w-full md:w-2/3 space-y-6">
          <div>
            <label className="block text-white font-bold mb-2">Name *</label>
            <input
              type="text"
              placeholder="Name your NFT"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-3 bg-gray-800 border ${
                errors.name ? 'border-red-500' : 'border-gray-600'
              } rounded-lg text-white`}
            />
            {errors.name && <p className="text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-white font-bold mb-2">Owner Address *</label>
            <input
              type="text"
              placeholder="0x..."
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className={`w-full p-3 bg-gray-800 border ${
                errors.owner ? 'border-red-500' : 'border-gray-600'
              } rounded-lg text-white`}
            />
            {errors.owner && <p className="text-red-500 mt-1">{errors.owner}</p>}
          </div>

          <div>
            <label className="block text-white font-bold mb-2">Price in ETH *</label>
            <input
              type="number"
              step="0.000001"
              placeholder="0.1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={`w-full p-3 bg-gray-800 border ${
                errors.price ? 'border-red-500' : 'border-gray-600'
              } rounded-lg text-white`}
            />
            {errors.price && <p className="text-red-500 mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-white font-bold mb-2">Description</label>
            <textarea
              placeholder="Enter a description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
            />
          </div>

          <button
            onClick={handleCreateNFT}
            disabled={isLoading}
            className={`w-full p-4 rounded-lg font-bold text-white ${
              isLoading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isLoading ? "Creating..." : "Create NFT"}
          </button>
        </div>
      </div>
    </div>
  );
}