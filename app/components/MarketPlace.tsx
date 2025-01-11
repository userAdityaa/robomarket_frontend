import React, { useEffect, useState } from 'react';
import { Heart, ChevronRight } from 'lucide-react';
import { Archivo } from 'next/font/google';
import contractABI from '../../../contracts/artifacts/contracts/NFT.sol/NFTMarketplaceToken.json'
import { ethers } from 'ethers';
import { getProvider, getSigner } from '../hooks/useMetaMask';
import { BrowserProvider } from 'ethers';
import { Contract } from 'ethers';


const archivo = Archivo({
  weight: '900',
  subsets: ['latin']
});


interface NFTCardProps {
    image: string;
    title: string;
    creator: string;
    price: string;
    priceUSD: string;
    change: number;
  }

const NFTCard: React.FC<NFTCardProps> = ({ image, title, creator, price, priceUSD, change }) => (
  <div className="relative bg-opacity-15 bg-white rounded-xl p-4 backdrop-blur-sm">
    <div className="aspect-square rounded-lg overflow-hidden mb-3">
      <img src={image || "/api/placeholder/400/400"} alt={title} className="w-full h-full object-cover" />
    </div>
    <h3 className="text-white font-semibold mb-1">{title}</h3>
    <p className="text-gray-400 text-sm mb-3">{creator}</p>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-white font-medium">{price} ETH</p>
        <p className="text-gray-400 text-sm">Floor Price</p>
      </div>
      <div className="text-right">
        <p className="text-white">${priceUSD}</p>
        <p className={`text-sm ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change > 0 ? '+' : ''}{change}%
        </p>
      </div>
    </div>
  </div>
);

export const MarketPlace = () => {

  const [provider, setProvider] = useState<BrowserProvider>();
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState<Contract>();
  const [mintPrice, setMintPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const collections = [
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


  useEffect(() => {
    const initialize = async () => {
      const signer = await getSigner();
      const nftContract = new ethers.Contract(
        contractAddress, 
        contractABI.abi, 
        signer
      );

      setProvider(await getProvider());
      setAccount(localStorage.getItem("walletAddress")!);
      setContract(nftContract);
      const price = await nftContract.mintPrice();
      setMintPrice(ethers.formatEther(price));
    };

    initialize();
  }, []);


  const handleMint = async() => { 
    try { 
      if(!contract) { 
        throw new Error("Contract not initialized.");
      }

      const tx = await contract.mint(account, {
        value: ethers.parseEther(mintPrice)
      });

      await tx.wait();
    } catch (error) { 
      console.error("Failed to Mint.", error);
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
        {collections.map((collection) => (
          <NFTCard key={collection.title} {...collection} />
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