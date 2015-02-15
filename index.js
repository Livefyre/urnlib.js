module.exports = (function(app) {
    var URN = function(parts) {
        this.parts = parts || [];
    };

    URN.prototype.toString = function() {
        var stringParts = ['urn', 'livefyre'];
        for (var i = 0; i < this.parts.length; i++) {
            var part = this.parts[i];
            if (part[0]) {
                stringParts.push(part[0] + '=' + part[1]);
            } else {
                stringParts.push(part[1]);
            }
        }
        return stringParts.join(':');
    };

    URN.prototype.add = function(type, id) {
        this.parts.push([type, id]);
    };

    URN.prototype.getParent = function(nLevels) {
        if (nLevels === undefined) {
            nLevels = 1;
        }
        return new URN(this.parts.slice(0, this.parts.length - nLevels));
    };

    URN.prototype.getParentByName = function(name) {
        for (var i = 1; i <= this.parts.length; i++) {
            if (this.parts[this.parts.length - i][0] == name) {
                return this.getParent(i - 1);
            }
        }
    };

    URN.prototype.getType = function() {
        return this.parts[this.parts.length - 1][0]
    };

    URN.prototype.getId = function() {
        return this.parts[this.parts.length - 1][1]
    };

    URN.prototype.contains = function(urnOrUrnString) {
        var urn = urnOrUrnString;
        if (typeof urn === 'string') {
            urn = parse(urn);
        }

        var len = urn.parts.length;

        // Every resource of this object should be part of input urn.
        return this.parts.every(function(part, idx) {
            if (idx >= len) {
                return false;
            }

            if (part.length !== urn.parts[idx].length) {
                return false;
            }

            return part.every(function(u, i) {
                return u === urn.parts[idx][i];
            });
        });
    };

    var parse = function(urn) {
        var parts = urn.split(':');
        var result = [];

        if (parts[0] == 'urn') {
            parts = parts.slice(2);
        }
        for (var i = 0; i < parts.length; i++) {
            var compParts = parts[i].split('=');
            if (compParts.length == 2) {
                result.push(compParts);
            } else {
                result.push([null, compParts]);
            }

        }
        return new URN(result);
    };

    var fromUrlPath = function(path) {
        var chain = [];
        path.split("/").forEach(function(part, idx) {
            if (idx % 2 == 0) {
                chain.push(part);
                chain.push(":");
            } else {
                chain.push(part);
                chain.push("=");
            }
        });
        return parse(chain.slice(0, -1).join(''));
    };
    
    return {
        parse: parse,
        fromUrlPath: fromUrlPath,
        URN: URN
    };
})();