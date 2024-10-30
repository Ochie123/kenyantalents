import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCategories } from '@/actions/blog';
import { Category } from '@/types/category';

interface CategoryMenuProps {
    onCategorySelect: (categoryId: string) => void;
    activeCategory: string | null;
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({ onCategorySelect, activeCategory }) => {
    const { categories, isLoading } = useCategories();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    if (isLoading) {
        return <div>Loading categories...</div>;
    }

    const handleCategoryClick = (e: React.MouseEvent<HTMLAnchorElement>, categoryId: string) => {
        e.preventDefault();
        onCategorySelect(categoryId);
    };

    return (
        <div className="nav-link grid grid-cols-2 gap-5 gap-y-6">
            {Object.entries(categories).map(([parentUrl, parentCategory]) => (
                <div key={parentUrl} className="nav-item">
                    <div className="text-button-uppercase pb-1">
                        {parentCategory.title}
                    </div>
                    <ul>
                        {parentCategory.children.map((child: Category) => {
                            const categoryId = child.url.split('/').filter(Boolean).pop();
                            const isActive = activeCategory === categoryId;
                            
                            return (
                                <li key={child.url}>
                                    <Link
                                        href={`${pathname}?category=${categoryId}`}
                                        className={`link duration-300 ${
                                            isActive ? 'text-primary' : 'text-secondary'
                                        }`}
                                        onClick={(e) => handleCategoryClick(e, categoryId!)}
                                    >
                                        {child.title}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default CategoryMenu;
