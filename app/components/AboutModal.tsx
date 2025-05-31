import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking,
} from 'react-native';
import { X, Mail, MapPin, School, Github } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

interface TeamMemberProps {
  name: string;
  role: string;
  email: string;
  github?: string;
}

const TeamMember = ({ name, role, email, github }: TeamMemberProps) => (
  <View style={styles.teamMember}>
    <View style={styles.memberImageContainer}>
      <Text style={styles.memberImageText}>
        {name.split(' ').map(n => n[0]).join('')}
      </Text>
    </View>
    <Text style={styles.memberName}>{name}</Text>
    <Text style={styles.memberRole}>{role}</Text>
    <View style={styles.memberContacts}>
      <TouchableOpacity onPress={() => Linking.openURL(`mailto:${email}`)}>
        <Mail size={16} color={Colors.dark.primary} />
      </TouchableOpacity>
      {github && (
        <TouchableOpacity onPress={() => Linking.openURL(`https://github.com/${github}`)}>
          <Github size={16} color={Colors.dark.primary} />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const teamMembers = [
  {
    name: "Name Surname",
    role: "Frontend Developer",
    email: "student1@astanait.edu.kz",
    github: "github-username1",
  },
  {
    name: "Name Surname",
    role: "Backend Developer",
    email: "student2@astanait.edu.kz",
    github: "github-username2",
  },
  {
    name: "Name Surname",
    role: "UI/UX Designer",
    email: "student3@astanait.edu.kz",
    github: "github-username3",
  },
];

export default function AboutModal({ visible, onClose }: AboutModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>About Defenzo</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.dark.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Our Mission</Text>
              <Text style={styles.text}>
                Defenzo is dedicated to making cybersecurity education accessible, engaging, and effective for everyone. We believe that in today's digital world, understanding cybersecurity is not just for professionals – it's an essential life skill.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What We Offer</Text>
              <Text style={styles.text}>
                • Interactive learning paths tailored to your skill level{'\n'}
                • Real-world scenarios and practical exercises{'\n'}
                • Industry-recognized certifications{'\n'}
                • Hands-on labs and simulations{'\n'}
                • Regular content updates reflecting the latest threats{'\n'}
                • Community-driven learning environment
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Meet Our Team</Text>
              <Text style={styles.subtitle}>Group CS-2207, Astana IT University</Text>
              <View style={styles.teamGrid}>
                {teamMembers.map((member, index) => (
                  <TeamMember key={index} {...member} />
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Our University</Text>
              <View style={styles.universityInfo}>
                <View style={styles.infoRow}>
                  <School size={20} color={Colors.dark.primary} />
                  <Text style={styles.infoText}>Astana IT University</Text>
                </View>
                <View style={styles.infoRow}>
                  <MapPin size={20} color={Colors.dark.primary} />
                  <Text style={styles.infoText}>EXPO Business Center, Block C.1{'\n'}Mangilik El avenue 55/11{'\n'}Astana, Kazakhstan</Text>
                </View>
              </View>
            </View>

            <View style={[styles.section, styles.versionSection]}>
              <Text style={styles.versionText}>Version 1.0.0</Text>
              <Text style={styles.copyrightText}>© 2024 Defenzo. All rights reserved.</Text>
              <Text style={styles.projectText}>Diploma Project 2024</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  modalTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
  },
  closeButton: {
    padding: Layout.spacing.xs,
  },
  content: {
    padding: Layout.spacing.lg,
  },
  section: {
    marginBottom: Layout.spacing.xl,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: Colors.dark.primary,
    marginBottom: Layout.spacing.md,
  },
  text: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    lineHeight: 24,
  },
  subtitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    opacity: 0.8,
    marginBottom: Layout.spacing.lg,
    textAlign: 'center',
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  teamMember: {
    alignItems: 'center',
    width: '45%',
    marginBottom: Layout.spacing.xl,
  },
  memberImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  memberImageText: {
    color: Colors.dark.text,
    fontSize: fontSizes.lg,
    fontFamily: fonts.heading,
  },
  memberName: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginBottom: 2,
  },
  memberRole: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.6,
    marginBottom: Layout.spacing.xs,
  },
  memberContacts: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
  },
  universityInfo: {
    backgroundColor: Colors.dark.background,
    borderRadius: Layout.borderRadius.medium,
    padding: Layout.spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.md,
    gap: Layout.spacing.md,
  },
  infoText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    flex: 1,
  },
  versionSection: {
    marginTop: Layout.spacing.xl,
    marginBottom: Layout.spacing.md,
    alignItems: 'center',
  },
  versionText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.6,
  },
  copyrightText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.6,
    marginTop: Layout.spacing.xs,
  },
  projectText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: Colors.dark.primary,
    marginTop: Layout.spacing.xs,
  },
}); 