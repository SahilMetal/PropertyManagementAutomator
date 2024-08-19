'use client'
import { useEffect, useState } from "react"
import axios from "axios";
const { v4: uuidv4 } = require('uuid')

export default function Component() {
    const [workOrderData, setWorkOrderData] = useState<any>([])
    const [propertyNames, setPropertyNames] = useState<any>([]);
    const [vendorNames, setVendorNames] = useState<any>([]);
    const [selectedProperty, setSelectedProperty] = useState('all')
    const [selectedVendor, setSelectedVendor] = useState('all')
    
    useEffect(() => {
        const propNameArr: any[] = []
        const vendNameArr: any[] = []
        const workOrderArr: any[] = []
        async function fetchData() {
            const workOrderDataFetch = await axios.get(`http://localhost:3000/api/workOrders`)
            console.log('!!!', workOrderDataFetch.data)
            workOrderDataFetch.data.forEach((e: any) => {
                workOrderArr.push(e)
                if (propNameArr.includes(e.propertyName) == false) propNameArr.push(e.propertyName)
                if (vendNameArr.includes(e.vendorName) == false) vendNameArr.push(e.vendorName)
            })
            setPropertyNames(propNameArr)
            setVendorNames(vendNameArr)
            setWorkOrderData(workOrderArr)
            console.log('vend arr' ,vendNameArr)
            console.log('work order arr' ,workOrderArr)
        }
        fetchData()
    }, []) // dependency array ***IMPORTANT TO KNOW***

    const handleVendorChange = (e: any) => {
        setSelectedVendor(e.target.value)
        console.log(e.target.value)
    }
    
    const handlePropertyChange = (e: any) => {
        setSelectedProperty(e.target.value)
        console.log(e.target.value)
    }

    const filteredOrders = workOrderData.filter((item: any) => 
        ((selectedProperty === item.propertyName || selectedProperty == 'all') 
            && 
        (selectedVendor === item.vendorName || selectedVendor == 'all'))
    );

    return (
        <div className="bg-white">
            <form className="w-1/2 p-8">
            <fieldset>
            <div className="relative border border-gray-300 text-gray-800 shadow-lg">
                <label htmlFor="frm-whatever" className="sr-only">My field</label>
                <select onChange={handlePropertyChange} value={selectedProperty} className="appearance-none w-full py-1 px-2 bg-gray-200" name="whatever" id="frm-whatever">
                    <option value="all">All Properties &hellip;</option>
                    {propertyNames.map((item: any) => (
                    <option key={uuidv4()}>{item}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2 text-gray-700 border-l">
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>
            </fieldset>
            <fieldset>
            <div className="relative border border-gray-300 text-gray-800 bg-white shadow-lg">
                <label htmlFor="frm-whatever" className="sr-only">My field</label>
                <select onChange={handleVendorChange} value={selectedVendor} className="appearance-none w-full py-1 px-2 bg-gray-200" name="whatever" id="frm-whatever">
                    <option value="all">All Vendors &hellip;</option>
                    {vendorNames.map((item: any) => (
                    <option key={uuidv4()}>{item}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2 text-gray-700 border-l">
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>
            </fieldset>
            </form>

            <h2 className="text-2xl font-semibold leading-tight p-5 text-black bg-white">Work Orders:</h2>

            <div>
                <div>
                {filteredOrders.map((item: any) => (    
                    <div key={item.workOrder.id}>
                    <div className="container mx-auto px-4 sm:px-8" >
                    <div className="py-2">
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 overflow-x-auto ">
                    <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
                        <thead>
                    <tr>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Subject
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Reference #
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Issued / Due
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Property / Vendor
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"> 
                        </th>
                    </tr>
                    </thead>
                        <tbody>
                            <tr>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <div className="ml-3">
                                        <p className="text-gray-900 whitespace-no-wrap">{item.workOrder.subject}</p>
                                    </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 uppercase">#{item.workOrder.reference}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">Issued: {(item.workOrder.createdAt).slice(0,10)} /</p>
                                    <p className="text-gray-600 whitespace-no-wrap">Due: {item.workOrder.dueDate || 'N/A'}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{item.propertyName} /</p>
                                    <p className="text-gray-600 whitespace-no-wrap">{item.vendorName}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className="relative inline-block py-1 font-semibold text-green-600 leading-tight">
                                    <span
                                        aria-hidden
                                        className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                                    >
                                    </span>
                                    <span className="relative">{item.workOrder.status}</span>
                                    </span>
                                </td>
                                <td
                                    className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right"
                                >
                                    <button
                                    type="button"
                                    className="inline-block text-gray-500 hover:text-gray-700"
                                    >
                                        </button>
                                    </td>
                                </tr>
                        </tbody>
                    </table>
            </div>
        </div>
        </div>
    </div>
    </div>
                ))}
</div>
</div>
</div>
    )
}