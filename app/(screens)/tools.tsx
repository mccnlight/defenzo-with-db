import { useBadgeStore } from '@/app/store/badgeStore';

export default function ToolsScreen() {
  const { checkAndAwardBadges } = useBadgeStore();

  const handlePasswordCheck = async (password: string) => {
    try {
      // Existing password check logic
      const result = await checkPassword(password);
      setPasswordResult(result);
      
      // Award badge for using password checker
      await checkAndAwardBadges('tool_usage', {
        tool_type: 'password_checker'
      });
    } catch (error) {
      console.error('Failed to check password:', error);
    }
  };

  const handleUrlCheck = async (url: string) => {
    try {
      // Existing URL check logic
      const result = await checkUrl(url);
      setUrlResult(result);
      
      // Award badge for using URL scanner
      await checkAndAwardBadges('tool_usage', {
        tool_type: 'url_scanner'
      });
    } catch (error) {
      console.error('Failed to check URL:', error);
    }
  };

  const handleEmailCheck = async (email: string) => {
    try {
      // Existing email check logic
      const result = await checkEmail(email);
      setEmailResult(result);
      
      // Award badge for using email checker
      await checkAndAwardBadges('tool_usage', {
        tool_type: 'email_checker'
      });
    } catch (error) {
      console.error('Failed to check email:', error);
    }
  };

  // ... rest of the code ...
} 