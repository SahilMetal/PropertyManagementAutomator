import axios from 'axios';
import dayjs from 'dayjs';
import { EMPORIA_URL } from './constants';
const {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} = require("amazon-cognito-identity-js");


const { 
  AUTH_USERNAME: Username, 
  AUTH_PASSWORD: Password, 
  USER_POOL_ID: UserPoolId, 
  CLIENT_ID:  ClientId
} = process.env

const getEmporiaToken = async () => {
  const Pool = new CognitoUserPool({ UserPoolId, ClientId });
  const cognitoUser = new CognitoUser({ Pool, Username });
  const authenticationDetails = new AuthenticationDetails({ Username, Password });

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result: any) => {
        const token = result.getIdToken().getJwtToken();
        resolve(token);
      },
      onFailure: (err: any) => {
        reject(err);
      },
    });
  });
};

const getEmporiaDevices = async (Authtoken: string) => {
  try {
    const configEmp = { headers: {"Content-Type": "application/json", Authtoken}}
    const { data: { devices } } = await axios.get(`${EMPORIA_URL}/customers/devices`, configEmp)
    return devices
  } catch (err: any) {
    throw new Error(err)
  }
}

const getEmporiaChargeFromSensorID = async (Authtoken: string, sensorId: string) => {
  const firstOfMonth = dayjs().startOf('month').format('YYYY-MM-DD')
  const lastOfMonth = dayjs().endOf('month').format('YYYY-MM-DD')
  try {
    const configEmp = { headers: {"Content-Type": "application/json", Authtoken}}
    const { data: { usageList } } = await axios.get(`${EMPORIA_URL}/AppAPI?apiMethod=getChartUsage&deviceGid=${sensorId}&channel=1,2,3&start=${firstOfMonth}T20:00:00.000Z&end=${lastOfMonth}T19:00:00.000Z&scale=1MON&energyUnit=KilowattHours`, configEmp as any)
    return usageList;
  } catch (err: any) {
    throw new Error(err)
  }
}


export { getEmporiaDevices, getEmporiaToken, getEmporiaChargeFromSensorID };
