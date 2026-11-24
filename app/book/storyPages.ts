// Text for the book's opening chapters. Copied from the About (Hattie & Minnie)
// page — if that page's wording changes, update it here too.

export type Block =
  | { kind: 'heading'; text: string }
  | { kind: 'p'; text: string }
  | { kind: 'quote'; text: string }
  | { kind: 'boxTitle'; text: string }
  | { kind: 'img'; src: string; caption: string; collection?: boolean; size?: 'full' | 'half' }

export type StoryPage = { blocks: Block[]; fullImage?: boolean }

export const INTRO: StoryPage = {
  blocks: [
    { kind: 'heading', text: 'Introduction' },
    {
      kind: 'p',
      text: 'The Aladdin Guestbook has now survived for more than a hundred years, and we can only hope this priceless snapshot of a unique era in the nation’s history survives for hundreds of years more.',
    },
    {
      kind: 'p',
      text: 'The book itself has nearly 1,500 signatures. Obviously, not everyone who signed in at the door can be included here. Instead, what you will find is a gallery of the famous, the notable, and the notorious who, at one time or another, visited the Aladdin. Almost all entries feature the subject’s photo, a signature, and a capsule biography.',
    },
    {
      kind: 'p',
      text: 'Please note there were some people — including such luminaries as Douglas Fairbanks, Mary Pickford, and the Marx Brothers — who were said to have visited the Aladdin, but because we could not find them in the book, they are not profiled here.',
    },
    {
      kind: 'quote',
      text: 'The Aladdin Tiffin Room is gone but the legacy endures, and is still celebrated a hundred years later.',
    },
  ],
}

export const STORY: StoryPage[] = [
  {
    blocks: [
      { kind: 'heading', text: 'Oh, What a Time It Was' },
      {
        kind: 'p',
        text: 'In the early nineteen twenties an unlikely pair of sisters, Hattie and Minnie Mooser, launched the Aladdin Supper Club and Tiffin Room in San Francisco’s Chinatown district. When it first opened it may not have seemed special. But within a year or two it just might have been the most famous restaurant in the world.',
      },
      { kind: 'img', src: '/about-tiffin-room.jpg', caption: 'The Aladdin Studio Tiffin Room, San Francisco' },
    ],
  },
  {
    blocks: [
      {
        kind: 'p',
        text: 'Stepping aside for a moment, we can trace the Mooser family history as far back as the 1850s, when Rose and Samuel Mooser immigrated to America from Bavaria. For some strange reason, once in America, the couple chose to travel across the continent to Elko, Nevada, where their four children — Hattie, Minnie, and brothers George and Leon — were born. In time the family relocated to Sacramento before moving to San Francisco in 1900. Historically, considering where the children were headed, they could not have arrived at a better time. Vaudeville was at its height and the film industry, new upon the scene, was booming.',
      },
      { kind: 'img', src: '/about-aladdin-home.jpg', caption: 'The Aladdin Studio, Chinatown, San Francisco', size: 'half' },
    ],
  },
  {
    blocks: [
      {
        kind: 'p',
        text: 'George and Leon moved to New York and in short order became influential talent agents. George recruited some of the top actors and actresses in vaudeville and film. Leon sailed to the Orient, where he signed a number of the nation’s vaudeville giants — most notably the Chinese Houdini, Ching Ling Foo (Zhu Liankui), who went on to become a star on the American stage. Tragically, while in China, Leon suffered sunstroke and died. He was only 40.',
      },
      { kind: 'img', src: '/memorabilia/leon-mooser-portraits.jpg', caption: 'Leon Mooser', collection: true },
    ],
  },
  {
    blocks: [
      {
        kind: 'img',
        src: '/about-ching.jpg',
        caption: 'Ching Ling Foo (Zhu Liankui), the “Chinese Houdini,” signed by Leon Mooser for the American stage',
        size: 'half',
      },
      {
        kind: 'p',
        text: 'Back in San Francisco, Hattie found work with the San Francisco Juvenile Court. Sensing that the court was badly underfunded, she volunteered to raise money by recruiting guest stars from local theaters to appear at local benefits. After that she founded the city’s first children’s theater, which later expanded into a children’s art center and a tea room. Perhaps encouraged by the success of the tea room, the sisters in 1921 launched their Aladdin Tiffin Supper Club in the city’s Chinatown. It may have gotten off to a slow start, but once their brothers George and Leon got involved its popularity exploded.',
      },
    ],
  },
  {
    blocks: [
      {
        kind: 'p',
        text: 'Much of that early success was attributed to George. Whenever one of his top movie or vaudeville stars was heading west, he made sure they swung by the Aladdin. As more and more idols of the silver screen made appearances, newspapers took notice and suddenly it was the hottest spot in town. The brothers, of course, were more than happy to keep the stars coming. And once those entertainers came, they most always came back — if only to hang out with their movieland friends.',
      },
      {
        kind: 'quote',
        text: 'In its heyday, if you dropped into the Aladdin on any given night you might have encountered the dashing movie idol Rudolph Valentino — Hattie referred to him as “my Rudi” — the celebrated silent film director D.W. Griffith, Sophie Tucker the famed Last of the Red Hot Mamas, cowboy movie star Roy Rogers, Lefty O’Doul the Yankee slugger, and even Warren G. Harding, President of the United States.',
      },
    ],
  },
  {
    blocks: [
      { kind: 'img', src: '/about-houdini.jpg', caption: 'Harry Houdini — honorary member of the Mooser family', size: 'half' },
      {
        kind: 'p',
        text: 'And if really fortunate, you might just have been there on a night when none other than the world-famous magician Harry Houdini — a close friend of the Mooser sisters — would have taken the Aladdin’s little stage and demonstrated a few of his astounding illusions. If his wife Bess was there, she’d join him on stage. And if she was unavailable, Hattie was happy to serve as his assistant.',
      },
    ],
  },
  {
    blocks: [
      {
        kind: 'p',
        text: 'It was Harry Houdini, the master of magic, illusion, and escape, who through the years was a steadfast friend to the Moosers. His tragic death in 1926 at the age of 52 was a tremendous blow to Hattie and Minnie. To them he would always be remembered as an honorary member of the family.',
      },
      {
        kind: 'p',
        text: 'In fact, the Moosers’ relationship with the great Houdini went back to the earliest days in New York. Hattie often told the story of how Houdini was so nervous before his New York debut that George had to push him out onto the stage. Not everybody agrees that the story is true, but it’s worth keeping alive no matter.',
      },
      {
        kind: 'img',
        src: '/memorabilia/hattie-minnie-houdini-portrait.jpg',
        caption: 'Hattie and Minnie with their portrait of Harry Houdini',
        collection: true,
        size: 'half',
      },
    ],
  },
  {
    blocks: [
      {
        kind: 'p',
        text: 'The Aladdin Studio Tiffin Room thrived until 1925, when they opened a new restaurant: the Aladdin Nite Club. It did well for a while, but the sisters refused to sell liquor, putting them at a disadvantage against establishments that did. So in 1929, they closed up shop. It had been a spectacular ride — worldwide fame and fond memories. All in all quite an achievement for a couple of girls from Elko, Nevada.',
      },
      {
        kind: 'img',
        src: '/about-beach-chalet.jpg',
        caption: 'The Beach Chalet restaurant in Golden Gate Park, which Hattie and Minnie managed after the Aladdin closed',
      },
    ],
  },
  {
    blocks: [
      {
        kind: 'p',
        text: 'After the Aladdin closed, Hattie and Minnie kept busy managing the Beach Chalet restaurant in Golden Gate Park. And during World War Two they volunteered as cooks and hostesses at the Stage Door Canteen, serving members of the military.',
      },
      {
        kind: 'p',
        text: 'In their later years, I can picture the sisters thumbing through their book, reliving those magical nights at the club — hobnobbing with the people they had met and the fabulous friends they had made.',
      },
      {
        kind: 'p',
        text: 'And keep in mind they achieved all of this in an era when women were expected to either stay at home or toil in low-paying dead-end jobs. Certainly not the fate of the Mooser sisters. They were, quite simply, undaunted and unstoppable.',
      },
      {
        kind: 'quote',
        text: 'Neither Hattie nor Minnie ever married, but the lives they lived were as memorable as those they hosted, if not more so.',
      },
    ],
  },
  {
    fullImage: true,
    blocks: [{ kind: 'img', src: '/about-hattie-minnie-end.jpg', caption: 'Hattie and Minnie Mooser' }],
  },
  {
    blocks: [
      { kind: 'heading', text: 'The Mooser Family' },
      {
        kind: 'p',
        text: 'Hattie and Minnie were born in Elko, Nevada, to German Jewish immigrant parents, Samuel and Rose Mooser. They grew up in Sacramento before the family moved to San Francisco in 1900. Samuel and Rose came as part of a large wave of German immigrants who arrived in America between the 1840s and 1860s. George and Leon were older brothers, also born in Nevada, who became highly influential entertainment producers — their success paved the way to the Aladdin.',
      },
      { kind: 'boxTitle', text: 'A Family Connection — The Civil War Branch' },
      {
        kind: 'p',
        text: 'Samuel Mooser’s brother was Abraham Flavian Mooser (1842–1931), who fought in the U.S. Civil War as a private in Company C of the 15th Mississippi Infantry. Born in Bavaria, Abraham had most likely arrived as a teenager — learning the language, perhaps working as a traveling salesman — and found himself in the South as the war approached. He fought at the Battle of Mill Springs and the Battle of Franklin, where he was wounded.',
      },
    ],
  },
  {
    blocks: [
      {
        kind: 'p',
        text: 'After the war, Abraham settled initially in Mississippi before making his way to California. There he put his early experience as a Southern merchant to use, opening Santa Monica’s first dry-goods store and becoming a central figure in the local community. He served as the last official Postmaster of Ocean Park from 1913 to 1914.',
      },
      {
        kind: 'p',
        text: 'Because Abraham was Samuel’s brother, his son Joseph Nathan Mooser was a first cousin to Hattie and Minnie — making Abraham their uncle. Joseph Nathan Mooser was the grandfather of the person who now holds this guestbook. Leon Newton Mooser, another cousin who grew up in Santa Monica, died at 96 in 1978.',
      },
    ],
  },
  { fullImage: true, blocks: [{ kind: 'img', src: '/memorabilia/aladdin-tiffin-room-postcards.jpg', caption: 'Postcards of the Aladdin Studio Tiffin Room, 363 Sutter Street', collection: true }] },
  { fullImage: true, blocks: [{ kind: 'img', src: '/memorabilia/aladdin-red-card.jpg', caption: 'The Aladdin’s card: Oriental Show Place. Luncheon, tea, dinner, supper. Dancing nightly 7 to 1', collection: true }] },
  { fullImage: true, blocks: [{ kind: 'img', src: '/memorabilia/hattie-poem-1.jpg', caption: '“Once again, we’ll rub the Lamp”: Hattie’s poem remembering the Aladdin’s guests', collection: true }] },
  { fullImage: true, blocks: [{ kind: 'img', src: '/memorabilia/hattie-poem-2.jpg', caption: 'Hattie’s poem, page 2, signed by Hattie Mooser', collection: true }] },
  { fullImage: true, blocks: [{ kind: 'img', src: '/memorabilia/aladdin-first-night-club-article-1.jpg', caption: '“The City’s First Night Club” by Bernice Scharlach', collection: true }] },
  { fullImage: true, blocks: [{ kind: 'img', src: '/memorabilia/aladdin-first-night-club-article-2.jpg', caption: '“The City’s First Night Club,” continued', collection: true }] },
  { fullImage: true, blocks: [{ kind: 'img', src: '/memorabilia/hattie-minnie-what-a-time-clipping.jpg', caption: '“Oh, What a Time We Had With Minnie and Hattie” by Claire Leeds, San Francisco Examiner', collection: true }] },
  { fullImage: true, blocks: [{ kind: 'img', src: '/memorabilia/hattie-minnie-scrapbooks.jpg', caption: 'Hattie and Minnie with their scrapbooks', collection: true }] },
  { fullImage: true, blocks: [{ kind: 'img', src: '/memorabilia/hattie-minnie-snapshots.jpg', caption: 'Album page of snapshots of Hattie, Minnie, and friends', collection: true }] },
]
