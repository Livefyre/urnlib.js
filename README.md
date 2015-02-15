# urnlib.js
A library for handling Livefyre URNs.

## Example
    urnlib = require("urnlib");
    var urnStr = 'urn:livefyre:network=livefyre.com:site=123456:collection=100000';
    var urn = urnlib.parse(urnStr);
