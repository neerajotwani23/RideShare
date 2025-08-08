# Google Account Linking Implementation

## Overview

This implementation allows users to link their existing email accounts with Google Sign-In, providing a seamless authentication experience. Users can now use both email/password and Google Sign-In methods for the same account.

## How It Works

### Auth Provider Values

- **`"email"`**: User registered with email/password only
- **`"google"`**: User registered with Google Sign-In only  
- **`"both"`**: User can use both email/password and Google Sign-In

### Account Linking Scenarios

#### 1. New User with Google Sign-In
- User doesn't exist in database
- Creates new account with `auth_provider = "google"`
- Stores Google ID in `google_id` column

#### 2. Existing Email User Links Google Account
- User exists with `auth_provider = "email"`
- Google Sign-In with same email address
- Updates `google_id` column
- Changes `auth_provider` to `"both"`
- User can now use both authentication methods

#### 3. Existing Google User
- User already has Google ID linked
- Verifies Google ID matches
- Proceeds with login

#### 4. Google ID Conflict
- If Google ID is already used by another account
- Returns 409 Conflict error
- Prevents account linking conflicts

#### 5. Email Mismatch
- If email exists but linked to different Google account
- Returns 401 Unauthorized error
- Protects against account hijacking

## Database Schema Changes

### User Model Updates

```python
# Updated auth_provider field
auth_provider = Column(String(50), default="email", nullable=False)  
# Values: "email", "google", or "both"

# Google ID field (already existed)
google_id = Column(String(255), nullable=True, unique=True, index=True)
```

### Schema Updates

```python
# UserCreate schema now supports optional password and gender
class UserCreate(UserBase):
    password: Optional[str] = None  # Optional for Google users
    user_type: UserTypeEnum
    gender: Optional[GenderEnum] = None  # Optional for Google users
```

## API Endpoints

### Google Login/Link Endpoint

**POST** `/auth/google-login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "google_id": "google_user_id_123",
  "access_token": "google_access_token",
  "first_name": "John",
  "last_name": "Doe",
  "profile_picture": "https://example.com/photo.jpg"
}
```

**Response:**
```json
{
  "access_token": "jwt_token",
  "refresh_token": "refresh_token",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "auth_provider": "both",
    "google_id": "google_user_id_123",
    // ... other user fields
  }
}
```

## Error Handling

### Common Error Responses

1. **400 Bad Request**: Missing required Google data
2. **401 Unauthorized**: Google account mismatch
3. **409 Conflict**: Google ID already linked to another account
4. **500 Internal Server Error**: Server error during authentication

## Frontend Integration

### UnifiedGoogleSignIn Component

The frontend component handles different scenarios:

1. **Successful Login**: User exists and Google ID matches
2. **Account Linking**: User exists but no Google ID - links automatically
3. **New User**: User doesn't exist - navigates to signup
4. **Linking Errors**: Shows appropriate error messages

### Error Message Handling

```typescript
if (errorMessage.includes('Google account mismatch') ||
    errorMessage.includes('already linked to another email')) {
  // Show account linking error
  Alert.alert('Account Linking Error', errorMessage);
}
```

## Testing

### Test Script

Run the test script to verify functionality:

```bash
cd RideShare-Backend
python test_google_linking.py
```

### Test Scenarios

1. **Email User Creation**: Create user with email/password
2. **Google Account Linking**: Link Google to existing email user
3. **Linked Account Login**: Login with Google on linked account
4. **Conflict Prevention**: Attempt to link different Google account
5. **New Google User**: Create new user with Google Sign-In

## Security Considerations

1. **Google ID Uniqueness**: Each Google ID can only be linked to one account
2. **Email Verification**: Google provides verified email addresses
3. **Access Token Validation**: Backend can validate Google access tokens
4. **Account Protection**: Prevents linking to wrong Google accounts

## Benefits

1. **User Convenience**: Users can choose their preferred login method
2. **Account Recovery**: Email users can link Google for easier access
3. **Seamless Experience**: No need to create separate accounts
4. **Security**: Maintains account integrity and prevents conflicts

## Future Enhancements

1. **Unlinking**: Allow users to unlink Google accounts
2. **Multiple Google Accounts**: Support linking multiple Google accounts
3. **Account Merging**: Merge separate email and Google accounts
4. **Social Login**: Extend to other providers (Facebook, Apple, etc.) 