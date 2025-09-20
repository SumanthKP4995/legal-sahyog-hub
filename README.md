# Legal Sahyog Hub - Incentivized e-Marketplace for Legal Services in India

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.7.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🏛️ Overview

Legal Sahyog Hub is a comprehensive e-marketplace platform that connects citizens with verified legal service providers across India. The platform incentivizes quality service delivery through a robust reward system and provides a complete ecosystem for legal consultations, education, and service management.

## ✨ Key Features

### 🔐 Multi-Role Authentication
- **Users**: Citizens seeking legal services
- **Providers**: Verified legal professionals (Advocates, Arbitrators, Mediators, Notaries)
- **Admins**: Platform administrators and content managers

### 🎯 Core Functionality
- **Service Discovery**: Advanced search and filtering for legal services
- **Booking System**: Time slot management and appointment scheduling
- **Video Consultations**: Integrated Jitsi Meet for secure video calls
- **Payment Processing**: Multiple payment methods with secure transactions
- **Rating & Reviews**: Comprehensive feedback system
- **Legal Literacy**: Educational content and resources
- **Real-time Notifications**: Instant updates for all activities

### 💰 Incentive System
- **Platform Fee**: 15% commission on each transaction
- **Provider Rewards**:
  - Session completion: 10 points
  - High rating bonus (4.5+): 5 points + 5% earnings bonus
  - Punctuality reward: 3 points + 2% earnings bonus

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 2.7.5
- **Database**: MySQL 8.0 with JPA/Hibernate
- **Security**: Spring Security with JWT authentication
- **Build Tool**: Maven
- **Java Version**: 17

### Frontend
- **HTML5/CSS3/JavaScript**: Modern responsive design
- **Bootstrap 5**: UI framework and components
- **Font Awesome**: Icon library
- **Jitsi Meet**: Video consultation integration

### Database
- **MySQL**: Relational database with 15+ tables
- **JPA/Hibernate**: ORM for database operations
- **Connection Pooling**: Optimized database connections

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/legal-sahyog-hub.git
   cd legal-sahyog-hub
   ```

2. **Set up the database**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE legalsahyoghub;
   
   # Import the schema
   mysql -u root -p legalsahyoghub < database_schema.sql
   ```

3. **Configure the application**
   ```bash
   # Update src/main/resources/application.properties
   spring.datasource.url=jdbc:mysql://localhost:3306/legalsahyoghub?useSSL=false&serverTimezone=UTC
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

4. **Run the application**
   ```bash
   # Using Maven
   mvn spring-boot:run
   
   # Or using the provided batch files (Windows)
   setup.bat
   run.bat
   ```

5. **Access the application**
   - Open your browser and navigate to `http://localhost:8080`
   - Default admin credentials: `admin@legalsahyog.com` / `admin123`

## 📱 User Interfaces

### Public Pages
- **Home Page**: Landing page with service overview
- **Services**: Browse and search legal services
- **Legal Literacy**: Educational content and resources
- **Login/Register**: Authentication pages

### User Dashboard
- **Service Booking**: Book consultations with providers
- **Booking History**: View past and upcoming appointments
- **Payment History**: Track all transactions
- **Reviews**: Manage feedback and ratings

### Provider Dashboard
- **Service Management**: Add and manage offered services
- **Booking Management**: Handle appointment requests
- **Availability**: Set working hours and time slots
- **Earnings**: Track income and rewards
- **Reviews**: Monitor client feedback

### Admin Dashboard
- **User Management**: Manage users and providers
- **Provider Verification**: Approve/reject provider applications
- **Content Management**: Manage legal literacy content
- **Analytics**: Platform statistics and reports
- **Payment Monitoring**: Track all transactions

## 🗄️ Database Schema

The application uses a comprehensive MySQL database with the following key tables:

- **users**: Client information
- **providers**: Legal professional profiles
- **admins**: Administrator accounts
- **services**: Available legal services
- **bookings**: Appointment records
- **payments**: Transaction history
- **reviews**: Client feedback
- **notifications**: System notifications
- **legal_content**: Educational resources

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for users, providers, and admins
- **Password Encryption**: BCrypt hashing for secure password storage
- **CORS Configuration**: Cross-origin resource sharing setup
- **Input Validation**: Comprehensive data validation and sanitization

## 📊 API Documentation

The application provides RESTful APIs for all major operations:

### Authentication APIs
- `POST /api/auth/login` - User login
- `POST /api/auth/register/user` - User registration
- `POST /api/auth/register/provider` - Provider registration

### Service APIs
- `GET /api/services` - Get all services
- `GET /api/services/search` - Search services with filters
- `POST /api/services` - Create new service (Provider only)

### Booking APIs
- `POST /api/bookings` - Create booking
- `GET /api/bookings/{id}` - Get booking details
- `PUT /api/bookings/{id}/confirm` - Confirm booking

### Payment APIs
- `POST /api/payments` - Process payment
- `GET /api/payments/user` - Get user payment history
- `GET /api/payments/provider` - Get provider earnings

## 🧪 Testing

### Manual Testing
1. **User Registration**: Test all user types
2. **Service Booking**: Complete booking flow
3. **Payment Processing**: Test payment scenarios
4. **Video Consultation**: Test Jitsi Meet integration
5. **Review System**: Test rating and feedback

### API Testing
Use tools like Postman or curl to test API endpoints:

```bash
# Test login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@legalsahyog.com","password":"admin123"}'
```

## 🚀 Deployment

### Local Development
```bash
mvn spring-boot:run
```

### Production Deployment
1. **Build the application**
   ```bash
   mvn clean package
   ```

2. **Deploy to server**
   ```bash
   java -jar target/legalsahyoghub-0.0.1-SNAPSHOT.jar
   ```

3. **Environment Configuration**
   - Set up production database
   - Configure SSL certificates
   - Set up reverse proxy (Nginx/Apache)
   - Configure domain and DNS

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Backend Development**: Spring Boot, JPA, MySQL
- **Frontend Development**: HTML5, CSS3, JavaScript, Bootstrap
- **Database Design**: MySQL schema and relationships
- **Security Implementation**: JWT, Spring Security
- **Video Integration**: Jitsi Meet API

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact: support@legalsahyog.com
- Documentation: [Wiki](https://github.com/yourusername/legal-sahyog-hub/wiki)

## 🎯 Roadmap

### Future Enhancements
- [ ] Mobile app (React Native/Flutter)
- [ ] Advanced analytics dashboard
- [ ] AI-powered legal document analysis
- [ ] Multi-language support
- [ ] Integration with government legal databases
- [ ] Blockchain-based document verification

## 🙏 Acknowledgments

- Spring Boot community for the excellent framework
- Jitsi Meet for video consultation capabilities
- Bootstrap for the responsive UI framework
- MySQL for reliable database management

---

**Legal Sahyog Hub - Empowering Legal Access Across India** 🇮🇳⚖️

*Connecting citizens with quality legal services through technology and innovation.*