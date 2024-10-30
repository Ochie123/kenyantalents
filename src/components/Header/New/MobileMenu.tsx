// MobileMenu.js
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Category } from '@/types/category';
import Link from 'next/link';
import { X } from '@phosphor-icons/react/dist/ssr/X';

interface MobileMenuProps {
  categories: Category[];
  open: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ categories, open, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [openSubNavMobile, setOpenSubNavMobile] = useState<number | null>(null);

  const handleMobileSubNav = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenSubNavMobile(openSubNavMobile === index ? null : index);
  };

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/blog/front?category=${categoryId}`);
    onClose();
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-white z-[999] transition-transform duration-300 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <Link href="/" onClick={onClose}>
          {/* Logo component here */}
        </Link>
        <button onClick={onClose}>
          <X />
        </button>
      </div>

      <div className="p-4">
        {Object.values(categoriesMap).map((parentCategory, index) => (
          <div key={parentCategory.url} className="border-b">
            <button
              className="w-full flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50"
              onClick={(e) => handleMobileSubNav(e, index)}
            >
              <span className={`text-lg ${pathname.includes(parentCategory.url) ? 'text-primary' : ''}`}>
                {parentCategory.title}
              </span>
              {parentCategory.children.length > 0 && (
                <CaretDown
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
                <ul className="bg-gray-50">
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
      </div>
    </div>
  );
};

export default MobileMenu;