const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://www.omdbapi.com';
const API_KEY = '6b9d95e5'; // same key you used in Postman

test('get movie by title returns valid data', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/?t=Inception&apikey=${API_KEY}`);

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.Title).toBeTruthy();

  const rating = parseFloat(body.imdbRating);
  expect(rating).not.toBeNaN();
});

test('handles movie not found', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/?t=asdkjaskdjaskd&apikey=${API_KEY}`);

  const body = await response.json();
  expect(body.Response).toBe('False');
});

test('search movie by title and year returns correct match', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/?t=Inception&y=2010&apikey=${API_KEY}`);
    const body = await response.json();

    expect(body.Year).toBe('2010');
    expect(body.Title.toLowerCase()).toContain('inception');
  });

  test('missing apikey returns 401, not a crash', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/?t=Inception`);

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.Error).toBeTruthy();
  });