require('dotenv').config();

/* */

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const poolData = { UserPoolId: process.env.PoolID, ClientId: process.env.ClientID };

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

const cognitoUser = (email) => new AmazonCognitoIdentity.CognitoUser({ Username: email, Pool: userPool });

const authDetails = (email, password) => new AmazonCognitoIdentity.AuthenticationDetails({ Username: email, Password: password });

/* */

module.exports = { userPool, cognitoUser, authDetails };