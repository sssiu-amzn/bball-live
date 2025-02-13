export default interface GameDetail {
    id: string;
    homeId: string;
    homeName: string;
    homeScore: number;
    homeLogo: string;
    awayId: string;
    awayName: string;
    awayScore: number;
    awayLogo: string;
    status: 'upcoming' | 'live' | 'finished';
  }