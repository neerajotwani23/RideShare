# Database-Side Validations Summary

## Overview
This document outlines all the database-side validations implemented throughout the RideShare application to ensure data integrity, security, and business logic compliance.

## 🏗️ Validation Layers

### 1. Database-Level Constraints (CheckConstraint)
- **User Model**: Name length, email length, password length, wallet balance, rating range
- **Vehicle Model**: Make/model/color length, license plate format, registration length
- **Ride Model**: Source/destination length, fare limits, seat range, source ≠ destination
- **RideRequest Model**: Seat range, location length validation
- **Transaction Model**: Amount limits (positive, max 100,000)
- **Payment Model**: Different sender/receiver validation
- **Rating Model**: Star range (1-5), text length, different users

### 2. SQLAlchemy Validators (@validates)
- **User Model**: Email format, phone format (Pakistani), CNIC format, name format, bio length
- **Vehicle Model**: Make/model format, color format, license plate format (Pakistani)
- **Ride Model**: Timing validation (future, within 30 days), location format, fare limits
- **RideRequest Model**: Seat validation, location format, status validation
- **Transaction Model**: Amount validation, type validation
- **Payment Model**: Type validation, user ID validation
- **Rating Model**: Star validation, text validation, user ID validation

### 3. Repository-Level Business Logic
- **UserRepository**: Email uniqueness, wallet balance validation
- **RideRepository**: Source/destination difference, active ride limit
- **RideRequestRepository**: Self-request prevention, seat availability, ride status validation
- **RatingRepository**: Self-rating prevention, duplicate rating prevention

## 📋 Detailed Validation Rules

### User Validations
```python
# Database Constraints
- first_name: length >= 2
- last_name: length >= 2  
- email: length >= 5, unique
- password: length >= 6
- wallet: >= 0
- average_rating: 0-5 range
- bio: length <= 1000
- profile_picture: length <= 500
- driving_license: length <= 100

# Validators
- first_name: letters and spaces only, title case
- last_name: letters and spaces only, title case
- email: valid email format, lowercase
- phone_no: Pakistani format (+92XXXXXXXXXX or 03XXXXXXXXX)
- cnic: Pakistani format (XXXXX-XXXXXXX-X), unique
- gender: enum (male, female, other)
```

### Vehicle Validations
```python
# Database Constraints
- name_make: length >= 2
- model: length >= 1
- color: length >= 2
- no_plate: length >= 5, unique
- registration: length >= 5, unique

# Validators
- name_make: letters, numbers, spaces, hyphens, title case
- model: letters, numbers, spaces, hyphens, title case
- color: letters and spaces only, title case
- no_plate: Pakistani format (ABC-123 or ABC-1234), uppercase
```

### Ride Validations
```python
# Database Constraints
- source: length >= 3
- destination: length >= 3
- fare: > 0
- seats_offered: 1-10 range
- source != destination

# Validators
- timing: future (30+ minutes), within 30 days
- source: letters, numbers, spaces, commas, hyphens, periods, title case
- destination: letters, numbers, spaces, commas, hyphens, periods, title case
- fare: 0-10,000 range, rounded to 2 decimals
- seats_offered: 1-10 range
- status: enum validation
- gender_preference: enum validation
```

### RideRequest Validations
```python
# Database Constraints
- seats: 1-10 range
- source: length >= 3 (if provided)
- destination: length >= 3 (if provided)

# Validators
- seats: 1-10 range
- source: format validation (if provided)
- destination: format validation (if provided)
- status: enum validation
- gender_preference: enum validation

# Business Logic
- Cannot request own ride
- Ride must be available (PENDING, ACTIVE, CONFIRMED)
- No duplicate pending requests
- Sufficient seats available
```

### Transaction Validations
```python
# Database Constraints
- amount: > 0, <= 100,000

# Validators
- amount: positive, max 100,000, rounded to 2 decimals
- type: enum validation (debit/credit)
```

### Payment Validations
```python
# Database Constraints
- from_user_id != to_user_id

# Validators
- type: enum validation (cash/wallet)
- from_user_id: required
- to_user_id: required
- transaction_id: required
```

### Rating Validations
```python
# Database Constraints
- stars: 1-5 range
- reviewer_id != reviewee_id
- text_review: length <= 1000 (if provided)

# Validators
- stars: 1-5 range
- text_review: length <= 1000, trimmed
- reviewer_id: required
- reviewee_id: required

# Business Logic
- Cannot rate yourself
- Cannot rate same user twice
```

## 🔒 Security Validations

### Authentication & Authorization
- Password hashing with bcrypt
- JWT token validation
- User ownership validation for resources
- Role-based access control (DRIVER/PASSENGER)

### Data Sanitization
- Input trimming and formatting
- SQL injection prevention (SQLAlchemy ORM)
- XSS prevention (input validation)
- Enum validation for all status fields

## 🚨 Error Handling

### Validation Error Responses
```python
# HTTP Status Codes
- 400: Bad Request (validation errors)
- 401: Unauthorized (authentication)
- 403: Forbidden (authorization)
- 404: Not Found (resource not found)
- 409: Conflict (duplicate data)

# Error Message Format
{
    "detail": "Specific validation error message"
}
```

### Common Error Messages
- "Email already registered"
- "Invalid phone number format"
- "Invalid CNIC format"
- "Source and destination cannot be the same"
- "You already have an active ride"
- "Not enough seats available"
- "You cannot rate yourself"
- "Insufficient wallet balance"

## 🧪 Testing

### Validation Test Script
Run the comprehensive validation test:
```bash
cd RideShare-Backend
python test_validations.py
```

### Test Coverage
- ✅ User model validations
- ✅ Vehicle model validations  
- ✅ Ride model validations
- ✅ Rating model validations
- ✅ Database constraints
- ✅ Business logic validations

## 📊 Performance Considerations

### Indexes
- Primary keys on all tables
- Unique indexes on email, CNIC, license plate, registration
- Foreign key indexes for relationships
- Composite indexes for common queries

### Constraint Performance
- Check constraints are evaluated at insert/update time
- Validators run before database operations
- Business logic validations include database queries

## 🔄 Migration Notes

### Database Schema Updates
When updating the database schema:
1. Add new constraints gradually
2. Test with existing data
3. Consider data migration for format changes
4. Update frontend validation to match

### Backward Compatibility
- New validations should not break existing valid data
- Consider making new fields optional initially
- Provide migration scripts for data format changes

## 📝 Best Practices

### Validation Order
1. **Frontend Validation**: Immediate user feedback
2. **API Validation**: Request validation (Pydantic)
3. **Model Validation**: SQLAlchemy validators
4. **Database Constraints**: Final data integrity
5. **Business Logic**: Repository-level validation

### Error Messages
- Clear and specific error messages
- User-friendly language
- Consistent error format
- Proper HTTP status codes

### Data Consistency
- Foreign key constraints
- Cascade delete rules
- Transaction rollback on errors
- Atomic operations where possible

## 🎯 Future Enhancements

### Planned Validations
- [ ] Real-time seat availability checking
- [ ] Ride timing conflict detection
- [ ] Payment method validation
- [ ] Geographic location validation
- [ ] Rating spam prevention
- [ ] User reputation system

### Monitoring
- [ ] Validation error logging
- [ ] Performance metrics
- [ ] Data quality reports
- [ ] Automated testing

---

**Last Updated**: July 2024
**Version**: 1.0
**Status**: ✅ Implemented and Tested 