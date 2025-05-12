import React, { useState } from 'react'
import logo from '/public/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHeart, faCartShopping, faUserLarge, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram, faPinterest } from "@fortawesome/free-brands-svg-icons";
import { Link } from 'react-router-dom';

function Navbar() {

    const [isOpen, SetisOpen] = useState(false)
    const handleClick = () => {
        SetisOpen(!isOpen)
    }

    return (
        <div className='font-jakarta'>
            <div className='h-16'></div>
            <div className="fixed top-0 left-0 w-full flex z-10 justify-between md:justify-around items-center p-2 bg-white shadow-xl">
                <Link to="/">
                    <img src={logo} alt="" className='w-44' />
                </Link>

                <div className="flex items-center">
                    <Link to='/' className="home p-4 hidden md:block">
                        Shop
                    </Link>
                    <Link to='/about' className="categories p-4 hidden md:block">
                        About Us
                    </Link>
                    <Link to='/contact' className="categories p-4 hidden md:block">
                        Contact Us
                    </Link>
                </div>

                <div className="flex items-center">
                    <Link to={'/wishlist'}>
                        <FontAwesomeIcon
                            className="navIcons mx-3 text-gray-400 hover:text-teal-600 transition-all duration-100"
                            icon={faHeart} size='lg'
                        />
                    </Link>
                    <Link to="/cart">
                        <FontAwesomeIcon
                            className="navIcons mx-3 text-gray-400 hover:text-teal-600 transition-all duration-100"
                            icon={faCartShopping} size='lg'
                        />
                    </Link>
                    <Link to="/profile">
                        <FontAwesomeIcon
                            className="navIcons mx-3 text-gray-400 hover:text-teal-600 transition-all duration-100"
                            icon={faUserLarge} size='lg'
                        />
                    </Link>
                    <div className='block md:hidden' onClick={handleClick}>
                        <FontAwesomeIcon
                            className="barIcons mx-3 text-teal-600"
                            icon={faBars} size='lg'
                        />
                    </div>
                </div>
            </div>

            <div className={`fixed top-0 right-0 h-screen w-[80%] bg-white z-40 shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className='float-right' onClick={handleClick}>
                    <FontAwesomeIcon icon={faXmark} size='2x' className='p-4 text-teal-600' />
                </div>

                <div className='text-2xl p-4 pt-28'>
                    <ul className='flex flex-col gap-4 font-semibold'>
                        <Link to='/'>
                            <li className='border-b border-teal-100 pb-4'>Shop</li>
                        </Link>
                        <Link to={'/about'}>
                            <li className='border-b border-teal-100 pb-4'>About Us</li>
                        </Link>
                        <Link to='/contact'>
                            <li className='border-b border-teal-100 pb-4'>Contact Us</li>
                        </Link>
                    </ul>
                </div>
                <div className='flex jusitfy-between pt-10'>
                    <div className='block'>
                        <FontAwesomeIcon
                            className="navIcons mx-3 text-teal-600"
                            icon={faFacebook} size='xl'
                        />
                    </div>

                    <div className='block'>
                        <FontAwesomeIcon
                            className="navIcons mx-3 text-teal-600"
                            icon={faPinterest} size='xl'
                        />
                    </div>

                    <div className='block'>
                        <FontAwesomeIcon
                            className="navIcons mx-3 text-teal-600"
                            icon={faInstagram} size='xl'
                        />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Navbar