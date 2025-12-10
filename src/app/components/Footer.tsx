import Image from 'next/image'
import React from 'react'
import FacebookIcon from '@mui/icons-material/Facebook';
import { Call, Facebook, Instagram } from '@mui/icons-material';
import Link from 'next/link';

const Footer = () => {
  return (
    <div className="w-full bg-amber-200 mt-8 pt-4 pb-4 rounded text-lg">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:px-6">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/images/restaurente.png"
            alt="Restaurant Logo"
            width={80}
            height={80}
            priority
          />
          <p className="mt-2 text-lg font-medium">Privacy Policy</p>
        </div>
        <div className="flex gap-6">
          <Link
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:scale-110 transition-transform"
          >
            <Facebook fontSize="large" />
          </Link>
          <Link
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 hover:scale-110 transition-transform"
          >
            <Instagram fontSize="large" />
          </Link>
        </div>
      </div>
    </div>
  );

}

export default Footer