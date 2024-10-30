'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { usePathname } from 'next/navigation';
import useMenuMobile from '@/store/useMenuMobile';
import { useModalSearchContext } from '@/context/ModalSearchContext';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useCategories } from '@/actions/blog';

const MegaMenu = dynamic(() => import('./MegaMenu'), { ssr: false });

interface Props {
    props: string;
}

const MenuOne: React.FC<Props> = ({ props }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { openMenuMobile, handleMenuMobile } = useMenuMobile();
    const { categories, isLoading } = useCategories();
    const { openModalSearch } = useModalSearchContext();

    const [fixedHeader, setFixedHeader] = useState(false);
    const [lastScrollPosition, setLastScrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setFixedHeader(scrollPosition > 0 && scrollPosition < lastScrollPosition);
            setLastScrollPosition(scrollPosition);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollPosition]);

    return (
        <>
            <div className={`header-menu style-one ${fixedHeader ? 'fixed' : 'absolute'} top-0 left-0 right-0 w-full md:h-[74px] h-[56px] ${props}`}>
                <div className="container mx-auto h-full">
                    <div className="header-main flex justify-between h-full">
                    
                        <div className="left flex items-center gap-16">
                            <Link href='/' className='flex items-center max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2'>
                                <Image 
                                    src='/images/logo.png' 
                                    alt='Home Decor Logo' 
                                    width={200} 
                                    height={100} 
                                    className="heading4"
                                />
                            </Link>
                            <MegaMenu 
                                categories={categories || []}
                            
                            
                            />
                        </div>
                        <div className="right flex gap-12">
                            <div className="list-action flex items-center gap-4">
                                <div className="search-icon flex items-center justify-center cursor-pointer">
                                    <Icon.MagnifyingGlass size={24} color='black' onClick={openModalSearch} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MenuOne;