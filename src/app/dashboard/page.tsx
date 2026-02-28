import { prisma } from "@/lib/prisma"

export default async function Dashboard() {
    // Mock login: Just get the first scout
    const scout = await prisma.user.findFirst({
        where: { email: 'scout1@example.com' },
        include: {
            referredDispensaries: {
                include: { subscription: true }
            },
            royaltyPayments: true
        }
    });

    if (!scout) return <div className="dashboard-layout container"><h1>No Scout Found</h1></div>;

    const totalProjectedMonthly = scout.referredDispensaries.reduce((acc, disp) => {
        if (disp.subscription && disp.subscription.status === 'active') {
            return acc + ((disp.subscription.monthlyFee || 0) * (disp.subscription.royaltyPercentage / 100));
        }
        return acc;
    }, 0);

    return (
        <main className="dashboard-layout container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome back, <span style={{ color: 'var(--color-primary)' }}>{scout.name}</span></h1>
                    <p className="subtitle" style={{ margin: 0 }}>Scout Code: <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{scout.referralCode}</span></p>
                </div>
                <div>
                    <button className="btn btn-primary">+ Register Dispensary</button>
                </div>
            </div>

            <div className="grid">
                <div className="glass-card">
                    <h3 style={{ color: 'var(--color-text-muted)' }}>Total Historical Earnings</h3>
                    <div className="metric-value">${scout.totalEarnings.toFixed(2)}</div>
                    <p style={{ color: '#00E676', fontSize: '0.9rem', fontWeight: 600 }}>↑ 12% from last month</p>
                </div>

                <div className="glass-card">
                    <h3 style={{ color: 'var(--color-text-muted)' }}>Projected Monthly Royalties</h3>
                    <div className="metric-value" style={{ color: 'var(--color-primary)' }}>${totalProjectedMonthly.toFixed(2)}</div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Based on {scout.referredDispensaries.length} active referred dispensaries</p>
                </div>
            </div>

            <h2 style={{ marginTop: '4rem', marginBottom: '2rem' }}>Your Verified Dispensaries</h2>

            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                {scout.referredDispensaries.map((dispensary) => (
                    <div key={dispensary.id} className="dispensary-item">
                        <div>
                            <h4 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{dispensary.name}</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                {dispensary.address} | Lic: {dispensary.licenseNumber}
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span className="badge-verified" style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
                                ✓ API Verified Daily
                            </span>
                            <p className="royalty-tag">
                                {dispensary.subscription ? `${dispensary.subscription.royaltyPercentage}% Royalty Drop` : 'Free Trial'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
