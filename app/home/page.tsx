'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import { Space_Mono } from 'next/font/google';
import { Twitter, HelpCircle, Gift, Box, FileText, PackagePlus } from 'lucide-react';
import Image from 'next/image';
import { MarketPlace, Robots, CreateNFT, CrowdFunding } from '../components';
import { FaBars, FaTimes } from 'react-icons/fa';

const spaceMono = Space_Mono({
  weight: '400',
  subsets: ['latin']
});

const MyRobots = () => (
  <Robots />
);

const CrowdFundingg = () => (
  <CrowdFunding />
);

const BuyRobot = () => (
  <MarketPlace />
);

const Twitterr = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-200 mb-4">Twitter</h2>
    <div className="text-gray-300">Twitter feed will appear here</div>
  </div>
);

const create = () => (
  <CreateNFT />
)

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [activePage, setActivePage] = useState("myRobots");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const address = localStorage.getItem("walletAddress");
      setWalletAddress(address || "Not Connected");
    }
  }, []);

  const menuItems = [
    { id: 'myRobots', label: 'My Robots', icon: Box, component: MyRobots },
    { id: 'Crowdfunding', label: 'Crowd Funding', icon: Gift, badge: '5', component: CrowdFundingg },
    { id: 'buyRobot', label: 'Buy Robot', icon: Box, component: BuyRobot },
    { id: 'twitter', label: 'Twitter', icon: Twitter, component: Twitterr },
    { id: 'create nft', label: "Create Nft", icon: PackagePlus, component: create },
  ];

  const ActiveComponent = menuItems.find(item => item.id === activePage)?.component || MyRobots;

  return (
    <div className={`bg-[#111111] min-h-screen ${spaceMono.className} flex`}>
      <button
        className="fixed top-4 right-4 z-50 p-2 text-gray-300 bg-zinc-800 rounded-lg md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>
      <nav
        className={`w-[17rem] p-6 text-gray-300 border-r border-zinc-900 h-[100vh] fixed bg-[#111111] transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
      >
        <div className="mb-6 ml-[0.5rem]">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Image src="/images/logo.png" alt="logo" width={180} height={120} />
          </h1>
        </div>
        <div className="space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActivePage(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 ${activePage === item.id ? 'bg-zinc-700 bg-opacity-30' : ''
                }`}
            >
              <item.icon size={22} color='gray' />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-1 bg-blue-600 text-xs px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </div>
        <div className="absolute bottom-4 flex items-center gap-2 text-sm text-gray-500">
          <Image src='/images/default_avatar.png' alt='default avatar' width={30} height={40} />
          <span className="truncate w-[18ch]">
            {walletAddress}
          </span>
        </div>
      </nav>
      <main
        className={`ml-0 flex-1 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } md:ml-[17rem]`}
      >
        <ActiveComponent />
      </main>
    </div>
  );
}