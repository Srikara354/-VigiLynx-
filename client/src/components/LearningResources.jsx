import { BookOpen, ArrowRight } from 'lucide-react';

const resources = [
  {
    title: 'Cybrary',
    url: 'https://www.cybrary.it/',
    description: 'Free and paid courses on cybersecurity topics for all levels.'
  },
  {
    title: 'TryHackMe',
    url: 'https://tryhackme.com/',
    description: 'Hands-on cybersecurity labs and guided learning paths.'
  },
  {
    title: 'Hack The Box Academy',
    url: 'https://academy.hackthebox.com/',
    description: 'Interactive cybersecurity training platform.'
  },
  {
    title: 'OWASP Top Ten',
    url: 'https://owasp.org/www-project-top-ten/',
    description: 'The most critical security risks to web applications.'
  },
  {
    title: 'Krebs on Security',
    url: 'https://krebsonsecurity.com/',
    description: 'Blog covering the latest in cybersecurity news and analysis.'
  },
  {
    title: 'The Hacker News',
    url: 'https://thehackernews.com/',
    description: 'Popular cybersecurity news platform.'
  },
  {
    title: 'Google Security Blog',
    url: 'https://security.googleblog.com/',
    description: 'Security updates and best practices from Google.'
  },
  {
    title: 'NIST Cybersecurity Framework',
    url: 'https://www.nist.gov/cyberframework',
    description: 'Guidelines and best practices for managing cybersecurity risk.'
  },
  {
    title: 'Awesome Security',
    url: 'https://github.com/sbilly/awesome-security',
    description: 'A curated list of awesome security resources and tools.'
  },
  {
    title: 'Red Team Village',
    url: 'https://redteamvillage.io/',
    description: 'Community and resources for red teaming and offensive security.'
  },
];

export default function LearningResources() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen size={32} className="text-primary" />
        <h1 className="text-2xl font-bold">Cybersecurity Learning Resources</h1>
      </div>
      <p className="mb-6 text-muted-foreground">
        Explore these curated resources to start or advance your journey in cybersecurity. Whether you are a beginner or a professional, there is something for everyone!
      </p>
      <ul className="space-y-5">
        {resources.map((res) => (
          <li key={res.url} className="p-4 bg-card rounded-lg shadow flex flex-col md:flex-row md:items-center gap-2">
            <a href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary font-semibold hover:underline">
              {res.title}
              <ArrowRight size={16} />
            </a>
            <span className="text-muted-foreground text-sm md:ml-4">{res.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
