const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const { userPool, cognitoUser, authDetails } = require('./config');

/* */

const registerUser = (email, password) => {

    var attributeList = [];

    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email }));

    return new Promise((resolve, reject) => {

        userPool.signUp(email, password, attributeList, null, function (error, response) {

            if (error) {

                reject(error);

                return;
            }

            let user = response.user;

            resolve(user);
        });

    });
}

const verifyUser = (email, verificationCode) => {

    let user = cognitoUser(email);

    return new Promise((resolve, reject) => {

        user.confirmRegistration(verificationCode, true, (error, response) => {

            if (error) {

                reject(error);
                return;
            }

            resolve(response);
        });
    });
}

const loginUser = (email, password) => {

    let auth = authDetails(email, password);
    let user = cognitoUser(email);

    return new Promise((resolve, reject) => {

        user.authenticateUser(auth, {

            onSuccess: (response) => resolve(response),
            onFailure: (error) => reject(error),
        });
    });
}

const changePassword = (email, password, newPassword) => {

    let auth = authDetails(email, password);
    let user = cognitoUser(email);

    return new Promise((resolve, reject) => {

        user.authenticateUser(auth, {

            onSuccess: () => {

                user.changePassword(password, newPassword, (error, response) => {

                    if (error) {

                        reject(error);
                        return;
                    }

                    resolve(response);
                });
            },

            onFailure: (error) => reject(error),
        });
    });
}

const removeUser = (email, password) => {

    let auth = authDetails(email, password);
    let user = cognitoUser(email);

    return new Promise((resolve, reject) => {

        user.authenticateUser(auth, {

            onSuccess: () => {

                user.deleteUser((error, response) => {

                    if (error) {

                        reject(error);
                        return;
                    }

                    resolve(response);
                });
            },

            onFailure: (error) => reject(error),
        });
    });
}

//registerUser('demo@gmail.com', 'Password@@123').then(r => console.log(r)).catch(e => console.log(e.message));

//verifyUser('demo@gmail.com', '123456').then(r => console.log(r)).catch(e => console.log(e.message));

//loginUser('demo@gmail.com', 'Password@@123').then(r => console.log(r)).catch(e => console.log(e.message));

//changePassword('demo@gmail.com', 'Password@@123', 'NewPassword@@123').then(r => console.log(r)).catch(e => console.log(e.message));

//removeUser('demo@gmail.com', 'Password@@123').then(r => console.log(r)).catch(e => console.log(e.message));

module.exports = { registerUser, verifyUser, loginUser, changePassword, removeUser };