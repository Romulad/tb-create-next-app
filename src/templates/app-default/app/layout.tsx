import type { Metadata } from "next";
import "./globall.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "My awesome Nextjs app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
