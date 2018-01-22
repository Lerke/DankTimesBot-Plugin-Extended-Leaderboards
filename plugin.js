"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var plugin_1 = require("../../src/plugin-host/plugin/plugin");
var plugin_event_types_1 = require("../../src/plugin-host/plugin-events/plugin-event-types");
/**
 * Example of auxiliary data classes.
 */
var ExamplePluginData = /** @class */ (function () {
    function ExamplePluginData() {
        this.TestNumber = 0;
    }
    return ExamplePluginData;
}());
/**
 * Example of the simplest DankTimesBot
 * plugin. Can be used as a template to
 * build new plugins.
 */
var Plugin = /** @class */ (function (_super) {
    __extends(Plugin, _super);
    /**
     * A plugin should call its base constructor to
     * provide it with an identifier, a version
     * and some optional data.
     */
    function Plugin() {
        var _this = _super.call(this, "Example Plugin", "1.0.0", {}) || this;
        // Example of sample data
        _this.Data = new ExamplePluginData();
        _this.Data.TestNumber = 1;
        _this.subscribeToPluginEvent(plugin_event_types_1.PLUGIN_EVENT.PLUGIN_EVENT_PRE_MESSAGE, function (_data) {
            return "Example of a Pre Message Event";
        });
        _this.subscribeToPluginEvent(plugin_event_types_1.PLUGIN_EVENT.PLUGIN_EVENT_USER_CHANGED_SCORE, function (_data) {
            return "A player changed score! Player: " + _data.User.name + ", change: " + _data.ChangeInScore;
        });
        _this.subscribeToPluginEvent(plugin_event_types_1.PLUGIN_EVENT.PLUGIN_EVENT_POST_MESSAGE, function (_data) {
            return "Example of a Post Message Event";
        });
        _this.subscribeToPluginEvent(plugin_event_types_1.PLUGIN_EVENT.PLUGIN_EVENT_LEADERBOARD_RESET, function (_data) {
            return "The leaderboard was reset for chat: " + _data.Chat.id;
        });
        _this.subscribeToPluginEvent(plugin_event_types_1.PLUGIN_EVENT.PLUGIN_EVENT_TIMER_TICK, function (_data) {
            return "Example of a timer tick event with saved Plugin State! Here's your number: " + _this.Data.TestNumber++;
        });
        _this.subscribeToPluginEvent(plugin_event_types_1.PLUGIN_EVENT.PLUGIN_EVENT_DANKTIMES_SHUTDOWN, function (_data) {
            console.log("Shutting down plugin! " + _this.Name);
        });
        return _this;
    }
    return Plugin;
}(plugin_1.AbstractPlugin));
exports.Plugin = Plugin;
