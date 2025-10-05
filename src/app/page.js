import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex flex-col justify-center items-center flex-grow text-center px-6 bg-gradient-to-b from-indigo-100 to-white">
        <h1 className="text-5xl font-bold mb-4">Welcome to My Blog</h1>
        <p className="text-lg text-gray-700 mb-8 max-w-xl">
          Share your stories, inspire others, and explore amazing ideas — all in one place.
        </p>

        <div className="flex gap-4">
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline">Log In</Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
