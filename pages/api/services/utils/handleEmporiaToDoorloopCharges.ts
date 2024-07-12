import { getEmporiaDevices, getEmporiaToken, getEmporiaChargeFromSensorID } from './emporia'
import { getLeaseByUnitID, postLeaseChargeToLeaseByID } from './doorloop'

const handleEmporiaToDoorloopCharges = async() => {
  try {
    const emporiaToken = await getEmporiaToken();

    const emporiaDevices = await getEmporiaDevices(emporiaToken as string)

    const emporiaToDoorLoopChargesProcessing = emporiaDevices.map((emporiaDevice: any) => 
      handleEmporiaToDoorloopCharge({ emporiaDevice, emporiaToken }))

    const emporiaToDoorLoopCharges = await Promise.all(emporiaToDoorLoopChargesProcessing)
    console.info('SUCCESSFULLY POSTED CHARGES TO DOORLOOP: ', emporiaToDoorLoopCharges)
  } catch (error) {
    console.error('ERROR POSTING CHARGES: ', error)
  }
}

const handleEmporiaToDoorloopCharge = async ({ emporiaDevice, emporiaToken }: any) => {
  try {
    const usageList = await getEmporiaChargeFromSensorID(emporiaToken, emporiaDevice.deviceGid);
    const leaseId = await getLeaseByUnitID(emporiaDevice.locationProperties.displayName);
    return await postLeaseChargeToLeaseByID(usageList[0], leaseId);
  } catch (err: any) {
    throw new Error(err);
  }
}


export default handleEmporiaToDoorloopCharges;