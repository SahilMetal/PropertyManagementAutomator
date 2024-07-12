import axios from 'axios';
import getToken from './Authenticate'

const processItem = async(device: any) => {
  const DOORLOOP_TOKEN = process.env.DOORLOOP_TOKEN
  const CLIENT_TOKEN = await getToken();
  const configEmp = { headers: {"Content-Type": "application/json", "Authtoken": CLIENT_TOKEN}}
  const configDL = { headers: {"Authorization": "Bearer " + DOORLOOP_TOKEN}}
  const unitId = device.locationProperties.displayName
  const sensorId = device.deviceGid;
  const { data: { data } } = await axios.get(`https://app.doorloop.com/api/leases?filter_unit=${unitId}`, configDL)
  const leaseId = data[0].id                                                                  
  const { data: { usageList } } = await axios.get(`https://api.emporiaenergy.com/AppAPI?apiMethod=getChartUsage&deviceGid=${sensorId}&channel=1,2,3&start=2024-07-01T20:00:00.000Z&end=2024-07-09T19:00:00.000Z&scale=1MON&energyUnit=KilowattHours`, configEmp as any)
  const charge = (usageList[0] * .132).toFixed(2);
  const chargeData = {
    "date": "2024-07-11", // new Date
    "lease": leaseId,
    "lines": [{
      "amount": charge,
      "account": "668557c73a92fd3a0881418f"
    }]
  }
  // need leaseId and usageList values to continue
  await axios.post("https://app.doorloop.com/api/lease-charges", chargeData, configDL)
  console.info('POSTED !!!!!!')
}

export default processItem;