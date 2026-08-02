import Link from 'next/link'

export const dynamic = 'force-dynamic'

const PAPER = '#f5f0e6'
const INK = '#1a1209'
const RULE = '#c8b89a'
const ACCENT = '#8b6914'
const FUCHSIA = '#c0405a'
const GREEN = '#2a6e3a'

interface Entry {
  name: string
  guestId: string
  page?: string
  blurb: string
  links?: { label: string; href: string }[]
}

interface Section {
  title: string
  entries: Entry[]
}

const sections: Section[] = [
  {
    title: 'Deaths that are stories in themselves',
    entries: [
      {
        name: 'Truly Shattuck',
        guestId: 'truly-shattuck',
        page: 'p. 150',
        blurb: 'The single best one on the list, and it\'s a hometown story. In 1893 her mother, Jane Shattuck, shot and killed Harry Poole, Truly\'s boyfriend, after he refused to commit to marriage; she was convicted of first-degree murder but released on a temporary-insanity appeal. Truly was a chorus girl at the Tivoli Opera House at the time, and the national publicity from the murder is what launched her career.',
      },
      {
        name: 'Bessie Eyton',
        guestId: 'bessie-eyton',
        page: 'p. 386',
        blurb: 'A 200-film Selig star who simply walked away from her family in 1935 and was not located until her death thirty years later. The disappearance of a famous face is a rare thing.',
      },
      {
        name: 'Adele Blood',
        guestId: 'adele-blood',
        blurb: 'In 1936 she organized, directed, and financed a stock production starring herself and her teenage daughter Dawn; it collapsed halfway through its run and consumed $40,000 of her fortune. On September 13, 1936, she shot herself in the head at her home on the grounds of the Westchester Country Club. Dawn killed herself three years later, in 1939. She was born in Alameda and had briefly worked at the Examiner — a real Bay Area thread.',
      },
      {
        name: 'Calvin Coolidge Jr.',
        guestId: 'calvin-coolidge-jr',
        page: 'Oct. 1922',
        blurb: 'Played tennis on the White House courts without socks, developed a blister, and died of sepsis at 16. The most consequential blister in American political history; his father said the power and glory of the presidency went with him.',
      },
      {
        name: 'William Erwin',
        guestId: 'william-erwin',
        page: 'p. 166',
        blurb: 'The Dole Derby detail worth getting right: Erwin didn\'t vanish in the race. He finished, then flew back out over the Pacific to search for the other missing aviators and disappeared himself, mid-radio-transmission.',
      },
      {
        name: 'Ted Healy',
        guestId: 'ted-healy',
        page: 'p. 228',
        blurb: 'Died December 21, 1937, days after a brawl at the Café Trocadero. The famous version blames Wallace Beery, mobster Pat DiCicco, and future James Bond producer Cubby Broccoli. But the coroner, autopsy surgeon, police, his widow, his sister, and the district attorney all concluded natural causes — nephritis from chronic alcoholism — and even his ex-wife, the sole dissenter, eventually withdrew her allegations. A good candidate for a piece about how a Hollywood legend hardens into "fact."',
      },
      {
        name: 'Kamuela Searle',
        guestId: 'kamuela-searle',
        page: 'p. 94',
        blurb: 'The persistent story is that an elephant crushed him to death during The Son of Tarzan. This originated in a 1968 book; in truth he was seriously but not fatally injured, recovered enough to appear in DeMille\'s Fool\'s Paradise in 1921, and died of cancer in 1924 — a disease he\'d been diagnosed with in 1919. Another myth-correction opportunity.',
      },
      {
        name: 'Herb Rawlinson',
        guestId: 'herb-rawlinson',
        page: 'p. 150',
        blurb: 'Died the day after completing his final film: Ed Wood\'s Jail Bait. A 42-year career that started on the boat over with Charlie Chaplin and ended in the filmography of the worst director in America.',
      },
      {
        name: 'Floyd Bennett',
        guestId: 'floyd-bennett',
        blurb: 'Flew Byrd over the North Pole, then died of pneumonia contracted while flying a rescue mission for the stranded crew of the Bremen. Killed by an act of rescue rather than exploration.',
      },
      {
        name: 'Marjorie White',
        guestId: 'marjorie-white',
        page: 'p. 309',
        blurb: 'Car crash at 31 in 1935, just as her film career was starting. She and Thelma formed their act in San Francisco in December 1921, which makes her an Aladdin-adjacent local origin story.',
      },
    ],
  },
  {
    title: 'Scandal and criminal proximity',
    entries: [
      {
        name: 'Dale Winter',
        guestId: 'dale-winter',
        page: 'p. 401',
        blurb: 'Married "Big Jim" Colosimo, Chicago\'s crime boss, in spring 1920. He was shot dead in his own café within weeks — the murder that opened the door for Torrio and Capone. She then married Henry Duffy and became a West Coast stage star. From gangland widow to Alcazar leading lady.',
      },
      {
        name: 'Judge Sylvain Lazarus',
        guestId: 'sylvain-lazarus',
        blurb: 'Presided over the Arbuckle preliminary hearing and, fourteen years later, the Ann Cooper Hewitt forced-sterilization case. One judge, two of the strangest legal spectacles of the era.',
      },
      {
        name: 'Nazimova',
        guestId: 'nazimova',
        page: 'p. 246',
        blurb: 'Ran the Garden of Allah as a salon, lived openly in Hollywood\'s lesbian circles behind a marriage of convenience, and — the connection nobody expects — was Nancy Reagan\'s godmother.',
      },
      {
        name: 'Julian Eltinge',
        guestId: 'julian-eltinge',
        page: 'p. 253',
        blurb: 'The arc is genuinely bleak. Municipal ordinances against cross-dressing performance destroyed his act; in his last years he performed in a business suit, gesturing at his gowns hung on a rack beside him while he sang.',
      },
      {
        name: 'Bela Lugosi',
        guestId: 'bela-lugosi',
        blurb: 'Helped organize an actors\' union during the 1919 Hungarian Soviet Republic and had to flee the country when it collapsed. Later, morphine addiction; buried in the Dracula cape.',
      },
      {
        name: 'Erich von Stroheim',
        guestId: 'erich-von-stroheim',
        page: 'p. 376',
        blurb: 'The whole aristocratic Austrian officer identity was invented. He was the son of a Jewish hat maker from Vienna, and he sustained the fiction for the rest of his life.',
      },
      {
        name: 'Bert Wheeler',
        guestId: 'bert-wheeler',
        page: 'p. 342',
        blurb: 'His wife left him for Clarence Stroud, who had signed the same guestbook fifteen pages earlier.',
      },
    ],
  },
  {
    title: 'Improbable arcs',
    entries: [
      {
        name: 'Vicki Baum',
        guestId: 'vicki-baum',
        blurb: 'She took up boxing in the late 1920s, training with Turkish prizefighter Sabri Mahir at his Berlin studio, where only three or four women were tough enough to stick with it — among them Marlene Dietrich. The author of Grand Hotel was a boxer.',
      },
      {
        name: 'El Brendel',
        guestId: 'el-brendel',
        blurb: 'Born in Philadelphia to a German immigrant father and an Irish mother, he spoke standard American English with no accent and entered vaudeville in 1913 as a German dialect comedian. Anti-German sentiment after the Lusitania forced him to invent the Swede — a forty-year career built on a wartime pivot.',
      },
      {
        name: 'Harry B. Liversedge',
        guestId: 'harry-b-liversedge',
        blurb: 'Olympic shot-put bronze in 1920, then commanded the regiment that raised the flag on Suribachi. He was stationed at Mare Island when he signed. Athletic footnote to the most reproduced photograph of the century.',
      },
      {
        name: 'Guy B. Park',
        guestId: 'guy-b-park',
        blurb: 'He became Governor of Missouri essentially by vacancy. Francis Wilson, the Democratic nominee, died three weeks before Election Day; with the backing of Wilson\'s family and the Pendergast machine, the party committee put Park on the ballot, and he won by the largest plurality in state history to that point. He is remembered as a fairly ineffectual governor bound to Tom Pendergast by gratitude.',
      },
      {
        name: 'Mike Donlin',
        guestId: 'mike-donlin',
        blurb: 'Batted .333 lifetime and then quit baseball at his peak to do vaudeville with his wife Mabel Hite. He kept coming back and leaving. One of the first athletes to decide entertainment paid better.',
      },
      {
        name: 'Willie Ritchie',
        guestId: 'willie-ritchie',
        page: 'p. 342',
        blurb: 'Born Gerhardt Steffen; took a ring name specifically so his mother wouldn\'t find out he was fighting. Then became world lightweight champion, which presumably made the deception difficult to maintain.',
      },
      {
        name: 'Franklyn Farnum',
        guestId: 'franklyn-farnum',
        blurb: 'Roughly 1,100 films, and he appeared in eight Best Picture winners — almost all uncredited, as an extra, after his starring career was over. A man who was physically present at the center of Hollywood for fifty years and visible in none of it.',
      },
      {
        name: 'Chaz Chase',
        guestId: 'chaz-chase',
        blurb: 'Six decades of a career built entirely on eating things that were not food: lit cigarettes, paper flowers, his own boutonnière. Consistency of vision.',
      },
      {
        name: 'Bertha Kalich',
        guestId: 'bertha-kalich',
        page: 'p. 190',
        blurb: 'Fled Romania after rival performers reportedly threatened her life, became the "Yiddish Duse" on Second Avenue and then Broadway, and went nearly blind in her final years while still performing.',
      },
      {
        name: 'Mischa Auer',
        guestId: 'mischa-auer',
        blurb: 'Grandson of the great violin pedagogue Leopold Auer; orphaned and stranded in the chaos of the Russian Revolution, eventually retrieved and brought to America, where he took his grandfather\'s surname. Ended up as Hollywood\'s most reliable wild-eyed lunatic.',
      },
      {
        name: 'Jimmy Savo',
        guestId: 'jimmy-savo',
        blurb: 'Lost a leg and went back on stage. Enough said.',
      },
      {
        name: 'Garland Anderson',
        guestId: 'garland-anderson',
        page: 'p. 145',
        blurb: 'A San Francisco bellhop with limited formal schooling who wrote a play, talked his way into a reading, got Al Jolson to fund his trip east, and became the first Black playwright with a full-length drama on Broadway. He later became a New Thought minister in England.',
      },
      {
        name: 'Jim Tully',
        guestId: 'jim-tully',
        blurb: 'Orphanage, hobo, chainmaker, prizefighter, then the most feared celebrity profile writer in Hollywood — studios genuinely dreaded him. John Gilbert reportedly punched him over a piece. And he signed your guestbook as a comic-strip character.',
      },
    ],
  },
  {
    title: 'Unexpected connections',
    entries: [
      {
        name: 'Jean Acker',
        guestId: 'jean-acker',
        page: 'p. 246',
        blurb: 'Valentino\'s first wife, who famously locked him out of the hotel room on their wedding night; the marriage was never consummated. She signed the same page as Valentino with "To thine own self be true," which is either oblivious or extremely pointed.',
      },
      {
        name: 'Louis Persinger',
        guestId: 'louis-persinger',
        blurb: 'Taught both Yehudi Menuhin and Isaac Stern. The margin note in your book identifying him as Menuhin\'s teacher is doing a lot of quiet work — this is the man who trained two of the century\'s greatest violinists, and the Menuhin family signs elsewhere in the same volume.',
      },
      {
        name: 'Gus Edwards',
        guestId: 'gus-edwards',
        blurb: 'Discovered Eddie Cantor, Groucho Marx, Walter Winchell, Ray Bolger, and Eleanor Powell. The Aladdin threw him a party in 1924. A single signature that fans out into half of twentieth-century American entertainment.',
      },
      {
        name: 'Frank Silver',
        guestId: 'frank-silver',
        blurb: '"Yes! We Have No Bananas" was widely accused of stitching together Handel\'s "Hallelujah Chorus," "My Bonnie," and a half-dozen other tunes. A novelty hit that doubles as a copyright case study.',
      },
      {
        name: 'Lon Chaney',
        guestId: 'lon-chaney',
        blurb: 'Both parents were deaf; pantomime was effectively his first language. The most expressive face in silent film came from a childhood of communicating without sound.',
      },
      {
        name: 'Howard Putzel',
        guestId: 'howard-putzel',
        page: 'p. 373',
        blurb: 'If it\'s him, and the 1925 San Francisco location fits, this is the guestbook catching the man who would introduce Peggy Guggenheim to Jackson Pollock — before he\'d done anything. He died at 47, just as Abstract Expressionism took off.',
      },
    ],
  },
]

export default function MostInterestingPage() {
  return (
    <main style={{ background: PAPER, color: INK, minHeight: '100vh' }}>
      <style>{`
        @font-face { font-family: 'MarketDeco'; src: url('/fonts/market-deco.ttf') format('truetype'); font-display: block; }
        @font-face { font-family: 'LinLibertine'; src: url('/fonts/linlibertine.ttf') format('truetype'); font-display: block; }
        .entry-link {
          display: block;
          text-decoration: none;
          color: ${INK};
          border-bottom: 1px solid ${RULE};
          padding: 24px 0 22px;
          transition: background 0.12s, padding-left 0.12s;
          border-radius: 2px;
        }
        .entry-link:hover { background: rgba(139,105,20,0.06); padding-left: 12px; }
        .entry-link:hover .entry-name { color: ${ACCENT}; }
        .entry-name {
          font-family: 'MarketDeco', serif;
          font-size: clamp(1.3rem, 3vw, 1.75rem);
          font-weight: 400;
          color: ${INK};
          display: block;
          margin-bottom: 6px;
          transition: color 0.12s;
        }
        .entry-meta {
          font-family: 'LinLibertine', serif;
          font-size: 0.75rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: ${ACCENT};
          opacity: 0.6;
          display: block;
          margin-bottom: 10px;
        }
        .entry-blurb {
          font-family: 'LinLibertine', serif;
          font-size: 1.05rem;
          line-height: 1.75;
          color: ${INK};
          opacity: 0.85;
        }
      `}</style>

      {/* Nav */}
      <div style={{ borderBottom: `1px solid ${RULE}`, padding: '14px 40px', display: 'flex', alignItems: 'center', gap: 24 }}>
        <Link href="/all-guests" style={{ color: ACCENT, fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'LinLibertine, serif' }}>
          ← All Names
        </Link>
        <Link href="/" style={{ color: ACCENT, fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', opacity: 0.5, fontFamily: 'LinLibertine, serif' }}>
          The Aladdin
        </Link>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '56px 40px 100px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontFamily: 'LinLibertine, serif', fontSize: '0.72rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: ACCENT, marginBottom: 16 }}>
            The Aladdin Studio Tiffin Room
          </p>
          <h1 style={{ fontFamily: 'MarketDeco, serif', fontSize: 'clamp(2.4rem, 7vw, 4rem)', fontWeight: 400, lineHeight: 1.08, margin: '0 0 24px', color: INK }}>
            Most Interesting Guests
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: RULE }} />
            <span style={{ color: FUCHSIA, fontSize: '1rem' }}>✦</span>
            <div style={{ flex: 1, height: 1, background: RULE }} />
          </div>
          <p style={{ fontFamily: 'LinLibertine, serif', fontSize: '1.05rem', fontStyle: 'italic', color: INK, opacity: 0.65, maxWidth: 540, margin: '0 auto' }}>
            A curated guide to the guestbook's most remarkable stories. Click any name to open the full profile.
          </p>
        </div>

        {/* Sections */}
        {sections.map((section, si) => (
          <div key={si} style={{ marginBottom: 72 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
              <h2 style={{
                fontFamily: 'LinLibertine, serif',
                fontSize: '0.78rem',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: ACCENT,
                margin: 0,
                flexShrink: 0,
              }}>
                {section.title}
              </h2>
              <div style={{ flex: 1, height: 2, background: `linear-gradient(to right, ${RULE}, transparent)` }} />
            </div>

            {section.entries.map((entry, ei) => (
              <Link key={ei} href={`/guest/${entry.guestId}`} className="entry-link">
                <span className="entry-name">{entry.name}</span>
                {entry.page && (
                  <span className="entry-meta">{entry.page}</span>
                )}
                <span className="entry-blurb">{entry.blurb}</span>
              </Link>
            ))}
          </div>
        ))}
      </div>

      <footer style={{ borderTop: `1px solid ${RULE}`, padding: '20px 40px', textAlign: 'center', fontFamily: 'LinLibertine, serif', fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.4 }}>
        Aladdin Studio Tiffin Room · San Francisco · 1921–1929
      </footer>
    </main>
  )
}
