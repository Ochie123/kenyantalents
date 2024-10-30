import React, { Suspense } from 'react';

import BlogGridF from './blog/front/page';


export default function Home() {
  return (
    <> 
      <Suspense>
        <div id="header" className='relative w-full'>
            <div className='blog grid md:py-0 py-0 '>
              <BlogGridF/>
            </div>
        </div>
      </Suspense>   
    </>
  );
}
