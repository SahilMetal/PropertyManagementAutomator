import axios from 'axios';
import dayjs from 'dayjs';
import { DOORLOOP_CHARGE_ACCOUNT, CHARGE_AMOUNT_PER_KW, DOORLOOP_URL } from './constants'; 
const configDL = { headers: {"Authorization": `Bearer ${process.env.DOORLOOP_TOKEN}`}}

const getLeaseByUnitID = async (unitId: string) => {
  try {
    const { data: { data } } = await axios.get(`${DOORLOOP_URL}/leases?filter_unit=${unitId}`, configDL)
    return data[0].id
  } catch (err: any) {
    throw new Error(err)
  }
}


const postLeaseChargeToLeaseByID = async (usage: number, lease: string) => {
    try {
        const amount = (usage * CHARGE_AMOUNT_PER_KW).toFixed(2);
        const chargeData = {
            date: dayjs().format('YYYY-MM-DD'), // DONE: sahil - new Date (use dayJS library)
            lease,
            lines: [{
              amount,
              account: DOORLOOP_CHARGE_ACCOUNT // TODO: shams - figure out which account to use
            }]
          }
        return await axios.post(`${DOORLOOP_URL}/lease-charges`, chargeData, configDL) 
    } catch (err: any) {
        throw new Error(err)
    }
    
}

export { getLeaseByUnitID, postLeaseChargeToLeaseByID }