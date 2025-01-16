'use client';
import React, { useEffect, useState } from 'react';
import { Bookmark, Users, Clock } from 'lucide-react';
import { Archivo } from 'next/font/google';
import { BrowserProvider, ethers, JsonRpcSigner, Contract } from 'ethers';
import contractABI from '../artifacts/contracts/CrowdFunding.sol/CrowdFunding.json';
import { AccountType } from '../wallet/page';

const archivo = Archivo({
  weight: '900',
  subsets: ['latin'],
});

interface Campaign {
  id: number;
  title: string;
  description: string;
  imageURI: string;
  goal: bigint;
  startsAt: bigint;
  endsAt: bigint;
  status: number;
  totalContributions: bigint;
  contributors: string[];
  contributionAmounts: bigint[];
}

const CrowdFunding = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [accountData, setAccountData] = useState<AccountType | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const contractAddress = '0x3Bd1a89cd6D97f381035B80CdD3c2CCb1D1d7519';

  // Initialize provider and signer
  useEffect(() => {
    const initializeProvider = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const balance = await provider.getBalance(address);

          setAccountData({
            address,
            balance: ethers.formatEther(balance),
          });
          setProvider(provider);
          setSigner(signer);
        } catch (error) {
          console.error('Error initializing provider:', error);
        }
      }
    };

    initializeProvider();
  }, []);

  // Initialize contract and fetch campaigns
  useEffect(() => {
    if (!provider || !signer) return;

    const initializeContract = async () => {
      try {
        const code = await provider.getCode(contractAddress);
        if (code === '0x') {
          console.error('No contract found at address:', contractAddress);
          return;
        }

        const crowdFundingContract = new ethers.Contract(
          contractAddress,
          contractABI.abi,
          signer
        );
        setContract(crowdFundingContract);

        console.log(crowdFundingContract);
        const campaigns = await crowdFundingContract.getAllCamapigns();
        setCampaigns(campaigns);
      } catch (error) {
        console.error('Error initializing contract:', error);
      }
    };

    initializeContract();
  }, [provider, signer]);

  // CampaignCard component
  const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
    const progress = Number((campaign.totalContributions) / campaign.goal);
    const daysLeft = Math.floor(
      (Number(campaign.endsAt) - Math.floor(Date.now() / 1000)) / 86400
    );

    return (
      <div className="w-full max-w-[25rem] bg-opacity-15 bg-white rounded-xl p-6 backdrop-blur-sm">
        <div className="mb-6 relative">
          <img
            src={campaign.imageURI}
            alt={campaign.title}
            className="w-full h-80 object-cover rounded-lg"
          />
          <button className="absolute top-4 right-4 p-2 bg-opacity-20 bg-white rounded-full backdrop-blur-sm">
            <Bookmark className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="space-y-4">
          <h1 className={`text-2xl font-bold text-white ${archivo.className}`}>
            {campaign.title}
          </h1>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-300">
              <span>{ethers.formatEther(campaign.totalContributions)} ETH raised</span>
              <span>{ethers.formatEther(campaign.goal)} ETH total</span>
            </div>
            <div className="h-2 bg-opacity-20 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between pt-4 border-t border-gray-700">
            <div className="flex items-center space-x-2 text-gray-300">
              <Users className="w-5 h-5" />
              <span>{campaign.contributors.length} patrons</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Clock className="w-5 h-5" />
              <span>{daysLeft} days left</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className={`text-3xl font-bold mb-8 text-white bg-clip-text ${archivo.className}`}>
        Crowd Funding
      </h1>
      <div className="flex flex-wrap gap-6 justify-start">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id.toString()} campaign={campaign} />
        ))}
      </div>
    </div>
  );
};

export default CrowdFunding;