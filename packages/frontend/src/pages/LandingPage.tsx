import { Clock, Phone, ShieldCheck, Users, Zap } from 'lucide-react';
import { Navbar } from '../components/Navbar';

const features = [
  { icon: Clock, text: 'No back-and-forth' },
  { icon: Users, text: 'Works for teams' },
  { icon: ShieldCheck, text: 'Simple & secure' },
];

export function LandingPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      <main
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: 96,
          paddingBottom: 96,
        }}
      >
        {/* Badge */}
        <div style={{ animation: 'fadeUp 0.45s ease both', animationDelay: '0ms' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              border: '1px solid var(--accent)',
              borderRadius: 6,
              padding: '5px 12px',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.09em',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              fontFamily: 'var(--font)',
            }}
          >
            <Zap size={11} strokeWidth={2.5} />
            Zero friction scheduling
          </span>
        </div>

        {/* H1 */}
        <h1
          style={{
            fontFamily: 'var(--font)',
            fontWeight: 700,
            fontSize: 'clamp(3rem, 7.5vw, 5.5rem)',
            lineHeight: 1.06,
            letterSpacing: '-0.04em',
            color: 'var(--fg)',
            marginTop: 28,
            animation: 'fadeUp 0.45s ease both',
            animationDelay: '80ms',
          }}
        >
          Book calls.
          <br />
          Effortlessly.
        </h1>

        {/* CTA */}
        <div
          id="book"
          style={{
            marginTop: 40,
            animation: 'fadeUp 0.45s ease both',
            animationDelay: '240ms',
          }}
        >
          <button
            className="cta-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 28px',
              background: 'var(--accent)',
              color: 'var(--accent-fg)',
              border: 'none',
              borderRadius: 8,
              fontFamily: 'var(--font)',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              letterSpacing: '-0.02em',
            }}
          >
            <Phone size={16} strokeWidth={2} />
            Book your call
          </button>
        </div>

        {/* Feature row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px 32px',
            marginTop: 64,
            animation: 'fadeUp 0.45s ease both',
            animationDelay: '320ms',
          }}
        >
          {features.map(({ icon: Icon, text }) => (
            <div
              key={text}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: 'var(--fg-muted)',
                fontFamily: 'var(--font)',
                fontSize: 14,
                fontWeight: 400,
              }}
            >
              <Icon size={15} strokeWidth={1.75} color="var(--fg-muted)" />
              {text}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
