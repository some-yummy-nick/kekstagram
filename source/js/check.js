define(function() {
 /**
  * @param {*} a - параметр для анализа
  * @param {*} b - параметр для анализа
  * @returns {number} - сумма произведений a и b
  */
  var multyplyArrays = function (a, b) {
    "use strict";
    var result = 0;

    for (var i = 0, l = a.length; i < l; i++) {
      result += a[i] * b[i];
    }

    return result;
  };

  /**
   * @param {*} a - параметр для анализа
   * @returns {number} - сумма
   */
var sum = function (a) {
    var result = 0;
    for (var i = 0; i < a.length; i++) {
        result += a[i];
    }

    return result;
};
  /**
   * @param {*} a - параметр для анализа
   * @param {*} b - параметр для анализа
   * @returns {string} - сообщение
   */
var getMessage = function (a, b) { // функция для подсчета статистики по разным типам изображений
    if (typeof (a) == 'boolean') {
        if (a == true) {
            return "Переданное GIF-изображение анимировано и содержит " + b + " кадров";
        } else {
            return "Переданное GIF-изображение не анимировано";
        }
    } else if (typeof (a) == 'number') {
        return "Переданное SVG-изображение содержит " + a + " объектов и " + b * 4 + " аттрибутов";
    } else if (typeof (a) == 'object') { // для массивов
        if (typeof (b) == 'object') {
            return "Общая площадь артефактов сжатия: " + multyplyArrays(a, b) + " пикселей";
        } else {
            return "Количество красных точек во всех строчках изображения: " + sum(a);
        }
    }
};
});
