# AyuStore E-Commerce Platform

A modern, full-stack e-commerce platform built with React.js frontend and Spring Boot backend.

![AyuStore Banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **React Router** for navigation
- **Axios** for API calls
- **Tailwind CSS** for styling

### Backend
- **Spring Boot 3.3** with Java 17+
- **Spring Security** with OAuth2/JWT
- **Spring Data JPA** with PostgreSQL
- **Redis** for caching
- **Razorpay** payment gateway
- **SpringDoc OpenAPI** for documentation

## 📋 Features

- 🛍️ Product catalog with search & categories
- 🔐 Google OAuth 2.0 authentication
- 🛒 Shopping cart functionality
- 📦 Order management & lifecycle
- 💳 Razorpay payment integration
- 👤 User profile management
- 🔑 Admin dashboard
- 📊 Redis caching for performance

## 📁 Project Structure

```
ayustore-e-commerce/
├── frontend/          # React.js frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   └── package.json
│
├── backend/           # Spring Boot backend
│   ├── src/main/java/com/ayustore/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── entity/
│   │   ├── dto/
│   │   ├── security/
│   │   └── config/
│   └── pom.xml
│
├── docker-compose.yml # Full stack deployment
└── README.md
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Database (Neon/Supabase)
DATABASE_URL=jdbc:postgresql://your-host:5432/ayustore
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your-password

# Redis (Upstash)
REDIS_URL=redis://your-redis-host:6379

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# JWT
JWT_SECRET=your-base64-encoded-secret

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Frontend
VITE_API_URL=http://localhost:8080/api
```

## 🏃 Running Locally

### Option 1: Docker Compose (Recommended)

```bash
# Start all services (frontend, backend, postgres, redis)
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📚 API Documentation

Once running, access Swagger UI at: http://localhost:8080/swagger-ui.html

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/{id}` | Get product details |
| GET | `/api/auth/google` | Google OAuth login |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | Get user orders |
| POST | `/api/payments/razorpay/create` | Create payment |
| GET | `/api/admin/dashboard` | Admin stats |

## 🚀 Deployment

### Backend (Render/Railway)
1. Connect GitHub repository
2. Set environment variables
3. Build: `cd backend && mvn package -DskipTests`
4. Start: `java -jar backend/target/*.jar`

### Frontend (Vercel/Netlify)
1. Connect GitHub repository
2. Root: `frontend`
3. Build: `npm run build`
4. Output: `dist`

### Database & Cache
- PostgreSQL: Neon or Supabase (free tier)
- Redis: Upstash (free tier)

## 👨‍💻 Author

**Ayush Mishra**

## 📄 License

MIT License - feel free to use for personal and commercial projects.
