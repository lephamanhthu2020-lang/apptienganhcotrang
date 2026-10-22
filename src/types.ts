export type UserRole = 'student' | 'teacher' | 'parent' | 'judge';

export type GradeLevel = 1 | 2 | 3 | 4 | 5;

export type DifferentiatedTier = 'support' | 'core' | 'advanced';

export interface VocabularyItem {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  imageUrl?: string;
  category?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  audioPrompt?: string;
  imageUrl?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DialogueTurn {
  id: string;
  speaker: 'Buddy' | 'Student';
  english: string;
  vietnamese: string;
  suggestedReply?: string[];
}

export interface IslandStage {
  id: string;
  title: string;
  subtitle: string;
  gradeLevel: GradeLevel;
  iconName: string;
  colorTheme: string;
  unlocked: boolean;
  completed: boolean;
  starsEarned: number;
  vocabularies: VocabularyItem[];
  dialogue: DialogueTurn[];
  questions: QuizQuestion[];
  listeningExercise: {
    audioText: string;
    question: string;
    options: string[];
    correctIndex: number;
  };
}

export interface StudentProfile {
  id: string;
  name: string;
  nickname: string;
  avatarSeed: string;
  gradeLevel: GradeLevel;
  className: string;
  studentCode: string;
  parentPhone?: string;
  initialSurveyScore?: number;
  initialTier?: DifferentiatedTier;
  currentTier?: DifferentiatedTier;
  stars: number;
  streakDays: number;
  completedStages: string[];
  vocabularyMastered: string[];
  badges: StudentBadge[];
  speakingScores: { date: string; target: string; score: number }[];
}

export interface StudentBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface CreativeProject {
  id: string;
  studentId: string;
  studentName: string;
  topic: string;
  title: string;
  caption: string;
  stickers: string[];
  bgColor: string;
  createdAt: string;
  status: 'draft' | 'submitted' | 'approved';
  teacherFeedback?: string;
  starsAwarded?: number;
}

export interface HomeworkAssignment {
  id: string;
  title: string;
  className: string;
  targetTier?: 'all' | DifferentiatedTier;
  stageId: string;
  dueDate: string;
  completedCount: number;
  totalCount: number;
}
