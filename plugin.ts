import { AbstractPlugin } from "../../src/plugin-host/plugin/plugin";
import { PLUGIN_EVENT } from "../../src/plugin-host/plugin-events/plugin-event-types"
import { UserScoreChangedPluginEventArguments } from "../../src/plugin-host/plugin-events/event-arguments/user-score-changed-plugin-event-arguments";
import { PrePostMessagePluginEventArguments } from "../../src/plugin-host/plugin-events/event-arguments/pre-post-message-plugin-event-arguments";
import { LeaderboardResetPluginEventArguments } from "../../src/plugin-host/plugin-events/event-arguments/leaderboard-reset-plugin-event-arguments";
import { NoArgumentsPluginEventArguments } from "../../src/plugin-host/plugin-events/event-arguments/no-arguments-plugin-event-arguments";
import { Leaderboard } from "../../src/chat/leaderboard/leaderboard";
import * as fs from 'fs';
import { ExtendedLeaderboard } from "./model/extended-leaderboard/extended-leaderboard";
import { IExtendedLeaderboard } from "./model/extended-leaderboard/i-extended-leaderboard";
import { ExtendedLeaderboardEntry } from "./model/extended-leaderboard/extended-leaderboard-entry";
import { EXTENDED_LEADERBOARD_TIME_SEGMENT } from "./model/extended-leaderboard/extended-leaderboard-time-segment";




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
      let diff: ExtendedLeaderboardEntry[] = this.Data().CalculateScoreDiff(0, Math.round(+new Date()/1000));
      let diffMap: Map<number, number> = new Map<number, number>();
      diff.forEach(element => {
        diffMap.set(element.id, (diffMap.has(element.id) ? diffMap.get(element.id) : 0) + element.change);
      });

      let Usermap: Map<number, string> = new Map<number, string>();
      diffMap.forEach((value, key) => {
        Usermap.set(key, this.Services().Users().find(x => x.id == key).name);
      });

      let rt = "EXTENDED LEADERBOARD\n";
        diffMap.forEach((value, key) => {
          rt += `${Usermap.get(key)}: ${value >= 0 ? "+" : "-" }${value}`;
        })
      return [rt];
    });
  }
} 