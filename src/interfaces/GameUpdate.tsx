  export default interface GameUpdate {
    gameId: string;
    teamId: string;
    quarter: 1 | 2 | 3 | 4;
    minLeft: number;
    secLeft: number;
    score: 1 | 2 | 3;
  }