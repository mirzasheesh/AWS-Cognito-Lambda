const { registerUser, verifyUser, loginUser, changePassword, removeUser } = require('./cognito/modules');

const parametersError = {
    statusCode: 400,
    body: JSON.stringify({
        error: 'Invalid parameters',
    }),
}

exports.register = async (event, context, callback) => {

    //to register a new user

    let body = JSON.parse(event.body);
    let email = body.email;
    let password = body.password;
    let response;

    if (email && password) {

        let error;
        let user = await registerUser(email, password).catch(e => error = e.message);

        if (user.username) {

            response = {
                statusCode: 201,
                body: JSON.stringify({
                    message: 'Verification OTP sent',
                }),
            }

        } else {

            response = {
                statusCode: 400,
                body: JSON.stringify({
                    error: user || error,
                }),
            }
        }

        return callback(null, response);
    }

    return callback(null, parametersError);
}

exports.verify = async (event, context, callback) => {

    //to verify otp and verify account

    let body = JSON.parse(event.body);
    let email = body.email;
    let otp = body.otp;
    let response;

    if (email && otp) {

        let error;
        let user = await verifyUser(email, otp).catch(e => error = e.message);

        if (user === 'SUCCESS') {

            response = {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Account verification done',
                }),
            }

        } else {

            response = {
                statusCode: 400,
                body: JSON.stringify({
                    error: user || error,
                }),
            }
        }

        return callback(null, response);
    }

    return callback(null, parametersError);
}

exports.login = async (event, context, callback) => {

    //to login

    let body = JSON.parse(event.body);
    let email = body.email;
    let password = body.password;
    let response;

    if (email && password) {

        let error;
        let user = await loginUser(email, password).catch(e => error = e.message);

        if (user) {

            response = {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Login success',
                    user: user,
                }),
            }

        } else {

            response = {
                statusCode: 400,
                body: JSON.stringify({
                    error: error,
                }),
            }
        }

        return callback(null, response);
    }

    return callback(null, parametersError);
}

exports.changePassword = async (event, context, callback) => {

    //to change password

    let body = JSON.parse(event.body);
    let email = body.email;
    let password = body.password;
    let newPassword = body.newPassword;
    let response;

    if (email && password && newPassword) {

        let error;
        let user = await changePassword(email, password, newPassword).catch(e => error = e.message);

        if (user) {

            response = {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Password changed',
                }),
            }

        } else {

            response = {
                statusCode: 400,
                body: JSON.stringify({
                    error: error,
                }),
            }
        }

        return callback(null, response);
    }

    return callback(null, parametersError);
}

exports.remove = async (event, context, callback) => {

    //to remove an account

    let body = JSON.parse(event.body);
    let email = body.email;
    let password = body.password;
    let response;

    if (email && password) {

        let error;
        let user = await removeUser(email, password).catch(e => error = e.message);

        if (user) {

            response = {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Account removed',
                }),
            }

        } else {

            response = {
                statusCode: 200,
                body: JSON.stringify({
                    error: error,
                }),
            }
        }

        return callback(null, response);
    }

    return callback(null, parametersError);
}