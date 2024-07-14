import { getEmporiaDevices, getEmporiaToken, getEmporiaChargeFromSensorID } from './emporia'
import { getLeaseByUnitID, postLeaseChargeToLeaseByID, sendEmailToClient, getAddressByUnitID, getTenantByUnitID } from './doorloop'

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
    const leaseData = await getLeaseByUnitID(emporiaDevice.locationProperties.displayName);
    const leaseId = leaseData[0].id
    const usageList = await getEmporiaChargeFromSensorID(emporiaToken, emporiaDevice.deviceGid, leaseData[0].start);
    await formulateEmail({ emporiaDevice, emporiaToken }, leaseData[0].start);
    return await postLeaseChargeToLeaseByID(usageList[0], leaseId);
  } catch (err: any) {
    throw new Error(err);
  }
}


const formulateEmail = async ({ emporiaDevice, emporiaToken }: any, leaseStartDate: string) => {
  const unitId = emporiaDevice.locationProperties.displayName;
  const { data: { data } } = await getTenantByUnitID(unitId);
  const tenantEmail = data[0].portalInfo.loginEmail;
  const unitData = await getAddressByUnitID(unitId);
  const unitName = unitData.data.name
  const a = unitData.data.address;
  const address = `${a.street1}, ${a.city}, ${a.state}, ${a.zip}`;
  const kWHratioInDollars = emporiaDevice.locationProperties.usageCentPerKwHour/100;
  const usage = await getEmporiaChargeFromSensorID(emporiaToken, emporiaDevice.deviceGid, leaseStartDate);
  const usageClean = (usage[0]).toFixed(2)
  const amount = (usage[0] * kWHratioInDollars).toFixed(2); // squeeze those decimals
  const emailString = `
    This is your monthy energy charge at: ${address} - Unit: ${unitName}.\n
    Monthy Usage: ${usageClean} (KWH),\n 
    Current Price Per KWH (Dollars): ${kWHratioInDollars},\n
    Total Monthly Charge: $${amount}  
    `
  sendEmailToClient(emailString, tenantEmail)
}


export default handleEmporiaToDoorloopCharges;