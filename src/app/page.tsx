import { prisma } from "@/lib/prisma";
import MapClient from "@/components/MapClient";

export default async function Home() {
  // Fetch dispensaries directly on the server for the map
  const rawDispensaries = await prisma.dispensary.findMany({
    select: {
      id: true,
      name: true,
      licenseNumber: true,
      address: true,
      latitude: true,
      longitude: true,
      verified: true
    }
  });

  return (
    <main>
      <section className="hero">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>

        <div className="hero-content container">
          <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.2)', borderRadius: '100px', color: 'var(--color-primary)', marginBottom: '2rem', fontWeight: 600 }}>
            🚀 The Scout Program is Live
          </div>
          <h1>The Industry's Most Accurate Directory. Built by You.</h1>
          <p className="subtitle">
            Say goodbye to outdated 2024 menus. Discover 100% verified dispensaries, legally compliant, and updated in real-time. Join the Scout Program and earn recurring royalties for every dispensary you bring.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href="/dashboard" className="btn btn-primary">
              Become a Scout
            </a>
            <a href="#explore" className="btn btn-secondary">
              Explore Map
            </a>
          </div>
        </div>
      </section>

      <section id="explore" className="container" style={{ padding: '4rem 2rem', position: 'relative', zIndex: 10 }}>
        <h2 style={{ textAlign: "center", marginBottom: "3rem" }}>
          Live Map. <span style={{ color: 'var(--color-primary)' }}>Powered by Apify.</span>
        </h2>

        {/* Render the fully interactive Mapbox GL Client Component */}
        <MapClient dispensaries={rawDispensaries} />

        <div className="grid" style={{ marginTop: '4rem' }}>
          <div className="glass-card">
            <h3 style={{ color: 'var(--color-accent)' }}>✅ 100% Verified Menus</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>
              We sync directly with dispensary inventory systems or use Apify to ensure data is updated daily. Outdated listings are purged.
            </p>
          </div>
          <div className="glass-card">
            <h3 style={{ color: 'var(--color-primary)' }}>💸 Scout Royalties</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Earn 10-15% of the monthly subscription fee for the lifetime of every dispensary you refer as a Scout.
            </p>
          </div>
          <div className="glass-card">
            <h3 style={{ color: '#F59E0B' }}>📜 2026 Compliant</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Age-gated, license-verified listings ensure peace of mind and strict adherence to the latest advertising standards.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
