'use client';
import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Archivo } from 'next/font/google';
import { ethers } from 'ethers';
import contractABI from '../artifacts/contracts/NFT.sol/NFTMarketplaceToken.json';

const archivo = Archivo({
  weight: '900',
  subsets: ['latin'],
});

interface PurchasedNFT {
  tokenId: number;
  title: string;
  image: string;
  creator: string;
  price: string;
  purchaseDate: string;
  owner: string;
  metadataURI: string;
}

interface CollectionNFT {
  image: string;
  title: string;
  creator: string;
  price: string;
  priceUSD: string;
  change: number;
  metadataURI: string;
}

interface NFTCardProps {
  image: string;
  title: string;
  creator: string;
  mintPrice: string;
  priceUSD: string;
  change: number;
  onMint: () => Promise<void>;
}

const NFTCard: React.FC<NFTCardProps> = ({ image, title, creator, mintPrice, priceUSD, change, onMint }) => (
  <div className="relative bg-opacity-15 bg-white rounded-xl p-4 backdrop-blur-sm">
    <div className="aspect-square rounded-lg overflow-hidden mb-3">
      <img src={image || "/api/placeholder/400/400"} alt={title} className="w-full h-full object-cover" />
    </div>
    <h3 className="text-white font-semibold mb-1">{title}</h3>
    <p className="text-gray-400 text-sm mb-3">{creator}</p>
    <div className="flex justify-between items-center mb-4">
      <div>
        <p className="text-white font-medium">{mintPrice} ETH</p>
        <p className="text-gray-400 text-sm">Mint Price</p>
      </div>
      <div className="text-right">
        <p className="text-white">${priceUSD}</p>
        <p className={`text-sm ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change > 0 ? '+' : ''}{change}%
        </p>
      </div>
    </div>
    <button 
      onClick={onMint}
      className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
    >
      Mint NFT
    </button>
  </div>
);

export const MarketPlace = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider>();
  const [signer, setSigner] = useState<ethers.JsonRpcSigner>();
  const [accountData, setAccountData] = useState<{ address: string; balance: string }>();
  const [contract, setContract] = useState<ethers.Contract>();
  const [mintPrice, setMintPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [availableCollections, setAvailableCollections] = useState<CollectionNFT[]>([]);

  const contractAddress = "0xd8D343348C86b7f1Ec9e213e86ca9A1212045151";

  useEffect(() => {
    const initializeProvider = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const balance = await provider.getBalance(address);

          setAccountData({ address, balance: ethers.formatEther(balance) });
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

    const initializeContract = async () => {
      try {
        const nftContract = new ethers.Contract(contractAddress, contractABI.abi, signer);
        setContract(nftContract);

        const price = await nftContract.mintPrice();
        setMintPrice(ethers.formatEther(price));

        console.log(nftContract)
        const allNFTs = await nftContract.getAllNFTs();
        const collections: CollectionNFT[] = allNFTs.map((nft: any) => ({
          image: nft.imageURL,
          title: nft.name,
          creator: nft.creator,
          price: ethers.formatEther(nft.price),
          priceUSD: "0", 
          change: 0, 
          metadataURI: nft.name,
        }));

        setAvailableCollections(collections);
      } catch (error) {
        console.error('Error initializing contract:', error);
      }
    };

    initializeContract();
  }, [provider, signer]);

  const handleMint = async (nftData: CollectionNFT) => {
    try {
      setLoading(true);
      setMessage('Creating NFT...');

      if (!contract || !accountData?.address) {
        throw new Error("Contract not initialized or wallet not connected");
      }

      // Step 1: Create the NFT
      const createTx = await contract.createNFT(nftData.title, nftData.metadataURI, ethers.parseEther(nftData.price));
      setMessage('Waiting for NFT creation confirmation...');
      await createTx.wait();

      // Step 2: Mint the NFT
      setMessage('Minting NFT...');
      const mintTx = await contract.mintNFT(0, accountData.address, { value: ethers.parseEther(mintPrice) });
      setMessage('Waiting for mint confirmation...');
      await mintTx.wait();

      // Save to local storage
      const purchasedNFT: PurchasedNFT = {
        tokenId: 0, // Replace with actual tokenId if available
        title: nftData.title,
        image: nftData.image,
        creator: nftData.creator,
        price: mintPrice,
        purchaseDate: new Date().toISOString(),
        owner: accountData.address,
        metadataURI: nftData.metadataURI,
      };

      saveNFTToStorage(purchasedNFT);
      setMessage('NFT Minted successfully!');
    } catch (error: any) {
      console.error("Failed to Mint:", error);
      setMessage(error.message || 'Failed to mint NFT. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveNFTToStorage = (nftData: PurchasedNFT) => {
    try {
      const allStoredNFTs = JSON.parse(localStorage.getItem('purchasedNFTs') || '{}');
      const walletNFTs = allStoredNFTs[nftData.owner] || [];
      const updatedWalletNFTs = [...walletNFTs, nftData];
      const updatedStorage = {
        ...allStoredNFTs,
        [nftData.owner]: updatedWalletNFTs,
      };
      localStorage.setItem('purchasedNFTs', JSON.stringify(updatedStorage));
    } catch (error) {
      console.error('Error saving NFT to localStorage:', error);
    }
  };

  const categories = ["Art", "Collectibles", "Metaverse", "Virtual Worlds", "Sports", "Music"];

  return (
    <div className="min-h-screen p-8">
      <h1 className={`text-3xl font-bold mb-8 text-white bg-clip-text ${archivo.className}`}>
        Top Collections
      </h1>

      <div className="flex gap-4 mb-8 overflow-x-auto">
        {categories.map((category, index) => (
          <button
            key={category}
            className={`px-6 py-2 rounded-full ${
              index === 0
                ? 'bg-blue-500 text-white'
                : 'bg-opacity-20 bg-white text-white backdrop-blur-sm'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {availableCollections.map((collection) => (
          <NFTCard
            key={collection.title}
            image={collection.image}
            title={collection.title}
            creator={collection.creator}
            mintPrice={mintPrice}
            priceUSD={collection.priceUSD}
            change={collection.change}
            onMint={() => handleMint(collection)}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <button className="px-8 py-3 rounded-full bg-opacity-20 bg-white text-white backdrop-blur-sm flex items-center gap-2">
          see more <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default MarketPlace;