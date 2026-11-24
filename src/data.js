// All content comes from "Sakshi_Mane_Portfolio_Content_Updated.pdf".

export const RESUME_URL = null // set to 'resume.pdf' once her resume PDF is added to /public

export const profile = {
  name: 'Sakshi Mane',
  role: 'Automation Tester',
  designation: 'Senior Analyst at Capgemini',
  location: 'Navi Mumbai, Maharashtra, India',
  tagline: 'Building reliable software through quality, precision and continuous learning.',
  welcome:
    "Welcome to my professional portfolio! I'm Sakshi Mane, a Computer Engineering graduate currently working at Capgemini as a Senior Analyst. I enjoy exploring technology, understanding software systems, identifying problems and contributing to quality software solutions.",
}

export const about = [
  "I'm a Computer Engineering graduate with a passion for technology, software development and quality assurance. Currently, I am working at Capgemini as a Senior Analyst, specializing in Automation and Manual Testing. I started my professional journey with Capgemini in December 2024 as an Analyst and progressed to the Senior Analyst designation.",
  'My academic background provided me with a foundation in programming, database management, web technologies and application development. Through my professional journey, I have developed an interest in software quality, application validation and testing practices.',
  'I believe in continuous improvement, taking ownership of responsibilities and approaching challenges with a problem-solving mindset.',
]

export const highlights = [
  'Computer Engineering graduate',
  'Professional experience at Capgemini since December 2024',
  'Career progression from Analyst to Senior Analyst',
  'Exposure to Automation and Manual Testing',
  'Academic experience in Android application and web development',
  'Recipient of the Lila Poonawalla Foundation Scholarship',
]

export const experience = {
  company: 'Capgemini',
  period: 'December 2024 – Present',
  place: 'India',
  role: 'Automation Tester',
  // Put the official logo in public/ and set e.g. logo: './capgemini-logo.svg'
  logo: null,
  overview:
    'Working in the software testing domain, with a focus on Automation and Manual Testing, contributing to software quality and application validation.',
  steps: [
    { id: 'analyst', title: 'Analyst', sub: 'Where I started', when: 'Joined · December 2024', text: 'Started her professional journey at Capgemini as an Analyst in Automation and Manual Testing.' },
    { id: 'senior', title: 'Senior Analyst', sub: 'Current designation', when: 'Promoted', text: 'Promoted to Senior Analyst, specializing in Automation Testing.' },
  ],
  duties: [
    'Perform manual testing to validate application functionality against requirements.',
    'Support automation testing activities to improve test execution efficiency.',
    'Understand application requirements and testing scenarios.',
    'Identify, document and report software defects.',
    'Participate in test case preparation and execution.',
    'Collaborate with team members to support software quality objectives.',
    'Contribute to testing documentation and execution reports.',
  ],
}

export const skills = [
  { name: 'Manual Testing', cat: 'Testing' },
  { name: 'Automation Testing', cat: 'Testing' },
  { name: 'Python', cat: 'Programming' },
  { name: 'C', cat: 'Programming' },
  { name: 'C++', cat: 'Programming' },
  { name: 'Java', cat: 'Programming' },
  { name: 'JavaScript', cat: 'Programming' },
  { name: 'HTML', cat: 'Web' },
  { name: 'CSS', cat: 'Web' },
  { name: 'Bootstrap', cat: 'Web' },
  { name: 'JavaScript', cat: 'Web', key: 'js-web' },
  { name: 'MySQL', cat: 'Database' },
  { name: 'Firebase', cat: 'Database' },
  { name: 'Data Structures', cat: 'Database' },
  { name: 'Problem Solving', cat: 'Professional' },
  { name: 'Leadership', cat: 'Professional' },
  { name: 'Communication', cat: 'Professional' },
  { name: 'Public Speaking', cat: 'Professional' },
  { name: 'Time Management', cat: 'Professional' },
  { name: 'Self Motivation', cat: 'Professional' },
]
export const skillCats = ['Testing', 'Programming', 'Web', 'Database', 'Professional', 'All']
export const catLabel = { Web: 'Web Technologies', Database: 'Database & Core Concepts', Professional: 'Professional Skills' }

export const projects = [
  {
    id: 'PRJ-2022',
    name: 'Stitching App',
    year: '2022',
    type: 'Android Application',
    summary: 'An Android app for tailors and fashion designers to manage customers, orders and measurements in one place.',
    overview:
      'Developed an Android application designed for tailors and fashion designers to manage customer information, orders and measurement details in one place.',
    problem: 'Tailoring records such as customer details, orders and measurements are hard to keep track of when they are scattered.',
    tech: ['Android Studio', 'Firebase'],
    contribution: [
      'Studied how tailors keep customer, order and measurement records, and planned the app around those real needs.',
      'Designed and built every screen in Android Studio, from adding a customer to saving their measurements.',
      'Set up Firebase as one central database, so records are saved safely and easy to find again.',
      'Tested each feature myself, fixed the issues I found, and kept improving the app until it worked smoothly.',
    ],
    features: [
      'Customer information management',
      'Order record maintenance',
      'Customer measurement storage',
      'Centralized database using Firebase',
      'Simplified management of tailoring records',
    ],
    result: null,
  },
  {
    id: 'PRJ-2021',
    name: 'Online Photographer Hiring System',
    year: '2021',
    type: 'Web Application',
    summary: 'A web system that simplifies and streamlines how a company hires photographers.',
    overview:
      'Developed an online photographer hiring system to simplify and streamline the photographer recruitment process for a company.',
    problem: 'Hiring photographers took staff a lot of time through a manual process.',
    tech: ['HTML', 'CSS', 'Bootstrap', 'JavaScript', 'MySQL'],
    contribution: [
      "Understood the company's slow, manual hiring process and planned a simpler online flow to replace it.",
      'Built a responsive front end with HTML, CSS, Bootstrap and JavaScript that works well on any screen.',
      'Designed the MySQL database to keep photographer and hiring details organised and quick to search.',
      'Tested the full hiring workflow from start to finish, helping cut the time staff spent hiring photographers by 80%.',
    ],
    features: [
      'Online photographer hiring interface',
      'Structured information management',
      'Database integration using MySQL',
      'Responsive frontend using HTML, CSS and Bootstrap',
      'Streamlined hiring workflow',
    ],
    result: '80% reduction in the time staff spent hiring photographers',
  },
]

export const education = [
  { id: 'be', short: 'B.E.', title: 'Bachelor of Engineering, Computer Engineering', school: "Pune District Education Association's College of Engineering, Manjari", years: '2021 – 2024', score: null },
  { id: 'dip', short: 'Diploma', title: 'Diploma in Computer Engineering', school: "Government Residential Women's Polytechnic College, Latur", years: '2018 – 2021', score: 91.43 },
  { id: 'ssc', short: 'SSC', title: 'Secondary School Certificate', school: 'Shrikrishna Vidyalaya, Gunjoti', years: '2017 – 2018', score: 91 },
]

export const scholarship = {
  title: 'Lila Poonawalla Foundation Scholarship',
  year: '2021',
  text: "Received the Lila Poonawalla Foundation Scholarship to support my Computer Engineering education. As part of the foundation's training initiatives, participated in programs focused on Advanced Values & Ethics and soft skills, contributing to personal and professional development.",
}

export const languages = [
  { name: 'Marathi', level: 'Advanced', value: 3 },
  { name: 'English', level: 'Intermediate', value: 2 },
  { name: 'Hindi', level: 'Intermediate', value: 2 },
]
export const interests = ['Gardening', 'Travelling', 'Watching Movies']

export const contact = {
  email: 'sakshi.mane4902@gmail.com',
  phone: '+91 9834698696',
  phoneHref: 'tel:+919834698696',
  linkedin: 'https://www.linkedin.com/in/sakshi-mane-7867b5232/',
  linkedinLabel: 'linkedin.com/in/sakshi-mane-7867b5232',
  location: 'Navi Mumbai, Maharashtra, India',
  // Web3Forms access key (free, safe to keep public). Until it is set, the form opens an email instead.
  formKey: null,
}
