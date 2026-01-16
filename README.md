# HRGenie Frontend

A modern, responsive frontend application for the HRGenie platform, seamlessly integrating document management, real-time collaboration, and AI-powered tools.

## Features

- **Authentication**: Secure user signup and login functionality.
- **Document Management**: Create, read, update, rename, and delete documents.
- **Real-time Collaboration**: Live updates and collaboration using Socket.io.
- **Rich Text Editing**: Integrated React Quill for a full-featured editing experience.
- **AI Integration**: Grammar checking and text summarization capabilities.
- **Modern UI**: Polished interface built with Radix UI primitives and Tailwind CSS v4.

## Architecture

The HRGenie frontend is built as a robust Single Page Application (SPA) leveraging the latest features of the React ecosystem.

### Tech Stack & Design Patterns

- **Framework**: Built on **Next.js 16** using the **App Router** for efficient, server-side optimized routing and layout management.
- **Core Library**: **React 19** powers the comprehensive component architecture.
- **State Management**: **Redux Toolkit** is utilized for global state management, specifically handling:
  - `authSlice`: Manages user authentication state and JWT tokens.
  - `documentSlice`: Handles the application's document data flow.
- **Data Fetching**: **Axios** is configured with interceptors to automatically inject the Authentication Bearer token into requests, ensuring secure communication with the backend.
- **Real-Time Communication**: **Socket.io-client** enables WebSocket connections for real-time document updates and collaborative features.
- **Styling**: **Tailwind CSS v4** provides a utility-first styling approach, augmented by **Radix UI** primitives for accessible, headless UI components, and **Lucide React** for consistent iconography. **Framer Motion** adds fluid animations to enhance user experience.
- **Form Handling**: **React Hook Form** combined with **Zod** schema validation ensures robust and type-safe form interactions.

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- The HRGenie Backend service running (default: `http://localhost:5001`)

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd hrgenie-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory. You can use the default API URL or specify your own:
    ```bash
    NEXT_PUBLIC_API_URL=http://localhost:5001
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the application:**
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components (atoms, molecules, organisms).
- `src/redux`: Redux store configuration and slices (`auth`, `document`).
- `src/services`: API service definitions (`api.ts`) and WebSocket configuration.
- `src/hooks`: Custom React hooks.
