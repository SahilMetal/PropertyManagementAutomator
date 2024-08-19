'use client'
import React, { useState } from 'react'

const Dropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedVal, setSelectedVal] = useState('Select an option');

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const closeDropdown = () => {
        setIsOpen(false);
    };

    const updateVal = (val: string) => {
        closeDropdown();
        setSelectedVal(val)
    }

    return (
        <div>
            <div className="relative inline-block">
                <div className='mx-10'>To: {selectedVal}</div>
                <button
                    type="button"
                    className="mx-10 px-4 py-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm inline-flex items-center"
                    onClick={toggleDropdown}
                >
                    Dropdown Menu
                </button>
                {isOpen && (
                    <div className="origin-top-right right-0 mt-2 w-44 mx-10 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <ul role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            <li>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => updateVal('Shams Realty LLC')}
                                >
                                    Shams Realty LLC
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => updateVal('Parpia PR Group LLC')}
                                >
                                    Parpia PR Group LLC
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => updateVal('Aliparp LLC')}
                                >
                                    Aliparp LLC
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => updateVal('Shams LLC')}
                                >
                                    Shams LLC
                                </a>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dropdown;