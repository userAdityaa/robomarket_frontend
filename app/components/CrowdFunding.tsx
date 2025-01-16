import React from 'react';
import { Bookmark, Users, Clock } from 'lucide-react';
import { Archivo } from 'next/font/google';

const archivo = Archivo({
  weight: '900',
  subsets: ['latin']
});

const campaigns = [
  {
    id: 1,
    title: "Sneakers Charcoal Lime",
    raised: 1400,
    total: 2000,
    patrons: 250,
    daysLeft: 10,
    image: "/images/chuks.png"
  },
  {
    id: 2,
    title: "Hoodie Lime",
    raised: 3200,
    total: 5000,
    patrons: 425,
    daysLeft: 15,
    image: "/images/greent.png"
  },
  {
    id: 3,
    title: "Inflatable Puffer Smiley Lime",
    raised: 800,
    total: 1500,
    patrons: 120,
    daysLeft: 8,
    image: "/images/clothes-2.png"
  },
  {
    id: 4,
    title: "Sky",
    raised: 12000,
    total: 15000,
    patrons: 890,
    daysLeft: 20,
    image: "/images/pipe.png"
  }
];

function CampaignCard({ campaign }: any) {
  const progress = (campaign.raised / campaign.total) * 100;
  
  return (
    <div className="w-full max-w-[25rem] bg-opacity-15 bg-white rounded-xl p-6 backdrop-blur-sm">
      <div className="mb-6 relative">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-80 object-fit rounded-lg"
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
            <span>${campaign.raised} raised</span>
            <span>${campaign.total} total</span>
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
            <span>{campaign.patrons} patrons</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300">
            <Clock className="w-5 h-5" />
            <span>{campaign.daysLeft} days left</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CrowdFunding() {
  return (
    <div className="min-h-screen p-8">
      <h1 className={`text-3xl font-bold mb-8 text-white bg-clip-text ${archivo.className}`}>
        Crowd Funding
      </h1>
      <div className="flex flex-wrap gap-6 justify-start">
        {campaigns.map(campaign => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
}