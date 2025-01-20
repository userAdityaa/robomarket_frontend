import Image from 'next/image'

export default function Roadmap() { 
    return (
        <div>
            <Image src = '/images/Roadmap.svg' alt='robots image' width={200} height={200} className='w-[80vw]'></Image>
        </div>
    )
}