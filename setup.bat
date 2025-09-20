@echo off
echo Legal Sahyog Hub - Setup Script
echo ================================
echo.

echo This script will help you set up the Legal Sahyog Hub application.
echo.

echo Step 1: Database Setup
echo ----------------------
echo Please ensure MySQL is installed and running.
echo Create a database named 'legal_sahyog_hub' and run the database_schema.sql file.
echo.

echo Step 2: Configuration
echo ---------------------
echo Update the following in src/main/resources/application.properties:
echo - Database connection details
echo - JWT secret key
echo - Email configuration (optional)
echo.

echo Step 3: Build and Run
echo ---------------------
echo Run the following commands:
echo 1. mvn clean install
echo 2. mvn spring-boot:run
echo.
echo Or use the run.bat file provided.
echo.

echo Step 4: Access Application
echo --------------------------
echo Once running, access the application at: http://localhost:8080
echo.
echo Default admin credentials:
echo Email: admin@legalsahyog.com
echo Password: admin123
echo.

echo For more detailed instructions, see README.md
echo.
pause
