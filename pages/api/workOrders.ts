import { getAllWorkOrdersPropertyAndVendorIds, getPropertyNameByPropertyId, getVendorNameByVendorId } from "./services/utils/doorloop";


const handleWorkOrders = async (_: any, res: any) => {
  try {
    const { data: { data }} = await getAllWorkOrdersPropertyAndVendorIds()
    const workOrderProcessing = data.map((order: any) => handleWorkOrder(order))
    
    const workOrders = await Promise.all(workOrderProcessing)
    // console.info('work orders called', workOrders)
    /* 
      {
        workOrders: [{}],
        properties: [''],
        vendors: ['']
      }
    */
    res.send(workOrders)
  } catch (error) {
    console.error('ERROR: ', error)
  }
}

const handleWorkOrder = async (order: any) => {
  const propertyName = await getPropertyNameByPropertyId(order.property)
  const vendorName = await getVendorNameByVendorId(order.workOrder.assignedToVendor)
  return { 
    propertyName: propertyName, 
    vendorName: vendorName, 
    workOrder: order
  }
}

export default handleWorkOrders;