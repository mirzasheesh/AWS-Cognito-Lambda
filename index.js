const { registerUser, verifyUser, loginUser, changePassword, removeUser } = require('./cognito/modules');

exports.handler = async function (event, context, callback) {

    let response;

    if (event.queryStringParameters.action) {

        let queries = event.queryStringParameters;
        let body = JSON.parse(event.body);

        //To register a new user

        if (queries.action === 'register' && body.email && body.password) {

            let error;

            let user = await registerUser(body.email, body.password).catch(e => error = e.message);

            if (user.username) {

                response = {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'Verification OTP sent',
                        email: body.email,
                    }),
                }

            } else {

                response = {
                    statusCode: 200,
                    body: JSON.stringify({
                        error: user || error,
                    }),
                }

            }

            return callback(null, response);
        }

        //To verify OTP

        if (queries.action === 'verify' && body.email && body.otp) {

            let error;
            let user = await verifyUser(body.email, body.otp).catch(e => error = e.message);

            if (user === 'SUCCESS') {
                response = {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'Account verification done',
                        email: body.email,
                    }),
                }
            } else {
                response = {
                    statusCode: 200,
                    body: JSON.stringify({
                        error: user || error,
                    }),
                }
            }

            return callback(null, response);
        }

        //For login

        if (queries.action === 'login' && body.email && body.password) {

            let error;
            let user = await loginUser(body.email, body.password).catch(e => error = e.message);

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
                    statusCode: 200,
                    body: JSON.stringify({
                        error: error,
                    }),
                }
            }

            return callback(null, response);
        }

        //To change password

        if (queries.action === 'change-pass' && body.email && body.password && body.newPassword) {

            let error;
            let user = await changePassword(body.email, body.password, newPassword).catch(e => error = e.message);

            if (user) {

                response = {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'Password changed',
                        user: user,
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

        //To remove account

        if (queries.action === 'remove' && body.email && body.password) {

            let error;
            let user = await removeUser(body.email, body.password).catch(e => error = e.message);

            if (user) {

                response = {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'Account removed',
                        user: user,
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

        response = {
            statusCode: 200,
            body: JSON.stringify({
                queries: queries,
                body: body,
            }),
        }

        return callback(null, response);
    }

    response = {
        statusCode: 200,
        body: JSON.stringify({
            error: 'Please specify a action',
        }),
    }

    return callback(null, response);
}