import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/index.js';

describe('Part 1: API Integration Tests', () => {
  //it('should pass placeholder test', () => {
    // TODO: Student implementation - Part 1: Integration Testing
    // Test user creation (POST /users)
    // Test ticket creation (POST /tickets)
    // Test auth middleware rejection (401 when X-User-Id is missing or invalid)
    // Test 404 responses for non-existent users and tickets
    // Test pagination and filtering on GET /tickets
    //expect(true).toBe(true);
  //});

  it('should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'Test User', email: 'test@example.com' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test User');
    expect(response.body.email).toBe('test@example.com');
  });

  it('should create a ticket', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({ name: 'Ticket User', email: 'ticket.user@example.com' });
    const userId = userResponse.body.id;

    const response = await request(app)
      .post('/tickets')
      .set('X-User-Id', userId)
      .send({ title: 'Test Ticket', description: 'This is a test ticket' });
    expect(response.status).toBe(201);
  });

  it('should reject a ticket when X-User-Id is missing', async () => {
    const response = await request(app)
      .post('/tickets')
      .send({ title: 'Test Ticket', description: 'This is a test ticket' });
    expect(response.status).toBe(401);
  });

  it('should return 404 for non-existent user', async () => {
    const response = await request(app)
      .get('/users/9999'); // Assuming 9999 is a non-existent user ID
    expect(response.status).toBe(404);
  });

  it('should return 404 for non-existent ticket', async () => {
    const response = await request(app)
      .get('/tickets/9999'); // Assuming 9999 is a non-existent ticket ID
    expect(response.status).toBe(404);
  });

  it('should support pagination on GET /tickets', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({ name: 'Pagination User', email: 'pagination.user@example.com' });
    const userId = userResponse.body.id;

    for (let i = 0; i < 6; i++) {
      const ticketResponse = await request(app)
      .post('/tickets')
      .set('X-User-Id', userId)
      .send({ title: `Ticket ${i}`, description: `Description ${i}` });
    }

    const response = await request(app)
      .get('/tickets?limit=5&offset=0');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(5);
  });

  it('should support filtering on GET /tickets', async () => {
    const response = await request(app)
      .get('/tickets?status=TODO');
    expect(response.status).toBe(200);

    for (const ticket of response.body) {
      expect(ticket.status).toBe('TODO');
    }
  });

});
