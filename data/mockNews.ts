interface NewsArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  content: string;
  views: number;
}

export const mockNewsArticles: NewsArticle[] = [
  {
    id: 'n1',
    title: 'New Phishing Campaign Targeting Remote Workers',
    category: 'Active Threats',
    date: 'Today',
    summary: 'A sophisticated phishing campaign is targeting remote workers through fake collaboration tool notifications. Learn how to protect yourself.',
    content: 'Full article content here...',
    views: 12453
  },
  {
    id: 'n2',
    title: 'Major Security Update for Popular Browsers',
    category: 'Tech Updates',
    date: 'Yesterday',
    summary: 'Critical security updates have been released for major web browsers. Users are advised to update immediately.',
    content: 'Full article content here...',
    views: 8921
  },
  {
    id: 'n3',
    title: 'Rising Trend in Mobile Security Threats',
    category: 'Industry News',
    date: '2 days ago',
    summary: 'Security researchers report an increase in mobile malware targeting banking applications.',
    content: 'Full article content here...',
    views: 15678
  },
  {
    id: 'n4',
    title: '5 Simple Steps to Secure Your Home Network',
    category: 'Security Tips',
    date: 'May 22, 2024',
    summary: 'Protect your smart devices and personal data with these easy-to-follow steps to strengthen your home Wi-Fi security and prevent unauthorized access.',
    content: 'Full article content here...',
    views: 9345
  },
  {
    id: 'n5',
    title: 'Understanding Zero Trust Security Model',
    category: 'Education',
    date: 'May 20, 2024',
    summary: 'Learn about the Zero Trust security model and why organizations are adopting this modern approach to cybersecurity.',
    content: 'Full article content here...',
    views: 25789
  }
];