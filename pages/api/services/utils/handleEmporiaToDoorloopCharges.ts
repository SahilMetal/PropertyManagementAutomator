import { getEmporiaDevices, getEmporiaToken, getEmporiaChargeFromSensorID } from './emporia'
import { getLeaseByUnitID, postLeaseChargeToLeaseByID, sendEmailToClient, getAddressByUnitID } from './doorloop'

const handleEmporiaToDoorloopCharges = async() => {
  try {
    const emporiaToken = await getEmporiaToken();

    const emporiaDevices = await getEmporiaDevices(emporiaToken as string)

    const emporiaToDoorLoopChargesProcessing = emporiaDevices.map((emporiaDevice: string[]) => 
      handleEmporiaToDoorloopCharge({ emporiaDevice, emporiaToken }))
    
    const emporiaToDoorLoopCharges = await Promise.all(emporiaToDoorLoopChargesProcessing)
    console.info('SUCCESSFULLY POSTED CHARGES TO DOORLOOP: ', emporiaToDoorLoopCharges[0].data)
  } catch (error) {
    console.error('ERROR POSTING CHARGES: ', error)
  }
}

const handleEmporiaToDoorloopCharge = async ({ emporiaDevice, emporiaToken }: any) => {
  try {
    const usageList = await getEmporiaChargeFromSensorID(emporiaToken, emporiaDevice.deviceGid);
    const leaseId = await getLeaseByUnitID(emporiaDevice.locationProperties.displayName);
    await formulateEmail({ emporiaDevice, emporiaToken });
    return await postLeaseChargeToLeaseByID(usageList[0], leaseId);
  } catch (err: any) {
    throw new Error(err);
  }
}


const formulateEmail = async ({ emporiaDevice, emporiaToken }: any) => {
  const deviceProps = emporiaDevice.locationProperties;
  const address = await getAddressByUnitID(deviceProps.displayName)
  const kWHratioInCents = deviceProps.usageCentPerKwHour/100;
  const usage = await getEmporiaChargeFromSensorID(emporiaToken, emporiaDevice.deviceGid);
  const amount = (usage * kWHratioInCents).toFixed(2);
  const emailString = `
    This is your monthy energy charge at: ${address}.\n
    Monthy Usage (KWH): ${usage},\n
    Current Price Per KWH: ${kWHratioInCents},\n
    Total Monthly Charge: $${amount}  
    `
  sendEmailToClient(emailString)
}


export default handleEmporiaToDoorloopCharges;