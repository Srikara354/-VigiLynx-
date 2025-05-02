import { BookOpen, ArrowRight } from 'lucide-react';

const sections = [
  {
    heading: 'Top Online Resources',
    items: [
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
        title: 'PortSwigger Web Security Academy',
        url: 'https://portswigger.net/web-security',
        description: 'Free online web security training from the makers of Burp Suite.'
      },
      {
        title: 'Blue Team Labs Online',
        url: 'https://blueteamlabs.online/',
        description: 'Defensive security labs and challenges.'
      },
      {
        title: 'Awesome Security',
        url: 'https://github.com/sbilly/awesome-security',
        description: 'A curated list of awesome security resources and tools.'
      },
    ]
  },
  {
    heading: 'Recommended Books',
    items: [
      {
        title: 'The Web Application Hacker’s Handbook',
        url: 'https://www.amazon.com/Web-Application-Hackers-Handbook-Exploiting/dp/1118026470',
        description: 'Dafydd Stuttard & Marcus Pinto'
      },
      {
        title: 'Hacking: The Art of Exploitation',
        url: 'https://www.nostarch.com/hacking2.htm',
        description: 'Jon Erickson'
      },
      {
        title: 'Practical Malware Analysis',
        url: 'https://www.nostarch.com/malware',
        description: 'Michael Sikorski & Andrew Honig'
      },
      {
        title: 'Blue Team Handbook',
        url: 'https://www.amazon.com/Blue-Team-Handbook-condensed-Responder/dp/1500734756',
        description: 'Don Murdoch'
      },
      {
        title: 'The Art of Memory Forensics',
        url: 'https://www.wiley.com/en-us/The+Art+of+Memory+Forensics%3A+Detecting+Malware+and+Threats+in+Windows%2C+Linux%2C+and+Mac+Memory-p-9781118825099',
        description: 'Michael Hale Ligh, Andrew Case, Jamie Levy, AAron Walters'
      },
    ]
  },
  {
    heading: 'YouTube Channels',
    items: [
      {
        title: 'NetworkChuck',
        url: 'https://www.youtube.com/c/NetworkChuck',
        description: 'Networking, hacking, and cybersecurity explained.'
      },
      {
        title: 'John Hammond',
        url: 'https://www.youtube.com/c/JohnHammond010',
        description: 'CTF walkthroughs, malware analysis, and more.'
      },
      {
        title: 'The Cyber Mentor',
        url: 'https://www.youtube.com/c/TheCyberMentor',
        description: 'Penetration testing and ethical hacking tutorials.'
      },
      {
        title: 'LiveOverflow',
        url: 'https://www.youtube.com/c/LiveOverflow',
        description: 'Hacking explained with CTFs and real-world examples.'
      },
      {
        title: 'HackerSploit',
        url: 'https://www.youtube.com/c/HackerSploit',
        description: 'Cybersecurity training and penetration testing.'
      },
    ]
  },
  {
    heading: 'Communities & News',
    items: [
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
        title: 'Red Team Village',
        url: 'https://redteamvillage.io/',
        description: 'Community and resources for red teaming and offensive security.'
      },
      {
        title: 'r/netsec',
        url: 'https://www.reddit.com/r/netsec/',
        description: 'Reddit community for security professionals.'
      },
      {
        title: 'InfoSec Write-ups',
        url: 'https://infosecwriteups.com/',
        description: 'Medium publication for security research and write-ups.'
      },
    ]
  },
  {
    heading: 'Frameworks & Standards',
    items: [
      {
        title: 'NIST Cybersecurity Framework',
        url: 'https://www.nist.gov/cyberframework',
        description: 'Guidelines and best practices for managing cybersecurity risk.'
      },
      {
        title: 'MITRE ATT&CK',
        url: 'https://attack.mitre.org/',
        description: 'A globally-accessible knowledge base of adversary tactics and techniques.'
      },
      {
        title: 'OWASP',
        url: 'https://owasp.org/',
        description: 'Open Web Application Security Project.'
      },
    ]
  },
];

export default function Learn() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen size={32} className="text-primary" />
        <h1 className="text-2xl font-bold">Learn Cybersecurity</h1>
      </div>
      <p className="mb-6 text-muted-foreground">
        Start or advance your cybersecurity journey with these curated resources, books, channels, and communities. Whether you’re a beginner or a professional, there’s something for everyone!
      </p>
      {sections.map(section => (
        <section className="mb-10" key={section.heading}>
          <h2 className="text-xl font-semibold mb-3">{section.heading}</h2>
          <ul className="space-y-5">
            {section.items.map(item => (
              <li key={item.url} className="p-4 bg-card rounded-lg shadow flex flex-col md:flex-row md:items-center gap-2">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary font-semibold hover:underline">
                  {item.title}
                  <ArrowRight size={16} />
                </a>
                <span className="text-muted-foreground text-sm md:ml-4">{item.description}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
