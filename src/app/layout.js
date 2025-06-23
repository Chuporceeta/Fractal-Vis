import "./globals.css";
import {UserContextProvider} from "@/components/userContext";

export const metadata = {
    title: "Fractal Visualizer",
    description: "Visualize any fractal.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black">
          <UserContextProvider>
              {children}
          </UserContextProvider>
      </body>
    </html>
  );
}
