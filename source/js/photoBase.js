'use strict';
  /**
   * Базовый конструктор для фотографии
   * @constructor
   */
  function PhotoBase() {}
  /**
   * Данные объекта из JSON
   * @type {Photo[]}
   * @private
   */
  PhotoBase.prototype._data = null;
  /**
   * Метод для отображения фотографии
   * @method
   */
  PhotoBase.prototype.render = function() {};
  /**
   * Метод удаления обработчика клика на фотографии
   * @method
   */
  PhotoBase.prototype.remove = function() {};
  /**
   * Метод события нажатия на фотографию
   * @method
   */
  PhotoBase.prototype.onPhotoClick = function() {};
  /**
   * Метод устанавливает объект-фотографию из JSON
   * @method
   * @param {object} data
   */
  PhotoBase.prototype.setData = function(data) {
    this._data = data;
  };
  /**
   * Метод возвращает объект-фотографию по JSON
   * @method
   * @returns {Photo[]}
   */
  PhotoBase.prototype.getData = function() {
    return this._data;
  };
  /**
   * Callback события нажатия на фотографию
   * @method
   * @type {function}
   */
  PhotoBase.prototype.onClick = null;

 module.exports = PhotoBase;

