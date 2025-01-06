'use client';
import React, { useEffect, useState } from 'react';
import { Space_Mono } from 'next/font/google';
import { Twitter, HelpCircle, Gift, Box, FileText } from 'lucide-react';
import Image from 'next/image';

const spaceMono = Space_Mono({
  weight: '400',
  subsets: ['latin']
});

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const address = localStorage.getItem("walletAddress");
      setWalletAddress(address || "Not Connected");
    }
  }, []);

  return (
    <div className={`bg-[#111111] min-h-screen ${spaceMono.className}`}>
      <nav className="w-[17rem] p-6 text-gray-300 border-r border-zinc-900 h-[100vh]">
        <div className="mb-6 ml-[0.5rem]">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Image src="/images/logo.png" alt="logo" width={180} height={120} />
          </h1>
        </div>

        <div className="space-y-2">
          <a href="#" className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg">
            <Box size={22} color='gray' />
            <span>My Robots</span>
          </a>

          <a href="#" className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg">
            <Gift size={22} color='gray' />
            <span>Invite friends</span>
            <span className="ml-1 bg-blue-600 text-xs px-1.5 py-0.5 rounded-full">5</span>
          </a>

          <a href="#" className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg">
            <FileText size={22} color='gray' />
            <span>Roadmap</span>
            <span className="text-xs text-gray-500">Soon</span>
          </a>

          <a href="#" className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg">
            <HelpCircle size={22} color='gray'/>
            <span>FAQ</span>
          </a>

          <a href="#" className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg">
            <Box size={22} color='gray'/>
            <span>Buy Robot</span>
          </a>

          <a href="#" className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg">
            <Twitter size={22} color='gray' />
            <span>Twitter</span>
          </a>
        </div>

        <div className="absolute bottom-4 flex items-center gap-2 text-sm text-gray-500">
          <Image src = '/images/default_avatar.png' alt='default avatar' width={30} height={40}></Image>
          <span className="truncate w-[18ch]">
            {walletAddress}
          </span>
        </div>
      </nav>
    </div>
  );
}
