interface NewsArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  content: string;
}

export const mockNewsArticles: NewsArticle[] = [
  {
    id: 'n1',
    title: 'New Phishing Campaign Targeting Remote Workers',
    category: 'ALERT',
    date: 'Today',
    summary: 'A sophisticated phishing campaign is targeting remote workers through fake collaboration tool notifications. Learn how to protect yourself.',
    content: 'Full article content here...'
  },
  {
    id: 'n2',
    title: 'Major Security Update for Popular Browsers',
    category: 'UPDATE',
    date: 'Yesterday',
    summary: 'Critical security updates have been released for major web browsers. Users are advised to update immediately.',
    content: 'Full article content here...'
  },
  {
    id: 'n3',
    title: 'Rising Trend in Mobile Security Threats',
    category: 'TREND',
    date: '2 days ago',
    summary: 'Security researchers report an increase in mobile malware targeting banking applications.',
    content: 'Full article content here...'
  },
  {
    id: 'n4',
    title: '5 Simple Steps to Secure Your Home Network',
    category: 'tips',
    date: 'May 22, 2024',
    summary: 'Protect your smart devices and personal data with these easy-to-follow steps to strengthen your home Wi-Fi security and prevent unauthorized access.',
    content: 'Full article content here...'
  },
  {
    id: 'n5',
    title: 'Major Data Breach Exposes Millions of User Records',
    category: 'threats',
    date: 'May 20, 2024',
    summary: 'A popular online service has confirmed a significant data breach affecting over 10 million users worldwide. Learn if you\'re affected and what actions to take.',
    content: 'Full article content here...'
  },
  {
    id: 'n6',
    title: 'The Rise of Passwordless Authentication',
    category: 'trends',
    date: 'May 18, 2024',
    summary: 'More companies are moving away from traditional passwords. Discover how biometrics, security keys, and other technologies are changing the way we log in.',
    content: 'Full article content here...'
  },
  {
    id: 'n7',
    title: 'Why Two-Factor Authentication Should Be Mandatory',
    category: 'tips',
    date: 'May 15, 2024',
    summary: 'Despite being available for years, 2FA adoption remains low. Security experts argue why this simple security measure should be required for all online accounts.',
    content: 'Full article content here...'
  },
  {
    id: 'n8',
    title: 'Ransomware Attacks Surge by 300% in Healthcare Sector',
    category: 'threats',
    date: 'May 12, 2024',
    summary: 'Hospitals and healthcare providers are facing an unprecedented wave of ransomware attacks, putting patient data and critical systems at risk.',
    content: 'Full article content here...'
  },
];