import GameDetail from "./interfaces/GameDetail";

export const games: GameDetail[] = [
    {
      id: 'game1',
      homeId: 'Denver Nuggets',
      homeName: 'Denver Nuggets',
      homeScore: 0,
      homeLogo: 'https://upload.wikimedia.org/wikipedia/en/7/76/Denver_Nuggets.svg',
      awayId: 'Boston Celtics',
      awayName: 'Boston Celtics',
      awayScore: 0,
      awayLogo: 'https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg',
      status: 'live',
    },
  
    {
      id: 'game2',
      homeId: 'Los Angeles Lakers',
      homeName: 'Los Angeles Lakers',
      homeScore: 0,
      homeLogo: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Los_Angeles_Lakers_logo.svg',
      awayId: 'Chicago Bulls',
      awayName: 'Chicago Bulls',
      awayScore: 0,
      awayLogo: 'https://upload.wikimedia.org/wikipedia/en/6/67/Chicago_Bulls_logo.svg',
      status: 'live',
    },
  ]