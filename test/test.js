var chai = require('chai');
var expect = require('chai').expect

const api = require('./../auth0-api/api');
require('dotenv').config()

describe('Auth0 API calls', function () {

   // uncomment if using reverse proxy etc

    if (process.env.NODE_ENV === "testing") {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      process.env.AUTH0_DOMAIN = 'localhost:9001';
    }

  it('should get a management token', function (done) {

    this.timeout(3000);

        async function runTest() {
          try {
            const response = await api.getMgmtToken();
            expect(response).to.have.own.property('access_token');
          } catch (e) {
            console.log(e);
            expect(true).to.be.false;
          } finally {
            done();
          }
        };

        runTest();

   });

   it('should get a user', function (done) {

        this.timeout(5000);

        async function runTest() {
          try {
            const tokens = await api.getMgmtToken();
            expect(tokens).to.have.own.property('access_token');
            const mgmtToken = tokens.access_token;
            const user = await api.getUser(mgmtToken, process.env.USER_ID);
            console.log(user);
            expect(process.env.USER_ID).to.eq(user.user_id);
          } catch (e) {
            console.log(e);
            expect(true).to.be.false;
          } finally {
            done();
          }
        };

        runTest();

    });

    it.only('should update a user', function (done) {

        this.timeout(5000);

        async function runTest() {
          try {
            const tokens = await api.getMgmtToken();
            expect(tokens).to.have.own.property('access_token');
            const mgmtToken = tokens.access_token;
            const payload = {
              email_verified: false
            };
            const user = await api.updateUser(mgmtToken, process.env.USER_ID, payload);
            console.log(user);
            expect(process.env.USER_ID).to.eq(user.user_id);
            expect(false).to.eq(user.email_verified);
          } catch (e) {
            console.log(e);
            expect(true).to.be.false;
          } finally {
            done();
          }
        };

        runTest();

    });

  it('should send forgot password email', function (done) {

    this.timeout(5000);

    async function runTest() {
      try {
        const email = process.env.EMAIL_TO_TEST;
        const response = await api.sendForgotPasswordEmail(email);
        expect(response).to.eq("We've just sent you an email to reset your password.");
      } catch (e) {
        console.log(e);
        expect(true).to.be.false;
      } finally {
        done();
      }
    };

    runTest();

  });



});