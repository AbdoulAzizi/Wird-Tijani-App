import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartBar as BarChart3, Trophy, Calendar, Flame, Star, Award } from 'lucide-react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientHeader from '../../components/GradientHeader';
import { useApp } from '../../contexts/AppContext';
import ScreenBackground from '../../components/ScreenBackground';
import Toast from 'react-native-root-toast';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode; // <-- corrigé
  unlocked: boolean;
  progress: string;
}

function getAchievements(
  totalWirds: number,
  totalWazifas: number,
  totalHadras: number,
  currentStreak: number
): Achievement[] {
  return [
    { id: 'first-steps', title: 'First Steps', description: 'Complete your first Wird', icon: <Star color="#EAB308" size={24} />, unlocked: totalWirds >= 1, progress: `${Math.min(totalWirds,1)}/1` },
    { id: 'dedicated-disciple', title: 'Dedicated Disciple', description: 'Maintain a 7-day streak', icon: <Flame color="#EAB308" size={24} />, unlocked: currentStreak >= 7, progress: `${Math.min(currentStreak,7)}/7` },
    { id: 'community-member', title: 'Community Member', description: 'Complete 5 Friday Wazīfas', icon: <Trophy color="#EAB308" size={24} />, unlocked: totalWazifas >= 5, progress: `${Math.min(totalWazifas,5)}/5` },
    { id: 'spiritual-warrior', title: 'Spiritual Warrior', description: 'Complete 30 Wirds', icon: <Award color="#EAB308" size={24} />, unlocked: totalWirds >= 30, progress: `${Math.min(totalWirds,30)}/30` },
    { id: 'steadfast-soul', title: 'Steadfast Soul', description: 'Maintain a 30-day streak', icon: <Award color="#EAB308" size={24} />, unlocked: currentStreak >= 30, progress: `${Math.min(currentStreak,30)}/30` },
  ];
}

export default function StatsScreen() {
  const { state } = useApp();
  const [activeConfettiId, setActiveConfettiId] = useState<string | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);

  const totalWirds = state.completedWirds.length;
  const totalWazifas = state.completedWazifas.length;
  const totalHadras = state.completedHadras.length;

  const totalIstighfar = totalWirds * 100 + totalWazifas * 30;
  const totalSalatAlFatih = totalWirds * 100 + totalWazifas * 50;
  const totalTahlil = totalWirds * 100 + totalWazifas * 100 + totalHadras * state.hadraTargets.tahlil;
  const totalIsmullah = totalHadras * state.hadraTargets.ismuLlah;
  const totalJawhara = totalWazifas * 12;

  const currentStreak = 5;
  const weeklyGoal = 14;
  const weeklyProgress = Math.min(totalWirds % weeklyGoal, weeklyGoal);

  const achievements = getAchievements(totalWirds, totalWazifas, totalHadras, currentStreak);

  // Charger achievements déjà débloqués depuis AsyncStorage
  useEffect(() => {
    const loadUnlocked = async () => {
      const stored = await AsyncStorage.getItem('unlockedAchievements');
      if (stored) setUnlockedAchievements(JSON.parse(stored));
    };
    loadUnlocked();
  }, []);

  // Vérifier les nouveaux unlocks
  useEffect(() => {
    achievements.forEach(async a => {
      if (a.unlocked && !unlockedAchievements.includes(a.id)) {
        setActiveConfettiId(a.id);
        Toast.show(`${a.title} unlocked! 🎉`, { duration: Toast.durations.SHORT });

        // Sauvegarder dans AsyncStorage
        const updated = [...unlockedAchievements, a.id];
        setUnlockedAchievements(updated);
        await AsyncStorage.setItem('unlockedAchievements', JSON.stringify(updated));
      }
    });
  }, [achievements, unlockedAchievements]);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenBackground>
        <GradientHeader
          arabicTitle="الإحصائيات"
          englishTitle="Spiritual Progress"
          subtitle="Track Your Journey"
          icon={<BarChart3 color="#FFFFFF" size={32} />}
        />

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Progress Cards */}
          <View style={styles.progressSection}>
            <View style={styles.progressCard}>
              <View style={styles.progressIcon}><Flame color="#FFFFFF" size={24} /></View>
              <Text style={styles.progressNumber}>{currentStreak}</Text>
              <Text style={styles.progressLabel}>Day Streak</Text>
              <Text style={styles.progressSubtext}>Keep up the excellent work!</Text>
            </View>

            <View style={styles.progressCard}>
              <View style={styles.progressIcon}><Calendar color="#FFFFFF" size={24} /></View>
              <Text style={styles.progressNumber}>{weeklyProgress}/{weeklyGoal}</Text>
              <Text style={styles.progressLabel}>This Week</Text>
              <Text style={styles.progressSubtext}>Wirds completed</Text>
            </View>
          </View>

          {/* Stats Overview */}
          <View style={styles.statsContainer}>
            <Text style={[styles.sectionTitle, { color: '#1F2937' }]}>Overview</Text>
            {[
              ['Total Wirds', totalWirds],
              ['Total Wazīfas', totalWazifas],
              ['Total Ḥadras', totalHadras],
              ['Istighfār Recited', totalIstighfar],
              ['Ṣalāt al-Fātiḥ Recited', totalSalatAlFatih],
              ['Tahlil Recited', totalTahlil],
              ['Ismullāh Recited', totalIsmullah],
              ['Jawharas Recited', totalJawhara],
            ].map(([label, value]) => (
              <View key={label} style={styles.statRow}>
                <Text style={styles.statLabel}>{label}</Text>
                <Text style={styles.statValue}>{value}</Text>
              </View>
            ))}
          </View>

          {/* Achievements */}
          <View style={styles.achievementsContainer}>
            <View style={styles.sectionHeader}>
              <Trophy color="#059669" size={24} />
              <Text style={styles.sectionTitle}>Achievements</Text>
            </View>

            {achievements.map(a => (
              <View key={a.id} style={styles.achievementCard}>
                <View style={styles.achievementIcon}>{a.icon}</View>
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementTitle}>{a.title}</Text>
                  <Text style={styles.achievementDescription}>
                    {a.description} {!a.unlocked && `(${a.progress})`}
                  </Text>
                </View>
                <View style={[styles.achievementBadge, { backgroundColor: a.unlocked ? '#EAB308' : '#9CA3AF' }]}>
                  <Text style={styles.achievementStatus}>{a.unlocked ? 'Earned' : 'Locked'}</Text>
                </View>
                {a.unlocked && activeConfettiId === a.id && (
                  <ConfettiCannon count={50} origin={{ x: 100, y: 0 }} fadeOut />
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </ScreenBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollView: { flex: 1 },
  progressSection: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 20, gap: 12 },
  progressCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  progressIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#059669', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  progressNumber: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  progressLabel: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  progressSubtext: { fontSize: 12, color: '#6B7280', textAlign: 'center' },
  statsContainer: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginHorizontal: 16, marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#FFFFFF', marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', gap: 8, marginBottom: 16, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 8, padding: 8, },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  statLabel: { fontSize: 14, color: '#6B7280' },
  statValue: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  achievementsContainer: { paddingHorizontal: 16, marginTop: 20 },
  achievementCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12 },
  achievementIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  achievementContent: { flex: 1 },
  achievementTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  achievementDescription: { fontSize: 14, color: '#6B7280' },
  achievementBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  achievementStatus: { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },
});
