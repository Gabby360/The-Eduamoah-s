export interface Blessing {
  id: string;
  name: string;
  date: string;
  message: string;
  initials: string;
}

export const weddingDetails = {
  couple: {
    brideName: 'Nadia Amoah',
    groomName: 'Kwame Edu',
    coupleName: "The Eduamoah's",
    brideSubtitle: 'THE BRIDE',
    groomSubtitle: 'THE GROOM',
    brideBio: 'A soul full of grace, warmth, and joy. Nadia brings light to every room she enters and fills Kwame\'s world with endless love and inspiration.',
    groomBio: 'A man of strength, character, and integrity. Kwame\'s devotion to Nadia is unwavering, as they step into this beautiful lifetime together.',
    heroImage: '/hero-custom.jpg',
    storyImage: '/story-custom.jpg',
    brideImage: '/bride-custom.jpg',
    groomImage: '/groom-custom.jpg',
    footerImage: 'https://public.readdy.ai/ai/img_res/effa0eb9afdac048b15ea176a341404b.jpg',
  },
  wedding: {
    date: 'October 10, 2026',
    dayOfWeek: 'Saturday',
    time: '2:00 PM',
    venue: 'The Grand Ivory Ballroom',
    address: '42 Independence Avenue, East Legon, Accra, Ghana',
    ceremonyTime: '2:00 PM',
    receptionTime: '4:00 PM',
    dinnerTime: '6:00 PM',
    celebrationTime: '8:00 PM',
  },
  hero: {
    tagline: 'Two hearts. One beautiful journey.',
    scrollText: 'SCROLL TO DISCOVER',
  },
  story: {
    headline: 'TWO HEARTS. ONE BEAUTIFUL STORY. A LIFETIME TO GO.',
    paragraphs: [
      'It began with a simple hello, and from that moment, everything changed. Their paths crossed on a warm evening in Accra, where laughter became the soundtrack of a beautiful beginning.',
      'What started as two strangers sharing a conversation blossomed into a connection neither could have imagined. Through every season, their love grew deeper, stronger, and more extraordinary.',
      'Now, after years of building dreams together, they are ready to say "I do" and begin the most beautiful chapter of their love story.',
    ],
  },
  timeline: [
    {
      time: '2:00 PM',
      title: 'CEREMONY',
      description: 'Exchange of vows under golden floral arches. Witness the sacred union of Nadia & Kwame.',
    },
    {
      time: '4:00 PM',
      title: 'RECEPTION',
      description: 'Cocktails, champagne toasts, and social hours surrounded by loved ones.',
    },
    {
      time: '6:00 PM',
      title: 'DINNER',
      description: 'An exquisite feast shared with those who mean the most to us.',
    },
    {
      time: '8:00 PM',
      title: 'CELEBRATION',
      description: 'Dance, laughter, and memories that will last a lifetime. Let us celebrate together.',
    },
  ],
  gallery: {
    images: [
      {
        url: '/gallery-13.jpg',
        title: 'Close Embrace',
        category: 'Romance'
      },
      {
        url: '/gallery-10.jpg',
        title: 'Staircase Kiss',
        category: 'Romance'
      },
      {
        url: '/gallery-1.jpg',
        title: 'Promise & Ring',
        category: 'Details'
      },
      {
        url: '/hero-custom.jpg',
        title: 'Forehead Kiss',
        category: 'Romance'
      },
      {
        url: '/gallery-12.jpg',
        title: 'Back to Back',
        category: 'Portrait'
      },
      {
        url: '/gallery-2.jpg',
        title: 'Warm Embrace',
        category: 'Romance'
      },
      {
        url: '/gallery-3.jpg',
        title: 'Loving Look',
        category: 'Portrait'
      },
      {
        url: '/gallery-14.jpg',
        title: 'Matching Energy',
        category: 'Portrait'
      },
      {
        url: '/gallery-4.jpg',
        title: 'Forever Together',
        category: 'Monochrome'
      },
      {
        url: '/gallery-5.jpg',
        title: 'Playful Moments',
        category: 'Celebration'
      },
      {
        url: '/gallery-6.jpg',
        title: 'African Prints & Smiles',
        category: 'Romance'
      },
      {
        url: '/gallery-7.jpg',
        title: 'Through His Eyes',
        category: 'Creative'
      },
      {
        url: '/gallery-8.jpg',
        title: 'Hold My Hand',
        category: 'Details'
      },
      {
        url: '/gallery-11.jpg',
        title: 'Framed in Love',
        category: 'Creative'
      },
      {
        url: '/gallery-15.jpg',
        title: 'Just the Two of Us',
        category: 'Romance'
      }
    ]
  },
  initialBlessings: [
    {
      id: '1',
      name: 'Auntie Grace',
      date: 'Aug 20, 2026',
      message: 'May your love continue to grow stronger with each passing day. God bless your union!',
      initials: 'A'
    },
    {
      id: '2',
      name: 'Uncle Kofi',
      date: 'Aug 21, 2026',
      message: 'We are so happy for you both. Wishing you a lifetime of joy, love, and beautiful memories together.',
      initials: 'U'
    },
    {
      id: '3',
      name: 'Sarah & James',
      date: 'Aug 22, 2026',
      message: 'Congratulations on finding your forever! We cannot wait to celebrate this special day in Accra with you.',
      initials: 'S'
    },
    {
      id: '4',
      name: 'Mama Rose',
      date: 'Aug 23, 2026',
      message: 'My heart is full of joy. May the Lord guide your steps as you build your home together.',
      initials: 'M'
    }
  ] as Blessing[]
};
