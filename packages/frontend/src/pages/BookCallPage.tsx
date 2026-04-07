import { Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export function BookCallPage() {
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
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            background: 'var(--accent)',
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Phone size={28} color="white" strokeWidth={2} />
        </div>

        <h1
          style={{
            fontFamily: 'var(--font)',
            fontWeight: 700,
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            letterSpacing: '-0.04em',
            color: 'var(--fg)',
            margin: 0,
            textAlign: 'center',
          }}
        >
          Book your call
        </h1>

        <p
          style={{
            fontFamily: 'var(--font)',
            fontSize: 16,
            color: 'var(--fg-muted)',
            margin: 0,
            textAlign: 'center',
          }}
        >
          Coming soon…
        </p>

        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '10px 20px',
            background: 'var(--accent)',
            color: 'var(--accent-fg)',
            border: 'none',
            borderRadius: 8,
            fontFamily: 'var(--font)',
            fontWeight: 600,
            fontSize: 14,
            textDecoration: 'none',
            letterSpacing: '-0.02em',
          }}
        >
          Go home
        </Link>
      </main>
    </div>
  );
}
