const {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} = require("amazon-cognito-identity-js");

const username = process.env.AUTH_USERNAME
const password = process.env.AUTH_PASSWORD;
const userPoolId = process.env.USER_POOL_ID
const clientId = process.env.CLIENT_ID

const getToken = async () => {
  const userPoolId = getUserPool();
  const cognitoUser = getCognitoUser(userPoolId);
  const authenticationDetails = getAuthenticationDetails();

  return new Promise((resolve) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result: any) => {
        const token = result.getIdToken().getJwtToken();
        resolve(token);
      },
      onFailure: (err: any) => {
        console.error("Emporia token error: ", JSON.stringify(err));
        resolve(null);
      },
    });
  });
};

const getUserPool = () => {
  const poolData = { UserPoolId: userPoolId, ClientId: clientId };
  const userPool = new CognitoUserPool(poolData);
  return userPool;
};

const getCognitoUser = (userPool: any) => {
  const userParams = { Pool: userPool, Username: username };
  const cognitoUser = new CognitoUser(userParams);
  return cognitoUser;
};

const getAuthenticationDetails = () => {
  const authenticationData = { Username: username, Password: password };
  const authenticationDetails = new AuthenticationDetails(authenticationData);
  return authenticationDetails;
};

export default getToken;
