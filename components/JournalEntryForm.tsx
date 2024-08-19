'use client'
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { DOORLOOP_URL } from "../pages/api/services/utils/constants";
const configDL = { 
    headers: {
    "Authorization": `Bearer ${process.env.DOORLOOP_TOKEN}`,
    "Cookie": process.env.A_COOKIE,
    "Tokenid": '6685658130901cd06ab765ee'
}}


const JournalEntryForm = () => {
    const session = useSession();
    // console.log(session)

    const [property, setProperty] = useState('')
    const [category, setCategory] = useState('')
    const [unit, setUnit] = useState('')
    const [description, setDescription] = useState('')
    const [credit, setCredit] = useState('')
    const [debit, setDebit] = useState('')

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
  
    const sendJournalEntry = async (property: string, category: string, unit: string, description: string, debit: string, credit: string, selectedVal: string) => {
        // fetch property by name
        // formlate journal entry using data from arguments/calls    
        try {
            const entry = {
                "lines": [
                    {"uniqueIndex":"generated?","account":"668557c73a92fd3a088140ed","memo":description,"debit": debit,"credit": credit},
                    {"uniqueIndex":"generated?","account":"668557c73a92fd3a088140f1","memo":"1","credit":'crebit',"debit":'debit'}
                ],
                "date":"2024-08-09","reference":"j9307c","property": property,"unit": unit
            }
            return await axios.post(`${DOORLOOP_URL}/general-entries`, entry, configDL)
        } catch (err: any) {
            throw new Error(err)
        }
    }
        
        
        
    // console.log('in house function', 'entry: ', entry)
    if ((session as any).status === 'loading') {
        return <p>Loading... Session object exists</p>;
    } else if ((session as any).status === 'authenticated') {
        return (
            <>
                <div>
                <div className="relative inline-block">
                    <div className='mx-10'>From: {selectedVal}</div>
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
            {/* <Dropdown2 /> */}
            <form className="max-w-sm mx-auto">
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Property</label>
                    <input type="text" id="property" onChange={(e) => setProperty(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                    <input type="text" id="category" onChange={(e) => setCategory(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Unit</label>
                    <input type="text" id="unit" onChange={(e) => setUnit(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description </label>
                    <input type="text" id="description" onChange={(e) => setDescription(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Debits</label>
                    <input type="text" id="debits" onChange={(e) => setDebit(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Credits</label>
                    <input type="text" id="credits" onChange={(e) => setCredit(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <button type="submit" 
                onClick={(e) => {
                    e.preventDefault();
                    sendJournalEntry(property, category, unit, description, credit, debit, selectedVal)
                    // console.log(property, category, unit, description, credit, debit, 'selected val', selectedVal)
                }}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >Submit</button>
            </form>
        </>
        )
    }
    return <p>Unauthenticated or session Does Not Exist</p>;
}

export default JournalEntryForm;