export default function FontPreview() {
  const headingFonts = [
    { id: 'hipstravaganza', label: 'Hipstravaganza', src: '/fonts/hipstravaganza.ttf', format: 'truetype' },
    { id: 'artisual-deco', label: 'Artisual Deco (Regular)', src: '/fonts/artisual-deco.otf', format: 'opentype' },
    { id: 'artisual-deco-black', label: 'Artisual Deco (Black)', src: '/fonts/artisual-deco-black.otf', format: 'opentype' },
    { id: 'market-deco', label: 'Market Deco', src: '/fonts/market-deco.ttf', format: 'truetype' },
    { id: 'athena', label: 'Athena', src: '/fonts/athena.ttf', format: 'truetype' },
    { id: 'cabbagetown', label: 'Cabbagetown', src: '/fonts/cabbagetown.ttf', format: 'truetype' },
    { id: 'decary', label: 'Decary Sans Light', src: '/fonts/decary.otf', format: 'opentype' },
  ]

  const bodyFonts = [
    { id: 'courier', label: 'Courier (system)', src: null, format: null },
    { id: 'creato', label: 'Creato Display', src: '/fonts/creato.otf', format: 'opentype' },
    { id: 'worldstar', label: 'Worldstar', src: '/fonts/worldstar.ttf', format: 'truetype' },
    { id: 'linlibertine', label: 'Lin Libertine', src: '/fonts/linlibertine.ttf', format: 'truetype' },
  ]

  const sampleName = 'Harry Houdini'
  const sampleCategory = 'Magician & Escape Artist · 1920s'
  const sampleBody = 'The world\'s greatest escape artist and illusionist, who challenged supernatural claims and befriended — then publicly feuded with — Arthur Conan Doyle over spiritualism. He signed the Aladdin guestbook as simply "Houdini — New York City."'

  const fontFaces = [
    ...headingFonts.filter(f => f.src).map(f =>
      `@font-face { font-family: '${f.id}'; src: url('${f.src}') format('${f.format}'); font-display: block; }`
    ),
    ...bodyFonts.filter(f => f.src).map(f =>
      `@font-face { font-family: '${f.id}'; src: url('${f.src}') format('${f.format}'); font-display: block; }`
    ),
  ].join('\n')

  const INK = '#1a1209'
  const PAPER = '#f5f0e6'
  const RULE = '#c8b89a'
  const ACCENT = '#8b6914'
  const FUCHSIA = '#c0405a'

  return (
    <main style={{ background: PAPER, color: INK, minHeight: '100vh', fontFamily: 'Georgia, serif' }}>
      <style>{fontFaces}</style>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 32px 80px' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: ACCENT, marginBottom: 8 }}>Font Preview</h1>
        <p style={{ fontSize: '0.8rem', color: RULE, marginBottom: 48 }}>Each card shows how the heading + body font combination looks on a profile page. The heading uses the large name font; the body uses the description font below it.</p>

        {/* HEADING FONT SECTION */}
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: ACCENT, borderBottom: `1px solid ${RULE}`, paddingBottom: 8, marginBottom: 32 }}>
          Heading Font Options (for the guest name)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginBottom: 64 }}>
          {headingFonts.map(f => (
            <div key={f.id} style={{ border: `1px solid ${RULE}`, padding: '28px 32px', background: '#fff' }}>
              <p style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: ACCENT, margin: '0 0 16px' }}>{f.label}</p>
              <div style={{ borderBottom: `2px double ${INK}`, paddingBottom: 20, marginBottom: 20 }}>
                <p style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: ACCENT, margin: '0 0 10px' }}>{sampleCategory}</p>
                <p style={{
                  fontFamily: `'${f.id}', serif`,
                  fontSize: 'clamp(2.4rem, 7vw, 4.5rem)',
                  fontWeight: f.id === 'artisual-deco-black' ? 900 : 400,
                  lineHeight: 1.05,
                  margin: 0,
                  color: INK,
                }}>
                  {sampleName}
                </p>
              </div>
              <p style={{ fontFamily: 'Palatino, serif', fontStyle: 'italic', fontSize: '1rem', lineHeight: 1.7, margin: 0, color: INK, borderLeft: `3px solid ${INK}`, paddingLeft: 16 }}>
                {sampleBody}
              </p>
            </div>
          ))}
        </div>

        {/* BODY FONT SECTION */}
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: ACCENT, borderBottom: `1px solid ${RULE}`, paddingBottom: 8, marginBottom: 32 }}>
          Body Font Options (for the description text)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginBottom: 64 }}>
          {bodyFonts.map(f => (
            <div key={f.id} style={{ border: `1px solid ${RULE}`, padding: '28px 32px', background: '#fff' }}>
              <p style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: ACCENT, margin: '0 0 16px' }}>{f.label}</p>
              <div style={{ borderBottom: `2px double ${INK}`, paddingBottom: 20, marginBottom: 20 }}>
                <p style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: ACCENT, margin: '0 0 10px' }}>{sampleCategory}</p>
                <p style={{
                  fontFamily: `'market-deco', serif`,
                  fontSize: 'clamp(2.4rem, 7vw, 4.5rem)',
                  lineHeight: 1.05,
                  margin: 0,
                  color: INK,
                }}>
                  {sampleName}
                </p>
              </div>
              <p style={{
                fontFamily: f.id === 'courier' ? "'Courier New', Courier, monospace" : `'${f.id}', serif`,
                fontSize: '1.05rem',
                lineHeight: 1.8,
                margin: 0,
                color: INK,
                borderLeft: `3px solid ${INK}`,
                paddingLeft: 16,
              }}>
                {sampleBody}
              </p>
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <p style={{ fontFamily: f.id === 'courier' ? "'Courier New', Courier, monospace" : `'${f.id}', serif`, fontSize: '0.85rem', margin: 0, color: ACCENT }}>
                  Quick Facts · Signed on page 231 · Born 1874 in Budapest
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* COMBINED COMBOS */}
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: ACCENT, borderBottom: `1px solid ${RULE}`, paddingBottom: 8, marginBottom: 32 }}>
          Suggested combinations
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {[
            { heading: 'hipstravaganza', headingLabel: 'Hipstravaganza', body: 'linlibertine', bodyLabel: 'Lin Libertine' },
            { heading: 'artisual-deco-black', headingLabel: 'Artisual Deco Black', body: 'creato', bodyLabel: 'Creato Display' },
            { heading: 'market-deco', headingLabel: 'Market Deco', body: 'linlibertine', bodyLabel: 'Lin Libertine' },
            { heading: 'athena', headingLabel: 'Athena', body: 'courier', bodyLabel: 'Courier' },
            { heading: 'cabbagetown', headingLabel: 'Cabbagetown', body: 'creato', bodyLabel: 'Creato Display' },
            { heading: 'decary', headingLabel: 'Decary Sans Light', body: 'worldstar', bodyLabel: 'Worldstar' },
          ].map(combo => (
            <div key={`${combo.heading}-${combo.body}`} style={{ border: `2px solid ${INK}`, padding: '32px 36px', background: PAPER }}>
              <p style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: FUCHSIA, margin: '0 0 20px' }}>
                {combo.headingLabel} + {combo.bodyLabel}
              </p>
              <div style={{ borderBottom: `2px double ${INK}`, paddingBottom: 24, marginBottom: 28, textAlign: 'center' }}>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: ACCENT, margin: '0 0 12px' }}>{sampleCategory}</p>
                <p style={{
                  fontFamily: `'${combo.heading}', serif`,
                  fontSize: 'clamp(2.4rem, 7vw, 4.2rem)',
                  lineHeight: 1.05,
                  margin: 0,
                  color: INK,
                }}>
                  {sampleName}
                </p>
              </div>
              <p style={{
                fontFamily: combo.body === 'courier' ? "'Courier New', Courier, monospace" : `'${combo.body}', serif`,
                fontSize: '1.05rem',
                lineHeight: 1.8,
                margin: '0 0 16px',
                color: INK,
                borderLeft: `3px solid ${INK}`,
                paddingLeft: 20,
                fontStyle: 'italic',
              }}>
                {sampleBody}
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {['Born Erik Weisz in Budapest, 1874', 'Signed the guestbook as simply "Houdini — New York City"', 'Fierce debunker of fraudulent mediums'].map((fact, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, fontFamily: combo.body === 'courier' ? "'Courier New', Courier, monospace" : `'${combo.body}', serif`, fontSize: '0.9rem', lineHeight: 1.6, color: INK }}>
                    <span style={{ color: ACCENT, flexShrink: 0 }}>✦</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 48, fontSize: '0.7rem', color: RULE, textAlign: 'center' }}>
          Tell me which heading + body combo you like and I'll apply it to all the profile pages.
        </p>
      </div>
    </main>
  )
}
