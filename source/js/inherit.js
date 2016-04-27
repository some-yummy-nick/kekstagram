'use strict';
  /**
   * Наследует один объект от другого
   * @param {function} child - Конструктор потомка
   * @param {function} parent - Конструктор предка
   */
  var inherit =  function(child, parent) {
    var EmptyConstructor = function() {};
    EmptyConstructor.prototype = parent.prototype;
    child.prototype = new EmptyConstructor();
  }
  module.exports = inherit;

