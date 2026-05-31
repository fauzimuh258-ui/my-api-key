// app/layout.js
export const metadata = {
  title: "My Groq API",
  description: "Personal AI API powered by Groq",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
