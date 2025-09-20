# 🚂 Railway Deployment Guide for Legal Sahyog Hub

## Quick Deployment Steps

### 1. Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Authorize Railway to access your repositories

### 2. Deploy Your Application
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: `SumanthKP4995/legal-sahyog-hub`
4. Railway will automatically detect it's a Spring Boot application

### 3. Add MySQL Database
1. In your project dashboard, click **"+ New"**
2. Select **"Database"** → **"MySQL"**
3. Railway will create a MySQL database and provide connection details

### 4. Configure Environment Variables
In your project settings, add these environment variables:

```
SPRING_PROFILES_ACTIVE=railway
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=8080
```

### 5. Database Connection
Railway will automatically provide these environment variables:
- `DATABASE_URL` - Complete database connection string
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password

### 6. Deploy
1. Railway will automatically build and deploy your application
2. Your app will be available at: `https://your-app-name.railway.app`

## 🎯 Expected Deployment Time: 5-10 minutes

## 🔗 Your Live URLs
- **Railway App**: `https://legal-sahyog-hub-production.railway.app`
- **GitHub Repository**: `https://github.com/SumanthKP4995/legal-sahyog-hub`

## 🚀 Features After Deployment
- ✅ Complete Spring Boot application
- ✅ MySQL database with all tables
- ✅ JWT authentication
- ✅ Video consultation (Jitsi Meet)
- ✅ Payment processing
- ✅ Admin and Provider dashboards
- ✅ Legal literacy center
- ✅ Real-time notifications

## 📱 Access Your Application
1. **Home Page**: `https://your-app.railway.app`
2. **Admin Login**: `admin@legalsahyog.com` / `admin123`
3. **API Documentation**: `https://your-app.railway.app/api/`

## 🔧 Troubleshooting
- Check Railway logs if deployment fails
- Ensure all environment variables are set
- Database will be automatically created with schema

## 🎉 Success!
Your Legal Sahyog Hub will be live and accessible worldwide!
