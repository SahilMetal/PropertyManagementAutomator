import axios from 'axios';
import getToken from './Authenticate'
import processItem from './processItem';

const postCharge = async() => {
  try {
    const clientToken = await getToken();
    const configEmp = { headers: {"Content-Type": "application/json", "Authtoken": clientToken}}
    const { data: { devices } } = await axios.get("https://api.emporiaenergy.com/customers/devices", configEmp as any)
    const promiseArray = devices.map((device: any) => {
      return processItem(device) //implicit
    })
    await Promise.all(promiseArray)
  } catch (error) {
    console.error('Error posting charge: ', error)
  }
}

export default postCharge;