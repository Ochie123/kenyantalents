import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { Drawer, IconButton, List, Box } from '@mui/material';
import { X, Menu as MenuIcon } from 'lucide-react';
import { LuAlignRight } from "react-icons/lu";
import { Category } from '@/types/category';

interface MegaMenuProps {
    categories: Category[];
}

const MegaMenu: React.FC<MegaMenuProps> = ({ categories = [] }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openSubNavMobile, setOpenSubNavMobile] = useState<number | null>(null);

    // Organize categories into parent-child structure
    const categoriesMap = categories.reduce<Record<string, { url: string; title: string; children: Category[] }>>((acc, category) => {
        if (!category.parent) {
            if (!acc[category.url]) {
                acc[category.url] = {
                    url: category.url,
                    title: category.title,
                    children: []
                };
            }
        } else {
            if (!acc[category.parent]) {
                const parentCategory = categories.find(c => c.url === category.parent);
                acc[category.parent] = {
                    url: category.parent,
                    title: parentCategory?.title || '',
                    children: []
                };
            }
            acc[category.parent].children.push(category);
        }
        return acc;
    }, {});

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMobileSubNav = (e: React.MouseEvent, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenSubNavMobile(openSubNavMobile === index ? null : index);
    };

    const handleCategoryClick = (categoryId: string) => {
        router.push(`/blog/front?category=${categoryId}`);
        setMobileOpen(false);
    };

    // Mobile Drawer Content
    const drawerContent = (
        <Box sx={{ width: 280 }} role="presentation">
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 2, 
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
            }}>
                <Link href="/" onClick={() => setMobileOpen(false)}>
                    {/* Logo component here */}
                </Link>
                <IconButton onClick={handleDrawerToggle}>
                    <X />
                </IconButton>
            </Box>

            <List sx={{ p: 0 }}>
                {Object.values(categoriesMap).map((parentCategory, index) => (
                    <div key={parentCategory.url} className='border-b border-gray-100'>
                        <button
                            className='w-full flex items-center justify-between py-3 px-4 cursor-pointer hover:bg-gray-50'
                            onClick={(e) => handleMobileSubNav(e, index)}
                        >
                            <span className={`text-lg ${pathname.includes(parentCategory.url) ? 'text-primary' : ''}`}>
                                {parentCategory.title}
                            </span>
                            {parentCategory.children.length > 0 && (
                                <Icon.CaretDown 
                                    size={20} 
                                    className={`transform transition-transform duration-300 ${
                                        openSubNavMobile === index ? 'rotate-180' : ''
                                    }`}
                                />
                            )}
                        </button>

                        {parentCategory.children.length > 0 && (
                            <div 
                                className={`transition-all duration-300 ease-in-out ${
                                    openSubNavMobile === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                                }`}
                            >
                                <ul className='bg-gray-50'>
                                    {parentCategory.children.map((child) => (
                                        <li key={child.url}>
                                            <button
                                                className={`w-full text-left block py-3 px-8 text-sm hover:bg-gray-100 ${
                                                    pathname === child.url ? 'text-primary' : 'text-gray-600'
                                                }`}
                                                onClick={() => handleCategoryClick(child.url.split('/').filter(Boolean).pop())}
                                            >
                                                {child.title}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            {/* Mobile Menu Toggle Button - Now visible from xs to md */}
        
            <div className="md:hidden" onClick={handleDrawerToggle}>
            <LuAlignRight className="text-3xl" />
            </div>

            {/* Desktop Menu - Hidden on mobile, visible from md up */}
            <div className="hidden md:block h-full">
                <ul className='flex items-center gap-8 h-full'>
                    {Object.values(categoriesMap).map((parentCategory) => (
                        <li key={parentCategory.url} className='h-full relative group'>
                            <Link 
                                href="#!" 
                                className={`pages font-medium hidden gap-8 lg:flex flex-1 justify-center ${
                                    pathname.includes(parentCategory.url) ? 'active' : ''
                                }`}
                            >
                                {parentCategory.title}
                            </Link>
                            {parentCategory.children.length > 0 && (
                                <div className="sub-menu absolute top-full left-0 py-3 px-5 bg-white rounded-b-xl shadow-lg invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 min-w-[200px] -left-10">
                                    <ul className='w-full'>
                                        {parentCategory.children.map((child) => (
                                            <li key={child.url}>
                                                <Link
                                                    href={`/blog/front?category=${child.url.split('/').filter(Boolean).pop()}`}
                                                    className={`link text duration-300 block py-2 px-4 hover:bg-gray-50 rounded ${
                                                        pathname === child.url ? 'active' : ''
                                                    }`}
                                                >
                                                    {child.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Mobile Drawer - Aligned with mobile menu visibility */}
            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true
                }}
                sx={{
                    '& .MuiDrawer-paper': { 
                        width: '80%',
                        maxWidth: '320px',
                        boxSizing: 'border-box'
                    },
                    display: { md: 'none' }  // Hide drawer from md breakpoint up
                }}
            >
                {drawerContent}
            </Drawer>
        </>
    );
};

export default MegaMenu;