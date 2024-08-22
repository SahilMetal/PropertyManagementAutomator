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
  // console.log(emporiaDevice)
  try {
    const unitData = emporiaDevice.locationProperties.displayName.split(' - ');
    const leaseData = await getLeaseByUnitID(unitData[0]);
    const leaseData2 = await getLeaseByUnitID((emporiaDevice.locationProperties.displayName).slice(27));
    
    const deviceName = emporiaDevice.locationProperties.displayName
    const unitId = JSON.stringify(unitData[0])
    const unitId2 = JSON.stringify(unitData[1])


    const usageList = await getEmporiaChargeFromSensorID(emporiaToken, emporiaDevice.deviceGid, leaseData[0].start);
    const usageByBreaker = usageList.data.deviceListUsages.devices[0].channelUsages;
    let unitOneTotal = 0; let unitTwoTotal = 0;
    const unitOneData = [] as any; const unitTwoData = [] as any;
    usageByBreaker.slice(1, -1).map((breaker: any) => {
      if (unitId == JSON.stringify((breaker.name).slice(4))) {
        unitOneTotal += breaker.usage;
        unitOneData.push({
          number: breaker.channelNum, 
          usage: breaker.usage,
          total: unitOneTotal,
          id: unitData[0]
        })
      } else // if (unitId2 == JSON.stringify((breaker.name).slice(4))) 
        {
        unitTwoTotal += breaker.usage;
        unitTwoData.push({number: breaker.channelNum, usage: breaker.usage, total: unitTwoTotal, id: unitData[1]})
      }
    })

    await formulateEmail({ emporiaDevice, emporiaToken }, unitOneData);
    await formulateEmail({ emporiaDevice, emporiaToken }, unitTwoData);
    await postLeaseChargeToLeaseByID(unitTwoData[unitTwoData.length - 1].total, leaseData2[0].id);
    return await postLeaseChargeToLeaseByID(unitOneData[unitOneData.length - 1].total, leaseData[0].id);
  } catch (err: any) {
    throw new Error(err);
  }
}

const formulateEmail = async ({ emporiaDevice, emporiaToken }: any, unitBreakerData: any) => {
  const unitId = unitBreakerData[0].id;
  const { data: { data } } = await getTenantByUnitID(unitId);
  const tenantEmail = data[0].portalInfo.loginEmail;
  const unitData = await getAddressByUnitID(unitId);
  const unitName = unitData.data.name
  const a = unitData.data.address;
  const address = `${a.street1}, ${a.city}, ${a.state}, ${a.zip}`;
  const kWHratioInDollars = emporiaDevice.locationProperties.usageCentPerKwHour/100;
  const usage = unitBreakerData[unitBreakerData.length - 1].total
  const usageClean = (usage).toFixed(2)
  const amount = (usage * kWHratioInDollars).toFixed(2);
  console.log('usage !!!!!!: ', usageClean, '$', amount)
  const emailString = `
    This is your monthy energy charge at: ${address} - Unit: ${unitName}.\n
    Monthy Usage: ${usageClean} (kWh),\n
    Usage per Breaker: 
    ${unitBreakerData.map((breaker: any) => {
      const usageRounded = (breaker.usage).toFixed(2)
      return `\n\t${breaker.number}: ${usageRounded} (kWh)`
    })} \n
    Current Price Per KWH (Dollars): ${kWHratioInDollars},\n
    Total Monthly Charge: $${amount}  
    `
  sendEmailToClient(emailString, tenantEmail)
  console.log(emailString)
}

handleEmporiaToDoorloopCharges(); //remove when done


export default handleEmporiaToDoorloopCharges;