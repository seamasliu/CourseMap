(function outer(modules, cache, entries){

  /**
   * Global
   */

  var global = (function(){ return this; })();

  /**
   * Require `name`.
   *
   * @param {String} name
   * @param {Boolean} jumped
   * @api public
   */

  function require(name, jumped){
    if (cache[name]) return cache[name].exports;
    if (modules[name]) return call(name, require);
    throw new Error('cannot find module "' + name + '"');
  }

  /**
   * Call module `id` and cache it.
   *
   * @param {Number} id
   * @param {Function} require
   * @return {Function}
   * @api private
   */

  function call(id, require){
    var m = cache[id] = { exports: {} };
    var mod = modules[id];
    var name = mod[2];
    var fn = mod[0];

    fn.call(m.exports, function(req){
      var dep = modules[id][1][req];
      return require(dep ? dep : req);
    }, m, m.exports, outer, modules, cache, entries);

    // expose as `name`.
    if (name) cache[name] = cache[id];

    return cache[id].exports;
  }

  /**
   * Require all entries exposing them on global if needed.
   */

  for (var id in entries) {
    if (entries[id]) {
      global[entries[id]] = require(id);
    } else {
      require(id);
    }
  }

  /**
   * Duo flag.
   */

  require.duo = true;

  /**
   * Expose cache.
   */

  require.cache = cache;

  /**
   * Expose modules
   */

  require.modules = modules;

  /**
   * Return newest require.
   */

   return require;
})({
1: [function(require, module, exports) {
var insights = require('ignacioola/insights')

}, {"ignacioola/insights":2}],
2: [function(require, module, exports) {
var minstache = require("minstache");

function Tooltip(options) {
    options = options || {};
    //this.template = options.template;
    this._data = {};

    this._createElement();

    try {
        this.renderTemplate = minstache.compile(options.template);
    } catch(err) {
        throw new Error("Error parsing tooltip template.", err);
    }
}

Tooltip.prototype = {
    constructor: Tooltip,
    elementId: "insights-tooltip",
    elementClass: "insights-tooltip",

    _createElement: function() {
        var found = document.getElementById(this.elementId);

        if (!found) {
            this.el = document.createElement("div");

            this.el.id = this.elementId;
            this.el.className = this.elementClass;
            this.el.style.position = "absolute";
            this.el.style.display = "none";
            document.body.appendChild(this.el);
        } else {
            this.el = found;
        }
    },

    render: function() {
        var content = this.renderTemplate(this.getData());

        if (!this._offset) throw new Error("Must set an offset");
        
        this.el.innerHTML = content;
        this.el.style.top = this._offset.top + "px";
        this.el.style.left = this._offset.left + "px";
        
        return this;
    },

    setOffset: function(offset) {
        this._offset = offset;
    },

    setData: function(data) {
        this._data = data;
    },

    getData: function() {
        return this._data;
    },

    show: function(offset, data) {
        offset && this.setOffset(offset);
        data && this.setData(data);
        this.render();

        this.el.style.display = "";
    },

    hide: function() {
        this.el.style.display = "none";
    }
};

module.exports = Tooltip;

}, {"minstache":3}],
3: [function(require, module, exports) {

/**
 * Expose `render()`.`
 */

exports = module.exports = render;

/**
 * Expose `compile()`.
 */

exports.compile = compile;

/**
 * Render the given mustache `str` with `obj`.
 *
 * @param {String} str
 * @param {Object} obj
 * @return {String}
 * @api public
 */

function render(str, obj) {
  obj = obj || {};
  var fn = compile(str);
  return fn(obj);
}

/**
 * Compile the given `str` to a `Function`.
 *
 * @param {String} str
 * @return {Function}
 * @api public
 */

function compile(str) {
  var js = [];
  var toks = parse(str);
  var tok;

  for (var i = 0; i < toks.length; ++i) {
    tok = toks[i];
    if (i % 2 == 0) {
      js.push('"' + tok.replace(/"/g, '\\"') + '"');
    } else {
      switch (tok[0]) {
        case '/':
          tok = tok.slice(1);
          js.push(' }) + ');
          break;
        case '^':
          tok = tok.slice(1);
          assertProperty(tok);
          js.push(' + section(obj, "' + tok + '", true, function(obj){ return ');
          break;
        case '#':
          tok = tok.slice(1);
          assertProperty(tok);
          js.push(' + section(obj, "' + tok + '", false, function(obj){ return ');
          break;
        case '!':
          tok = tok.slice(1);
          assertProperty(tok);
          js.push(' + obj.' + tok + ' + ');
          break;
        default:
          assertProperty(tok);
          js.push(' + escape(obj.' + tok + ') + ');
      }
    }
  }

  js = '\n'
    + indent(escape.toString()) + ';\n\n'
    + indent(section.toString()) + ';\n\n'
    + '  return ' + js.join('').replace(/\n/g, '\\n');

  return new Function('obj', js);
}

/**
 * Assert that `prop` is a valid property.
 *
 * @param {String} prop
 * @api private
 */

function assertProperty(prop) {
  if (!prop.match(/^[\w.]+$/)) throw new Error('invalid property "' + prop + '"');
}

/**
 * Parse `str`.
 *
 * @param {String} str
 * @return {Array}
 * @api private
 */

function parse(str) {
  return str.split(/\{\{|\}\}/);
}

/**
 * Indent `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function indent(str) {
  return str.replace(/^/gm, '  ');
}

/**
 * Section handler.
 *
 * @param {Object} context obj
 * @param {String} prop
 * @param {Function} thunk
 * @param {Boolean} negate
 * @api private
 */

function section(obj, prop, negate, thunk) {
  var val = obj[prop];
  if (Array.isArray(val)) return val.map(thunk).join('');
  if ('function' == typeof val) return val.call(obj, thunk(obj));
  if (negate) val = !val;
  if (val) return thunk(obj);
  return '';
}

/**
 * Escape the given `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

function escape(html) {
  return String(html)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

}, {}]}, {}, {"1":""})
