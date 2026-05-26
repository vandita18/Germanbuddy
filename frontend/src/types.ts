export interface VocabularyItem {
  german: string;
  english: string;
  all_translations?: string;
  gender?: string;
  pos?: string;
  frequency_rank?: number;
  example_de?: string;
  example_en?: string;
  level?: string;
}

export interface GrammarItem {
  id: number;
  title: string;
  explanation: string;
  exampleGerman: string;
  exampleEnglish: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

export interface AlphabetItem {
  id: string;
  type: string;
  letter: string;
  name: string;
  pronunciation: string;
  example_word_de: string;
  example_word_en: string;
  ipa: string;
}

export interface User {
  name: string;
  email: string;
  password: string;
}