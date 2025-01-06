'use client'
import React from 'react';
import { Space_Mono } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

const spaceMono = Space_Mono({
  weight: '400',
  subsets: ['latin']
});

const Navbar = () => {
  const pathname = usePathname();
  
  if (pathname === '/wallet') return null;
  if (pathname === '/home') return null;
  
  return (
    <nav className={`bg-[#191B21] ${spaceMono.className} text-white p-2 border-b border-zinc-800 max-ipad:p-4`}>
      <div className="max-w-[85rem] mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/images/logo.png" alt="SuperRobots" width={150} height={40} className="mr-2" />
        </Link>

        <div className="flex-1 flex items-center justify-center gap-8 max-ipad:hidden">
          <Link href="/faq" className="hover:text-gray-300">FAQ</Link>
          <Link href="/roadmap" className="hover:text-gray-300">Roadmap</Link>
          <span className="text-gray-500">Soon</span>
          <Link href="/opensea" className="hover:text-gray-300">OpenSea</Link>
          <Link href="/twitter" className="hover:text-gray-300">Twitter</Link>
        </div>

        <Link 
          href="/wallet" 
          className="bg-white bg-opacity-10 px-4 py-2 rounded hover:bg-zinc-700 hover:text-zinc-400 transition-colors max-ipad:hidden"
        >
          Connect Wallet
        </Link>

        <Menu className='hidden max-ipad:block'/>
      </div>
    </nav>
  );
};

export default Navbar;