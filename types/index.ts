export interface LearningMilestone {
  week: number;
  title: string;
  description: string;
  topics: string[];
  resources: string[];
  goal: string;
}

export interface LearningPath {
  title: string;
  description: string;
  totalWeeks: number;
  milestones: LearningMilestone[];
  weeklySchedule: Record<string, string>;
}

export interface Story {
  id: string;
  title: string;
  protagonist: string;
  region: string;
  field: string;
  content: string;
  lesson: string;
  achievement: string;
  emoji: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface UserProfileData {
  educationLevel: string;
  learningGoals: string;
  timeAvailable: string;
  careerDream: string;
  interests: string;
}

export interface LibraryCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
}

export interface LibraryResource {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  language: string;
  duration?: string;
  difficulty?: string;
}

export interface Circle {
  id: string;
  name: string;
  description?: string;
  topic: string;
  maxMembers: number;
  memberCount: number;
}

export interface CirclePost {
  id: string;
  nickname: string;
  content: string;
  createdAt: Date;
}
