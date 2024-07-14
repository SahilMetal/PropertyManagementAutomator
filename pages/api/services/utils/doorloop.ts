import axios from 'axios';
import dayjs from 'dayjs';
import { Resend } from 'resend'
import { DOORLOOP_CHARGE_ACCOUNT, CHARGE_AMOUNT_PER_KW, DOORLOOP_URL} from './constants';
const resend = new Resend(process.env.RESEND_API_KEY);


const configDL = { headers: {"Authorization": `Bearer ${process.env.DOORLOOP_TOKEN}`}}
const date = dayjs().format('YYYY-MM-DD')


const getLeaseByUnitID = async (unitId: string) => {
  try {
    const { data: { data } } = await axios.get(`${DOORLOOP_URL}/leases?filter_unit=${unitId}`, configDL)
    return data;
  } catch (err: any) {
    throw new Error(err)
  }
}

const getAddressByUnitID = async (unitId: string) => {
  try {
    return await axios.get(`${DOORLOOP_URL}/units/${unitId}`, configDL)
  } catch (err: any) {
    throw new Error(err)
  }
}

const getTenantByUnitID = async (unitId: string) => {
  try {
    return await axios.get(`${DOORLOOP_URL}/tenants?filter_unit=${unitId}`, configDL)
  } catch (err: any) {
    throw new Error(err)
  }
}

const postLeaseChargeToLeaseByID = async (usage: number, lease: string) => {
    try {
      const amount = (usage * CHARGE_AMOUNT_PER_KW).toFixed(2);
      const chargeData = {
        date,
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

const sendEmailToClient = async (emailString: string, tenantEmail: string) => {
  console.log('SENDING!!!!!!')
  try {
    const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [tenantEmail],
        subject: 'done??',
        text: emailString, //function with arguments --> address, usage, charge per KWH, total charge --> return a string
      } as any);
    if (error) {
      console.error('error in send email try: ', error)
    } else {
      console.info('success in send email: ', data)
    }
  } catch (error) {
    console.error('error in send email catch: ', error)
  }
}

export { getLeaseByUnitID, postLeaseChargeToLeaseByID, sendEmailToClient, getAddressByUnitID, getTenantByUnitID}