export interface OfficeDetail {
  id: string; // e.g. 'cyberjaya', 'malta', 'kigali', 'dubai', 'limassol', 'asuncion'
  name: string;
  city: string;
  country: string;
  timezone: string; // e.g. 'Asia/Kuala_Lumpur', 'Europe/Malta', 'Africa/Kigali', 'Asia/Dubai', 'Asia/Nicosia', 'America/Asuncion'
  temp: number;
  weatherDesc: string;
  lunchMenu: string[];
  localTrivia: string;
  localSlang: { expression: string; meaning: string; pronunciation: string }[];
}

export type BadgeType = 'Bug Squasher' | 'Code Craftsman' | 'Helpful Hero' | 'PR Guru' | 'Coffee Buddy' | 'Creative Catalyst' | 'Zen Master' | 'Lego Master';

export interface KudosCheers {
  id: string;
  senderName: string;
  senderOffice: string;
  recipientName: string;
  recipientOffice: string;
  badge: BadgeType;
  message: string;
  timestamp: string;
  likes: number;
}

export interface OfficePoll {
  id: string;
  question: string;
  options: { label: string; votes: number; id: string }[];
  totalVotes: number;
  userVotedId?: string;
}

export interface CoffeeMatch {
  id: string;
  timestamp: string;
  status: 'searching' | 'matched' | 'idle';
  userOffice: string;
  matchedName?: string;
  matchedOffice?: string;
  matchedRole?: string;
  matchedEmail?: string;
  avatarColor?: string;
}

export interface ChatInteractionLog {
  id: string;
  timestamp: string;
  role: 'user' | 'model';
  text: string;
}

export interface ScannerLog {
  id: string;
  timestamp: string;
  level: "info" | "success" | "warn" | "error";
  message: string;
}
