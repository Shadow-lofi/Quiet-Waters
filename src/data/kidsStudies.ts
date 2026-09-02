// Animated Bible studies for kids (a Temple Plus feature). Each study is a short
// storybook of pages; every page names an animated SVG scene (rendered by
// StudyScene.tsx), a line of kid-friendly narration, and a Scripture reference.
// Data-driven so new stories are just new entries here + their scenes. Ordered to
// follow the Bible.

export type SceneKey =
  | 'noah-build'
  | 'noah-animals'
  | 'noah-rain'
  | 'noah-dove'
  | 'noah-rainbow'
  | 'david-sheep'
  | 'david-goliath'
  | 'david-stones'
  | 'david-sling'
  | 'david-victory'
  | 'creation-light'
  | 'creation-sky'
  | 'creation-land'
  | 'creation-stars'
  | 'creation-sea'
  | 'creation-animals'
  | 'creation-rest'
  | 'jonah-run'
  | 'jonah-storm'
  | 'jonah-fish'
  | 'jonah-pray'
  | 'jonah-nineveh'

export interface StudyPage {
  scene: SceneKey
  text: string
  ref: string
}

export interface KidsStudy {
  id: string
  title: string
  subtitle: string
  /** A short memory verse shown on the finish screen. */
  verse: string
  verseRef: string
  pages: StudyPage[]
}

export const KIDS_STUDIES: KidsStudy[] = [
  {
    id: 'creation',
    title: 'The Creation',
    subtitle: 'God made everything good',
    verse: 'In the beginning God created the heavens and the earth.',
    verseRef: 'Genesis 1:1',
    pages: [
      {
        scene: 'creation-light',
        text: 'In the very beginning, everything was dark and empty. Then God said, “Let there be light!” And light burst out, bright and warm. That was Day One.',
        ref: 'Genesis 1:3',
      },
      {
        scene: 'creation-sky',
        text: 'On Day Two, God made the big blue sky up high and the waters down below. He stretched it out like a great tent over the world.',
        ref: 'Genesis 1:7',
      },
      {
        scene: 'creation-land',
        text: 'On Day Three, God gathered the seas and made dry land. Then — pop, pop, pop! — grass, flowers, and tall trees grew everywhere.',
        ref: 'Genesis 1:11',
      },
      {
        scene: 'creation-stars',
        text: 'On Day Four, God hung the bright sun for the day and the gentle moon for the night. He sprinkled the sky with twinkling stars.',
        ref: 'Genesis 1:16',
      },
      {
        scene: 'creation-sea',
        text: 'On Day Five, God filled the seas with splashing fish and whales, and the skies with birds that swooped and sang.',
        ref: 'Genesis 1:21',
      },
      {
        scene: 'creation-animals',
        text: 'On Day Six, God made all the animals — hoppy, stompy, and small. Then he made people, in his very own image, to love and care for it all.',
        ref: 'Genesis 1:27',
      },
      {
        scene: 'creation-rest',
        text: 'God looked at everything he had made, and it was very good! On Day Seven, God rested — and he taught us to rest too.',
        ref: 'Genesis 2:2',
      },
    ],
  },
  {
    id: 'noah',
    title: 'Noah and the Ark',
    subtitle: 'God keeps his promises',
    verse: 'I have set my rainbow in the clouds.',
    verseRef: 'Genesis 9:13',
    pages: [
      {
        scene: 'noah-build',
        text: 'The world had forgotten to be kind. But Noah loved God with his whole heart. So God gave Noah a big job: build a great big boat called an ark.',
        ref: 'Genesis 6:14',
      },
      {
        scene: 'noah-animals',
        text: 'Then something wonderful happened! The animals came two by two — big ones and small ones, hoppers and crawlers. Noah welcomed every one onto the ark.',
        ref: 'Genesis 6:19',
      },
      {
        scene: 'noah-rain',
        text: 'Soon the rain began. It poured and poured — forty days and forty nights! But inside the ark, Noah’s family and all the animals were cozy, safe, and dry.',
        ref: 'Genesis 7:12',
      },
      {
        scene: 'noah-dove',
        text: 'When the rain stopped, Noah sent out a little dove. It flew back holding a fresh green leaf — a happy sign that dry land was near again!',
        ref: 'Genesis 8:11',
      },
      {
        scene: 'noah-rainbow',
        text: 'Then God painted a beautiful rainbow across the sky. It was his promise, shining in every color: “I will always love you and care for you.”',
        ref: 'Genesis 9:13',
      },
    ],
  },
  {
    id: 'david',
    title: 'David and Goliath',
    subtitle: 'God gives us courage',
    verse: 'The battle is the LORD’s.',
    verseRef: '1 Samuel 17:47',
    pages: [
      {
        scene: 'david-sheep',
        text: 'David was the youngest of eight brothers — just a shepherd boy who watched the sheep and sang songs to God. But God saw something special in David’s heart.',
        ref: '1 Samuel 16:11',
      },
      {
        scene: 'david-goliath',
        text: 'One day a giant named Goliath stomped out, taller than a house! He shouted at God’s people, and everyone was afraid — everyone except David.',
        ref: '1 Samuel 17:4',
      },
      {
        scene: 'david-stones',
        text: '“God helped me protect my sheep from lions and bears,” David said. So he chose five smooth stones from the stream and picked up his sling.',
        ref: '1 Samuel 17:40',
      },
      {
        scene: 'david-sling',
        text: '“You come with a sword,” David called, “but I come in the name of the Lord!” He swung his sling round and round, and let a stone fly.',
        ref: '1 Samuel 17:45',
      },
      {
        scene: 'david-victory',
        text: 'Down came the giant with a mighty thud! Little David had won — because the battle belonged to God. God had made him brave.',
        ref: '1 Samuel 17:50',
      },
    ],
  },
  {
    id: 'jonah',
    title: 'Jonah and the Big Fish',
    subtitle: 'God gives second chances',
    verse: 'Salvation comes from the LORD.',
    verseRef: 'Jonah 2:9',
    pages: [
      {
        scene: 'jonah-run',
        text: 'God asked Jonah to tell the city of Nineveh to turn back to God. But Jonah didn’t want to — so he hopped on a boat sailing the other way!',
        ref: 'Jonah 1:3',
      },
      {
        scene: 'jonah-storm',
        text: 'Out at sea, God sent a big storm. The wind howled and the waves crashed higher and higher. Jonah knew he had run away from God.',
        ref: 'Jonah 1:4',
      },
      {
        scene: 'jonah-fish',
        text: 'The sailors lowered Jonah into the water — and SPLASH — God sent a giant fish that swallowed Jonah in one big gulp!',
        ref: 'Jonah 1:17',
      },
      {
        scene: 'jonah-pray',
        text: 'Inside the fish, in the dark, Jonah prayed. “I’m sorry, God. Thank you for saving me.” For three days he talked with God.',
        ref: 'Jonah 2:1',
      },
      {
        scene: 'jonah-nineveh',
        text: 'Then the fish set Jonah gently on dry land! This time Jonah went to Nineveh, and the whole city turned to God. God gives second chances.',
        ref: 'Jonah 3:3',
      },
    ],
  },
]

export function studyById(id: string): KidsStudy | undefined {
  return KIDS_STUDIES.find((s) => s.id === id)
}
