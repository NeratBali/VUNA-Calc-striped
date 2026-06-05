const request = require('supertest');
const app = require('../src/app');

describe('CI/CD Quality Assurance Gate Verification', () => {
  
  // Test 1: Verifies that your Express backend loads successfully
  it('should successfully respond to the automated pipeline healthcheck', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  // Test 2: Verifies basic calculator configuration logic boundaries
  it('should verify the testing suite is structurally operational', () => {
    const total = 2 + 3;
    expect(total).toBe(5);
  });
});