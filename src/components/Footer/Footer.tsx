import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import * as Icon from "@phosphor-icons/react/dist/ssr";

const Footer = () => {
    return (
        <>
            <div id="footer" className='footer border-t border-line gap-5 py-4'>
            <div className="container">
                <div className="footer-main bg-surface">
                        <div className="content-footer py-[60px] flex justify-between flex-wrap gap-y-8">
                            <div className="company-infor basis-1/4 max-lg:basis-full pr-7">
                            <Link href='/'>
                            <div className='flex gap-3 mt-3'>
                            <div className="flex flex-col ">
                            <Image 
                                src='/images/logo.png' 
                                alt='Kenyan Talents Logo' 
                                width={100} // specify the width of your logo
                                height={100} // specify the height of your logo
                                className="heading4"
                            />
                            </div>
                            </div>
                            </Link>
                            </div>
                            <div className="right-content flex flex-wrap gap-y-8 basis-3/4 max-lg:basis-full">
                                <div className="list-nav flex justify-between basis-2/3 max-md:basis-full gap-4">
                                    <div className="item flex flex-col basis-1/3 ">
                                        <div className="text-button-uppercase pb-3">Infomation</div>
                                        <Link className='caption1 has-line-before duration-300 w-fit' href={'/'}>Contact us</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/'}>About us</Link>
                                    </div>
                                    <div className="item flex flex-col basis-1/3 ">
                                        <div className="text-button-uppercase pb-3">Privacy Policy</div>
                                        <Link className='caption1 has-line-before duration-300 w-fit' href={'/'}>Terms</Link>
                                    </div>
                                    <div className="item flex flex-col basis-1/3 ">
                                        <div className="text-button-uppercase pb-3">Customer Services</div>
                                        <Link className='caption1 has-line-before duration-300 w-fit' href={'/'}>Kenyan Talents FAQs</Link>
                                    </div>
                                </div>
                                <div className="newsletter basis-1/3 pl-7 max-md:basis-full max-md:pl-0">
                                    <div className="text-button-uppercase">Newletter</div>
                                    <div className="input-block w-full h-[52px] mt-4">
                                        <form className='w-full h-full relative' action="post">
                                            <input type="email" placeholder='Enter your e-mail' className='caption1 w-full h-full pl-4 pr-14 rounded-xl border border-line' required />
                                            <button className='w-[44px] h-[44px] bg-black flex items-center justify-center rounded-xl absolute top-1 right-1'>
                                                <Icon.ArrowRight size={24} color='#fff' />
                                            </button>
                                        </form>
                                    </div>
                                    <div className="list-social flex items-center gap-6 mt-4">
                                        <Link href={'/'} target='_blank'>
                                            <div className="icon-facebook text-2xl text-black"></div>
                                        </Link>
                                        <Link href={'/'} target='_blank'>
                                            <div className="icon-instagram text-2xl text-black"></div>
                                        </Link>
                                        <Link href={'/'} target='_blank'>
                                            <div className="icon-twitter text-2xl text-black"></div>
                                        </Link>
                                        <Link href={'/'} target='_blank'>
                                            <div className="icon-pinterest text-2xl text-black"></div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="footer-bottom py-3 flex items-center justify-between gap-5 max-lg:justify-center max-lg:flex-col border-t border-line">
                            <div className="center flex items-center gap-8">
                                <div className="copyright caption1 pages font-medium hidden gap-8 lg:flex">©2024 Kenyan Talents. All Rights Reserved.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Footer