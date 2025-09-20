@echo off
echo Starting Legal Sahyog Hub...
echo.
echo Please ensure you have:
echo 1. Java 17+ installed
echo 2. MySQL 8.0+ running
echo 3. Database 'legal_sahyog_hub' created
echo 4. Maven installed
echo.
echo If Maven is not installed, you can download it from: https://maven.apache.org/download.cgi
echo.
pause
echo.
echo Attempting to run the application...
echo.

REM Try to run with Maven
mvn spring-boot:run
if %errorlevel% neq 0 (
    echo.
    echo Maven not found. Please install Maven and try again.
    echo.
    echo Alternative: If you have the JAR file, you can run:
    echo java -jar target/legal-sahyog-hub-0.0.1-SNAPSHOT.jar
    echo.
    pause
)
