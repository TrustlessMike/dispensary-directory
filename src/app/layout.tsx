import "./globals.css";

export const metadata = {
  title: "Scout | The 2026 Dispensary Directory",
  description: "Verified Dispensary Directory powered by the Scout Loyalty Program. Accurate menus, live pricing, compliant listings.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <nav className="navbar">
          <div className="container">
            <div className="brand">
              <span className="brand-icon">⚡</span> Scout<span style={{ color: '#94A3B8', fontWeight: 300 }}>Directory</span>
            </div>
            <div className="nav-links">
              <a href="/" className="nav-link">Home</a>
              <a href="/dashboard" className="nav-link">Scout Dashboard</a>
              <a href="#" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Login</a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
