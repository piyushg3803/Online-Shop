import { faFacebook, faInstagram, faPinterest } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'
import logo from '/public/logo.png'

function Footer() {
    return (
        <div className='flex flex-col font-jakarta'>
            <div id="contact" className="bg-[#e9f5f4] py-10 flex-shrink-0">
                <div className="m-4 flex flex-col items-center text-center">
                    <a href="#">
                        <img src={logo} alt="" className="w-48 py-4" />
                    </a>
                    <h1 className='text-xl'>Shop confidently with BuyIn.com</h1>
                    <div className="ms-5 mt-2 flex justify-center">
                        <a
                            className="text-gray-500 hover:text-teal-600 rounded-full transition-all duration-100 text-2xl"
                            href="https://www.facebook.com/"
                            target="_blank"
                        >
                            <FontAwesomeIcon className="m-3" icon={faFacebook} />
                        </a>
                        <a
                            className="text-gray-500 hover:text-teal-600 rounded-full transition-all duration-100 text-2xl"
                            href="https://www.instagram.com/"
                            target="_blank"
                        >
                            <FontAwesomeIcon className="m-3" icon={faInstagram} />
                        </a>
                        <a
                            className="text-gray-500 hover:text-teal-600 rounded-full transition-all duration-100 text-2xl"
                            href="https://www.pinterest.com/"
                            target="_blank"
                        >
                            <FontAwesomeIcon className="m-3" icon={faPinterest} />
                        </a>
                    </div>
                </div>
                <div className="text-center flex justify-center font-semibold text-lg lg:text-xl mx-5 space-y-5">
                    <Link to='/shop'>
                        <h1 className='mx-4'>Shop</h1>
                    </Link>
                    <Link to='/about'>
                        <h1 className='mx-4'>About Us</h1>
                    </Link>
                    <Link to='/contact'>
                        <h1 className='mx-4'>Contact</h1>
                    </Link>
                </div>

                <div className='flex justify-around flex-col lg:flex-row items-center'>
                    <div className="text-center flex text-sm lg:text-xl mx-5 space-y-4 text-gray-700">
                        <Link to={'/terms'}>
                            <h1 className='mx-2'>Terms & Conditions</h1>
                        </Link>
                        <Link to={'/policies'}>
                            <h1 className='mx-2'>Refund & Return</h1>
                        </Link>
                    </div>
                    <div className="text-center flex text-sm lg:text-xl mx-5 space-y-4 text-gray-700">
                        Copyright 2025 Innovatix. All rights reserved.
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Footer