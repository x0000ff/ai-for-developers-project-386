import { CalendarDays, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-nav)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: 'var(--accent)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CalendarDays size={18} color="white" strokeWidth={2} />
          </div>
          <span
            style={{
              fontFamily: 'var(--font)',
              fontWeight: 700,
              fontSize: 18,
              color: 'var(--fg)',
              letterSpacing: '-0.02em',
            }}
          >
            Callbook
          </span>
        </Link>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
<Link
            to="/admin"
            className="nav-btn-outline"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '8px 16px',
              border: '1px solid var(--border)',
              borderRadius: 8,
              background: 'transparent',
              color: 'var(--fg)',
              fontFamily: 'var(--font)',
              fontWeight: 500,
              fontSize: 14,
              textDecoration: 'none',
              letterSpacing: '-0.01em',
            }}
          >
            <ShieldCheck size={14} strokeWidth={2} />
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
