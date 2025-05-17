import { Lock, ShieldCheck, Globe, Smartphone } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Course, Lesson, LessonContent, Achievement, Question, Scenario, VisualTask, Hotspot } from '@/types/course';

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Cyber Hygiene Basics',
    description: 'Master essential digital hygiene habits to protect yourself online. Learn secure daily practices, threat awareness, and basic security measures.',
    category: 'basics',
    duration: '90m',
    progress: 0,
    level: 'Beginner',
    tags: ['Digital Hygiene', 'Online Safety', 'Security Basics'],
    image: 'https://example.com/cyber-hygiene.jpg',
    rating: 4.8,
    learners: 12500,
    recommended: true,
    achievements: [
      {
        id: 'ach1',
        title: 'Online Clean Freak',
        description: 'Master the basics of digital hygiene',
        icon: '🧹',
        progress: 0
      }
    ],
    lessons: [
      {
        id: 'lesson-1',
        title: 'Digital Hygiene Fundamentals',
        type: 'dialog',
        duration: '15m',
        content: {
          introduction: 'Welcome to your journey towards better digital hygiene! Let\'s start by understanding the core concepts and why they matter in today\'s connected world.',
          questions: [
            {
              id: 'q1',
              text: 'What is digital hygiene?',
              type: 'multiple_choice',
              options: [
                'Cleaning your computer screen regularly',
                'Regular practices to maintain digital security and privacy',
                'Using antivirus software only',
                'Having a fast internet connection'
              ],
              correctAnswer: 'Regular practices to maintain digital security and privacy',
              explanation: 'Digital hygiene involves all the regular practices and habits that help maintain your digital security and privacy, similar to how personal hygiene keeps you healthy.'
            }
          ]
        },
        completed: false
      },
      {
        id: 'lesson-2',
        title: 'Safe Browsing Habits',
        type: 'cards',
        duration: '15m',
        content: {
          questions: [
            {
              id: 'tf1',
              text: 'HTTPS websites are more secure than HTTP websites',
              type: 'true_false',
              correctAnswer: true,
              explanation: 'HTTPS encrypts data transmission between your browser and the website, making it more secure than unencrypted HTTP connections.'
            },
            {
              id: 'tf2',
              text: 'It\'s safe to download files from any website that offers them',
              type: 'true_false',
              correctAnswer: false,
              explanation: 'Only download files from trusted sources to avoid malware. Unknown sources may distribute harmful software.'
            }
          ]
        },
        completed: false
      },
      {
        id: 'lesson-3',
        title: 'Device Maintenance',
        type: 'scenario',
        duration: '20m',
        content: {
          scenarios: [
            {
              id: 'sc1',
              situation: 'Your device is running slow and showing unexpected pop-ups. What should you do first?',
              options: [
                'Run a full system scan with your antivirus',
                'Ignore it and continue working',
                'Download a speed booster app from an ad',
                'Reset your device immediately'
              ],
              correctOption: 0,
              explanation: 'Running a system scan helps identify potential malware causing these issues. Always use trusted security software for scans.'
            },
            {
              id: 'sc2',
              situation: 'You receive a notification that a system update is available. What\'s the best action?',
              options: [
                'Install it right away',
                'Ignore it completely',
                'Wait a few months to install',
                'Only install if your device stops working'
              ],
              correctOption: 0,
              explanation: 'Regular system updates are crucial for security. They often contain important security patches and bug fixes.'
            }
          ]
        },
        completed: false
      },
      {
        id: 'lesson-4',
        title: 'Security Settings Check',
        type: 'visual',
        duration: '20m',
        content: {
          visualTasks: [
            {
              id: 'vt1',
              title: 'Find Security Risks',
              description: 'Identify potential security risks in these device settings. Click on the areas that need attention.',
              image: 'security-settings.jpg',
              hotspots: [
                {
                  id: 'hs1',
                  x: 30,
                  y: 40,
                  size: 20,
                  title: 'Outdated Software',
                  description: 'System updates are pending for over 30 days, leaving your device vulnerable to known security issues.'
                },
                {
                  id: 'hs2',
                  x: 60,
                  y: 70,
                  size: 20,
                  title: 'Weak Privacy Settings',
                  description: 'Location services are enabled for all apps, potentially exposing your location data unnecessarily.'
                },
                {
                  id: 'hs3',
                  x: 45,
                  y: 55,
                  size: 20,
                  title: 'App Permissions',
                  description: 'Several apps have unnecessary permissions that could compromise your privacy.'
                }
              ]
            }
          ]
        },
        completed: false
      },
      {
        id: 'lesson-5',
        title: 'Data Backup Strategies',
        type: 'dialog',
        duration: '10m',
        content: {
          introduction: 'Learn how to protect your valuable data through regular backups and proper storage practices.',
          questions: [
            {
              id: 'q1',
              text: 'What is the 3-2-1 backup rule?',
              type: 'multiple_choice',
              options: [
                'Have 3 copies, on 2 different media types, with 1 copy offsite',
                'Backup 3 times a day, 2 times a week, 1 time a month',
                'Use 3 devices, 2 clouds, and 1 external drive',
                'Backup data for 3 days, 2 weeks, and 1 month'
              ],
              correctAnswer: 'Have 3 copies, on 2 different media types, with 1 copy offsite',
              explanation: 'The 3-2-1 backup rule is a best practice that ensures your data survives various types of disasters.'
            }
          ]
        },
        completed: false
      },
      {
        id: 'lesson-6',
        title: 'Digital Footprint Awareness',
        type: 'visual',
        duration: '10m',
        content: {
          visualTasks: [
            {
              id: 'vt1',
              title: 'Track Your Digital Trail',
              description: 'Discover how your online activities leave traces and learn to manage them.',
              image: 'digital-footprint.jpg',
              hotspots: [
                {
                  id: 'hs1',
                  x: 25,
                  y: 35,
                  size: 20,
                  title: 'Social Media Activity',
                  description: 'Your likes, comments, and shares create a permanent record of your interests and opinions.'
                },
                {
                  id: 'hs2',
                  x: 75,
                  y: 45,
                  size: 20,
                  title: 'Search History',
                  description: 'Your search queries can reveal personal information and browsing patterns.'
                },
                {
                  id: 'hs3',
                  x: 50,
                  y: 65,
                  size: 20,
                  title: 'Online Shopping',
                  description: 'Purchase history and browsing patterns are tracked and stored by retailers.'
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
    title: 'Password & Account Protection',
    description: 'Master the art of secure password creation and management. Learn about two-factor authentication and advanced account security measures.',
    category: 'security',
    duration: '75m',
    progress: 0,
    level: 'Intermediate',
    tags: ['Passwords', '2FA', 'Account Security'],
    image: 'https://example.com/password-protection.jpg',
    rating: 4.9,
    learners: 15800,
    recommended: true,
    achievements: [
      {
        id: 'ach2',
        title: 'Password Keeper',
        description: 'Master of secure password management',
        icon: '🔐',
        progress: 0
      }
    ],
    lessons: [
      {
        id: 'lesson-1',
        title: 'Password Creation Mastery',
        type: 'dialog',
        duration: '15m',
        content: {
          introduction: 'Learn the art of creating strong, memorable passwords that keep your accounts secure.',
          questions: [
            {
              id: 'q1',
              text: 'Which of these passwords is the strongest?',
              type: 'multiple_choice',
              options: [
                'Password123!',
                'MyBirthday1990',
                'Tr0ub4dor&3',
                'correct-horse-battery-staple'
              ],
              correctAnswer: 'correct-horse-battery-staple',
              explanation: 'Long passphrases are more secure and easier to remember than complex short passwords. This example uses four random words, creating high entropy while remaining memorable.'
            }
          ]
        },
        completed: false
      },
      {
        id: 'lesson-2',
        title: 'Password Manager Setup',
        type: 'visual',
        duration: '15m',
        content: {
          visualTasks: [
            {
              id: 'vt1',
              title: 'Password Manager Features',
              description: 'Learn to use a password manager effectively by identifying key features.',
              image: 'password-manager.jpg',
              hotspots: [
                {
                  id: 'hs1',
                  x: 30,
                  y: 40,
                  size: 20,
                  title: 'Password Generator',
                  description: 'Creates strong, random passwords tailored to website requirements.'
                },
                {
                  id: 'hs2',
                  x: 70,
                  y: 30,
                  size: 20,
                  title: 'Security Dashboard',
                  description: 'Monitors password strength and alerts you to compromised accounts.'
                }
              ]
            }
          ]
        },
        completed: false
      },
      {
        id: 'lesson-3',
        title: '2FA Implementation',
        type: 'scenario',
        duration: '15m',
        content: {
          scenarios: [
            {
              id: 'sc1',
              situation: 'You\'re setting up 2FA for your email. Which method should you choose?',
              options: [
                'SMS codes',
                'Authenticator app',
                'Email to backup address',
                'Security questions'
              ],
              correctOption: 1,
              explanation: 'Authenticator apps are more secure than SMS, which can be intercepted through SIM swapping attacks.'
            },
            {
              id: 'sc2',
              situation: 'You\'ve lost your phone with your 2FA authenticator app. What should you do?',
              options: [
                'Panic and create new accounts',
                'Use backup codes stored securely',
                'Wait for the phone to be found',
                'Contact the phone manufacturer'
              ],
              correctOption: 1,
              explanation: 'Always save backup codes in a secure location when setting up 2FA to handle device loss or failure.'
            }
          ]
        },
        completed: false
      },
      {
        id: 'lesson-4',
        title: 'Account Recovery Setup',
        type: 'dialog',
        duration: '15m',
        content: {
          introduction: 'Learn how to set up secure account recovery methods to prevent lockouts.',
          questions: [
            {
              id: 'q1',
              text: 'What is the safest way to store recovery codes?',
              type: 'multiple_choice',
              options: [
                'In a password manager',
                'Written on a sticky note',
                'In your email drafts',
                'As a phone contact'
              ],
              correctAnswer: 'In a password manager',
              explanation: 'A password manager provides encrypted storage and is more secure than physical notes or unencrypted digital storage.'
            }
          ]
        },
        completed: false
      },
      {
        id: 'lesson-5',
        title: 'Security Key Protection',
        type: 'visual',
        duration: '15m',
        content: {
          visualTasks: [
            {
              id: 'vt1',
              title: 'Hardware Security Keys',
              description: 'Learn about hardware security keys and how they provide superior account protection.',
              image: 'security-keys.jpg',
              hotspots: [
                {
                  id: 'hs1',
                  x: 35,
                  y: 45,
                  size: 20,
                  title: 'USB Connection',
                  description: 'Physical connection ensures presence and prevents remote attacks.'
                },
                {
                  id: 'hs2',
                  x: 65,
                  y: 55,
                  size: 20,
                  title: 'NFC Capability',
                  description: 'Enables secure authentication with mobile devices.'
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
    id: 'course-3',
    title: 'Phishing & Social Defense',
    description: 'Learn to identify and protect against phishing attempts and social engineering tactics. Master the art of digital self-defense.',
    category: 'security',
    duration: '90m',
    progress: 0,
    level: 'Intermediate',
    tags: ['Phishing', 'Social Engineering', 'Email Security'],
    image: 'https://example.com/phishing-defense.jpg',
    rating: 4.7,
    learners: 18200,
    recommended: true,
    achievements: [
      {
        id: 'ach3',
        title: 'Anti-Phisher',
        description: 'Expert at detecting phishing attempts',
        icon: '🎣',
        progress: 0
      }
    ],
    lessons: [
      {
        id: 'lesson-1',
        title: 'Phishing Fundamentals',
        type: 'dialog',
        duration: '15m',
        content: {
          introduction: 'Understand what phishing is and why it remains one of the most successful cyber attack methods.',
          questions: [
            {
              id: 'q1',
              text: 'What is phishing?',
              type: 'multiple_choice',
              options: [
                'A type of computer virus',
                'A fraudulent attempt to obtain sensitive information',
                'A network security tool',
                'A password recovery method'
              ],
              correctAnswer: 'A fraudulent attempt to obtain sensitive information',
              explanation: 'Phishing is a cyber attack that tricks users into revealing sensitive information by posing as a trustworthy entity.'
            },
            {
              id: 'q2',
              text: 'Which of these is NOT a common phishing tactic?',
              type: 'multiple_choice',
              options: [
                'Creating urgency',
                'Using official logos',
                'Providing detailed contact information',
                'Having spelling errors'
              ],
              correctAnswer: 'Providing detailed contact information',
              explanation: 'Legitimate organizations provide clear contact information. Phishers often avoid this to prevent verification.'
            }
          ]
        },
        completed: false
      },
      {
        id: 'lesson-2',
        title: 'Email Security',
        type: 'visual',
        duration: '20m',
        content: {
          visualTasks: [
            {
              id: 'vt1',
              title: 'Spot the Phish',
              description: 'Identify suspicious elements in this email that indicate it\'s a phishing attempt.',
              image: 'phishing-email.jpg',
              hotspots: [
                {
                  id: 'hs1',
                  x: 20,
                  y: 30,
                  size: 20,
                  title: 'Suspicious Sender',
                  description: 'The email address doesn\'t match the claimed organization\'s domain.'
                },
                {
                  id: 'hs2',
                  x: 50,
                  y: 60,
                  size: 20,
                  title: 'Urgent Action Required',
                  description: 'Creating false urgency is a common tactic to pressure users into making mistakes.'
                }
              ]
            }
          ]
        },
        completed: false
      },
      {
        id: 'lesson-3',
        title: 'Social Engineering Defense',
        type: 'scenario',
        duration: '20m',
        content: {
          scenarios: [
            {
              id: 'sc1',
              situation: 'You receive a call from someone claiming to be from tech support about your computer having a virus. What do you do?',
              options: [
                'Give them remote access to your computer',
                'Provide your credit card for "security software"',
                'Hang up and contact the company directly',
                'Download the software they recommend'
              ],
              correctOption: 2,
              explanation: 'Always verify the identity of callers by contacting the company through official channels you trust.'
            },
            {
              id: 'sc2',
              situation: 'A colleague sends an urgent email requesting sensitive company data. What should you do?',
              options: [
                'Send the data immediately',
                'Verify the request through a different communication channel',
                'Forward the email to others',
                'Reply asking for more details'
              ],
              correctOption: 1,
              explanation: 'Verify unusual requests through a different channel (phone, in person) to prevent business email compromise attacks.'
            }
          ]
        },
        completed: false
      },
      {
        id: 'lesson-4',
        title: 'Advanced Phishing Tactics',
        type: 'visual',
        duration: '20m',
        content: {
          visualTasks: [
            {
              id: 'vt1',
              title: 'Modern Phishing Techniques',
              description: 'Learn to identify sophisticated phishing attempts that use advanced tactics.',
              image: 'advanced-phishing.jpg',
              hotspots: [
                {
                  id: 'hs1',
                  x: 30,
                  y: 40,
                  size: 20,
                  title: 'Look-alike Domain',
                  description: 'Subtle misspellings or character substitutions in domain names.'
                },
                {
                  id: 'hs2',
                  x: 60,
                  y: 50,
                  size: 20,
                  title: 'SSL Certificate',
                  description: 'Even phishing sites can have HTTPS, don\'t rely solely on this for security.'
                },
                {
                  id: 'hs3',
                  x: 45,
                  y: 70,
                  size: 20,
                  title: 'Clone Phishing',
                  description: 'Exact copies of legitimate emails with modified links or attachments.'
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
    id: 'course-4',
    title: 'Data & Device Protection',
    description: 'Learn advanced techniques for protecting your personal data and devices. Master privacy settings, encryption, and malware defense.',
    category: 'security',
    duration: '120m',
    progress: 0,
    level: 'Advanced',
    tags: ['Data Protection', 'Privacy', 'Malware Defense'],
    image: 'https://example.com/data-protection.jpg',
    rating: 4.8,
    learners: 14500,
    recommended: true,
    achievements: [
      {
        id: 'ach4',
        title: 'Cyber Shield Guardian',
        description: 'Master of data and device protection',
        icon: '🛡️',
        progress: 0
      }
    ],
    lessons: [
      {
        id: 'lesson-1',
        title: 'Data Privacy Fundamentals',
        type: 'dialog',
        duration: '20m',
        content: {
          introduction: 'Understand the importance of data privacy and how to protect your personal information in the digital age.',
          questions: [
            {
              id: 'q1',
              text: 'What constitutes personal data?',
              type: 'multiple_choice',
              options: [
                'Only your name and address',
                'Only financial information',
                'Any information that can identify you',
                'Only your social media posts'
              ],
              correctAnswer: 'Any information that can identify you',
              explanation: 'Personal data includes any information that can be used to identify an individual, directly or indirectly.'
            },
            {
              id: 'q2',
              text: 'Which practice best protects your data privacy?',
              type: 'multiple_choice',
              options: [
                'Sharing everything publicly',
                'Regular privacy audits',
                'Never using the internet',
                'Using public Wi-Fi'
              ],
              correctAnswer: 'Regular privacy audits',
              explanation: 'Regular privacy audits help you maintain control over your data by reviewing and adjusting privacy settings.'
            }
          ]
        },
        completed: false
      },
      {
        id: 'lesson-2',
        title: 'Privacy Settings Mastery',
        type: 'visual',
        duration: '25m',
        content: {
          visualTasks: [
            {
              id: 'vt1',
              title: 'Privacy Settings Check',
              description: 'Learn to configure privacy settings across different platforms and services.',
              image: 'privacy-settings.jpg',
              hotspots: [
                {
                  id: 'hs1',
                  x: 30,
                  y: 40,
                  size: 20,
                  title: 'Data Sharing Options',
                  description: 'Control what information apps can access and share.'
                },
                {
                  id: 'hs2',
                  x: 60,
                  y: 70,
                  size: 20,
                  title: 'Account Privacy',
                  description: 'Manage who can see your information and activity.'
                }
              ]
            }
          ]
        },
        completed: false
      },
      {
        id: 'lesson-3',
        title: 'Malware Protection',
        type: 'scenario',
        duration: '25m',
        content: {
          scenarios: [
            {
              id: 'sc1',
              situation: 'Your antivirus detects a suspicious file. What should you do?',
              options: [
                'Quarantine and analyze the file',
                'Ignore the warning',
                'Delete the file immediately',
                'Share the file to check if it\'s safe'
              ],
              correctOption: 0,
              explanation: 'Quarantining allows for safe analysis while preventing potential damage. Always investigate suspicious files properly.'
            },
            {
              id: 'sc2',
              situation: 'You notice your device is mining cryptocurrency without your permission. What\'s your first step?',
              options: [
                'Disconnect from the internet',
                'Continue using the device normally',
                'Only use safe mode',
                'Format the device immediately'
              ],
              correctOption: 0,
              explanation: 'Disconnecting prevents the malware from communicating with its control servers and limits damage.'
            }
          ]
        },
        completed: false
      },
      {
        id: 'lesson-4',
        title: 'Encryption Basics',
        type: 'dialog',
        duration: '25m',
        content: {
          introduction: 'Learn about data encryption and how it protects your information from unauthorized access.',
          questions: [
            {
              id: 'q1',
              text: 'Why is encryption important?',
              type: 'multiple_choice',
              options: [
                'To make files larger',
                'To protect data from unauthorized access',
                'To share files faster',
                'To save storage space'
              ],
              correctAnswer: 'To protect data from unauthorized access',
              explanation: 'Encryption converts data into a coded form that only authorized parties can access, ensuring confidentiality.'
            },
            {
              id: 'q2',
              text: 'What should you encrypt?',
              type: 'multiple_choice',
              options: [
                'Only financial documents',
                'Only photos and videos',
                'All sensitive personal data',
                'Only work files'
              ],
              correctAnswer: 'All sensitive personal data',
              explanation: 'Any data that could be valuable to attackers or harmful if exposed should be encrypted.'
            }
          ]
        },
        completed: false
      },
      {
        id: 'lesson-5',
        title: 'Secure Data Disposal',
        type: 'visual',
        duration: '15m',
        content: {
          visualTasks: [
            {
              id: 'vt1',
              title: 'Data Deletion Methods',
              description: 'Learn proper techniques for securely disposing of sensitive data.',
              image: 'data-disposal.jpg',
              hotspots: [
                {
                  id: 'hs1',
                  x: 25,
                  y: 35,
                  size: 20,
                  title: 'File Shredding',
                  description: 'Simple deletion doesn\'t remove data completely. Use secure deletion tools.'
                },
                {
                  id: 'hs2',
                  x: 75,
                  y: 45,
                  size: 20,
                  title: 'Device Wiping',
                  description: 'Proper device sanitization before disposal or recycling.'
                },
                {
                  id: 'hs3',
                  x: 50,
                  y: 65,
                  size: 20,
                  title: 'Cloud Data',
                  description: 'Remember to remove data from cloud services and backups.'
                }
              ]
            }
          ]
        },
        completed: false
      }
    ]
  }
];

export default mockCourses; 