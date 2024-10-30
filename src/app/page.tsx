import React, { Suspense } from 'react';

import BlogGridF from './blog/front/page';
import "./globals.css";

export default function Home() {
  return (
    <> 
      <Suspense>
        <div id="header" className='relative w-full'>
          <div className="container">
            <div className='blog grid md:py-0 py-0 '>
              <BlogGridF/>
            </div>
          </div>
        </div>
      </Suspense>   
    </>
  );
}
