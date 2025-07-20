import "./globals.css";

export const metadata = {
  title: "Smart Goal Planner",
  description: "Track and manage your savings goals",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
