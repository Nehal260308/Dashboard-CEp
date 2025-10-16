# Urban Audit Dashboard

A responsive, multi-user dashboard for community-based urban audit projects.

## Features

### User Features
1. **Poster Upload Module**
   - Upload and manage image-based posters
   - Preview images in modal view
   - Delete and re-upload functionality

2. **Ward Map Module**
   - Insert and embed ward map links
   - View maps directly in the dashboard
   - Update map links as needed

3. **Skywalk Audit Module**
   - Upload multiple images
   - View images in a scrollable gallery
   - Individual image deletion

4. **Survey Analytics Module**
   - Upload CSV files or Google Sheets links
   - View auto-generated analytics and charts
   - Replace data as needed

5. **Interview Media Module**
   - Upload audio/video files
   - Built-in media player
   - Navigate through multiple files

6. **Mapillary Mapping Module**
   - Upload Mapillary links
   - Add up to 3 supporting images
   - Manage links and images

7. **Problem Solving Exercise Module**
   - Add links to coding exercises/solutions
   - Quick access to solutions
   - Update links as needed

### Technical Features
- Next.js for robust server-side rendering
- Firebase for secure authentication and data storage
- Tailwind CSS for responsive design
- TypeScript for type safety
- Real-time data synchronization

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your Firebase configuration in `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## User Access

- Pre-configured users:
  - Manthan
  - Vihan
  - Nemi

Each user has their own personalized workspace with isolated data.

## Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Deployment**: Vercel (recommended)

## Security Features

- Secure authentication system
- Protected user data isolation
- Secure admin access
- File upload restrictions and validation

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.