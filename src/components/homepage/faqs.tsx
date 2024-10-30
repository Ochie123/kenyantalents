'use client';
import React, { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { Box, Typography } from '@mui/material';

const faqData = [
  {
    heading: "1. How does Moderndecordiaries work?",
    subheading:
      "We curate the cutest baby clothes from your favorite stores like Amazon and others, making it easy for you to find everything in one place. Click on any item you like, and you'll be taken directly to the retailer's website to make your purchase.",
  },
  {
    heading: "2. How do you select the products featured on your site?",
    subheading:
      "Our team carefully curates each item featured on Moderndecordiaries to ensure we showcase only the best baby clothing and accessories. We prioritize top-rated products from trusted brands, with stylish designs, high-quality materials, and positive customer reviews. We also aim to provide a wide range of styles and sizes to meet every baby's needs.",
  },
  {
    heading: "3. Do you offer discounts or coupons?",
    subheading:
      "Absolutely! As an affiliate site, we strive to provide our visitors with the best deals and discounts available. We frequently update our site with the latest promo codes, sales, and special offers from our partner retailers. Be sure to check our 'Deals' section or sign up for our newsletter to stay in the loop.",
  },
  {
    heading: "4. How do I purchase the items featured on your site?",
    subheading:
      "To purchase any of the baby clothing or accessories showcased on Moderndecordiaries, simply click on the 'Shop Now' button or affiliate link provided with each product listing. This will redirect you to our partner retailer's website, where you can complete your purchase securely. Our affiliate links ensure you receive any applicable discounts or promotions.",
  },
  {
    heading: "5. What is an affiliate link and why do you use them?",
    subheading:
      "An affiliate link is a special trackable URL that allows us to earn a small commission when our visitors make a purchase through that link, at no extra cost to you. We use affiliate links to generate revenue and sustain our site, while providing our visitors with access to the best baby products and deals from our trusted retail partners.",
  },
  {
    heading: "6. Do you have a blog with baby fashion and parenting tips?",
    subheading:
      "Yes, our blog is a valuable resource for new and expectant parents seeking advice on baby fashion, care, and parenting. Our experienced writers share practical tips, style inspiration, product recommendations, and more. Be sure to check out our 'Blog' section or subscribe to our newsletter to stay up-to-date with our latest posts.",
  },
  {
    heading: "7. How do I choose the right size for my baby?",
    subheading:
      "Choosing the correct size for your baby is essential for their comfort and proper fit. We recommend referring to the size chart provided by each brand, as sizing can vary. Measure your baby's height, weight, and key measurements like chest, waist, and inseam to determine the best fit. If you're unsure, it's better to size up as babies grow quickly.",
  },
  {
    heading: "8. How can I contact you if I have more questions?",
    subheading:
      "We're always happy to assist our visitors! If you have any additional questions or need further assistance, feel free to reach out to us via our 'Contact' page. Our friendly team will do their best to provide you with prompt and helpful responses.",
  },
  {
    heading: "9. Do you sell the clothes directly?",
    subheading:
      "No, we don't sell the clothes ourselves. We're an affiliate website, which means we partner with other retailers and earn a commission when you buy through our links.",
  },
  {
    heading: "10. Can I get styling advice or outfit ideas?",
    subheading:
      "Absolutely! Our blog is full of helpful tips, trend reports, and outfit inspiration for dressing your baby in style. Be sure to check it out for the latest fashion advice.",
  },
  {
    heading: "11. What are the best choices or staff picks for baby clothes?",
    subheading:
      "Our staff picks highlight a mix of everyday essentials and trendy items. We choose products with high ratings and positive reviews, and include a variety of price points to cater to different budgets.",
  },
];

function KnowledgeCenterPage() {
  return (
    <div className="my-20 px-6" id="faq-section">
      <h3 className="text-center text-3xl lg:text-5xl font-bold text-offwhite mb-3">Frequently Asked Questions</h3>
      <p className="text-center lg:text-lg font-normal text-bluish">
        Empower your shopping experience with insights and answers.
      </p>
      <div className="mx-auto max-w-7xl">
        <div className="grid">
          {/* Column-1 */}
          <div className='col-12'>
            <div className="w-full px-4 pt-10">
              {faqData.map((item, i) => (
                <div className="mx-auto w-full max-w-5xl rounded-2xl bg-white py-4 px-1 mb-2" key={i}>
                  <Disclosure>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full justify-between rounded-lg text-offwhite sm:px-4 sm:py-2 text-left md:text-2xl font-medium">
                          <span>{item.heading}</span>
                          <ChevronUpIcon
                            className={`${open ? 'rotate-180 transform' : ''
                              } h-5 w-5 text-black-500`}
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pt-2 pb-2 md:text-lg text-bluish font-normal opacity-50">{item.subheading}</Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KnowledgeCenterPage;