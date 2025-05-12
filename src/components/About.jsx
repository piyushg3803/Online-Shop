import React from 'react'
import logo from '/public/logo.png'

function About() {
    return (
        <div className='font-jakarta pb-20'>
            <div className='flex justify-center bg-teal-50 py-20 lg:py-28'>
                <img src={logo} alt="BuyIn Logo" className='w-52 lg:w-72 h-auto' />
            </div>
            <div className='py-8 mx-auto px-4 max-w-7xl'>
                <h1 className='text-4xl lg:text-5xl font-bold text-teal-600 text-center my-8'>About Us</h1>
                <p className='font-medium my-2 text-xl lg:text-2xl'>Welcome to BuyIn — your all-in-one destination for everything you need and love.</p>
                <p className='font-medium my-2 text-xl lg:text-2xl'>At BuyIn, we believe that shopping should be simple, enjoyable, and accessible. Whether you're hunting for the latest fashion trends, electronics, home essentials, beauty products, or daily utilities — we’ve got it all, in one place.</p>

                <h1 className='text-4xl lg:text-5xl mt-20 font-bold text-teal-600 text-center my-8'>Who We Are?</h1>
                <p className='font-medium my-2 text-xl lg:text-2xl'>BuyIn is a modern e-commerce platform built with the mission to make online shopping effortless. We bring together a wide selection of high-quality products from trusted brands and sellers across categories. Our focus is not just on variety, but also on value — giving you the best products at the right prices</p>
                <h2 className='text-2xl lg:text-3xl mt-20 font-bold my-3'>Why Choose Us</h2>
                <li className='font-medium my-2 text-xl lg:text-2xl list-none'>
                    <span className='font-bold me-2'>Vast Product Range:</span>At BuyIn, we believe that shopping should be simple, enjoyable, and accessible. Whether you're hunting for the latest fashion trends, electronics, home essentials, beauty products, or daily utilities — we’ve got it all, in one place.
                </li>
                <li className='font-medium my-2 text-xl lg:text-2xl list-none'>
                    <span className='font-bold me-2'>Trusted Quality:</span>Every product listed on BuyIn goes through a quality assurance check.
                </li>
                <li className='font-medium my-2 text-xl lg:text-2xl list-none'>
                    <span className='font-bold me-2'>Customer First:</span>Your satisfaction is our top priority. Fast shipping, easy returns, and responsive support make your experience smooth.
                </li>
                <li className='font-medium my-2 text-xl lg:text-2xl list-none'>
                    <span className='font-bold me-2'>Secure Shopping: </span>Your data is protected, and your payments are safe — always.
                </li>

                <h1 className='text-4xl lg:text-5xl mt-20 font-bold text-teal-600 text-center my-8'>Our Promise</h1>
                <p className='font-medium my-2 text-xl lg:text-2xl'>We are not just a marketplace — we are a growing community of shoppers who value quality, speed, and service. Our team is constantly working to improve your shopping experience and bring you the best deals, new arrivals, and exclusive collections.</p>
            </div>
        </div>
    )
}

export default About