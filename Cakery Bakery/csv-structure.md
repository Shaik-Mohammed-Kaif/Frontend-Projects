# CSV File Structure Documentation

This document outlines the structure of CSV files used in the Cakery bakery website for data storage.

## users.csv
Stores user registration data with password hashing.

```csv
id,name,email,password,created_at
USER-1234567890,John Doe,john@example.com,hashed_password_here,2024-01-15T10:30:00Z
USER-1234567891,Sarah Smith,sarah@example.com,hashed_password_here,2024-01-16T09:15:00Z
```

**Fields:**
- `id`: Unique user identifier (format: USER-{timestamp})
- `name`: Full name of the user
- `email`: Email address (used for login)
- `password`: Hashed password using Java Core security features
- `created_at`: Registration timestamp in ISO format

## orders.csv
Stores customer order details for events and celebrations.

```csv
order_id,user_id,product_name,quantity,event_name,event_type,total_price,customer_name,email,contact_number,additional_notes,date
ORD-1234567890,USER-1234567890,Chocolate Fudge Cake,2,Birthday Party,Birthday,71.98,John Doe,john@example.com,555-0123,Extra candles please,2024-01-15T14:20:00Z
ORD-1234567891,USER-1234567891,Wedding Cake,1,Sarah's Wedding,Wedding,89.99,Sarah Smith,sarah@example.com,555-0124,,2024-01-16T11:45:00Z
```

**Fields:**
- `order_id`: Unique order identifier (format: ORD-{timestamp})
- `user_id`: Reference to user who placed the order
- `product_name`: Name of the selected bakery item
- `quantity`: Number of items ordered
- `event_name`: Name of the event/celebration
- `event_type`: Type of event (Birthday, Wedding, Office Event, etc.)
- `total_price`: Calculated total price
- `customer_name`: Customer's full name
- `email`: Customer's email address
- `contact_number`: Phone number for order confirmation
- `additional_notes`: Special requests or dietary restrictions
- `date`: Order timestamp in ISO format

## contacts.csv
Stores contact form submissions and customer inquiries.

```csv
contact_id,name,email,message,date
CONTACT-1234567890,Mike Johnson,mike@example.com,Do you offer gluten-free options?,2024-01-15T16:30:00Z
CONTACT-1234567891,Lisa Davis,lisa@example.com,Interested in catering services for 50 people,2024-01-16T13:20:00Z
```

**Fields:**
- `contact_id`: Unique contact identifier (format: CONTACT-{timestamp})
- `name`: Full name of the person contacting
- `email`: Email address for response
- `message`: Customer's message or inquiry
- `date`: Submission timestamp in ISO format

## products.csv
Stores bakery product information and availability.

```csv
id,name,category,price,description,image_url,availability
1,Chocolate Fudge Cake,Cake,35.99,Rich chocolate cake with creamy fudge frosting,https://example.com/cake1.jpg,true
2,French Croissants,Pastry,3.99,Buttery flaky croissants baked fresh,https://example.com/croissant.jpg,true
3,Oatmeal Cookies,Cookie,1.99,Wholesome cookies with raisins,https://example.com/cookies.jpg,false
```

**Fields:**
- `id`: Unique product identifier
- `name`: Product name
- `category`: Category (Cake, Pastry, Cookie, Bread, Cupcake, Sandwich)
- `price`: Product price in USD
- `description`: Detailed product description
- `image_url`: URL to product image
- `availability`: Boolean indicating if product is available

## newsletter.csv
Stores email newsletter subscriptions.

```csv
id,email,date
NEWS-1234567890,customer1@example.com,2024-01-15T18:45:00Z
NEWS-1234567891,customer2@example.com,2024-01-16T10:30:00Z
```

**Fields:**
- `id`: Unique subscription identifier (format: NEWS-{timestamp})
- `email`: Subscriber's email address
- `date`: Subscription timestamp in ISO format

## Java Backend Implementation Notes

### Password Hashing
- Use `MessageDigest` with SHA-256 for password hashing
- Add salt for additional security
- Example: `DigestUtils.sha256Hex(password + salt)`

### CSV File Operations
- Use `BufferedReader` and `BufferedWriter` for file operations
- Implement proper exception handling for file I/O
- Use `Files.exists()` to check file existence before operations

### Data Validation
- Email format validation using regex patterns
- Phone number format checking
- Required field validation before CSV insertion
- Price calculations with proper decimal handling

### File Structure
```
backend/
├── src/
│   ├── models/
│   │   ├── User.java
│   │   ├── Order.java
│   │   ├── Contact.java
│   │   └── Product.java
│   ├── services/
│   │   ├── UserService.java
│   │   ├── OrderService.java
│   │   └── ContactService.java
│   └── utils/
│       ├── CSVHandler.java
│       └── PasswordUtils.java
└── csv_data/
    ├── users.csv
    ├── orders.csv
    ├── contacts.csv
    ├── products.csv
    └── newsletter.csv
```

This CSV structure provides a complete data storage solution for the bakery website without requiring a traditional database system.