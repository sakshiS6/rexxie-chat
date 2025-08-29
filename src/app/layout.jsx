import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Real-time Chat App",
  description: "A modern real-time chat application built with Next.js and WebSocket",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <Navbar/> */}
        
        {children}
        {/* <Footer/> */}
        </body>
    </html>
  );
}
