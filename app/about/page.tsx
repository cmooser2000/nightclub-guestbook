import Link from 'next/link'

export const dynamic = 'force-dynamic'

const PAPER = '#f5f0e6'
const INK = '#1a1209'
const RULE = '#c8b89a'
const ACCENT = '#8b6914'
const FUCHSIA = '#c0405a'

function Fig({ src, alt, caption, float }: { src: string; alt: string; caption?: string; float?: 'left' | 'right' }) {
  const floatStyle: React.CSSProperties = float === 'right'
    ? { float: 'right', marginLeft: 32, marginBottom: 20, marginTop: 4, width: 260, clear: 'right' }
    : float === 'left'
    ? { float: 'left', marginRight: 32, marginBottom: 20, marginTop: 4, width: 260, clear: 'left' }
    : { margin: '32px 0', width: '100%' }

  return (
    <figure style={{ ...floatStyle, margin: float ? floatStyle.margin : '32px auto', padding: 0 }}>
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          display: 'block',
          border: `1px solid ${RULE}`,
          filter: 'sepia(10%)',
        }}
      />
      {caption && (
        <figcaption style={{
          fontFamily: 'LinLibertine, serif',
          fontSize: '0.72rem',
          fontStyle: 'italic',
          color: INK,
          opacity: 0.55,
          marginTop: 7,
          lineHeight: 1.55,
          textAlign: 'center',
        }}>
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

export default function AboutPage() {
  return (
    <main style={{ background: PAPER, color: INK, minHeight: '100vh' }}>
      <style>{`
        @font-face { font-family: 'MarketDeco'; src: url('/fonts/market-deco.ttf') format('truetype'); font-display: block; }
        @font-face { font-family: 'LinLibertine'; src: url('/fonts/linlibertine.ttf') format('truetype'); font-display: block; }
        .about-body {
          overflow: hidden;
        }
        .about-body p {
          font-family: 'LinLibertine', serif;
          font-size: clamp(1.05rem, 2vw, 1.2rem);
          line-height: 1.85;
          margin: 0 0 1.4em;
          color: #1a1209;
        }
        .about-body p:last-child { margin-bottom: 0; }
        .section-rule {
          display: flex;
          align-items: center;
          gap: 20px;
          margin: 60px 0 36px;
          clear: both;
        }
        .section-rule h2 {
          font-family: 'LinLibertine', serif;
          font-size: 0.75rem;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          color: #8b6914;
          margin: 0;
          flex-shrink: 0;
        }
        .section-rule .rule-line {
          flex: 1;
          height: 1px;
          background: #c8b89a;
        }
        .fact-box {
          border: 1px solid #c8b89a;
          padding: 24px 28px;
          margin: 36px 0;
          background: rgba(200,184,154,0.08);
          clear: both;
        }
        .fact-box p {
          font-family: 'LinLibertine', serif;
          font-size: 1rem;
          line-height: 1.7;
          margin: 0 0 0.8em;
          color: #1a1209;
        }
        .fact-box p:last-child { margin-bottom: 0; }
        .pullquote {
          border-left: 3px solid #1a1209;
          padding-left: 24px;
          margin: 36px 0;
          font-family: 'LinLibertine', serif;
          font-size: clamp(1.15rem, 2.5vw, 1.4rem);
          font-style: italic;
          line-height: 1.7;
          color: #1a1209;
          clear: both;
        }
        .dates {
          font-family: 'LinLibertine', serif;
          font-size: 0.85rem;
          letter-spacing: 0.12em;
          color: #8b6914;
          opacity: 0.8;
        }
        .img-pair {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin: 32px 0;
          clear: both;
        }
        .img-pair figure { margin: 0; }
        .img-pair img {
          width: 100%;
          display: block;
          border: 1px solid #c8b89a;
          filter: sepia(10%);
        }
        .img-pair figcaption {
          font-family: 'LinLibertine', serif;
          font-size: 0.72rem;
          font-style: italic;
          color: #1a1209;
          opacity: 0.55;
          margin-top: 7px;
          line-height: 1.55;
          text-align: center;
        }
        @media (max-width: 600px) {
          figure[style*="float"] { float: none !important; width: 100% !important; margin-left: 0 !important; margin-right: 0 !important; }
          .img-pair { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Nav */}
      <div style={{ borderBottom: `1px solid ${RULE}`, padding: '14px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ color: ACCENT, fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'LinLibertine, serif' }}>
          ← The Aladdin
        </Link>
        <Link href="/all-guests" style={{ color: ACCENT, fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', opacity: 0.5, fontFamily: 'LinLibertine, serif' }}>
          All Names
        </Link>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 40px 100px' }}>

        {/* Page header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontFamily: 'LinLibertine, serif', fontSize: '0.72rem', letterSpacing: '0.38em', textTransform: 'uppercase', color: ACCENT, marginBottom: 20 }}>
            The Aladdin Studio Tiffin Room · San Francisco
          </p>
          <h1 style={{
            fontFamily: 'MarketDeco, serif',
            fontSize: 'clamp(2.8rem, 8vw, 5rem)',
            fontWeight: 400,
            lineHeight: 1.05,
            margin: '0 0 28px',
            color: INK,
          }}>
            Hattie &amp; Minnie Mooser
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: RULE }} />
            <span style={{ color: FUCHSIA, fontSize: '1rem' }}>✦</span>
            <div style={{ flex: 1, height: 1, background: RULE }} />
          </div>
          <p className="dates">Hattie Mooser 1878–1970 &nbsp;·&nbsp; Minnie Mooser 1881–1979</p>
        </div>

        {/* Opening image — tiffin room interior */}
        <Fig
          src="/about-tiffin-room.jpg"
          alt="The Aladdin Studio Tiffin Room"
          caption="The Aladdin Studio Tiffin Room, San Francisco"
        />

        {/* ── Part One: Oh, What a Time It Was ── */}
        <div className="section-rule">
          <h2>Oh, What a Time It Was</h2>
          <div className="rule-line" />
        </div>

        <div className="about-body">
          <p>
            In the early nineteen twenties an unlikely pair of sisters, Hattie and Minnie Mooser,
            launched the Aladdin Supper Club and Tiffin Room in San Francisco's Chinatown district.
            When it first opened it may not have seemed special. But within a year or two it just
            might have been the most famous restaurant in the world.
          </p>

          {/* Aladdin exterior — floated right */}
          <Fig
            src="/about-aladdin-home.jpg"
            alt="The Aladdin Studio exterior"
            caption="The Aladdin Studio, Chinatown, San Francisco"
            float="right"
          />

          <p>
            Stepping aside for a moment, we can trace the Mooser family history as far back as the
            1850s, when Rose and Samuel Mooser immigrated to America from Bavaria. For some strange
            reason, once in America, the couple chose to travel across the continent to Elko, Nevada,
            where their four children — Hattie, Minnie, and brothers George and Leon — were born.
            In time the family relocated to Sacramento before moving to San Francisco in 1900.
            Historically, considering where the children were headed, they could not have arrived
            at a better time. Vaudeville was at its height and the film industry, new upon the
            scene, was booming.
          </p>

          <p>
            George and Leon moved to New York and in short order became influential talent agents.
            George recruited some of the top actors and actresses in vaudeville and film. Leon
            sailed to the Orient, where he signed a number of the nation's vaudeville giants —
            most notably the Chinese Houdini, Ching Ling Foo (Zhu Liankui), who went on to become
            a star on the American stage. Tragically, while in China, Leon suffered sunstroke and
            died. He was only 40.
          </p>

          {/* Ching Ling Foo */}
          <Fig
            src="/about-ching.jpg"
            alt="Ching Ling Foo (Zhu Liankui)"
            caption="Ching Ling Foo (Zhu Liankui), the &ldquo;Chinese Houdini,&rdquo; signed by Leon Mooser for the American stage"
          />

          <p>
            Back in San Francisco, Hattie found work with the San Francisco Juvenile Court. Sensing
            that the court was badly underfunded, she volunteered to raise money by recruiting guest
            stars from local theaters to appear at local benefits. After that she founded the city's
            first children's theater, which later expanded into a children's art center and a tea
            room. Perhaps encouraged by the success of the tea room, the sisters in 1921 launched
            their Aladdin Tiffin Supper Club in the city's Chinatown. It may have gotten off to a
            slow start, but once their brothers George and Leon got involved its popularity exploded.
          </p>

          <p>
            Much of that early success was attributed to George. Whenever one of his top movie or
            vaudeville stars was heading west, he made sure they swung by the Aladdin. As more and
            more idols of the silver screen made appearances, newspapers took notice and suddenly
            it was the hottest spot in town. The brothers, of course, were more than happy to keep
            the stars coming. And once those entertainers came, they most always came back — if
            only to hang out with their movieland friends.
          </p>

          <div className="pullquote">
            In its heyday, if you dropped into the Aladdin on any given night you might have
            encountered the dashing movie idol Rudolph Valentino — Hattie referred to him as
            "my Rudi" — the celebrated silent film director D.W. Griffith, Sophie Tucker the
            famed Last of the Red Hot Mamas, cowboy movie star Roy Rogers, Lefty O'Doul the
            Yankee slugger, and even Warren G. Harding, President of the United States.
          </div>

          {/* Houdini — floated left */}
          <Fig
            src="/about-houdini.jpg"
            alt="Harry Houdini"
            caption="Harry Houdini — honorary member of the Mooser family"
            float="left"
          />

          <p>
            And if really fortunate, you might just have been there on a night when none other
            than the world-famous magician Harry Houdini — a close friend of the Mooser sisters —
            would have taken the Aladdin's little stage and demonstrated a few of his astounding
            illusions. If his wife Bess was there, she'd join him on stage. And if she was
            unavailable, Hattie was happy to serve as his assistant.
          </p>

          <p>
            It was Harry Houdini, the master of magic, illusion, and escape, who through the
            years was a steadfast friend to the Moosers. His tragic death in 1926 at the age
            of 52 was a tremendous blow to Hattie and Minnie. To them he would always be
            remembered as an honorary member of the family.
          </p>

          <p>
            In fact, the Moosers' relationship with the great Houdini went back to the earliest
            days in New York. Hattie often told the story of how Houdini was so nervous before
            his New York debut that George had to push him out onto the stage. Not everybody
            agrees that the story is true, but it's worth keeping alive no matter.
          </p>

          <p>
            The Aladdin Studio Tiffin Room thrived until 1925, when they opened a new
            restaurant: the Aladdin Nite Club. It did well for a while, but the sisters refused
            to sell liquor, putting them at a disadvantage against establishments that did. So
            in 1929, they closed up shop. It had been a spectacular ride — worldwide fame and
            fond memories. All in all quite an achievement for a couple of girls from Elko, Nevada.
          </p>

          {/* Beach Chalet */}
          <Fig
            src="/about-beach-chalet.jpg"
            alt="The Beach Chalet, Golden Gate Park"
            caption="The Beach Chalet restaurant in Golden Gate Park, which Hattie and Minnie managed after the Aladdin closed"
          />

          <p>
            After the Aladdin closed, Hattie and Minnie kept busy managing the Beach Chalet
            restaurant in Golden Gate Park. And during World War Two they volunteered as cooks
            and hostesses at the Stage Door Canteen, serving members of the military.
          </p>

          <p>
            In their later years, I can picture the sisters thumbing through their book, reliving
            those magical nights at the club — hobnobbing with the people they had met and the
            fabulous friends they had made.
          </p>

          <p>
            And keep in mind they achieved all of this in an era when women were expected to
            either stay at home or toil in low-paying dead-end jobs. Certainly not the fate of
            the Mooser sisters. They were, quite simply, undaunted and unstoppable.
          </p>

          <div className="pullquote">
            Neither Hattie nor Minnie ever married, but the lives they lived were as memorable
            as those they hosted, if not more so.
          </div>

          {/* Hattie and Minnie — closing portrait */}
          <Fig
            src="/about-hattie-minnie-end.jpg"
            alt="Hattie and Minnie Mooser"
            caption="Hattie and Minnie Mooser"
          />
        </div>

        {/* ── Part Two: The Family ── */}
        <div className="section-rule">
          <h2>The Mooser Family</h2>
          <div className="rule-line" />
        </div>

        <div className="about-body">
          <p>
            Hattie and Minnie were born in Elko, Nevada, to German Jewish immigrant parents,
            Samuel and Rose Mooser. They grew up in Sacramento before the family moved to San
            Francisco in 1900. Samuel and Rose came as part of a large wave of German immigrants
            who arrived in America between the 1840s and 1860s. George and Leon were older
            brothers, also born in Nevada, who became highly influential entertainment producers —
            their success paved the way to the Aladdin.
          </p>

          <div className="fact-box">
            <p style={{ fontFamily: 'LinLibertine, serif', fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: ACCENT, marginBottom: 12 }}>
              A Family Connection — The Civil War Branch
            </p>
            <p>
              Samuel Mooser's brother was Abraham Flavian Mooser (1842–1931), who fought in the
              U.S. Civil War as a private in Company C of the 15th Mississippi Infantry. Born in
              Bavaria, Abraham had most likely arrived as a teenager — learning the language,
              perhaps working as a traveling salesman — and found himself in the South as the
              war approached. He fought at the Battle of Mill Springs and the Battle of Franklin,
              where he was wounded.
            </p>
            <p>
              After the war, Abraham settled initially in Mississippi before making his way to
              California. There he put his early experience as a Southern merchant to use,
              opening Santa Monica's first dry-goods store and becoming a central figure in
              the local community. He served as the last official Postmaster of Ocean Park
              from 1913 to 1914.
            </p>
            <p>
              Because Abraham was Samuel's brother, his son Joseph Nathan Mooser was a first
              cousin to Hattie and Minnie — making Abraham their uncle. Joseph Nathan Mooser
              was the grandfather of the person who now holds this guestbook. Leon Newton Mooser,
              another cousin who grew up in Santa Monica, died at 96 in 1978.
            </p>
          </div>
        </div>

        {/* ── The Guestbook ── */}
        <div className="section-rule">
          <h2>The Guestbook</h2>
          <div className="rule-line" />
        </div>

        <div className="about-body">
          <p>
            The Aladdin Guestbook has now survived for more than a hundred years, and we can
            only hope this priceless snapshot of a unique era in the nation's history survives
            for hundreds of years more.
          </p>

          <p>
            The book itself has nearly 1,500 signatures. Obviously, not everyone who signed in
            at the door can be included here. Instead, what you will find is a gallery of the
            famous, the notable, and the notorious who, at one time or another, visited the Aladdin.
            Almost all entries feature the subject's photo, a signature, and a capsule biography.
          </p>

          <p>
            Please note there were some people — including such luminaries as Douglas Fairbanks,
            Mary Pickford, and the Marx Brothers — who were said to have visited the Aladdin,
            but because we could not find them in the book, they are not profiled here.
          </p>

          <div className="pullquote">
            The Aladdin Tiffin Room is gone but the legacy endures, and is still celebrated
            a hundred years later.
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 64, paddingTop: 40, borderTop: `1px solid ${RULE}`, clear: 'both' }}>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              fontFamily: 'LinLibertine, serif',
              fontSize: '1rem',
              letterSpacing: '0.08em',
              color: '#f5f0e6',
              textDecoration: 'none',
              background: ACCENT,
              borderRadius: 3,
              padding: '14px 32px',
            }}
          >
            Step inside the Aladdin →
          </Link>
        </div>

      </div>

      <footer style={{ borderTop: `1px solid ${RULE}`, padding: '20px 40px', textAlign: 'center', fontFamily: 'LinLibertine, serif', fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.4 }}>
        Aladdin Studio Tiffin Room · San Francisco · 1921–1929
      </footer>
    </main>
  )
}
