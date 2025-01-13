'use client';
import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Archivo } from 'next/font/google';
import { ethers } from 'ethers';
import { getProvider, getSigner } from '../hooks/useMetaMask';
import { BrowserProvider } from 'ethers';
import { Contract } from 'ethers';
import contractABI from '../artifacts/contracts/NFT.sol/NFTMarketplaceToken.json'
import { parseEther } from 'ethers';
import { JsonRpcProvider } from 'ethers';
import { AccountType } from '../wallet/page';
import { JsonRpcSigner } from 'ethers';

interface PurchasedNFT {
  title: string;
  image: string;
  creator: string;
  price: string;
  purchaseDate: string;
  owner: string;
}

interface CollectionNFT {
  image: string;
  title: string;
  creator: string;
  price: string;
  priceUSD: string;
  change: number;
}

interface MarketPlaceProps extends AccountType{}

const archivo = Archivo({
  weight: '900',
  subsets: ['latin']
});


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
  const [provider, setProvider] = useState<BrowserProvider>();
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [accountData, setAccountData] = useState<AccountType>();
  const [contract, setContract] = useState<Contract>();
  const [mintPrice, setMintPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [availableCollections, setAvailableCollections] = useState<CollectionNFT[]>([]);
  
  const collections: CollectionNFT[] = [
    {
      image: "/images/first.avif",
      title: "CoolGuyzz",
      creator: "Coolguyzz.io",
      price: "1.5",
      priceUSD: "2045.12",
      change: -12.45
    },
    {
      image: "/images/second.avif",
      title: "gangstaboi v.1",
      creator: "GB_Gangs",
      price: "2.53",
      priceUSD: "4487",
      change: 34.5
    },
    {
      image: "/images/third.avif",
      title: "HyperApe",
      creator: "HyperApe.co",
      price: "1.31",
      priceUSD: "1743.4",
      change: -5.6
    },
    {
      image: "/images/four.avif",
      title: "Lyodd$1",
      creator: "Naomi Po",
      price: "1.156",
      priceUSD: "1670",
      change: 12.45
    }, 
    {
        image: "/images/five.avif",
        title: "Container",
        creator: "Naomi Po",
        price: "1.156",
        priceUSD: "1670",
        change: 12.45
    }, 
    {
        image: "/images/six.avif",
        title: "Container-container",
        creator: "Naomi Po",
        price: "1.156",
        priceUSD: "1670",
        change: 12.45
    }, 
    {
        image: "/images/seven.avif",
        title: "seven",
        creator: "Naomi Po",
        price: "1.156",
        priceUSD: "1670",
        change: 12.45
    },
    {
    image: "/images/eight.avif",
        title: "Eight",
        creator: "Naomi Po",
        price: "1.156",
        priceUSD: "1670",
        change: 12.45
    }
  ];
  

  const contractAddress = "0xc7b96B5CAfe0E02926b73A14449F8534b66E350C"

  const filterPurchasedNFTs = (): CollectionNFT[] => { 
    if(!accountData?.address) return collections; 
    try { 
      const allStoredNFTs = JSON.parse(localStorage.getItem('purchasedNFTs') || '{}');
      const walletNFTs = allStoredNFTs[accountData.address] || [];
      const purchasedTitles: Set<string> = new Set<string>(walletNFTs.map((nft: PurchasedNFT) => nft.title));
      return collections.filter(collection => !purchasedTitles.has(collection.title));
    } catch(error) { 
      console.error(error);
      return collections;
    }
  }

  useEffect(() => {
    const filtered = filterPurchasedNFTs();
    setAvailableCollections(filtered);
  }, [accountData]);

  const saveNFTToStorage = (nftData: PurchasedNFT) => {
    try {
      const allStoredNFTs = JSON.parse(localStorage.getItem('purchasedNFTs') || '{}');
      
      const walletNFTs = allStoredNFTs[nftData.owner] || [];
      
      const updatedWalletNFTs = [...walletNFTs, nftData];
      
      const updatedStorage = {
        ...allStoredNFTs,
        [nftData.owner]: updatedWalletNFTs
      };
      
      localStorage.setItem('purchasedNFTs', JSON.stringify(updatedStorage));
      const filtered = filterPurchasedNFTs();
      setAvailableCollections(filtered);
    } catch (error) {
      console.error('Error saving NFT to localStorage:', error);
    }
  };

  useEffect(() => {
    const initializeProvider = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const storedData = localStorage.getItem('walletData');

          if (storedData) {
            const parsedData = JSON.parse(storedData);
            setAccountData(parsedData);
            setProvider(provider);
            setSigner(signer);
          }
        } catch (error) {
          console.error('Error initializing provider:', error);
        }
      }
    };

    initializeProvider();
  }, []);

  useEffect(() => {
    if (!provider) return;

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
        try {
          const price = await nftContract.mintPrice();
          const formattedPrice = ethers.formatEther(price);
          setMintPrice(formattedPrice);
        } catch (error) {
          console.error('Error getting mint price:', error);
          console.log('Contract ABI:', contractABI.abi);
        }

      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initialize();
  }, [provider]);

  const handleMint = async(nftData: Omit<PurchasedNFT, 'purchaseDate' | 'owner'>) => { 
    try { 
      setLoading(true);
      setMessage('');
      if(!contract) { 
        throw new Error("Contract not initialized.");
      }
  
      const tx = await contract?.mint(contractAddress, {
        value: parseEther(mintPrice)
      });
  
      setMessage('Minting in progress...');
      await tx.wait();
      const purchasedNFT: PurchasedNFT = {
        ...nftData,
        purchaseDate: new Date().toISOString(),
        owner: accountData?.address!
      };
      saveNFTToStorage(purchasedNFT);
      setMessage('NFT Minted successfully!');
    } catch (error) { 
      console.error("Failed to Mint.", error);
      setMessage('Failed to mint NFT. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const categories = ["Art", "Collectibles", "Metaverse", "Virtual Worlds", "Sports", "Music"];

  return (
    <div className="min-h-screen p-8">
      <h1 className={`text-3xl font-bold mb-8 text-white  bg-clip-text ${archivo.className}`}>
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
          onMint={() => handleMint({
            title: collection.title,
            image: collection.image,
            creator: collection.creator,
            price: mintPrice
          })}
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