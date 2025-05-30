# MySonar App

**MySonar** is a Mobile Application designed to enhance the experience of Sónar Festival attendees through personalized schedule recommendations tailored to each user's musical tastes and attendance preferences.

This repository contains the code of the Mobile App. If you are interested in the algorithms and logic behind it, check out the [Backend API repository](https://github.com/adriablancafort/mysonar-api).

### The Challenge

Sónar is an electronic and experimental music festival held annually in Barcelona, renowned for bringing together internationally acclaimed artists while giving visibility to emerging and alternative talents. The festival distinguishes itself through its focus on innovation and technology, featuring two main parts: **Sónar by Day** (the experimental and innovative section) and **Sónar by Night** (featuring the most crowded performances).

With over **150,000 spectators**, **350 artists**, and more than **100 project booths** across 3 festival days, attendees often face decision fatigue when choosing which activities to attend. This abundance of simultaneous offerings can lead people to simply follow the crowd, potentially missing out on activities that better match their personal preferences.

### Our Solution

MySonar addresses this challenge by offering a **personalized festival experience** through:

- **Smart Recommendations**: An algorithm based on embeddings that analyzes user preferences through a brief, creative questionnaire
- **Customized Itineraries**: Unique schedules adapted to individual needs and interests
- **Artist Discovery**: Promotion of emerging artists and innovative experiences, helping users discover new talents they might otherwise miss
- **Experience Preview**: Three key attributes that anticipate and describe what the user's festival experience will be like

The app aims to eliminate FOMO (Fear of Missing Out) by providing users with a clear guide that maximizes their time and ensures they participate in activities truly designed for their tastes.

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img width="300" alt="Screenshot 2025-05-30 at 10 58 05" src="https://github.com/user-attachments/assets/6c1403a7-4df9-4baf-8cd4-78a97e0ee0d7" />
      </td>
      <td align="center">
        <img width="300" alt="Screenshot 2025-05-30 at 10 58 35" src="https://github.com/user-attachments/assets/0af5f10f-c221-4903-831c-ddde1e7e7d3a" />
      </td>
    </tr>
    <tr>
      <td align="center">
        <img width="300" alt="Screenshot 2025-05-30 at 10 58 57" src="https://github.com/user-attachments/assets/133b3670-50d1-4a9a-b4fe-01bfdd3f782e" />
      </td>
      <td align="center">
        <img width="300" alt="Screenshot 2025-05-30 at 11 00 01" src="https://github.com/user-attachments/assets/4e0abd86-02ec-4265-995a-3fad7fb58ced" />
      </td>
    </tr>
    <tr>
      <td align="center">
        <img width="300" alt="Screenshot 2025-05-30 at 11 00 11" src="https://github.com/user-attachments/assets/57a253d5-d31d-44cb-b87d-a5343a4d32b9" />
      </td>
      <td align="center">
        <img width="300" alt="Screenshot 2025-05-30 at 11 02 30" src="https://github.com/user-attachments/assets/e58ee75a-d65c-486c-8ed2-18a30c9886ee" />
      </td>
    </tr>
    <tr>
      <td align="center">
        <img width="300" alt="Screenshot 2025-05-30 at 11 02 50" src="https://github.com/user-attachments/assets/5114ce48-9325-44ba-8ffb-965ad476d23e" />
      </td>
      <td align="center">
        <img width="300" alt="Screenshot 2025-05-30 at 11 00 47" src="https://github.com/user-attachments/assets/05fcfe1c-9966-4f2c-b7ba-71ad93a6a130" />
      </td>
    </tr>
    <tr>
      <td align="center">
        <img width="300" alt="Screenshot 2025-05-30 at 11 03 48" src="https://github.com/user-attachments/assets/044288d9-75c3-4577-a9d8-91b11f4929cd" />
      </td>
      <td align="center">
        <img width="300" alt="Screenshot 2025-05-30 at 11 04 53" src="https://github.com/user-attachments/assets/499b20b6-53fd-471a-bd77-061d958b8915" />
      </td>
    </tr>
  </table>
</div>

## Application Access

The MySonar app is currently available **only for Android** devices (no iOS version yet, since it requires the Apple Developer License).

👉 **[Download the APK here](https://expo.dev/accounts/adriablancafort/projects/mysonar/builds/c802bad1-2da8-4151-90d0-c63232c11f4f)**

To install:
1. Open the link on your Android device.
2. Allow installation from unknown sources if prompted.
3. Tap the `.apk` file and follow the instructions.

---

## Development Setup

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Get Started

1. Clone the repository

   ```bash
   git clone https://github.com/adriablancafort/mysonar-app.git
   cd mysonar-app
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create environment configuration

   Create a `.env` file in the root directory and add:
   ```
   EXPO_PUBLIC_API_URL=your_api_url_here
   ```

4. Start the development server

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

### Building for Production

To create an Android APK build using EAS:

1. Configure EAS (if not already done):
   ```bash
   eas login
   eas build:configure
   ```

2. Build for Android preview:
   ```bash
   eas build --platform android --profile preview
   ```

3. For a production build:
   ```bash
   eas build --platform android --profile production
   ```

The build will be available in your [Expo dashboard](https://expo.dev/) once completed.
