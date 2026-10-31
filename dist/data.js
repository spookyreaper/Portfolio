// Public project details verified from https://github.com/spookyreaper.
// Edit this file to change the published portfolio for every visitor.
// The on-page editor saves a preview only in the current browser.
window.PORTFOLIO_DATA = {
  profile: {
    name: 'Brandon Alvarado', shortName: 'brandon',
    role: 'FULL-STACK DEVELOPER. CURIOUS BY DEFAULT.',
    intro: 'I’m Brandon. I build web apps that bring people together, solve everyday problems, and make room for a little play.',
    about: 'My projects range from helping lost pets find their way home to connecting pet owners with sitters — plus the occasional word puzzle. I enjoy building the whole experience, from the interface to the API.',
    aboutSecond: 'I work with JavaScript across the stack, using React for interactive interfaces and Node.js, Express, Sails, and MongoDB behind the scenes. This portfolio is a collection of that work.',
    skills: ['JavaScript', 'React', 'Node.js', 'Express', 'Sails', 'MongoDB', 'HTML & CSS'],
    email: '', github: 'https://github.com/spookyreaper', linkedin: ''
  },
  projects: [
    {
      id: 'lostpaw-network', title: 'LostPaw Network',
      subtitle: 'Helping every paw find a way home.', category: 'Web apps', year: '2024',
      image: 'assets/lostpaw-home-desktop.jpg', color: '#e9dfd2',
      tags: ['React', 'JavaScript', 'Leaflet', 'MapLibre', 'Tailwind CSS'],
      description: 'A community app for reporting lost and found pets and helping families reconnect. Visitors can browse reports, search and filter by animal or location, and explore nearby reports on an interactive map.\n\nSigned-in users can create reports with photos, choose a location with address search or a map pin, and manage their profiles. The React frontend is paired with the LostPaw API, also featured in this portfolio.\n\nStarted in 2024 and updated in 2026. Preview images show seeded example reports, rather than active pet alerts.',
      live: 'https://lostpawnetwork.netlify.app/',
      source: 'https://github.com/spookyreaper/LostPawNetwork-frontend', demo: false
    },
    {
      id: 'pet-paradise', title: 'Pet Paradise Keepers',
      subtitle: 'Connecting good pets with great people.', category: 'Web apps', year: '2024',
      image: 'assets/pet-paradise-preview.png', color: '#e1e7da',
      tags: ['Node.js', 'Express', 'MongoDB', 'EJS'],
      description: 'A pet care marketplace connecting pet owners and sitters. Owners can create pet profiles and sitting-job listings, while sitters can discover opportunities, apply for jobs, and discuss rates.\n\nThe app includes sitter discovery, profile photos, and private messaging so people can coordinate care in one place. Built with Express, EJS templates, and MongoDB through Mongoose.\n\nStarted in 2024 and updated in 2026. Explore the repository for the source and local setup instructions.',
      live: '', source: 'https://github.com/spookyreaper/Pet-Paradise-Keepers', demo: false
    },
    {
      id: 'connection-game', title: 'Connection Game',
      subtitle: 'Sixteen words. Four connections. One good puzzle.', category: 'Games', year: '2024',
      image: 'assets/connections-preview.png', color: '#e8e2ef',
      tags: ['JavaScript', 'HTML & CSS', 'localStorage'],
      description: 'A responsive word-association game: find four related groups hidden among sixteen words. Choose from Easy, Medium, Hard, and Expert, then work through a randomized board with scoring, shuffle, one-away hints, and explanations.\n\nBuilt with plain HTML, CSS, and JavaScript. Preferences are saved locally, and puzzle data is checked with the Node.js test runner.\n\nStarted in 2024 and updated in 2026. Play the published game or explore the source below.',
      live: 'https://spookyreaper.github.io/Connections-Game-/',
      source: 'https://github.com/spookyreaper/Connections-Game-', demo: false
    },
    {
      id: 'lostpaw-api', title: 'LostPaw API',
      subtitle: 'The backend behind a happy homecoming.', category: 'APIs', year: '2024',
      image: 'assets/lostpaw-api.svg', color: '#232c2b',
      tags: ['Node.js', 'Sails', 'MongoDB', 'JWT'],
      description: 'The companion API for LostPaw Network. It powers accounts, profiles, pet reports, photo uploads, and the locations shown on the map. Authenticated place lookup helps reporters find an address without entering coordinates.\n\nBuilt with Node.js and Sails, using Waterline models and MongoDB in production. Authentication includes password hashing, persisted JWT sessions, logout revocation, and ownership checks for report changes.\n\nStarted in 2024 and updated in 2026. The cover is an illustrative API overview; see the repository for the implementation and configuration.',
      live: '', source: 'https://github.com/spookyreaper/LostPawNetwork-backend', demo: false
    }
  ]
};
