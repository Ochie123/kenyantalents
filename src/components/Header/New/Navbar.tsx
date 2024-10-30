"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import Sidebar from "./Sidebar";
import { ModeToggle } from "./ModeToggle";
import { useRouter } from "next/navigation";
import Image from 'next/image'
import Search from "./Search";
import { useCategories } from '@/actions/blog';
import MegaMenu from "../Menu/MegaMenu";

//const Footer = ()
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { categories } = useCategories();
  const router = useRouter();

  const handleSearchOpen = () => {
    setSearchOpen(true);
    window.history.pushState({ search: true }, '');
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
  };

  // Listen for back button/gesture to close search
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.search) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navItems = [
    { name: "home", path: "/" },
    { name: "about", path: "/about" },
    { name: "write", path: "/write" },
  ].filter(Boolean);

  return (
    <>
      <div className="w-full flex justify-center border-b shadow sticky left-0 bg-background/80 backdrop-blur-md top-0 z-[999]">
        <nav className="max-w-[1170px] px-8 xl:px-0 max-[500px]:px-3 w-full py-2 flex justify-between items-center">

          
        <div className="left flex items-center gap-16">
            <Link href="/" className='flex items-center max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2'>
       
                            <Image 
                                src='/images/logo.png' 
                                alt='Kenyan Talents Logo' 
                                width={100} // specify the width of your logo
                                height={100} // specify the height of your logo
                                className="heading4"
                            />
                 
            </Link>
            <MegaMenu categories={categories || []} />
          </div>

          <div className="flex justify-end items-center gap-6 flex-1">
            <div>
              <CiSearch className="text-3xl cursor-pointer" onClick={handleSearchOpen} />
            </div>
            <div>
              <ModeToggle />
            </div>
          </div>
        </nav>
      </div>
      {open && <Sidebar />}
      {searchOpen && (
        <div onClick={handleSearchClose} className='fixed flex justify-center items-center inset-0 z-[999] px-4 py-5'>
          <div className='w-full min-h-screen backdrop-blur-sm bg-background/25 fixed inset-0'></div>
          <Search mount={searchOpen} onClose={handleSearchClose} />
        </div>
      )}
    </>
  );
}

export default Navbar;