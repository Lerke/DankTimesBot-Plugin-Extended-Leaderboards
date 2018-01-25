"use strict";
exports.__esModule = true;
var extended_leaderboard_entry_1 = require("./extended-leaderboard-entry");
var ExtendedLeaderboard = /** @class */ (function () {
    function ExtendedLeaderboard() {
        this.entries = [];
    }
    ExtendedLeaderboard.prototype.FromLeaderboard = function (_initial) {
        var _this = this;
        var initRoot = [];
        this.entries = [];
        _initial.entries.forEach(function (entry) {
            _this.entries.push(new extended_leaderboard_entry_1.ExtendedLeaderboardEntry(entry.id, entry.score));
        });
    };
    ExtendedLeaderboard.prototype.FromLiteral = function (_literal) {
        this.entries = _literal.entries.map(function (x) { return new extended_leaderboard_entry_1.ExtendedLeaderboardEntry(x.id, x.change); });
    };
    ExtendedLeaderboard.prototype.RegisterUpdate = function (_id, _change) {
        this.entries.push(new extended_leaderboard_entry_1.ExtendedLeaderboardEntry(_id, _change));
    };
    ExtendedLeaderboard.prototype.CalculateScoreDiff = function (_intervalStart, _intervalEnd) {
        return this.entries.filter(function (x) { return x.timestamp >= _intervalStart; }).filter(function (x) { return x.timestamp <= _intervalEnd; });
    };
    return ExtendedLeaderboard;
}());
exports.ExtendedLeaderboard = ExtendedLeaderboard;
