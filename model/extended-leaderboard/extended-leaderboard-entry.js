"use strict";
exports.__esModule = true;
var ExtendedLeaderboardEntry = /** @class */ (function () {
    function ExtendedLeaderboardEntry(_id, _change) {
        this.timestamp = Math.round(+new Date() / 1000);
        this.id = _id;
        this.change = _change;
    }
    return ExtendedLeaderboardEntry;
}());
exports.ExtendedLeaderboardEntry = ExtendedLeaderboardEntry;
