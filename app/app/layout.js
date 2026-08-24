export const metadata = {
  title: "Secret Letter",
  description: "A message meant to find you.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
