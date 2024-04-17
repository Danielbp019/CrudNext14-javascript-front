export const metadata = {
  title: "Creado con Next 14 y javascript",
  description: "CRUD Frontend javascript",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
