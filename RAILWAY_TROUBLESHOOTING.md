# 🚂 Railway Deployment Troubleshooting Guide

## ❌ Build Failed - Common Issues & Solutions

### Issue 1: Spring Boot Version Compatibility
**Problem**: Spring Boot 3.x has breaking changes
**Solution**: ✅ Fixed - Downgraded to Spring Boot 2.7.5

### Issue 2: MySQL Connector Version
**Problem**: Explicit version conflicts with Spring Boot
**Solution**: ✅ Fixed - Using Spring Boot managed version

### Issue 3: JAR File Name Mismatch
**Problem**: Railway can't find the JAR file
**Solution**: ✅ Fixed - Updated all references to correct JAR name

## 🔧 Railway Configuration Fixes Applied

### 1. Updated pom.xml
```xml
<!-- Fixed Spring Boot version -->
<version>2.7.5</version>

<!-- Fixed MySQL connector -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
```

### 2. Updated railway.json
```json
{
  "deploy": {
    "startCommand": "java -jar target/legal-sahyog-hub-0.0.1-SNAPSHOT.jar"
  }
}
```

### 3. Updated Procfile
```
web: java -Dserver.port=$PORT -jar target/legal-sahyog-hub-0.0.1-SNAPSHOT.jar
```

## 🚀 Re-deploy on Railway

### Step 1: Push Fixed Code
```bash
git add .
git commit -m "Fix Railway deployment issues"
git push origin main
```

### Step 2: Trigger New Deployment
1. Go to your Railway project dashboard
2. Click on your service
3. Go to "Deployments" tab
4. Click "Redeploy" or "Deploy Latest"

### Step 3: Monitor Build Logs
- Watch the build process in Railway dashboard
- Check for any remaining errors
- Build should complete successfully now

## 🎯 Expected Build Process

1. **Maven Build**: `mvn clean package`
2. **JAR Creation**: `target/legal-sahyog-hub-0.0.1-SNAPSHOT.jar`
3. **Database Setup**: MySQL database creation
4. **Application Start**: Spring Boot application startup
5. **Health Check**: Application health verification

## 🔍 Debugging Steps

### If Build Still Fails:

1. **Check Build Logs**:
   - Go to Railway dashboard
   - Click on failed deployment
   - Review build logs for specific errors

2. **Verify Environment Variables**:
   ```
   SPRING_PROFILES_ACTIVE=railway
   JWT_SECRET=legal-sahyog-hub-super-secret-jwt-key-2024
   PORT=8080
   ```

3. **Check Database Connection**:
   - Ensure MySQL database is created
   - Verify DATABASE_URL is set correctly

4. **Test Locally**:
   ```bash
   mvn clean package
   java -jar target/legal-sahyog-hub-0.0.1-SNAPSHOT.jar
   ```

## 🎉 Success Indicators

When deployment succeeds, you'll see:
- ✅ Build completed successfully
- ✅ Application started on port 8080
- ✅ Health check passed
- ✅ Live URL provided

## 📞 Support

If issues persist:
1. Check Railway documentation
2. Review build logs carefully
3. Ensure all environment variables are set
4. Verify database connection

## 🚀 Your Live App

After successful deployment:
- **URL**: `https://legal-sahyog-hub-production.railway.app`
- **Admin Login**: `admin@legalsahyog.com` / `admin123`
- **API**: `https://legal-sahyog-hub-production.railway.app/api/`
