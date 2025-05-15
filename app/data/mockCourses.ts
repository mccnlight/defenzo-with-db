import { Lock, ShieldCheck, Globe, Smartphone } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Course, Lesson, LessonContent, Achievement, Question, Scenario, VisualTask, Hotspot } from '@/types/course';

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Essential Cybersecurity Practices',
    description: 'Learn the fundamentals of cybersecurity through interactive exercises and real-world scenarios.',
    category: 'basics',
    duration: '2h 30m',
    progress: 0,
    level: 'Beginner',
    tags: ['Security Basics', 'Office Safety', 'Best Practices'],
    image: 'https://example.com/course1.jpg',
    rating: 4.8,
    learners: 12500,
    recommended: true,
    achievements: [
      {
        id: 'ach1',
        title: 'Security Novice',
        description: 'Complete your first security lesson',
        icon: '🛡️',
        progress: 0
      },
      {
        id: 'ach2',
        title: 'Office Guardian',
        description: 'Master office security practices',
        icon: '🏢',
        progress: 0
      }
    ],
    lessons: [
      {
        id: 'lesson-1',
        title: 'Introduction to Office Security',
        type: 'dialog',
        duration: '30m',
        content: {
          introduction: 'Welcome to your first day at the office! Let\'s learn how to stay secure.',
          questions: [
            {
              id: 'q1',
              text: 'What\'s the first step in maintaining office security?',
              type: 'multiple_choice',
              options: [
                'Ignore security protocols',
                'Learn and follow security guidelines',
                'Share passwords with colleagues',
                'Leave computers unlocked'
              ],
              correctAnswer: 'Learn and follow security guidelines',
              explanation: 'Following security guidelines is crucial for maintaining a secure workplace.'
            }
          ]
        },
        completed: false
      },
      {
        id: 'lesson-2',
        title: 'Security Facts Check',
        type: 'cards',
        duration: '15m',
        content: {
          questions: [
            {
              id: 'tf1',
              text: 'Antivirus software alone is enough for complete security',
              type: 'true_false',
              correctAnswer: false,
              explanation: 'Security requires multiple layers of protection, not just antivirus software.'
            },
            {
              id: 'tf2',
              text: 'Two-factor authentication adds an extra layer of security',
              type: 'true_false',
              correctAnswer: true,
              explanation: 'Two-factor authentication provides additional protection beyond passwords.'
            },
            {
              id: 'tf3',
              text: 'It\'s safe to use USB drives found in public places',
              type: 'true_false',
              correctAnswer: false,
              explanation: 'Unknown USB devices may contain malware or other security threats.'
            }
          ]
        },
        completed: false
      },
      {
        id: 'lesson-3',
        title: 'Office Security Scenarios',
        type: 'scenario',
        duration: '25m',
        content: {
          scenarios: [
            {
              id: 'sc1',
              situation: 'You receive an email from "IT Support" asking for your password',
              options: [
                'Reply with your password',
                'Verify the sender\'s identity through official channels',
                'Ignore the email',
                'Forward to colleagues'
              ],
              correctOption: 1,
              explanation: 'Always verify requests for sensitive information through official channels.'
            },
            {
              id: 'sc2',
              situation: 'You need to connect to Wi-Fi at a coffee shop',
              options: [
                'Connect to any open network',
                'Use a VPN for secure connection',
                'Access sensitive work data',
                'Share the network with others'
              ],
              correctOption: 1,
              explanation: 'Using a VPN helps protect your data on public networks.'
            }
          ]
        },
        completed: false
      },
      {
        id: 'lesson-4',
        title: 'Security Vulnerabilities',
        type: 'visual',
        duration: '20m',
        content: {
          visualTasks: [
            {
              id: 'vt1',
              title: 'Find Security Vulnerabilities',
              description: 'Identify potential security risks in this office scene',
              image: 'office-scene.jpg',
              hotspots: [
                {
                  id: 'hs1',
                  x: 30,
                  y: 40,
                  size: 20,
                  title: 'Exposed Password',
                  description: 'Passwords written on sticky notes are a security risk.'
                },
                {
                  id: 'hs2',
                  x: 60,
                  y: 70,
                  size: 20,
                  title: 'Unlocked Computer',
                  description: 'Unattended computers should always be locked.'
                },
                {
                  id: 'hs3',
                  x: 45,
                  y: 55,
                  size: 20,
                  title: 'Sensitive Documents',
                  description: 'Confidential documents left in plain sight.'
                }
              ]
            },
            {
              id: 'vt2',
              title: 'Server Room Security',
              description: 'Identify security issues in the server room',
              image: 'server-room.jpg',
              hotspots: [
                {
                  id: 'hs4',
                  x: 25,
                  y: 35,
                  size: 20,
                  title: 'Unsecured Access',
                  description: 'Server room door should be locked at all times.'
                },
                {
                  id: 'hs5',
                  x: 55,
                  y: 65,
                  size: 20,
                  title: 'Temperature Warning',
                  description: 'Server room temperature is above safe levels.'
                }
              ]
            }
          ]
        },
        completed: false
      }
    ]
  },
  {
    id: 'course-2',
    title: 'Password Security Masterclass',
    description: 'Master the art of creating and managing secure passwords. Learn about password managers and two-factor authentication.',
    category: 'passwords',
    duration: '1h 45m',
    progress: 0,
    level: 'Intermediate',
    tags: ['Passwords', '2FA', 'Security'],
    image: 'https://example.com/course2.jpg',
    rating: 4.9,
    learners: 15800,
    recommended: true,
    lessons: [
      {
        id: 'lesson-1',
        title: 'Password Fundamentals',
        type: 'dialog',
        duration: '25m',
        content: {
          introduction: 'Learn what makes a password truly secure.',
          questions: [
            {
              id: 'q1',
              text: 'What makes a strong password?',
              type: 'multiple_choice',
              options: [
                'Using personal information',
                'Complex combination of characters',
                'Simple dictionary words',
                'Sequential numbers'
              ],
              correctAnswer: 'Complex combination of characters',
              explanation: 'Strong passwords use a mix of letters, numbers, and special characters.'
            }
          ]
        },
        completed: false
      }
    ]
  },
  {
    id: 'course-3',
    title: 'Phishing Attack Prevention',
    description: 'Learn to identify and prevent phishing attacks. Understand common tactics used by attackers and how to protect yourself.',
    category: 'security',
    duration: '90m',
    progress: 0,
    level: 'Beginner',
    tags: ['Phishing', 'Email Security', 'Awareness'],
    image: 'https://example.com/course3.jpg',
    rating: 4.7,
    learners: 18200,
    recommended: true,
    lessons: []
  },
  {
    id: 'course-4',
    title: 'Mobile Device Security',
    description: 'Secure your smartphones and tablets. Learn about app permissions, device encryption, and safe browsing.',
    category: 'mobile',
    duration: '2h 15m',
    progress: 0,
    level: 'Intermediate',
    tags: ['Mobile', 'Apps', 'Device Security'],
    image: 'https://example.com/course4.jpg',
    rating: 4.6,
    learners: 11500,
    lessons: []
  },
  {
    id: 'course-5',
    title: 'Social Engineering Defense',
    description: 'Learn to recognize and defend against social engineering attacks. Understand manipulation techniques and prevention strategies.',
    category: 'security',
    duration: '1h 15m',
    progress: 0,
    level: 'Intermediate',
    tags: ['Social Engineering', 'Security Awareness', 'Prevention'],
    image: 'https://example.com/course5.jpg',
    rating: 4.8,
    learners: 13400,
    lessons: []
  },
  {
    id: 'course-6',
    title: 'Secure Web Browsing Habits',
    description: 'Develop safe browsing habits. Learn about HTTPS, safe downloads, and browser security settings.',
    category: 'web',
    duration: '45m',
    progress: 0,
    level: 'Beginner',
    tags: ['Web Security', 'Browser Safety', 'HTTPS'],
    image: 'https://example.com/course6.jpg',
    rating: 4.7,
    learners: 16200,
    lessons: []
  },
  {
    id: 'course-7',
    title: 'Data Privacy Fundamentals',
    description: 'Understand the basics of data privacy. Learn how to protect your personal information online and offline.',
    category: 'privacy',
    duration: '60m',
    progress: 0,
    level: 'Beginner',
    tags: ['Privacy', 'Data Protection', 'Security'],
    image: 'https://example.com/course7.jpg',
    rating: 4.9,
    learners: 14800,
    lessons: []
  },
  {
    id: 'course-8',
    title: 'Malware Protection Strategies',
    description: 'Learn effective strategies to protect against malware, viruses, and ransomware. Understand prevention and recovery methods.',
    category: 'security',
    duration: '1h 30m',
    progress: 0,
    level: 'Intermediate',
    tags: ['Malware', 'Antivirus', 'Security'],
    image: 'https://example.com/course8.jpg',
    rating: 4.8,
    learners: 12600,
    lessons: []
  }
];

export default mockCourses; 