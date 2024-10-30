// src/components/BlogLayout.tsx
import React from 'react';
//import MenuOne from './Header/Menu/MenuOne'; // Adjust the import path as necessary

const BlogLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div>
        
            <div className='blog list md:py-10 py-1'>
            <main>{children}
            </main>
            </div>
         
          
        </div>
    );
};

export default BlogLayout;