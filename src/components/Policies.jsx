import { faRetweet } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

function Policies() {
    return (
        <div className='py-20 mx-auto px-4 max-w-7xl font-jakarta'>
            <h1 className='text-4xl lg:text-5xl font-bold text-teal-600 text-center my-8'>Refund & Return Policies</h1>
            <p className='font-medium my-2 text-xl lg:text-2xl'>At BuyIn, we want you to shop with confidence. If you're not completely satisfied with your purchase, we’re here to help.</p>

            <h2 className='text-2xl lg:text-3xl mt-20 text-teal-600 font-bold my-3'>
                Return Policy</h2>
            <li className='font-medium my-2 text-xl lg:text-2xl'>
                You can request a return within 7 days of delivery for most items.
            </li>
            <li className='font-medium my-2 text-xl lg:text-2xl'>
                Items must be unused, in original condition, and with all original packaging and tags.
            </li>
            <li className='font-medium my-2 text-xl lg:text-2xl'>
                Products like innerwear, perishables, and customized items are not eligible for return.
            </li>

            <h2 className='text-2xl lg:text-3xl mt-20 text-teal-600 font-bold my-3'>Refund Policy</h2>
            <li className='font-medium my-2 text-xl lg:text-2xl'>
                Once we receive and inspect the returned item, we will notify you about the status of your refund.
            </li>
            <li className='font-medium my-2 text-xl lg:text-2xl'>
                Approved refunds will be processed within 5–7 business days to your original payment method.
            </li>

            <h2 className='text-2xl lg:text-3xl mt-20 text-teal-600 font-bold my-3'>Non-Returnable Items</h2>
            <li className='font-medium my-2 text-xl lg:text-2xl'>
                Certain categories including health & hygiene, food items, and digital downloads are not returnable for safety reasons.
            </li>

            <h2 className='text-2xl lg:text-3xl mt-20 text-teal-600 font-bold my-3'>Return Process</h2>
            <ol className='list-decimal list-inside'>
                <li className='font-medium my-2 text-xl lg:text-2xl'>
                    Go to your order history and select the item.
                </li>
                <li className='font-medium my-2 text-xl lg:text-2xl'>
                    Click on “Request Return” and follow the steps.
                </li>
                <li className='font-medium my-2 text-xl lg:text-2xl'>
                    Our courier partner will pick it up or you can drop it off at a designated point.
                </li>
            </ol>
        </div>
    )
}

export default Policies