import { IExtendedLeaderboardEntry } from "./i-extended-leaderboard-entry";

export class ExtendedLeaderboardEntry implements IExtendedLeaderboardEntry {
  timestamp: number;
  id: number;
  change: number;

  constructor(_id: number, _change: number)
  {
    this.timestamp = Math.round(+new Date()/1000);
    this.id = _id;
    this.change = _change;
  }
}