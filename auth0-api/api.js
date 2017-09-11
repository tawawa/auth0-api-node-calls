var request = require("request");
require('dotenv').config();

  const getMgmtToken = () => {

      return new Promise((resolve, reject) => {

        const body = {
          client_id: process.env.AUTH0_MGMT_CLIENT_ID,
          client_secret: process.env.AUTH0_MGMT_CLIENT_SECRET,
          audience: `https://${process.env.AUTH0_DOMAIN_ORIG}/api/v2/`,
          grant_type: 'client_credentials'
        };

        const uri = `https://${process.env.AUTH0_DOMAIN}/oauth/token`;

        const options = {
          method: 'POST',
          url: uri,
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(body)
        };

        request(options, (err, response, tokens) => {
          if (err) {
            return reject(new Error(err.message));
          }
          let reply = JSON.parse(tokens);
          return resolve(reply);
        });

      });
    };


    const getApiV1MgmtToken = () => {

      return new Promise((resolve, reject) => {

        const body = {
          client_id: process.env.AUTH0_MGMT_V1_CLIENT_ID,
          client_secret: process.env.AUTH0_MGMT_v1_CLIENT_SECRET,
          grant_type: 'client_credentials'
        };

        const uri = `https://${process.env.AUTH0_DOMAIN}/oauth/token`;

        const options = {
          method: 'POST',
          url: uri,
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(body)
        };

        request(options, (err, response, tokens) => {
          if (err) {
            return reject(new Error(err.message));
          }
          let reply = JSON.parse(tokens);
          return resolve(reply);
        });

      });
    };


  const getUser = (mgmtToken, userId) => {

      return new Promise((resolve, reject) => {

        var options = {
          method: 'GET',
          url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`,
          headers: {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: `Bearer ${mgmtToken}`
            },
            json: true
          };

        request(options, function (error, response, body) {
          if (error) {
            return reject(error);
          }
          return resolve(body);
        });


      });

    };

    const updateUser = (mgmtToken, userId, payload) => {

          console.log(`updating user: ${payload}`);

          return new Promise((resolve, reject) => {

            var options = {
              method: 'PATCH',
              url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`,
              headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${mgmtToken}`
              },
              body: payload,
              json: true
            };

            request(options, function (error, response, body) {
              if (error || !(response.statusCode + '').startsWith("2")) {
                console.log("Failed to send forgot password email.");
                return reject(error);
              }
              console.log(body);
              return resolve(body);
            });

          });

        }

    const sendForgotPasswordEmail = (email) => {

      console.log(`sending password reset for: ${email}`);

      return new Promise((resolve, reject) => {

        var options = {
          method: 'POST',
          url: `https://${process.env.AUTH0_DOMAIN}/dbconnections/change_password`,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            client_id: process.env.AUTH0_CLIENT_ID,
            email: email,
            connection: process.env.AUTH0_CONNECTION
          },
          json: true
        };

        request(options, function (error, response, body) {
          if (error || !(response.statusCode + '').startsWith("2")) {
            console.log("Failed to send forgot password email.");
            return reject(error);
          }
          console.log(body);
          return resolve(body);
        });

      });

    };

    const sendVerificationEmail = (mgmtApiV1Token, userId) => {

      console.log(`sending verification email for user with userId: ${userId}`);

      return new Promise((resolve, reject) => {

        var options = {
          method: 'POST',
          url: `https://${process.env.AUTH0_DOMAIN}/api/users/${userId}/send_verification_email`,
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${mgmtApiV1Token}`
          }
        };

        request(options, function (error, response, body) {
          if (error || !(response.statusCode + '').startsWith("2")) {
            console.log("Failed to send verify email.");
            return reject(error);
          }
          console.log(body);
          return resolve(body);
        });

      });

    };


module.exports = {
  getMgmtToken,
  getApiV1MgmtToken,
  getUser,
  updateUser,
  sendForgotPasswordEmail,
  sendVerificationEmail
}

