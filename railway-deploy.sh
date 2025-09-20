#!/bin/bash

# Railway Deployment Script for Legal Sahyog Hub

echo "🚂 Starting Railway deployment for Legal Sahyog Hub..."

# Build the application
echo "📦 Building Spring Boot application..."
mvn clean package -DskipTests

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🎯 JAR file created: target/legal-sahyog-hub-0.0.1-SNAPSHOT.jar"
    echo "🚀 Ready for Railway deployment!"
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Legal Sahyog Hub is ready for Railway deployment!"
