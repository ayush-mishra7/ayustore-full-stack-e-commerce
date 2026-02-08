# AyuStore E-Commerce Backend

A production-grade Spring Boot backend for the AyuStore e-commerce platform, featuring Google OAuth2 authentication, JWT tokens, Redis caching, PostgreSQL database, and Razorpay payment integration.

## 🚀 Features

- **Authentication**: Google OAuth 2.0 with JWT token-based sessions
- **Role-Based Access Control**: USER and ADMIN roles
- **Product Management**: CRUD operations with Redis caching
- **Order Management**: Complete order lifecycle handling
- **Payment Integration**: Razorpay payment gateway
- **API Documentation**: Swagger/OpenAPI at `/swagger-ui.html`

## 📋 Prerequisites

- Java 17+
- Maven 3.8+
- PostgreSQL 15+ (or Neon/Supabase)
- Redis 7+ (or Upstash)
- Google OAuth 2.0 credentials
- Razorpay API keys

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL JDBC connection string |
| `DATABASE_USERNAME` | Database username |
| `DATABASE_PASSWORD` | Database password |
| `REDIS_URL` | Redis connection URL |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `JWT_SECRET` | Base64-encoded secret (min 256 bits) |
| `RAZORPAY_KEY_ID` | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret |
| `FRONTEND_URL` | Frontend origin for CORS |

## 🏃 Running Locally

### Option 1: Docker Compose (Recommended)

```bash
# Set environment variables
export GOOGLE_CLIENT_ID=your-client-id
export GOOGLE_CLIENT_SECRET=your-client-secret
export RAZORPAY_KEY_ID=your-razorpay-key
export RAZORPAY_KEY_SECRET=your-razorpay-secret

# Start all services
docker-compose up --build
```

### Option 2: Maven

```bash
# Start PostgreSQL and Redis locally first, then:
./mvnw spring-boot:run
```

## 📚 API Endpoints

### Public
- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get product details
- `GET /api/auth/google` - Initiate Google OAuth

### Authenticated (USER)
- `GET /api/auth/me` - Get current user profile
- `POST /api/orders` - Create order
- `GET /api/orders` - Get my orders
- `POST /api/payments/razorpay/create` - Create payment
- `POST /api/payments/razorpay/verify` - Verify payment

### Admin Only
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/orders` - All orders
- `PUT /api/admin/orders/{id}/status` - Update order status
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/{id}` - Update product
- `DELETE /api/admin/products/{id}` - Delete product
- `GET /api/admin/users` - List users

## 🔧 Tech Stack

- **Framework**: Spring Boot 3.2
- **Security**: Spring Security, OAuth2, JWT
- **Database**: PostgreSQL, Spring Data JPA
- **Caching**: Redis, Spring Cache
- **Payments**: Razorpay Java SDK
- **Docs**: SpringDoc OpenAPI

## 📦 Deployment

### Render / Railway

1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Build command: `./mvnw package -DskipTests`
4. Start command: `java -jar target/*.jar`

### Database (Neon/Supabase)

Use the connection string provided by your database host.

### Redis (Upstash)

Use the Redis URL provided by Upstash.

## 📄 License

MIT License - feel free to use for personal and commercial projects.

---

Built with ❤️ by Ayush Mishra
