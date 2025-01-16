'use client';
import { Archivo } from 'next/font/google';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const archivo = Archivo({
  weight: '900',
  subsets: ['latin'],
});

interface PurchasedNFT {
  title: string;
  image: string; 
  creator: string;
  price: string;
  purchaseDate: string;
  owner: string;
}

export default function Robots() {
  const [purchasedNFTs, setPurchasedNFTs] = useState<PurchasedNFT[]>([]);
  const [walletAddress, setWalletAddress] = useState<string>('');

  useEffect(() => {
    const storedData = localStorage.getItem('walletData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setWalletAddress(parsedData.address);
    }

    try {
      const allStoredNFTs = JSON.parse(localStorage.getItem('purchasedNFTs') || '{}');
      console.log(allStoredNFTs)
      if (walletAddress && allStoredNFTs[walletAddress]) {
        setPurchasedNFTs(allStoredNFTs[walletAddress]);
      }
    } catch (error) {
      console.error('Error loading purchased NFTs:', error);
    }
  }, [walletAddress]);

  return (
    <div className="p-6 bg-[#111111] min-h-screen">
      <h1 className={`text-white ${archivo.className} text-3xl mb-6`}>My Robots</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {purchasedNFTs.length > 0 ? (
          purchasedNFTs.map((nft, index) => (
            <div key={`${nft.title}-${index}`} className="bg-[#1a1a1a] rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <h2 className={`${archivo.className} text-white text-2xl`}>{nft.title}</h2>
                <span className="text-gray-400">#{index + 1}</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/images/OpenSea.png"
                  alt="OpenSea"
                  width={20}
                  height={20}
                  className="opacity-50"
                />
                <a
                  href="https://opensea.io/collection/super-robots-by-superdao"
                  className="text-gray-400 text-sm flex items-center hover:text-gray-300"
                  target="_blank"
                >
                  View on OpenSea
                  <ArrowRight size={14} className="ml-1" />
                </a>
              </div>
              <div className="relative aspect-square mb-4 bg-[#e8f5d3] rounded-2xl overflow-hidden">
                {/* Use the base64 string directly in the src attribute */}
                <Image
                  src={nft.image}
                  alt={nft.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white py-3 px-4 rounded-xl">
                  Open
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          // Default empty state
          <div className="bg-[#1a1a1a] rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className={`${archivo.className} text-white text-2xl`}>Super Robot</h2>
              <span className="text-gray-400">#4542</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/images/OpenSea.png"
                alt="OpenSea"
                width={20}
                height={20}
                className="opacity-50"
              />
              <a
                href="https://opensea.io/collection/super-robots-by-superdao"
                className="text-gray-400 text-sm flex items-center hover:text-gray-300"
                target="_blank"
              >
                View on OpenSea
                <ArrowRight size={14} className="ml-1" />
              </a>
            </div>
            <div className="relative aspect-square mb-4 bg-[#e8f5d3] rounded-2xl overflow-hidden">
              <Image
                src="/images/empty_robot.png"
                alt="Super Robot #4542"
                fill
                className="object-fill"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white py-3 px-4 rounded-xl">
                Open
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        <div className="bg-[#1a1a1a] rounded-3xl p-6 relative">
          <div className="h-full flex flex-col items-center text-center py-20">
            <h2 className={`${archivo.className} text-white text-3xl mb-4`}>Get more Robots</h2>
            <p className="text-gray-400 mb-8">
              Expand your collection — get new robots on OpenSea
            </p>
            <a href="https://opensea.io/collection/super-robots-by-superdao" target="_blank">
              <button className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white py-3 px-6 rounded-xl">
                Buy on OpenSea
              </button>
            </a>
            <Image
              src="/images/Image.png"
              alt="row robot image"
              height={50}
              width={800}
              className="w-[90rem] mt-[12rem] absolute bottom-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}