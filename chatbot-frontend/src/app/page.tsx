import ChatWidget from "@/components/ChatWidget";
import "./globals.css";

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-black bg-cover bg-center"
      style={{
        backgroundImage: "url('/series.JPG')",
      }}
    >
      {/* Black card container */}
      <div className="bg-black bg-opacity-70 p-8 rounded-xl text-center w-11/12 max-w-3xl">
       <h1 className="mb-6 px-4 cyberpunk-text">🤖 Sabed's Bot</h1>

        <p className="mb-6 px-4 fire-text text-lg">
          Welcome! Chat with the bot below about TV and Anime shows.
        </p>
      </div>

      {/* Chat widget */}
      <ChatWidget />
    </div>
  );
}
