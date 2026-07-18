/**
 * Knowledge Intelligence Engine Types
 */

export interface KnowledgeState {
  knowledgeMatch: number; // 0-100
  matchedPatterns: string[];
  rejectedPatterns: string[];
  institutionalRules: string[];
  otcBehaviour: string;
  psychologyContext: string;
  recommendations: string[];
  conflictingKnowledge: string[];
  knowledgeInfluence: number; // e.g. ±5
}
