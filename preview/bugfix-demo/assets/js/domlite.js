/*!
 * domlite.js - lightweight helper covering the subset of jQuery used by Dungeons of Daggorath UI.
 * This is not a full jQuery replacement; it only implements the methods currently invoked.
 */
(function(global) {
  function toArray(list) {
    return Array.prototype.slice.call(list || []);
  }

  function wrap(nodes) {
    return new Wrapper(nodes);
  }

  function Wrapper(nodes) {
    this.nodes = nodes || [];
  }

  Wrapper.prototype.each = function(fn) {
    this.nodes.forEach(function(node, idx) { fn.call(node, node, idx); });
    return this;
  };

  var defaultDisplayCache = {};

  function getDefaultDisplay(node) {
    var tag = node.tagName.toLowerCase();
    if (!defaultDisplayCache[tag]) {
      var temp = document.createElement(tag);
      document.body.appendChild(temp);
      var display = window.getComputedStyle(temp).display;
      document.body.removeChild(temp);
      defaultDisplayCache[tag] = display === "none" ? "block" : display;
    }
    return defaultDisplayCache[tag];
  }

  Wrapper.prototype.show = function() {
    return this.each(function(node) {
      node.style.display = "";
      if (window.getComputedStyle(node).display === "none") {
        node.style.display = getDefaultDisplay(node);
      }
    });
  };

  Wrapper.prototype.hide = function() {
    return this.each(function(node) {
      node.style.display = "none";
    });
  };

  function normalizePropertyName(name) {
    return name.indexOf("-") !== -1 ? name : name.replace(/([A-Z])/g, "-$1").toLowerCase();
  }

  Wrapper.prototype.css = function(property, value) {
    if (typeof property === "string") {
      var propName = property;
      if (value === undefined) {
        var first = this.nodes[0];
        if (!first) {
          return undefined;
        }
        var computed = window.getComputedStyle(first);
        var normalized = normalizePropertyName(propName);
        var direct = computed[propName];
        return direct !== undefined ? direct : computed.getPropertyValue(normalized);
      }
      return this.each(function(node) {
        if (!node.style) {
          return;
        }
        if (propName.indexOf("-") !== -1) {
          node.style.setProperty(propName, value);
        } else {
          node.style[propName] = value;
        }
      });
    }

    if (property && typeof property === "object") {
      var styles = property;
      return this.each(function(node) {
        if (!node.style) {
          return;
        }
        Object.keys(styles).forEach(function(key) {
          var val = styles[key];
          if (key.indexOf("-") !== -1) {
            node.style.setProperty(key, val);
          } else {
            node.style[key] = val;
          }
        });
      });
    }

    return this;
  };

  Wrapper.prototype.click = function(handler) {
    return this.each(function(node) {
      node.addEventListener("click", handler);
    });
  };

  Wrapper.prototype.text = function(value) {
    if (value === undefined) {
      return this.nodes.length ? this.nodes[0].textContent : "";
    }
    return this.each(function(node) {
      node.textContent = value;
    });
  };

  Wrapper.prototype.empty = function() {
    return this.each(function(node) {
      node.innerHTML = "";
    });
  };

  Wrapper.prototype.append = function(child) {
    return this.each(function(node) {
      if (child instanceof Wrapper) {
        child.nodes.forEach(function(c) {
          node.appendChild(c);
        });
      } else if (child instanceof Node) {
        node.appendChild(child);
      } else if (typeof child === "string") {
        node.insertAdjacentHTML("beforeend", child);
      }
    });
  };

  Wrapper.prototype.ready = function(handler) {
    if (typeof handler === "function") {
      $(handler);
    }
    return this;
  };

  Wrapper.prototype.hideAndShow = function(method) {
    return this[method]();
  };

  function createElementFromString(str) {
    var match = str.match(/^<([a-z0-9\-]+)\/>$/i) || str.match(/^<([a-z0-9\-]+)>$/i);
    if (match) {
      return document.createElement(match[1]);
    }
    return null;
  }

  function $(selector) {
    if (typeof selector === "function") {
      if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(selector, 0);
      } else {
        document.addEventListener("DOMContentLoaded", selector);
      }
      return wrap([]);
    }

    if (selector instanceof Wrapper) {
      return selector;
    }

    if (selector instanceof Node || selector === window || selector === document) {
      return wrap([selector]);
    }

    if (typeof selector === "string") {
      selector = selector.trim();
      if (selector[0] === "<" && selector[selector.length - 1] === ">") {
        var element = createElementFromString(selector);
        if (element) {
          return wrap([element]);
        }
      }
      return wrap(toArray(document.querySelectorAll(selector)));
    }

    if (selector && selector.length !== undefined) {
      return wrap(toArray(selector));
    }

    return wrap([]);
  }

  $.fn = Wrapper.prototype;

  $.ready = function(fn) {
    $(fn);
  };

  global.$ = $;
})(window);
