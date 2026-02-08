
export type CardRole = "red" | "blue" | "neutral" | "assassin";
export type Team = "red" | "blue";
export type ViewMode = "agent" | "spymaster";

export type CardType = {
  word: string;
  role: CardRole;
  revealed: boolean;
};

export type GameState = {
  board: CardType[];
  currentTeam: Team;
  redRemaining: number;
  blueRemaining: number;
  winner: Team | null;
  gameOver: boolean;
  viewMode: ViewMode;
};
