import { AbstractPlugin } from "../../src/plugin-host/plugin/plugin";
import { PLUGIN_EVENT } from "../../src/plugin-host/plugin-events/plugin-event-types"
import { UserScoreChangedPluginEventArguments } from "../../src/plugin-host/plugin-events/event-arguments/user-score-changed-plugin-event-arguments";
import { PrePostMessagePluginEventArguments } from "../../src/plugin-host/plugin-events/event-arguments/pre-post-message-plugin-event-arguments";
import { LeaderboardResetPluginEventArguments } from "../../src/plugin-host/plugin-events/event-arguments/leaderboard-reset-plugin-event-arguments";
import { NoArgumentsPluginEventArguments } from "../../src/plugin-host/plugin-events/event-arguments/no-arguments-plugin-event-arguments";
import { Leaderboard } from "../../src/chat/leaderboard/leaderboard";
import * as fs from 'fs';

class ExtendedLeaderboardEntry {
  private timestamp: number;
  private id: number;
  private change: number;

  constructor(_id: number, _change: number)
  {
    this.timestamp = Math.round(+new Date()/1000);
    this.id = _id;
    this.change = _change;
  }
}

interface IExtendedLeaderboard 
{
  entries: ExtendedLeaderboardEntry[];
}

class ExtendedLeaderboard implements IExtendedLeaderboard {
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
    this.entries = _literal.entries;
  }
  
  public RegisterUpdate(_id: number, _change: number)
  {
    this.entries.push(new ExtendedLeaderboardEntry(_id, _change));
  }
}

/**
 * Example of the simplest DankTimesBot
 * plugin. Can be used as a template to
 * build new plugins.
 */
export class Plugin extends AbstractPlugin
{
  protected Data: () => ExtendedLeaderboard = () => super.Data;

  /**
   * A plugin should call its base constructor to
   * provide it with an identifier, a version
   * and some optional data.
   */
  constructor()
  {
    super("Extended Leaderboards", "0.0.1", {});

    this.subscribeToPluginEvent(PLUGIN_EVENT.PLUGIN_EVENT_POST_INIT, (_data: NoArgumentsPluginEventArguments) => 
    {
      if(fs.existsSync(`./data/plugins/${this.PID()}/data.json`))
      {
        let existingdata: IExtendedLeaderboard = JSON.parse(fs.readFileSync(`./data/plugins/${this.PID()}/data.json`, 'utf8'));
        if(existingdata)
        {
          super.Data = new ExtendedLeaderboard();
          (<ExtendedLeaderboard>super.Data).FromLiteral(existingdata);
        }
        else
        {
          super.Data = new ExtendedLeaderboard();
          (<ExtendedLeaderboard>super.Data).FromLeaderboard(this.Services().Leaderboard());
        }
      }
      else
      {
        super.Data = new ExtendedLeaderboard();
        this.Data().RegisterUpdate(194823227, 5);
        this.Data().RegisterUpdate(194823227, 5);
        this.Data().RegisterUpdate(194823227, 5);
      }
    });

    this.subscribeToPluginEvent(PLUGIN_EVENT.PLUGIN_EVENT_USER_CHANGED_SCORE, (_data: UserScoreChangedPluginEventArguments) =>
    {
        this.Data().RegisterUpdate(_data.User.id, _data.ChangeInScore);
      return [];
    });
    this.subscribeToPluginEvent(PLUGIN_EVENT.PLUGIN_EVENT_LEADERBOARD_RESET, (_data: LeaderboardResetPluginEventArguments) =>
    {
      return [`The leaderboard was reset for chat: ${_data.Chat.id}`];
    });
    this.subscribeToPluginEvent(PLUGIN_EVENT.PLUGIN_EVENT_DANKTIMES_SHUTDOWN, (_data: NoArgumentsPluginEventArguments) => 
    {
      console.log("Shutting down plugin! " + this.Name);
      if(!fs.existsSync('./data/plugins'))
        fs.mkdirSync(`./data/plugins`);
      if(!fs.existsSync(`./data/plugins/`))
        fs.mkdirSync(`./data/plugins/`);
      if(!fs.existsSync(`./data/plugins//${this.PID()}`))
        fs.mkdirSync(`./data/plugins/${this.PID()}`);

      fs.writeFileSync(`./data/plugins/${this.PID()}/data.json`, JSON.stringify(this.Data()));
    });

    this.registerCommand("extendedleaderboard", (_params: string[]) => 
    {
      return [`${JSON.stringify(this.Data())}`];
    });
  }
} 