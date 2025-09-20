@echo off
echo 🚂 Starting Railway deployment for Legal Sahyog Hub...

echo 📦 Building Spring Boot application...
mvn clean package -DskipTests

if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo 🎯 JAR file created: target/legal-sahyog-hub-0.0.1-SNAPSHOT.jar
    echo 🚀 Ready for Railway deployment!
) else (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo 🎉 Legal Sahyog Hub is ready for Railway deployment!
pause
