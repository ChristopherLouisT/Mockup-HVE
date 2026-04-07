"use client";
import Image from 'next/image';
import headerImg from '@/app/img/header.jpeg';

const Header = () => {
    return (
        <div className="w-full">
      <Image
        src={headerImg}
        alt="Header"
        className="w-full h-[140px]"
        priority
      />
    </div>
    )
};

export default Header;