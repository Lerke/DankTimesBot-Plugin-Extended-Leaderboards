import { IExtendedLeaderboard } from "./i-extended-leaderboard";
import { ExtendedLeaderboardEntry } from "./extended-leaderboard-entry";
import { Leaderboard } from "../../../../src/chat/leaderboard/leaderboard";
import { EXTENDED_LEADERBOARD_TIME_SEGMENT } from "./extended-leaderboard-time-segment";

export class ExtendedLeaderboard implements IExtendedLeaderboard {
  entries: ExtendedLeaderboardEntry[];

  constructor()
  {
    this.entries = [];

  }

  public FromLeaderboard(_initial: Leaderboard): void
  {
    let initRoot: ExtendedLeaderboardEntry[] = [];
    this.entries = [];
    _initial.entries.forEach(entry => {
      this.entries.push(new ExtendedLeaderboardEntry(entry.id, entry.score));
    });
  }

  public FromLiteral(_literal: IExtendedLeaderboard)
  {
    this.entries = _literal.entries.map(x => new ExtendedLeaderboardEntry(x.id, x.change));
  }
  
  public RegisterUpdate(_id: number, _change: number)
  {
    this.entries.push(new ExtendedLeaderboardEntry(_id, _change));
  }

  public CalculateScoreDiff(_intervalStart: number, _intervalEnd: number): ExtendedLeaderboardEntry[]
  {
    return this.entries.filter(x => x.timestamp >= _intervalStart).filter(x => x.timestamp <= _intervalEnd);
  }

  public CalculateDateDifference(_intervalStart: Date, _intervalEnd: Date): ExtendedLeaderboardEntry[]
  {
    return this.entries.filter(x => x.timestamp >= Math.round((+_intervalStart/1000))).filter(x => x.timestamp <= Math.round((+_intervalEnd/1000)));
  }

  public CalculatePresetDifference(_intervalType: EXTENDED_LEADERBOARD_TIME_SEGMENT, _count: number)
  {
    let intervalStart: number = 0;
    let intervalEnd: number = 0;

    switch(_intervalType)
    {
      case EXTENDED_LEADERBOARD_TIME_SEGMENT.HOUR:
        intervalEnd = Math.round((+new Date()/1000));
        intervalStart = intervalEnd + (86400 * _count);
      break;
      case EXTENDED_LEADERBOARD_TIME_SEGMENT.DAY:
      break;
      case EXTENDED_LEADERBOARD_TIME_SEGMENT.WEEK:
      break;
      case EXTENDED_LEADERBOARD_TIME_SEGMENT.MONTH:
      break;
      case EXTENDED_LEADERBOARD_TIME_SEGMENT.YEAR:
      break;
    }
  }
}