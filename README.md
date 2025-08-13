# Vera - AI-Powered Wardrobe Management

**Vera** is an intelligent wardrobe management application that helps users organize their clothing items, plan outfits, and manage their style preferences with AI-powered suggestions.

## 🚀 Features

### **Authentication & User Management**
- **Google OAuth Integration**: Secure sign-in/sign-out using NextAuth.js
- **Smart Onboarding**: Intelligent onboarding flow for new users
- **Gmail Integration**: Connect Gmail to automatically process order confirmations

### **Wardrobe Management**
- **Item Organization**: Categorize and tag clothing items by brand, color, size, and category
- **Image Management**: Upload and manage product images with automatic categorization
- **Smart Filtering**: Dynamic filters based on your actual wardrobe items
- **Search Functionality**: Search by name, brand, color, size, and more

### **Outfit Planning**
- **AI-Powered Suggestions**: Get outfit recommendations based on your wardrobe
- **Outfit Creation**: Build and save custom outfit combinations
- **Calendar Integration**: Schedule outfits for specific dates
- **Pack Management**: Create travel packs with selected items

### **Advanced Features**
- **PDF Processing**: Extract product information from order confirmation PDFs
- **Image Processing**: AI-powered image analysis and categorization
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Real-time Updates**: Instant synchronization across all components

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: Prisma with PostgreSQL
- **AI Integration**: OpenAI API for intelligent suggestions
- **Image Processing**: Advanced image analysis and categorization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google OAuth credentials
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vera_logic_working
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with:
   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="your-secret"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   OPENAI_API_KEY="your-openai-key"
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### **For New Users**
1. Sign in with your Google account
2. Complete the onboarding flow to connect your Gmail
3. Start adding items to your wardrobe
4. Explore outfit suggestions and planning features

### **For Existing Users**
1. Sign in with your Google account
2. Access your existing wardrobe and outfits
3. Continue organizing and planning your style

## 🎨 Design System

Vera features a modern, clean design system with:
- **Color Palette**: Warm creams, sophisticated grays, and accent colors
- **Typography**: Inter and Playfair Display fonts for optimal readability
- **Layout**: Responsive grid system with proper spacing and hierarchy
- **Components**: Consistent UI components with smooth animations

## 🔧 Development

### **Project Structure**
```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable React components
├── contexts/           # React contexts for state management
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries and configurations
├── types/              # TypeScript type definitions
└── prisma/             # Database schema and migrations
```

### **Key Commands**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open database GUI
```

## 📊 Current Status

✅ **COMPLETED**: All major features implemented including:
- Complete UI/UX redesign
- Authentication system with Google OAuth
- Smart onboarding flow
- Wardrobe management system
- Outfit planning and suggestions
- Responsive design optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the [PROGRESS.md](PROGRESS.md) for detailed development progress
- Review [PROGRESS_LOG.md](PROGRESS_LOG.md) for recent changes
- Open an issue for bugs or feature requests

---

**Vera** - Your AI-powered wardrobe management assistant 🎯
