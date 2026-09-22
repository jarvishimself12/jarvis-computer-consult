# Jarvis Computer Consult - Mobile App (Expo)

An official, full-featured React Native / Expo mobile application for **Jarvis Computer Consult**, configured with the custom company logo as the app icon and splash screen.

## Features
- **Custom App Icon & Splash**: Utilizes the high-resolution red SNW logo as the phone home screen icon (`icon.png`), Android adaptive icon (`adaptive-icon.png`), and splash launch screen (`splash.png`).
- **Store Catalog**: Full catalog of computers, laptops, phones, accessories, and tech services matching the web platform.
- **Cart & Checkout**: Interactive shopping bag, quantity steppers, promo code discount (`JARVIS25`), and mobile money / card checkout flow.
- **Product Details**: Complete specifications, ratings, warranties, and stock badges.
- **Authentication**:
  - Sign In & Sign Up with credential validation.
  - "Continue with Google" modal requesting valid email and password format.
  - User profile with order tracking and direct customer support.

## Getting Started

### 1. Install Dependencies
Navigate to the mobile app directory and install dependencies:
```bash
cd mobile-app
npm install
```

### 2. Start the App
Start the Expo development server:
```bash
npx expo start
```

### 3. Open on Phone
- **Android**: Install the **Expo Go** app from Google Play Store. Scan the QR code displayed in the terminal.
- **iOS**: Install the **Expo Go** app from Apple App Store. Scan the QR code using your iPhone Camera.
- **Web**: Press `w` in the terminal to view in your web browser.

### 4. Build Standalone APK / App Bundle
To build an installable APK for Android phones with the custom home screen icon:
```bash
npx eas-cli build -p android --profile preview
```
