'use strict';
var inherit = require("./inherit"),
    PhotoBase = require("./PhotoBase");
    
    new PhotoBase();
  /**
   * Конструктор фотографии в общем списке
   * @constructor
   */
  function Photo() {
    this.onPhotoClick = this.onPhotoClick.bind(this);
  }
  inherit(Photo, PhotoBase);
  /**
   * Отображение DOM-элемента по шаблону для фотографии в списке
   * @method
   * @override
   */
  Photo.prototype.render = function() {
    var template = document.querySelector('#picture-template');
    if ('content' in template ) {
      this.element = template.content.childNodes[1].cloneNode(true);
    } else {
      this.element = template.childNodes[1].cloneNode(true);
    }

    this.element.querySelector('.picture-comments').textContent = this._data.comments;
    this.element.querySelector('.picture-likes').textContent = this._data.likes;
    var backgroundImage = new Image();
    var imageLoadTimeout;
    backgroundImage.onload = function() {
      clearTimeout(imageLoadTimeout);
      var elementImage = this.element.querySelector('img');
      this.element.replaceChild(backgroundImage, elementImage);
      backgroundImage.width = 182;
    }.bind(this);
    backgroundImage.onerror = function() {
      this.element.classList.add('picture-load-failure');
    }.bind(this);
    backgroundImage.src = this._data.url;
    var IMAGE_TIMEOUT = 10000;
    imageLoadTimeout = setTimeout(function() {
      backgroundImage.src = '';
      this.element.classList.add('picture-load-failure');
    }.bind(this), IMAGE_TIMEOUT);

    this.element.addEventListener('click', this.onPhotoClick);
  };
  /**
   * Обработчик клика по фотографии в общем списке фотографий
   * @method
   * @listens click
   * @param evt
   * @override
   */
  Photo.prototype.onPhotoClick = function(evt) {
    evt.preventDefault();
    if (
      this.element.classList.contains('picture') &&
      !this.element.classList.contains('picture-load-failure')
    ) {
      if (typeof this.onClick === 'function') {
        this.onClick();
      }
    }
  };
  /**
   * Метод удаления обработчиков событий с DOM-элемента фотографии и удаления элемента из DOM-дерева
   * @method
   * @override
   */
  Photo.prototype.remove = function() {
    this.element.addEventListener('click', this.onPhotoClick);
  };
  module.exports = Photo;



