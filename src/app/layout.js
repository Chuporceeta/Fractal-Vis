import "./globals.css";

export const metadata = {
  title: "Fractal Visualizer",
  description: "Visualize any fractal.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black">
        {children}
      </body>
    </html>
  );
}
