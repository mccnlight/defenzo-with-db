import { Lock, ShieldCheck, Globe, Smartphone } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export type Course = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  progress: number;
  lessons: Lesson[];
  image?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  achievements?: Achievement[];
  rating: number;
  learners: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'dialog' | 'cards' | 'scenario' | 'visual' | 'quiz';
  duration: string;
  content: LessonContent;
  completed?: boolean;
}

export interface LessonContent {
  introduction?: string;
  questions?: Question[];
  scenarios?: Scenario[];
  visualTasks?: VisualTask[];
  quiz?: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'true_false';
  options?: string[];
  correctAnswer: string | boolean;
  explanation: string;
}

export interface Scenario {
  id: string;
  situation: string;
  options: string[];
  correctOption: number;
  explanation: string;
}

export interface VisualTask {
  id: string;
  image: string;
  hotspots: Hotspot[];
}

export interface Hotspot {
  id: string;
  x: number;
  y: number;
  size: number;
  title: string;
  description: string;
}

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Essential Cybersecurity Practices',
    description: 'Learn the fundamentals of cybersecurity through interactive exercises and real-world scenarios.',
    category: 'basics',
    duration: '30',
    progress: 0,
    level: 'Beginner',
    tags: ['Security Basics', 'Office Safety', 'Best Practices'],
    image: 'https://example.com/course1.jpg',
    rating: 4.8,
    learners: 12500,
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
        duration: '5',
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
        }
      },
      {
        id: 'lesson-2',
        title: 'Security Facts Check',
        type: 'cards',
        duration: '5',
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
        duration: '10',
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
        duration: '5',
        content: {
          visualTasks: [
            {
              id: 'vt1',
              image: 'office-scene.jpg',
              hotspots: [
                {
                  id: 'hs1',
                  x: 30,
                  y: 40,
                  size: 20,
                  title: 'Exposed Password',
                  description: 'Passwords should never be visible on sticky notes or screens.'
                },
                {
                  id: 'hs2',
                  x: 60,
                  y: 70,
                  size: 20,
                  title: 'Unlocked Computer',
                  description: 'Always lock your computer when stepping away.'
                }
              ]
            }
          ]
        },
        completed: false
      },
      {
        id: 'lesson-5',
        title: 'Final Assessment',
        type: 'quiz',
        duration: '5',
        content: {
          quiz: [
            {
              id: 'q1',
              text: 'Which practice improves office security?',
              type: 'multiple_choice',
              options: [
                'Sharing passwords',
                'Regular security updates',
                'Using simple passwords',
                'Disabling firewalls'
              ],
              correctAnswer: 'Regular security updates',
              explanation: 'Regular updates help protect against new security threats.'
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
    duration: '45',
    progress: 0,
    level: 'Beginner',
    tags: ['Passwords', '2FA', 'Security'],
    image: 'https://example.com/course2.jpg',
    rating: 4.9,
    learners: 15800,
    lessons: [
      {
        id: 'lesson-1',
        title: 'Password Fundamentals',
        type: 'dialog',
        duration: '10',
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
        }
      }
    ]
  },
  {
    id: 'course-3',
    title: 'Phishing Attack Prevention',
    description: 'Learn to identify and avoid phishing attacks. Protect yourself from email and social engineering threats.',
    category: 'basics',
    duration: '60',
    progress: 0,
    level: 'Intermediate',
    tags: ['Phishing', 'Email Security', 'Social Engineering'],
    image: 'https://example.com/course3.jpg',
    rating: 4.7,
    learners: 9300,
    lessons: []
  },
  {
    id: 'course-4',
    title: 'Mobile Device Security',
    description: 'Secure your smartphones and tablets. Learn about app permissions, device encryption, and safe browsing.',
    category: 'mobile',
    duration: '90',
    progress: 0,
    level: 'Beginner',
    tags: ['Mobile', 'Apps', 'Device Security'],
    image: 'https://example.com/course4.jpg',
    rating: 4.6,
    learners: 7200,
    lessons: []
  },
  {
    id: 'course-5',
    title: 'Social Engineering Defense',
    description: 'Learn to recognize and defend against social engineering attacks. Understand manipulation techniques and prevention strategies.',
    category: 'basics',
    duration: '75',
    progress: 0,
    level: 'Intermediate',
    tags: ['Social Engineering', 'Security Awareness', 'Prevention'],
    image: 'https://example.com/course5.jpg',
    rating: 4.8,
    learners: 8500,
    lessons: []
  },
  {
    id: 'course-6',
    title: 'Secure Web Browsing Habits',
    description: 'Develop safe browsing habits. Learn about HTTPS, safe downloads, and browser security settings.',
    category: 'web',
    duration: '45',
    progress: 0,
    level: 'Beginner',
    tags: ['Web Security', 'Browser Safety', 'HTTPS'],
    image: 'https://example.com/course6.jpg',
    rating: 4.7,
    learners: 11200,
    lessons: []
  },
  {
    id: 'course-7',
    title: 'Data Privacy Fundamentals',
    description: 'Understand the basics of data privacy. Learn how to protect your personal information online and offline.',
    category: 'basics',
    duration: '60',
    progress: 0,
    level: 'Beginner',
    tags: ['Privacy', 'Data Protection', 'Security'],
    image: 'https://example.com/course7.jpg',
    rating: 4.9,
    learners: 13400,
    lessons: []
  },
  {
    id: 'course-8',
    title: 'Malware Protection Strategies',
    description: 'Learn effective strategies to protect against malware, viruses, and ransomware. Understand prevention and recovery methods.',
    category: 'basics',
    duration: '90',
    progress: 0,
    level: 'Intermediate',
    tags: ['Malware', 'Antivirus', 'Security'],
    image: 'https://example.com/course8.jpg',
    rating: 4.8,
    learners: 10600,
    lessons: []
  }
];

export default mockCourses; 