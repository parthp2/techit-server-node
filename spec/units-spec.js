const request = require("request");

const api = request.defaults({
  baseUrl: 'http://localhost:3000/api',
  json: true
});

describe('Unit API Tests:', function () {

  let jwtToken = '', parthJwtToken = '';
	

  beforeAll(function (done) {
    api.post({
      url: '/login',
      body: {
        username: 'admin',
		    password: 'abcd'
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      jwtToken = body.token;
      api.post({
        url: '/login',
        body: {
          username: 'parth',
          password: 'abcd'
        }
      }, function (err, res, body) {
        console.log(err)
        expect(res.statusCode).toBe(200);
        parthJwtToken = body.token;
        done();
      });
    });
  });
	
	
  it('Get the technicians of a unit Pass', function (done) {
    api.get({
      url: '/units/5af127e3ee1b9efe2a362291/technicians',
      headers: {
        'Authorization': 'Bearer ' + jwtToken
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      expect(body.technicians).not.toBeLessThan(1)
      done();
    });
  });
	
 it('Get the technicians of a unit Fail', function (done) {
    api.get({
      url: '/units/5af127e3ee1b9efe2a362291/technicians',
      headers: {
        'Authorization': 'Bearer ' + parthJwtToken
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(403);
      done();
    });
  });
	
	
   it('Get the tickets submitted to a unit Pass', function (done) {
    api.get({
      url: '/units/5af127e3ee1b9efe2a362291/tickets',
      headers: {
        'Authorization': 'Bearer ' + jwtToken
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      expect(body.tickets).not.toBeLessThan(1)
      done();
    });
  });
	
	
	 it('Get the tickets submitted to a unit Fail', function (done) {
    api.get({
      url: '/units/5af127e3ee1b9efe2a362291/tickets',
      headers: {
        'Authorization': 'Bearer ' + parthJwtToken
      }
    }, function (err, res, body) {
      expect(res.statusCode).toBe(403);
      done();
    });
  });
	
  

});
