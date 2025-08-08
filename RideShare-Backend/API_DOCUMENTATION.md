# RideShare Backend API Documentation

This document provides instructions for integrating the frontend with the RideShare backend, focusing on authentication services.

## Base URL

The API is running locally. Assuming the default FastAPI port, the base URL is: `http://127.0.0.1:8000`

## Authentication Endpoints

Here are the details for the login and signup endpoints.

### 1. User Registration (Signup)

- **Endpoint:** `/auth/register`
- **Method:** `POST`
- **Description:** Creates a new user account.

#### Request Body

The request body must be a JSON object with the following structure:

```json
{
  "first_name": "string",
  "last_name": "string",
  "email": "user@example.com",
  "password": "a_secure_password",
  "user_type": "passenger",
  "phone_no": "string (optional)",
  "cnic": "string (optional)",
  "profile_picture": "string (optional, URL)",
  "bio": "string (optional)",
  "driving_license": "string (optional)",
  "gender": "string (optional)"
}
```

- `user_type` must be either `"driver"` or `"passenger"`.

#### Success Response (200 OK)

A JSON object representing the newly created user:

```json
{
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone_no": "1234567890",
    "user_type": "passenger",
    "cnic": "12345-6789012-3",
    "profile_picture": null,
    "bio": null,
    "driving_license": null,
    "gender": null,
    "wallet": 0.0,
    "average_rating": 0.0,
    "created_at": "2023-10-27T10:00:00.000Z"
}
```

---

### 2. User Login

- **Endpoint:** `/auth/login`
- **Method:** `POST`
- **Description:** Authenticates a user and returns an access token.

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "a_secure_password"
}
```

#### Success Response (200 OK)

A JSON object containing the access token, token type, and user details:

```json
{
    "access_token": "your_jwt_token_here",
    "token_type": "bearer",
    "user": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "phone_no": "1234567890",
        "user_type": "passenger",
        "cnic": "12345-6789012-3",
        "profile_picture": null,
        "bio": null,
        "driving_license": null,
        "gender": null,
        "wallet": 0.0,
        "average_rating": 0.0,
        "created_at": "2023-10-27T10:00:00.000Z"
    }
}
```

## How to Use This in Your Frontend

To integrate this into your frontend application, you will need to make HTTP requests to these endpoints. For example, using `fetch` in JavaScript:

### Example: Signup

```javascript
async function registerUser(userData) {
  const response = await fetch('http://127.0.0.1:8000/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  console.log(data);
}

const newUser = {
  first_name: "Jane",
  last_name: "Doe",
  email: "jane.doe@example.com",
  password: "password123",
  user_type: "passenger"
};

registerUser(newUser);
```

### Example: Login

```javascript
async function loginUser(credentials) {
  const response = await fetch('http://127.0.0.1:8000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  console.log(data);

  // Store the access_token for future authenticated requests
  if (data.access_token) {
    localStorage.setItem('accessToken', data.access_token);
  }
}

const userCredentials = {
  email: "jane.doe@example.com",
  password: "password123"
};

loginUser(userCredentials);
``` 