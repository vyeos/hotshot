# Hotshot 🔥

Hotshot is a high-octane, anime-themed web application built for community interaction. It features a unique energy-based economy, daily content drops, and a robust authentication system.

## 🌟 Features

- **Anime-Inspired UI**: A vibrant, dynamic interface with custom animations and a bold design language.
- **Daily Drops**: Exclusive image drops that users can interact with.
- **Tribute System**: Users can spend "Energy" to pay tribute to their favorite waifu.
- **Smart Energy Economy**:
  - Daily energy allowance and refills.
  - Automatic energy regeneration logic.
- **Robust Authentication**: Secure sign-up and login powered by **Convex Auth**, including:
  - GitHub & Google OAuth
  - Custom username and password
- **Real-time Updates**: Instant data synchronization for leaderboards and user states using Convex.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Backend & Database**: [Convex](https://convex.dev/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/)
- **Animations**: `tw-animate-css`

## 🚀 Getting Started

Follow these steps to get the project running locally:

### Prerequisites

- Node.js (v18 or higher)
- bun

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/hotshot.git
    cd hotshot
    ```

2.  **Install dependencies:**

    ```bash
    bun install
    ```

3.  **Set up Environment Variables:**

    Initialize your Convex project to generate the necessary environment variables in `.env.local`:

    ```bash
    npx convex dev
    ```

    This will configure `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`.

4.  **Start the development server:**

    This command starts both the Next.js frontend and the Convex backend.

    ```bash
    bun dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `/app`: Next.js App Router pages and layouts.
- `/convex`: Backend logic, schema, and authentication configuration.
- `/components`: Reusable UI components.
- `/public`: Static assets.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
