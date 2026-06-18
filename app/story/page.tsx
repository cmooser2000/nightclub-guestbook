import Link from 'next/link'

const INK = '#1a1209'
const PAPER = '#f5f0e6'
const RULE = '#c8b89a'

export default function LandingPage() {
  return (
    <main style={{ background: PAPER, color: INK, fontFamily: 'var(--font-garamond), Georgia, serif' }}>

      {/* ── MASTHEAD ── */}
      <header style={{ borderBottom: `3px double ${INK}`, padding: '20px 40px 16px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '0.7rem', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 8 }}>
          San Francisco · Est. 1921
        </p>
        <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: 900, lineHeight: 1.05, margin: 0, letterSpacing: '0.02em' }}>
          Aladdin Studio
        </h1>
        <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(1.2rem, 4vw, 2.4rem)', fontWeight: 400, fontStyle: 'italic', margin: '4px 0 12px', letterSpacing: '0.06em' }}>
          Tiffin Room
        </h2>
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.5, margin: 0 }}>
          363 Sutter Street · Douglas 3974 · Hattie Mooser · M.C. Mooser
        </p>
      </header>

      {/* ── HERO IMAGE ── */}
      <div style={{ position: 'relative', maxHeight: '70vh', overflow: 'hidden', borderBottom: `2px solid ${INK}` }}>
        <img
          src="/tiffin-room-interior.jpg"
          alt="Aladdin Studio Tiffin Room interior, 363 Sutter Street, San Francisco"
          style={{ width: '100%', display: 'block', filter: 'sepia(20%) contrast(1.05)', objectFit: 'cover', maxHeight: '70vh' }}
        />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(transparent, rgba(245,240,230,0.95))',
          padding: '60px 40px 28px',
          textAlign: 'center',
        }}>
          <p style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(1rem, 2.5vw, 1.35rem)', fontStyle: 'italic', margin: 0, maxWidth: 620, marginInline: 'auto', lineHeight: 1.5 }}>
            "The spot-around-town for celebrities — the shows they used to put on are still being gabbed about."
          </p>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 10, opacity: 0.5 }}>— Herb Caen, San Francisco Chronicle, 1941</p>
        </div>
      </div>

      {/* ── BODY ── */}
      <article style={{ maxWidth: 860, margin: '0 auto', padding: '60px 32px' }}>

        {/* Deck */}
        <div style={{ textAlign: 'center', borderBottom: `1px solid ${RULE}`, paddingBottom: 40, marginBottom: 52 }}>
          <p style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(1.1rem, 2.5vw, 1.45rem)', fontStyle: 'italic', lineHeight: 1.6, maxWidth: 640, margin: '0 auto 16px' }}>
            Two sisters. One room. A decade of magic.
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, opacity: 0.85 }}>
            In the heart of San Francisco's theater district, Hattie and Minnie Mooser ran a place unlike anything else in the city —
            part tea room, part nightclub, part salon. During Prohibition's most glamorous years, the Aladdin Studio Tiffin Room
            became the gathering spot for the great names of vaudeville and early Hollywood.
          </p>
        </div>

        {/* Section 1: The Sisters */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start', marginBottom: 60 }}>
          <div>
            <SectionHead>The Mooser Sisters</SectionHead>
            <p style={{ lineHeight: 1.85, fontSize: '1.05rem', marginBottom: 16 }}>
              Hattie and Minnie Mooser came from a family already embedded in the world of entertainment. Their brothers,
              George and Leon, were theatrical producers shuttling between Shanghai and New York, facilitating a cultural
              exchange between East and West that shaped what the sisters would build.
            </p>
            <p style={{ lineHeight: 1.85, fontSize: '1.05rem', marginBottom: 16 }}>
              Descended from German Jewish immigrants who had arrived during the California Gold Rush era, the Moosers were
              San Francisco through and through. When Hattie and Minnie opened their first establishment on Post Street —
              a hybrid children's theater and tea room — few could have imagined what it would become.
            </p>
            <p style={{ lineHeight: 1.85, fontSize: '1.05rem' }}>
              By 1921 they had moved to 363 Sutter Street, right in the heart of the theater district, and the Aladdin
              Studio Tiffin Room was born.
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <img
              src="/hattie-minnie.webp"
              alt="Hattie and Minnie Mooser"
              style={{ width: '100%', maxWidth: 340, filter: 'sepia(10%) contrast(1.1)', border: `1px solid ${RULE}` }}
            />
            <p style={{ fontSize: '0.75rem', marginTop: 10, opacity: 0.55, letterSpacing: '0.05em', fontStyle: 'italic' }}>
              Hattie Mooser (left) and Minnie Mooser (right)
            </p>
          </div>
        </section>

        <Divider />

        {/* Section 2: The Room */}
        <section style={{ marginBottom: 60 }}>
          <SectionHead>What Went On at the Aladdin</SectionHead>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
            <div>
              <p style={{ lineHeight: 1.85, fontSize: '1.05rem', marginBottom: 16 }}>
                The Aladdin defied easy categorization. By afternoon it served women's groups, bridal parties, and card
                circles. By evening it transformed into a proper nightclub — what the sisters themselves advertised as
                comparable to the finest venues in New York, Paris, and London, despite operating throughout Prohibition
                without serving a drop of alcohol.
              </p>
              <p style={{ lineHeight: 1.85, fontSize: '1.05rem', marginBottom: 16 }}>
                The decor leaned Chinese: lanterns, dragons painted on the walls, porcelain garden stools. The kitchen
                was run by African American women cooks of considerable talent, and young women from San Francisco's
                Asian communities served the tables. The menu ran to beef, chicken, and ham — hearty American fare at
                eighty-five cents a course, with music and dancing from seven o'clock.
              </p>
              <p style={{ lineHeight: 1.85, fontSize: '1.05rem' }}>
                A fortune teller called Mme. Rabbas held court most afternoons. There were mah-jongg lessons,
                Charleston and St. Louis Hop dance classes, and a milliner named Georges whose hats were said to be
                the talk of the town.
              </p>
            </div>
            <div>
              <img
                src="/aladdin-stage.jpg"
                alt="The Aladdin Studio Tiffin Room stage"
                style={{ width: '100%', filter: 'sepia(15%) contrast(1.08)', border: `1px solid ${RULE}` }}
              />
              <p style={{ fontSize: '0.75rem', marginTop: 10, opacity: 0.55, letterSpacing: '0.05em', fontStyle: 'italic', textAlign: 'center' }}>
                The stage at the Aladdin Studio, 363 Sutter Street
              </p>
            </div>
          </div>
        </section>

        <Divider />

        {/* Section 3: Houdini */}
        <section style={{ marginBottom: 60 }}>
          <SectionHead>Houdini's Headquarters</SectionHead>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 48, alignItems: 'start' }}>
            <div>
              <p style={{ lineHeight: 1.85, fontSize: '1.05rem', marginBottom: 16 }}>
                Whenever Harry Houdini came to San Francisco, he came to the Aladdin. The sisters knew him well enough
                that Hattie occasionally substituted for Bess Houdini in his stage performances — a fact that suggests
                a closeness that went well beyond being regular customers.
              </p>
              <p style={{ lineHeight: 1.85, fontSize: '1.05rem', marginBottom: 16 }}>
                Houdini was so fond of the place that in 1924 he let Hattie lead him and a group of newspaper reporters
                through the Winchester Mystery House at midnight for his investigations into the paranormal. He trusted
                her completely.
              </p>
              <p style={{ lineHeight: 1.85, fontSize: '1.05rem', marginBottom: 16 }}>
                In 1915, at the Panama-Pacific World's Fair, Houdini produced glass jewels seemingly from thin air —
                claiming he'd retrieved them from the Tower of Jewels display. No one ever determined how he did it.
                Hattie was watching.
              </p>
              <p style={{ lineHeight: 1.85, fontSize: '1.05rem' }}>
                The advertisement was direct about the relationship. "<em>Houdini</em>," it read, "the world famous
                Handcuff King, may be able to escape from anything, but he admits that he cannot get away from the fact
                that the Aladdin Studio Tiffin Room WHERE HE DINES DAILY can't be beat for its wonderful welcome,
                charming atmosphere, excellent food."
              </p>
            </div>
            <div>
              <img
                src="/houdini-ad.jpg"
                alt="Houdini endorsement advertisement for the Aladdin Studio Tiffin Room"
                style={{ width: '100%', filter: 'contrast(1.15)', border: `1px solid ${RULE}` }}
              />
            </div>
          </div>
        </section>

        <Divider />

        {/* Section 4: The Famous & The End */}
        <section style={{ marginBottom: 64 }}>
          <SectionHead>The Famous Who Came</SectionHead>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
            <div>
              <p style={{ lineHeight: 1.85, fontSize: '1.05rem', marginBottom: 16 }}>
                The Mooser brothers' connections in New York and Shanghai meant that virtually every major touring
                act passed through the Aladdin's door. Douglas Fairbanks dined here. The Marx Brothers came.
                Vaudevillians, opera singers, prizefighters, governors, and silent film stars — they all signed
                the guestbook.
              </p>
              <p style={{ lineHeight: 1.85, fontSize: '1.05rem', marginBottom: 16 }}>
                The guestbook itself became one of the great artifacts of San Francisco's golden age of entertainment.
                Four hundred and eighteen pages, filled in neat copperplate and sprawling signatures. Some names are
                instantly recognizable; others belong to people who were famous in their time and forgotten in ours —
                the jugglers, the comedians, the character actors who made vaudeville the most democratic art form
                America ever produced.
              </p>
              <p style={{ lineHeight: 1.85, fontSize: '1.05rem' }}>
                The Aladdin closed in 1929, a casualty of Prohibition's underground competition. Hattie and Minnie
                went on to work at the Beach Chalet and Club Trouville, and later opened the Aladdin Tavern on
                Van Ness, but nothing matched what they'd built on Sutter Street. When Herb Caen wrote about it
                in 1941, a decade after it closed, people were still talking about it.
              </p>
            </div>
            <div>
              <img
                src="/aladdin-ad.jpg"
                alt="Aladdin Studio Tiffin Room advertisement"
                style={{ width: '100%', maxWidth: 320, filter: 'contrast(1.15)', border: `1px solid ${RULE}`, margin: '0 auto', display: 'block' }}
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <div style={{
          textAlign: 'center',
          borderTop: `3px double ${INK}`,
          borderBottom: `3px double ${INK}`,
          padding: '48px 24px',
          marginBottom: 0,
        }}>
          <p style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, marginBottom: 12, letterSpacing: '0.02em' }}>
            Their guestbook survives.
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 32px', opacity: 0.8 }}>
            All 418 pages, with the handwritten signatures of everyone who walked through those doors —
            famous and forgotten alike.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-playfair), serif',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: INK,
              border: `2px solid ${INK}`,
              padding: '14px 40px',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            Open the Guestbook
          </Link>
        </div>

      </article>

      <footer style={{
        borderTop: `1px solid ${RULE}`,
        padding: '24px 40px',
        textAlign: 'center',
        fontSize: '0.7rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        opacity: 0.45,
      }}>
        Aladdin Studio Tiffin Room · 363 Sutter Street · San Francisco · 1921–1929
      </footer>
    </main>
  )
}

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{
      fontFamily: 'var(--font-playfair), serif',
      fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
      fontWeight: 700,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      marginBottom: 20,
      marginTop: 0,
      borderBottom: `1px solid ${RULE}`,
      paddingBottom: 10,
    }}>
      {children}
    </h3>
  )
}

function Divider() {
  return (
    <div style={{ textAlign: 'center', margin: '52px 0', fontSize: '1rem', letterSpacing: '0.5em', opacity: 0.35 }}>
      ✦ ✦ ✦
    </div>
  )
}
