import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Modal } from 'react-native';
import Colors from '@/constants/Colors';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  triggeredBy?: string;
}

interface Response {
  id: string;
  text: string;
  outcome: string;
  nextResponses: string[];
}

interface Scenario {
  title: string;
  description: string;
  messages: Message[];
  responses: Response[];
  outcomes: {
    good: {
      title: string;
      description: string;
    };
    bad: {
      title: string;
      description: string;
    };
    neutral: {
      title: string;
      description: string;
    };
  };
}

interface ChatSimulationProps {
  content: {
    scenario: Scenario;
  };
  onComplete: () => void;
}

export const ChatSimulation: React.FC<ChatSimulationProps> = ({ content, onComplete }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [availableResponses, setAvailableResponses] = useState<Response[]>([]);
  const [showOutcome, setShowOutcome] = useState(false);
  const [outcome, setOutcome] = useState<{ title: string; description: string } | null>(null);

  useEffect(() => {
    // Initialize with the first message and first set of responses
    setMessages([content.scenario.messages[0]]);
    setAvailableResponses(content.scenario.responses.slice(0, 4));
  }, [content]);

  const handleResponse = (response: Response) => {
    // Add user's response to messages
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: response.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMessage]);

    // Find and add the next message
    const nextMessage = content.scenario.messages.find(msg => msg.triggeredBy === response.id);
    if (nextMessage) {
      setTimeout(() => {
        setMessages(prev => [...prev, nextMessage]);
        
        // Update available responses based on the selected response's nextResponses
        if (response.nextResponses.length > 0) {
          const nextAvailableResponses = content.scenario.responses.filter(r => 
            response.nextResponses.includes(r.id)
          );
          setAvailableResponses(nextAvailableResponses);
        } else {
          // If no next responses, show outcome
          setOutcome(content.scenario.outcomes[response.outcome as keyof typeof content.scenario.outcomes]);
          setShowOutcome(true);
        }
      }, 1000);
    } else {
      // If no next message, show outcome
      setOutcome(content.scenario.outcomes[response.outcome as keyof typeof content.scenario.outcomes]);
      setShowOutcome(true);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.dark.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors.dark.text }]}>{content.scenario.title}</Text>
        <Text style={[styles.description, { color: Colors.dark.text }]}>
          {content.scenario.description}
        </Text>
      </View>

      <ScrollView style={styles.messagesContainer}>
        {messages.map(message => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.sender === 'user' ? styles.userMessage : styles.otherMessage,
            ]}
          >
            <Text style={[styles.messageText, { color: Colors.dark.text }]}>{message.text}</Text>
            <Text style={[styles.timestamp, { color: Colors.dark.text }]}>{message.timestamp}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.responsesContainer}>
        {availableResponses.map(response => (
          <TouchableOpacity
            key={response.id}
            style={[styles.responseButton, { backgroundColor: Colors.dark.primary }]}
            onPress={() => handleResponse(response)}
          >
            <Text style={styles.responseText}>{response.text}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={showOutcome} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={[styles.outcomeContainer, { backgroundColor: Colors.dark.card }]}>
            <Text style={[styles.outcomeTitle, { color: Colors.dark.text }]}>{outcome?.title}</Text>
            <Text style={[styles.outcomeDescription, { color: Colors.dark.text }]}>
              {outcome?.description}
            </Text>
            <TouchableOpacity
              style={[styles.completeButton, { backgroundColor: Colors.dark.primary }]}
              onPress={onComplete}
            >
              <Text style={styles.completeButtonText}>Complete Lesson</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    opacity: 0.8,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 16,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.dark.primary,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.dark.card,
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  responsesContainer: {
    gap: 8,
  },
  responseButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  responseText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  outcomeContainer: {
    padding: 24,
    borderRadius: 12,
    maxWidth: '80%',
    alignItems: 'center',
  },
  outcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  outcomeDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  completeButton: {
    padding: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 