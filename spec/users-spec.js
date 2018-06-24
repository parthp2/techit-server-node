const request = require("request");
const User = require('../models/user');

const api = request.defaults({
  baseUrl: 'http://localhost:3000/api',
  json: true
});

describe('Users API Tests:', function () {
  let jwtToken = '';
  beforeAll(function (done) {
      api.post({
          url: '/login',
          body: {
              username: 'viccena',
              password: 'abcd'
          }
      }, function (err, res, body) {
        expect(res.statusCode).toBe(200);
        jwtToken = body.token;
        done()  
      });
  });

  it('Login success', function (done) {
    api.post({
      url: '/login',
      body: {
        username: 'parth',
        password:'abcd'
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      done();
    });
  });
  
  it('Login Failure', function (done) {
    api.post({
      url: '/login',
      body: {
        username: 'parth',
        password:'abcdk'
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(401);
      done();
    });
  });

  it('Get A User Ticket Successful', function (done) {
    api.get({
      url: `/users/5af125ef11a96a2ac19e99f4/tickets`,
      headers: {
        'Authorization': 'Bearer ' + jwtToken
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      expect(res.json).not.toBeLessThan(1);
      done();
    });
  });

  it('Get A User Ticket Fails', function (done) {
    api.get({
      url: '/users/5af125ef11a96a2ac19e99f5/tickets',
      headers: {
        'Authorization': 'Bearer ' + jwtToken
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(403);
      done();
    });
  });
});