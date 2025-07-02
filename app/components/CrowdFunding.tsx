'use client';
import React, { useEffect, useState, memo } from 'react';
import { Bookmark, Users, Clock, Plus, Upload } from 'lucide-react';
import { Archivo } from 'next/font/google';
import Image from 'next/image';
import { BrowserProvider, ethers, JsonRpcSigner, Contract } from 'ethers';
import contractABI from '../artifacts/contracts/CrowdFunding.sol/CrowdFunding.json';
import { AccountType } from '../wallet/page';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const archivo = Archivo({
  weight: '900',
  subsets: ['latin'],
});

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

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

interface CreateCampaignForm {
  title: string;
  description: string;
  imageURI: string;
  goal: string;
  duration: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <input
        type="file"
        id="file-upload"
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer flex flex-col items-center space-y-2"
      >
        <Upload className="w-8 h-8 text-gray-400" />
        <span className="text-gray-500">Click to upload campaign image</span>
      </label>
    </div>
  );
};

const CreateCampaignModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
  createForm: CreateCampaignForm;
  setCreateForm: React.Dispatch<React.SetStateAction<CreateCampaignForm>>;
  handleFileSelect: (file: File) => void;
  uploadStatus: string;
}> = memo(({ isOpen, onClose, onCreate, createForm, setCreateForm, handleFileSelect, uploadStatus }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Campaign</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Campaign Title"
            value={createForm.title}
            onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded"
          />

          <textarea
            placeholder="Campaign Description"
            value={createForm.description}
            onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded h-32"
          />

          <div className="space-y-2">
            <FileUpload onFileSelect={handleFileSelect} />
            {uploadStatus && (
              <p className={`text-sm ${uploadStatus === 'Upload successful!' ? 'text-green-600' :
                  uploadStatus === 'Uploading...' ? 'text-blue-600' :
                    'text-red-600'
                }`}>
                {uploadStatus}
              </p>
            )}
          </div>

          <input
            type="text"
            placeholder="Goal (ETH)"
            value={createForm.goal}
            onChange={(e) => setCreateForm(prev => ({ ...prev, goal: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded"
          />

          <input
            type="number"
            placeholder="Duration (days)"
            value={createForm.duration}
            onChange={(e) => setCreateForm(prev => ({ ...prev, duration: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onCreate}
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={!createForm.imageURI || !createForm.title || !createForm.goal}
          >
            Create Campaign
          </button>
        </div>
      </div>
    </div>
  );
});

const CrowdFunding = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [accountData, setAccountData] = useState<AccountType | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [createForm, setCreateForm] = useState<CreateCampaignForm>({
    title: '',
    description: '',
    imageURI: '',
    goal: '',
    duration: '30',
  });

  const contractAddress = '0x076f284109314aB7580A567fA40b1eA985F9BF25';

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
        const campaigns = await crowdFundingContract.getAllCamapigns();
        setCampaigns(campaigns);
      } catch (error) {
        console.error('Error initializing contract:', error);
      }
    };

    initializeContract();
  }, [provider, signer]);

  const handleFileSelect = async (file: File) => {
    setUploadedFile(file);
    setUploadStatus('Uploading...');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.filePath) {
        setCreateForm(prev => ({ ...prev, imageURI: response.data.filePath }));
        setUploadStatus('Upload successful!');
        toast.success('Image uploaded successfully!');
      }
      setUploadedFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Upload failed');
      toast.error('Failed to upload image');
    }
  };

  const handlePayment = async () => {
    if (!contract || !selectedCampaign || !paymentAmount) return;
    try {
      const amountInWei = ethers.parseEther(paymentAmount);
      const tx = await contract.contribute(selectedCampaign.id, { value: amountInWei });
      await tx.wait();
      const updatedCampaigns = await contract.getAllCamapigns();
      setCampaigns(updatedCampaigns);

      setIsModalOpen(false);
      setSelectedCampaign(null);
      setPaymentAmount('');
    } catch (error) {
      console.error('Error making payment:', error);
    }
  };

  const handleCreateCampaign = async () => {
    if (!contract) return;

    try {
      const goalInWei = ethers.parseEther(createForm.goal);
      const startTime = Math.floor(Date.now() / 1000);
      const endTime = startTime + (parseInt(createForm.duration) * 24 * 60 * 60);

      const tx = await contract.createCampaign(
        createForm.title,
        createForm.description,
        createForm.imageURI,
        goalInWei,
        endTime
      );
      await tx.wait();

      const updatedCampaigns = await contract.getAllCamapigns();
      setCampaigns(updatedCampaigns);

      setCreateForm({
        title: '',
        description: '',
        imageURI: '',
        goal: '',
        duration: '30',
      });
      setIsCreateModalOpen(false);
      setUploadedFile(null);
      setUploadStatus('');
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
    const progress = Number((campaign.totalContributions * BigInt(100)) / campaign.goal);
    const daysLeft = Math.floor(
      (Number(campaign.endsAt) - Math.floor(Date.now() / 1000)) / 86400
    );

    return (
      <div className="w-full max-w-[25rem] bg-opacity-15 bg-white rounded-xl p-6 backdrop-blur-sm cursor-pointer"
        onClick={() => {
          setSelectedCampaign(campaign);
          setIsModalOpen(true);
        }}
      >
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
    <div className="min-h-screen p-8 relative">
      <h1 className={`text-3xl font-bold mb-8 text-white bg-clip-text ${archivo.className}`}>
        Crowd Funding
      </h1>

      <div className="flex flex-wrap gap-6 justify-start">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id.toString()} campaign={campaign} />
        ))}
      </div>

      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
      >
        <Plus className="w-8 h-8 text-white" />
      </button>

      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setUploadedFile(null);
          setUploadStatus('');
        }}
        onCreate={handleCreateCampaign}
        createForm={createForm}
        setCreateForm={setCreateForm}
        handleFileSelect={handleFileSelect}
        uploadStatus={uploadStatus}
      />

      {isModalOpen && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Contribute to {selectedCampaign.title}</h2>
            <input
              type="text"
              placeholder="Amount in ETH"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrowdFunding;