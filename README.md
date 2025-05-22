# DEFENZO - Interactive Cybersecurity Learning Platform

![DEFENZO Logo](assets/images/icon.png)

DEFENZO is an interactive cybersecurity learning platform designed to help users master essential security concepts through hands-on exercises and real-world scenarios.

## 🌟 Features

- **Interactive Learning Paths**: Tailored courses for different skill levels
- **Real-world Scenarios**: Practical exercises and simulations
- **Security Tools**: 
  - URL Scanner (VirusTotal integration)
  - Password Strength Checker
  - Two-Factor Authentication
- **Progress Tracking**: Monitor your learning journey
- **Achievement System**: Earn badges and rewards
- **Regular Updates**: Stay current with latest security trends

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Go (for backend)
- SQLite3

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/defenzo.git
cd defenzo
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
go mod download
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Configure API URL:
   - Open `app/services/api.ts`
   - Find the `BASE_URL` constant
   - Replace the IP address with your local machine's IP address
   - To find your IP address:
     - On Windows: Run `ipconfig` in Command Prompt
     - On macOS/Linux: Run `ifconfig` or `ip addr` in Terminal
   - Make sure your mobile device and development machine are on the same network

6. Start the development servers:

Frontend:
```bash
npm run dev
```

Backend:
```bash
cd backend
go run main.go
```

## 🛠️ Tech Stack

### Frontend
- React Native
- Expo
- TypeScript
- Zustand (State Management)

### Backend
- Go
- SQLite
- JWT Authentication
- VirusTotal API Integration

## 📱 Mobile App

The mobile app is built with React Native and Expo, providing a native experience across iOS and Android platforms.

## 🔒 Security Features

- JWT Authentication
- Password Strength Validation
- Two-Factor Authentication
- URL Security Scanning
- Secure Data Storage

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- Frontend Developer
- Backend Developer
- UI/UX Designer

## 📧 Contact

For support or inquiries, please contact: support@defenzo.com

## 🙏 Acknowledgments

- VirusTotal API
- Expo Team
- React Native Community