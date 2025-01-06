import { Space_Mono, Archivo } from "next/font/google";
import Image from "next/image";

const spaceMono = Space_Mono({
  weight: '400',
  subsets: ['latin']
});

const archivo = Archivo({
  weight: '900',
  subsets: ['latin']
});

export default function Home() {
  return (
    <main className={`bg-zinc-900 min-h-screen text-white p-8 ${spaceMono.className} py-28`}>
      
      <div className="max-w-7xl mx-auto flex items-center justify-between max-ipad:hidden">
        <div className="max-w-xl">
          <p className="text-[#6153CC] mb-4 flex items-center gap-2 font-bold">
            <Image src="/images/Sparkling.svg" alt="sparkling" width={20} height={20} />
            Mint is paused
          </p>
          
          <h1 className={`text-6xl font-bold mb-6 ${archivo.className}`}>
            Get Your
            <br />
            SuperRobot
          </h1>
          
          <p className="text-xl mb-8 font-mono leading-tight">
            Collect and customize digital characters
            <br />
            First mint is free, no gas fees
          </p>
          
          <div className="flex gap-4 mb-12">
            <button className="bg-gradient-to-r from-orange-400 to-pink-500 px-6 py-3 rounded-lg font-mono font-bold">
              Mint for free
            </button>
            <div className="flex items-center">
              <Image src="/images/Item.png" alt="item no gas" width={140} height={100} />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Image src="/images/Minted.svg" alt="minted people" width={280} height={40} />
          </div>
        </div>

        <div className="relative">
          <Image
            src="/images/Robot.png"
            alt="SuperRobot Character"
            width={1000}
            height={600}
            className="relative z-50 w-[38rem]"
          />
        </div>
      </div>

      <div className="max-ipad:block hidden pb-30 max-ipad:overflow-x-hidden">
        <div className="flex flex-col items-center">
          <p className="text-[#6153CC] mb-4 flex items-center gap-2 font-bold">
            <Image src="/images/Sparkling.svg" alt="sparkling" width={20} height={20} />
            Mint is paused
          </p>

          <h1 className={`text-7xl font-bold mb-6 ${archivo.className} text-center leading-[4rem] max-phone:text-5xl`}>
            Get Your
            <br />
            SuperRobot
          </h1>

          <p className="text-xl mb-8 font-mono leading-tight text-center max-phone:text-[0.90rem] max-phone:w-[40rem]">
            Collect and customize digital characters
            <br />
            First mint is free, no gas fees
          </p>

          <div className="flex flex-col items-center gap-4 mb-12">
            <button className="bg-gradient-to-r from-orange-400 to-pink-500 px-6 py-3 rounded-lg font-mono font-bold">
              Mint for free
            </button>
            <div className="flex items-center">
              <Image src="/images/Item.png" alt="item no gas" width={140} height={100} />
            </div>
          </div>

          <div className="relative">
            <Image
              src="/images/Robot.png"
              alt="SuperRobot Character"
              width={1600}
              height={600}
              className="relative z-10 w-[900px]"
            />
          </div>

          <div className="flex items-center gap-2 mt-[1rem]">
            <Image src="/images/Minted.svg" alt="minted people" width={280} height={40} className="max-phone:w-[13rem]"/>
          </div>
        </div>
      </div>

    </main>
  );
}
