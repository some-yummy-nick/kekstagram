(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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


},{}],2:[function(require,module,exports){
'use strict';
  /**
   * Конструктор галереи
   * @constructor
   */
  var Gallery = function() {
    /**
     * Галерея на странице
     * @type {HTMLElement}
     */
    this.element = document.querySelector('.gallery-overlay');
    /**
     * Крест для закрытия галереи
     * @type {HTMLElement}
     */
    this.closeButton = this.element.querySelector('.gallery-overlay-close');
    /**
     * Контейнер для фотографии
     * @type {HTMLElement}
     */
    this.photo = document.querySelector('.gallery-overlay-image');
    /**
     * Контейнер для лайков
     * @type {HTMLElement}
     */
    this.likes = document.querySelector('.gallery-overlay-controls-like');
    /**
     * Количество лайков
     * @type {HTMLElement}
     */
    this.likesCount = document.querySelector('.likes-count');
    /**
     * Контейнер для комментариев
     * @type {HTMLElement}
     */
    this.comments = document.querySelector('.gallery-overlay-controls-comments');
    /**
     * список фотографий из json
     * @type {Array}
     */
    this.pictures = [];
    /**
     * Текущая фотография
     * @type {number}
     */
    this.currentPicture = 0;
    /**
     * Подписка на событие нажатия на крестик для загрытия галереи
     * @type {function(this:Gallery)}
     * @private
     */
    this._onCloseClick = this._onCloseClick.bind(this);
    /**
     * Подписка на событие нажатия клавиши на клавиатуре
     * @type {function(this:Gallery)}
     * @private
     */
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    /**
     * Подписка на событие клика по фотографии
     * @type {function(this:Gallery)}
     * @private
     */
    this._onPhotoClick = this._onPhotoClick.bind(this);
    /**
     * Подписка на событие лайка фотографии
     * @type {function(this:Gallery)}
     * @private
     */
    this._onSetLike = this._onSetLike.bind(this);
    /**
     * Подписка на событие изменение адресной строки
     * @type {function(this:Gallery)}
     * @private
     */
    this._onHashChange = this._onHashChange.bind(this);
  };
  /** @enum {number} */
  var KEYCODE = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };
  /**
   * Вызывающий метод для отображения галереи
   * @method
   */
  Gallery.prototype.render = function() {
    var regexp = /#photo\/(\S+)/;
    location.hash = location.hash.match(regexp) ? '' : 'photo/' + this.pictures[this.currentPicture].url;
    window.addEventListener('hashchange', this._onHashChange);
    this.restoreFromHash.bind(this);
  };
  /**
   * Устанавливает хеш в адресную строку
   * @method
   */
  Gallery.prototype._onHashChange = function() {
    this.restoreFromHash();
  };
  Gallery.prototype.restoreFromHash = function() {
    if ( location.hash === '') {
      this.hide();
    }else {
      this.show();
      this.setCurrentPicture(this.currentPicture);
    }
  };
  /**
   * Основной метод для отображения галереи
   * @method
   */
  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');
    this.closeButton.addEventListener('click', this._onCloseClick);
    this.photo.addEventListener('click', this._onPhotoClick);
    this.likes.addEventListener('click', this._onSetLike);
    window.addEventListener('keydown', this._onDocumentKeyDown);
  };
  /**
   * Основной метод закрытия галереи
   * @method
   */
  Gallery.prototype.hide = function() {
    this.element.classList.add('invisible');
    this.closeButton.removeEventListener('click', this._onCloseClick);
    this.photo.removeEventListener('click', this._onPhotoClick);
    this.likes.removeEventListener('click', this._onSetLike);
    window.removeEventListener('keydown', this._onDocumentKeyDown);
    window.removeEventListener('hashchange', this._onHashChange);
  };
  /**
   * Метод события нажатия на клавишу клавиатуры
   * @method
   * @listens click
   * @param {Event} evt - событие нажатия клавиши
   * @private
   */
  Gallery.prototype._onDocumentKeyDown = function(evt) {
    switch (evt.keyCode) {
      case KEYCODE.ESC:
        location.hash = '';
        break;
      case KEYCODE.LEFT:
        this.setCurrentPicture(this.currentPicture - 1);
        break;
      case KEYCODE.RIGHT:
        this.setCurrentPicture(this.currentPicture + 1);
        break;
    }
    this.setCurrentPicture(this.currentPicture);
  };
  /**
   * Метод массива фотографий из json сохраняет в объекте
   * @method
   * @param {Photo[]} pictures - массив фотографий
   */
  Gallery.prototype.setPictures = function(pictures) {
    this.pictures = pictures;
  };
  /**
   * Метод устанавливает фотографию, которую отображает галерея
   * @method
   *@param {number|string} i - индекс фотографии в массиве или путь до фотографии
   */
  Gallery.prototype.setCurrentPicture = function(i) {
    this.currentPicture = i;
    var picture;
    if (typeof i === 'number') {
      picture = this.pictures[i];
    } else {
      picture = this.pictures[this.getNumberPicture(i)];
    }
    this.photo.src = picture.url;
    this.likes.querySelector('.likes-count').textContent = picture.likes;
    this.comments.querySelector('.comments-count').textContent = picture.comments;

    if (picture.setLike === true) {
      this.likesCount.classList.add('likes-count-liked');
    } else {
      this.likesCount.classList.remove('likes-count-liked');
    }
  };
  /**
   * Метод события нажатия крестика для закрытия фотогалерии
   * @method
   * @listens click
   * @private
   */
  Gallery.prototype._onCloseClick = function() {
    location.hash = '';
  };
  /**
   * Метод события нажатия на фотогалерею
   * @method
   * @listens click
   * @private
   */
  Gallery.prototype._onPhotoClick = function() {
    this.setCurrentPicture(this.currentPicture + 1);
    location.hash = 'photo/' + this.pictures[this.currentPicture].url;

  };
  /**
   * Метод устанавливает объект-фотографию из JSON
   * @method
   * @param {object} data
   */
  Gallery.prototype.setData = function(data) {
    this._data = data;
    this.currentPicture = this.getNumberPicture(data.url);
  };
  /**
   * Метод возвращает номер фотограции в массиве
   * @method
   * @param {string} url - имя фотографии
   * @returns {number}
   */
  Gallery.prototype.getNumberPicture = function(url) {
    for (var i = 0; i < this.pictures.length; i++) {
      if (url === this.pictures[i].url) {
        this.currentPicture = i;
        return i;
      }
    }
  };
  /**
   * Метод лайка на фотографии
   * @method
   * @private
   */
  Gallery.prototype._onSetLike = function() {
    var currentObject = this.pictures[this.currentPicture];
    if (currentObject.setLike !== true) {
      currentObject.likes = currentObject.likes + 1;
      this.likesCount.classList.add('likes-count-liked');
      this.likesCount.innerHTML = currentObject.likes;
      currentObject.setLike = true;
    } else {
      currentObject.likes = currentObject.likes - 1;
      this.likesCount.classList.remove('likes-count-liked');
      this.likesCount.innerHTML = currentObject.likes;
      currentObject.setLike = false;
    }
  };

 module.exports =  Gallery;

},{}],3:[function(require,module,exports){
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


},{}],4:[function(require,module,exports){
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




},{"./PhotoBase":1,"./inherit":3}],5:[function(require,module,exports){
'use strict';
var Photo = require("./photo"),
    Gallery = require("./gallery");
    
    new Photo();
    new Gallery();
  /**
   * document в переменой
   * @type {Element}
   */
  var doc = document;
  /**
   * Контейнер для всех загруженных фотографий
   * @type {Element}
   */
  var container = doc.querySelector('.pictures');
  /**
   * Активный фильтр
   * @type {string}
   */
  var activeFilter = localStorage.getItem('activeFilter') || 'filter-popular';
  /**
   * Массив объектов загруженных фотографий
   * @type {Photo[]}
   */
  var pictures = [];
  /**
   * Массив объектов загруженных фотографий
   * @type {Photo[]}
   */
  var filteredPictures = [];
  /**
   * Массив объектов загруженных фотографий
   * @type {Photo[]}
   */
  var renderedElements = [];
  /**
   * @type (Gallery)
   */
  var gallery = new Gallery();
  /**
   * Текущая страница с фотографиями
   * @type {number}
   */
  var currentPage = 0;
  /**
   * @const
   * @type {number}
   */
  var PAGE_SIZE = 12;
  var LARGE_SCREEN_SIZE = 1367;
  /**
   * Форма с фильтрами
   * @type {Element}
   */
  var filters = doc.querySelector('.filters');
  /**
   * Таймаут для строла
   */
  var scrollTimeout;
  function setFilter() {
    filters.addEventListener('click', function(evt) {
      var clickedElement = evt.target;
      if (clickedElement.classList.contains('filters-radio')) {
        setActiveFilter(clickedElement.id);
      }
    });
  }
  /**
   * Событие скролла
   */
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      var containerCoordinates = container.getBoundingClientRect();
      var viewportSize = window.innerHeight;
      if (containerCoordinates.top <= viewportSize ) {
        if (currentPage < Math.ceil(filteredPictures.length / PAGE_SIZE)) {
          renderPictures(filteredPictures, ++currentPage);
        }
      }
    }, 100);
  });
  /**
   * Проверка на размер экрана
   */
  var windowLarge = function() {
    if (document.body.clientWidth > LARGE_SCREEN_SIZE) {
      if (currentPage < Math.ceil(filteredPictures.length / PAGE_SIZE)) {
        renderPictures(filteredPictures, ++currentPage);
      }
    }
  };
  getPictures();
  setFilter();
  /**
   * Отрисовка картинок
   * @param {Array.<Object>} picturesToRender
   * @param {number} pageNumber - номер страницы отображения
   * @param {boolean} replace - если истина, то удаляет все существующие DOM-элементы с фотографиями
   */
  function renderPictures(picturesToRender, pageNumber, replace) {
    if (replace) {
      var el;
      while ((el = renderedElements.shift())) {
        container.removeChild(el.element);
        el.onClick = null;
        el.remove();
      }

    }
    var fragment = document.createDocumentFragment();
    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var pagePictures = picturesToRender.slice(from, to);
    renderedElements = renderedElements.concat(pagePictures.map(function(picture) {
      var photoElement = new Photo();
      photoElement.setData(picture);
      photoElement.render();
      container.appendChild(photoElement.element);
      photoElement.onClick = function() {
        gallery.setData(photoElement.getData());
        location.hash = '#photo' + '/' + picture.url;
      };
      return photoElement;
    }));
    container.appendChild(fragment);
  }
  filters.classList.remove('hidden');
  /**
   * Установка выбранного фильтра
   * @param {string} id
   * @param {boolean} force
   */
  function setActiveFilter(id, force) {
    if (activeFilter === id && !force) {
      return;
    }
    currentPage = 0;
    var selectedFilter = document.querySelector('#' + activeFilter);
    if (selectedFilter) {
      selectedFilter.setAttribute('checked', 'false');
    }
    document.querySelector('#' + id).setAttribute('checked', 'true');
    filteredPictures = pictures.slice(0);
    localStorage.setItem('activeFilter', id);
    switch (id) {
      case 'filter-discussed':
        filteredPictures = filteredPictures.sort(function( a, b ) {
          return b.comments - a.comments;
        });
        activeFilter = 'filter-discussed';
        break;
      case 'filter-new':
        filteredPictures = filteredPictures.sort(function(a, b) {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        var week2 = Number(new Date(new Date() - 14 * 24 * 60 * 60 * 1000));
        filteredPictures = filteredPictures.filter(function(picture) {
          return new Date(picture.date).getTime() >= week2;
        });
        activeFilter = 'filter-new';
        break;
      case 'filter-popular':
        filteredPictures = pictures;
        break;
    }
    gallery.setPictures(filteredPictures);
    renderPictures(filteredPictures, currentPage, true);
    activeFilter = id;
    windowLarge();
  }
  var checkHash = function() {
    var regexp = location.hash.match(/#photo\/(\S+)/);
    if (regexp) {
      gallery.setCurrentPicture(regexp[1]);
      gallery.show();
    }else {
      gallery.hide();
    }
  };
  /**
   * Загрузка списка картинок
   */
  function getPictures() {
    container.classList.add('pictures-loading');
    var imageLoadTimeout;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://o0.github.io/assets/json/pictures.json');
    xhr.addEventListener('load', function(evt) {
      clearTimeout(imageLoadTimeout);
      container.classList.remove('pictures-loading');
      var rawData = evt.target.response;
      pictures = JSON.parse(rawData);
      filteredPictures = pictures.slice(0);
      gallery.setPictures(filteredPictures);
      renderPictures(filteredPictures, currentPage);
      setActiveFilter(activeFilter, true);
      checkHash();
      windowLarge();
    });

    xhr.addEventListener('error', function() {
      container.classList.add('pictures-failure');
    });
    var IMAGE_TIMEOUT = 10000;
    imageLoadTimeout = setTimeout(function() {
      pictures = '';
      container.classList.add('pictures-failure');
    }, IMAGE_TIMEOUT);
    xhr.send();
  }
  window.addEventListener('hashchange', checkHash);

},{"./gallery":2,"./photo":4}],6:[function(require,module,exports){
'use strict';
  /**
   * @constructor
   * @param {string} image
   */
  var Resizer = function(image) {
    // Изображение, с которым будет вестись работа.
    this._image = new Image();
    this._image.src = image;

    // Холст.
    this._container = document.createElement('canvas');
    this._ctx = this._container.getContext('2d');

    // Создаем холст только после загрузки изображения.
    this._image.onload = function() {
      // Размер холста равен размеру загруженного изображения. Это нужно
      // для удобства работы с координатами.
      this._container.width = this._image.naturalWidth;
      this._container.height = this._image.naturalHeight;

      /**
       * Предлагаемый размер кадра в виде коэффициента относительно меньшей
       * стороны изображения.
       * @const
       * @type {number}
       */
      var INITIAL_SIDE_RATIO = 0.75;
      // Размер меньшей стороны изображения.
      var side = Math.min(
          this._container.width * INITIAL_SIDE_RATIO,
          this._container.height * INITIAL_SIDE_RATIO);

      // Изначально предлагаемое кадрирование — часть по центру с размером в 3/4
      // от размера меньшей стороны.
      this._resizeConstraint = new Square(
          this._container.width / 2 - side / 2,
          this._container.height / 2 - side / 2,
          side);

      // Отрисовка изначального состояния канваса.
      this.redraw();
    }.bind(this);

    // Фиксирование контекста обработчиков.
    this._onDragStart = this._onDragStart.bind(this);
    this._onDragEnd = this._onDragEnd.bind(this);
    this._onDrag = this._onDrag.bind(this);
  };

  Resizer.prototype = {
    /**
     * Родительский элемент канваса.
     * @type {Element}
     * @private
     */
    _element: null,

    /**
     * Положение курсора в момент перетаскивания. От положения курсора
     * рассчитывается смещение на которое нужно переместить изображение
     * за каждую итерацию перетаскивания.
     * @type {Coordinate}
     * @private
     */
    _cursorPosition: null,

    /**
     * Объект, хранящий итоговое кадрирование: сторона квадрата и смещение
     * от верхнего левого угла исходного изображения.
     * @type {Square}
     * @private
     */
    _resizeConstraint: null,

    /**
     * Отрисовка канваса.
     */
    redraw: function() {
      // Очистка изображения.
      this._ctx.clearRect(0, 0, this._container.width, this._container.height);

      // Параметры линии.
      // NB! Такие параметры сохраняются на время всего процесса отрисовки
      // canvas'a поэтому важно вовремя поменять их, если нужно начать отрисовку
      // чего-либо с другой обводкой.

      // Толщина линии.
      this._ctx.lineWidth = 6;
      // Цвет обводки.
      this._ctx.strokeStyle = '#ffe753';
      // Размер штрихов. Первый элемент массива задает длину штриха, второй
      // расстояние между соседними штрихами.
      this._ctx.setLineDash([15, 10]);
      // Смещение первого штриха от начала линии.
      this._ctx.lineDashOffset = 7;

      // Сохранение состояния канваса.
      // Подробней см. строку 132.
      this._ctx.save();

      // Установка начальной точки системы координат в центр холста.
      this._ctx.translate(this._container.width / 2, this._container.height / 2);

      var displX = -(this._resizeConstraint.x + this._resizeConstraint.side / 2);
      var displY = -(this._resizeConstraint.y + this._resizeConstraint.side / 2);
      // Отрисовка изображения на холсте. Параметры задают изображение, которое
      // нужно отрисовать и координаты его верхнего левого угла.
      // Координаты задаются от центра холста.
      this._ctx.drawImage(this._image, displX, displY);

      // Отрисовка прямоугольника, обозначающего область изображения после
      // кадрирования. Координаты задаются от центра.
      this._ctx.strokeRect(
          (-this._resizeConstraint.side / 2) - this._ctx.lineWidth / 2,
          (-this._resizeConstraint.side / 2) - this._ctx.lineWidth / 2,
          this._resizeConstraint.side - this._ctx.lineWidth / 2,
          this._resizeConstraint.side - this._ctx.lineWidth / 2);

      var containerX = -this._container.width / 2;
      var containerY = -this._container.height / 2;
      var fillRectStart = this._resizeConstraint.side / 2;

      this._ctx.fillStyle = 'rgba(0, 0, 0, .8)';
      this._ctx.moveTo(containerX, containerY);
      this._ctx.lineTo(containerX + this._container.width, containerY);
      this._ctx.lineTo(containerX + this._container.width, containerY + this._container.height);
      this._ctx.lineTo(containerX, containerY + this._container.height);
      this._ctx.lineTo(containerX, containerY);

      this._ctx.moveTo(-fillRectStart - this._ctx.lineWidth, -fillRectStart - this._ctx.lineWidth);
      this._ctx.lineTo(-fillRectStart - this._ctx.lineWidth, fillRectStart - this._ctx.lineWidth / 2);
      this._ctx.lineTo(fillRectStart - this._ctx.lineWidth / 2, fillRectStart - this._ctx.lineWidth / 2);
      this._ctx.lineTo(fillRectStart - this._ctx.lineWidth / 2, -fillRectStart - this._ctx.lineWidth);
      this._ctx.lineTo(-fillRectStart - this._ctx.lineWidth, -fillRectStart - this._ctx.lineWidth);

      this._ctx.fill();

      this._ctx.font = '20px Open Sans';
      this._ctx.fillStyle = '#fff';
      this._ctx.textAlign = 'center';
      this._ctx.fillText(this._image.naturalWidth + ' x ' + this._image.naturalHeight, 0, (-this._resizeConstraint.side / 2) - (this._ctx.lineWidth + this._ctx.lineWidth / 2));


      // Восстановление состояния канваса, которое было до вызова ctx.save
      // и последующего изменения системы координат. Нужно для того, чтобы
      // следующий кадр рисовался с привычной системой координат, где точка
      // 0 0 находится в левом верхнем углу холста, в противном случае
      // некорректно сработает даже очистка холста или нужно будет использовать
      // сложные рассчеты для координат прямоугольника, который нужно очистить.
      this._ctx.restore();
    },

    /**
     * Включение режима перемещения. Запоминается текущее положение курсора,
     * устанавливается флаг, разрешающий перемещение и добавляются обработчики,
     * позволяющие перерисовывать изображение по мере перетаскивания.
     * @param {number} x
     * @param {number} y
     * @private
     */
    _enterDragMode: function(x, y) {
      this._cursorPosition = new Coordinate(x, y);
      document.body.addEventListener('mousemove', this._onDrag);
      document.body.addEventListener('mouseup', this._onDragEnd);
    },

    /**
     * Выключение режима перемещения.
     * @private
     */
    _exitDragMode: function() {
      this._cursorPosition = null;
      document.body.removeEventListener('mousemove', this._onDrag);
      document.body.removeEventListener('mouseup', this._onDragEnd);
    },

    /**
     * Перемещение изображения относительно кадра.
     * @param {number} x
     * @param {number} y
     * @private
     */
    updatePosition: function(x, y) {
      this.moveConstraint(
          this._cursorPosition.x - x,
          this._cursorPosition.y - y);
      this._cursorPosition = new Coordinate(x, y);
    },

    /**
     * @param {MouseEvent} evt
     * @private
     */
    _onDragStart: function(evt) {
      this._enterDragMode(evt.clientX, evt.clientY);
    },

    /**
     * Обработчик окончания перетаскивания.
     * @private
     */
    _onDragEnd: function() {
      this._exitDragMode();
    },

    /**
     * Обработчик события перетаскивания.
     * @param {MouseEvent} evt
     * @private
     */
    _onDrag: function(evt) {
      this.updatePosition(evt.clientX, evt.clientY);
    },

    /**
     * Добавление элемента в DOM.
     * @param {Element} element
     */
    setElement: function(element) {
      if (this._element === element) {
        return;
      }

      this._element = element;
      this._element.insertBefore(this._container, this._element.firstChild);
      // Обработчики начала и конца перетаскивания.
      this._container.addEventListener('mousedown', this._onDragStart);
    },

    /**
     * Возвращает кадрирование элемента.
     * @return {Square}
     */
    getConstraint: function() {
      return this._resizeConstraint;
    },

    /**
     * Смещает кадрирование на значение указанное в параметрах.
     * @param {number} deltaX
     * @param {number} deltaY
     * @param {number} deltaSide
     */
    moveConstraint: function(deltaX, deltaY, deltaSide) {
      this.setConstraint(
          this._resizeConstraint.x + (deltaX || 0),
          this._resizeConstraint.y + (deltaY || 0),
          this._resizeConstraint.side + (deltaSide || 0));
    },

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} side
     */
    setConstraint: function(x, y, side) {
      if (typeof x !== 'undefined') {
        this._resizeConstraint.x = x;
      }

      if (typeof y !== 'undefined') {
        this._resizeConstraint.y = y;
      }

      if (typeof side !== 'undefined') {
        this._resizeConstraint.side = side;
      }

      requestAnimationFrame(function() {
        this.redraw();
        window.dispatchEvent(new CustomEvent('resizerchange'));
      }.bind(this));
    },

    /**
     * Удаление. Убирает контейнер из родительского элемента, убирает
     * все обработчики событий и убирает ссылки.
     */
    remove: function() {
      this._element.removeChild(this._container);

      this._container.removeEventListener('mousedown', this._onDragStart);
      this._container = null;
    },

    /**
     * Экспорт обрезанного изображения как HTMLImageElement и исходником
     * картинки в src в формате dataURL.
     * @return {Image}
     */
    exportImage: function() {
      // Создаем Image, с размерами, указанными при кадрировании.
      var imageToExport = new Image();

      // Создается новый canvas, по размерам совпадающий с кадрированным
      // изображением, в него добавляется изображение взятое из канваса
      // с измененными координатами и сохраняется в dataURL, с помощью метода
      // toDataURL. Полученный исходный код, записывается в src у ранее
      // созданного изображения.
      var temporaryCanvas = document.createElement('canvas');
      var temporaryCtx = temporaryCanvas.getContext('2d');
      temporaryCanvas.width = this._resizeConstraint.side;
      temporaryCanvas.height = this._resizeConstraint.side;
      temporaryCtx.drawImage(this._image,
          -this._resizeConstraint.x,
          -this._resizeConstraint.y);
      imageToExport.src = temporaryCanvas.toDataURL('image/png');

      return imageToExport;
    }
  };

  /**
   * Вспомогательный тип, описывающий квадрат.
   * @constructor
   * @param {number} x
   * @param {number} y
   * @param {number} side
   * @private
   */
  var Square = function(x, y, side) {
    this.x = x;
    this.y = y;
    this.side = side;
  };

  /**
   * Вспомогательный тип, описывающий координату.
   * @constructor
   * @param {number} x
   * @param {number} y
   * @private
   */
  var Coordinate = function(x, y) {
    this.x = x;
    this.y = y;
  };

   module.exports =  Resizer;

},{}],7:[function(require,module,exports){
'use strict';
require("./pictures"),
require("./upload");



},{"./pictures":5,"./upload":8}],8:[function(require,module,exports){
/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';
var Resizer = require("./resizer");

    new Resizer();

  /** @enum {string} */
  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2
  };

  /**
   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
   * из ключей FileType.
   * @type {RegExp}
   */
  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

  /**
   * @type {Object.<string, string>}
   */
  var filterMap;

  /**
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var currentResizer;

  /**
   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
   * изображением.
   */
  function cleanupResizer() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  }
  /**
   * Ставит одну из трех случайных картинок на фон формы загрузки.
   */
  function updateBackground() {
    var images = [
      'img/logo-background-1.jpg',
      'img/logo-background-2.jpg',
      'img/logo-background-3.jpg'
    ];

    var backgroundElement = document.querySelector('.upload');
    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
  }

  /**
   * Проверяет, валидны ли данные, в форме кадрирования.
   * @return {boolean}
   */
  function resizeFormIsValid() {
    if (currentResizer) {
      if ((Number(sideForm.value) + Number(leftForm.value) <= currentResizer._image.naturalWidth) && (Number(sideForm.value) + Number(aboveForm.value) <= currentResizer._image.naturalHeight ) && Number(sideForm.value) !== 0 && Number(leftForm.value) !== 0 && Number(aboveForm.value) !== 0 ) {
        return true;
      }
    }
    return false;
  }

  function valueForm() {
    var change = document.createEvent('CustomEvent');
    change.initCustomEvent('resizerchange', false, false, {});
    window.addEventListener('resizerchange', function() {
      leftForm.value = currentResizer.getConstraint().x;
      aboveForm.value = currentResizer.getConstraint().y;
      sideForm.value = currentResizer.getConstraint().side;
    });
    window.dispatchEvent(change);
  }

  //Установка значений смещения на форму
  /**
   * Форма загрузки изображения.
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];

  /**
   * Форма кадрирования изображения.
   * @type {HTMLFormElement}
   */
  var resizeForm = document.forms['upload-resize'];
  var submitButton = resizeForm['resize-fwd'];


  /**
   * Форма добавления фильтра.
   * @type {HTMLFormElement}
   */
  var filterForm = document.forms['upload-filter'];
  var filterCookie = window.docCookies.getItem('upload-filter');
  var filterFormControls = filterForm.querySelector('.upload-filter-controls');
  var filterinput = filterFormControls.querySelectorAll('input');
  for (var i = 0; i < filterinput.length; i++ ) {
    if (filterinput[i].id === filterCookie ) {
      filterinput[i].checked = 'checked';
    }
  }
  /**
   * @type {HTMLImageElement}
   */
  var filterImage = filterForm.querySelector('.filter-image-preview');
  filterImage.className = window.docCookies.getItem('filter-image-preview');
  /**
   * @type {HTMLElement}
   */
  var uploadMessage = document.querySelector('.upload-message');

  /**
   * @param {Action} action
   * @param {string=} message
   * @return {Element}
   */
  function showMessage(action, message) {
    var isError = false;

    switch (action) {
      case Action.UPLOADING:
        message = message || 'Кексограмим&hellip;';
        break;

      case Action.ERROR:
        isError = true;
        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;
    }

    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
    uploadMessage.classList.remove('invisible');
    uploadMessage.classList.toggle('upload-message-error', isError);
    return uploadMessage;
  }

  function hideMessage() {
    uploadMessage.classList.add('invisible');
  }

  /**
   * Обработчик изменения изображения в форме загрузки. Если загруженный
   * файл является изображением, считывается исходник картинки, создается
   * Resizer с загруженной картинкой, добавляется в форму кадрирования
   * и показывается форма кадрирования.
   * @param {Event} evt
   */
  var leftForm = resizeForm['resize-x'];
  var aboveForm = resizeForm['resize-y'];
  var sideForm = resizeForm['resize-size'];

  aboveForm.min = 0;
  leftForm.min = 0;
  sideForm.min = 1;
  resizeForm.addEventListener('change', function() {
    currentResizer.setConstraint(+leftForm.value, +aboveForm.value, +sideForm.value);
  });
  uploadForm.addEventListener('change', function(evt) {
    var element = evt.target;
    if (element.id === 'upload-file') {
      // Проверка типа загружаемого файла, тип должен быть изображением
      // одного из форматов: JPEG, PNG, GIF или SVG.
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();

        showMessage(Action.UPLOADING);

        fileReader.addEventListener('load', function() {
          cleanupResizer();

          currentResizer = new Resizer(fileReader.result);
          currentResizer.setElement(resizeForm);

          uploadMessage.classList.add('invisible');
          uploadForm.classList.add('invisible');
          resizeForm.classList.remove('invisible');
          hideMessage();
          setTimeout(valueForm, 1);
        });

        fileReader.readAsDataURL(element.files[0]);
      } else {
        // Показ сообщения об ошибке, если загружаемый файл, не является
        // поддерживаемым изображением.
        showMessage(Action.ERROR);
      }
    }
  });

  /**
   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
   * и обновляет фон.
   * @param {Event} evt
   */
  resizeForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  });

  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * @param {Event} evt
   */

  resizeForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    if (resizeFormIsValid()) {
      filterImage.src = currentResizer.exportImage().src;

      resizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');
      submitButton.removeAttribute('disabled');
    } else {
      submitButton.setAttribute('disabled', '');
    }
  });
  /**
   * Сброс формы фильтра. Показывает форму кадрирования.
   * @param {Event} evt
   */
  filterForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  });

  /**
   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
   * записав сохраненный фильтр в cookie.
   * @param {Event} evt
   */
  filterForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    filterForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');

    var dateToExpire = Number(Date.now()) + 228 * 24 * 60 * 60 * 100;
    var formattedDateToExpire = new Date(dateToExpire).toUTCString();
    window.docCookies.setItem('upload-filter', filterMap.className, formattedDateToExpire);
    window.docCookies.setItem('filter-image-preview', filterImage.className, formattedDateToExpire);
  });

  /**
   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
   * выбранному значению в форме.
   */
  filterForm.addEventListener('change', function() {
    if (!filterMap) {
      // Ленивая инициализация. Объект не создается до тех пор, пока
      // не понадобится прочитать его в первый раз, а после этого запоминается
      // навсегда.
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia'
      };
    }

    var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
    filterMap.className = 'upload-' + filterMap[selectedFilter];
  });

  cleanupResizer();
  updateBackground();


},{"./resizer":6}]},{},[7])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxHaXRodWJcXGtla3N0YWdyYW1cXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkM6L0dpdGh1Yi9rZWtzdGFncmFtL3NvdXJjZS9qcy9QaG90b0Jhc2UuanMiLCJDOi9HaXRodWIva2Vrc3RhZ3JhbS9zb3VyY2UvanMvZ2FsbGVyeS5qcyIsIkM6L0dpdGh1Yi9rZWtzdGFncmFtL3NvdXJjZS9qcy9pbmhlcml0LmpzIiwiQzovR2l0aHViL2tla3N0YWdyYW0vc291cmNlL2pzL3Bob3RvLmpzIiwiQzovR2l0aHViL2tla3N0YWdyYW0vc291cmNlL2pzL3BpY3R1cmVzLmpzIiwiQzovR2l0aHViL2tla3N0YWdyYW0vc291cmNlL2pzL3Jlc2l6ZXIuanMiLCJDOi9HaXRodWIva2Vrc3RhZ3JhbS9zb3VyY2UvanMvc2NyaXB0LmpzIiwiQzovR2l0aHViL2tla3N0YWdyYW0vc291cmNlL2pzL3VwbG9hZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xyXG4gIC8qKlxyXG4gICAqINCR0LDQt9C+0LLRi9C5INC60L7QvdGB0YLRgNGD0LrRgtC+0YAg0LTQu9GPINGE0L7RgtC+0LPRgNCw0YTQuNC4XHJcbiAgICogQGNvbnN0cnVjdG9yXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gUGhvdG9CYXNlKCkge31cclxuICAvKipcclxuICAgKiDQlNCw0L3QvdGL0LUg0L7QsdGK0LXQutGC0LAg0LjQtyBKU09OXHJcbiAgICogQHR5cGUge1Bob3RvW119XHJcbiAgICogQHByaXZhdGVcclxuICAgKi9cclxuICBQaG90b0Jhc2UucHJvdG90eXBlLl9kYXRhID0gbnVsbDtcclxuICAvKipcclxuICAgKiDQnNC10YLQvtC0INC00LvRjyDQvtGC0L7QsdGA0LDQttC10L3QuNGPINGE0L7RgtC+0LPRgNCw0YTQuNC4XHJcbiAgICogQG1ldGhvZFxyXG4gICAqL1xyXG4gIFBob3RvQmFzZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7fTtcclxuICAvKipcclxuICAgKiDQnNC10YLQvtC0INGD0LTQsNC70LXQvdC40Y8g0L7QsdGA0LDQsdC+0YLRh9C40LrQsCDQutC70LjQutCwINC90LAg0YTQvtGC0L7Qs9GA0LDRhNC40LhcclxuICAgKiBAbWV0aG9kXHJcbiAgICovXHJcbiAgUGhvdG9CYXNlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbigpIHt9O1xyXG4gIC8qKlxyXG4gICAqINCc0LXRgtC+0LQg0YHQvtCx0YvRgtC40Y8g0L3QsNC20LDRgtC40Y8g0L3QsCDRhNC+0YLQvtCz0YDQsNGE0LjRjlxyXG4gICAqIEBtZXRob2RcclxuICAgKi9cclxuICBQaG90b0Jhc2UucHJvdG90eXBlLm9uUGhvdG9DbGljayA9IGZ1bmN0aW9uKCkge307XHJcbiAgLyoqXHJcbiAgICog0JzQtdGC0L7QtCDRg9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDQvtCx0YrQtdC60YIt0YTQvtGC0L7Qs9GA0LDRhNC40Y4g0LjQtyBKU09OXHJcbiAgICogQG1ldGhvZFxyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhXHJcbiAgICovXHJcbiAgUGhvdG9CYXNlLnByb3RvdHlwZS5zZXREYXRhID0gZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgdGhpcy5fZGF0YSA9IGRhdGE7XHJcbiAgfTtcclxuICAvKipcclxuICAgKiDQnNC10YLQvtC0INCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINC+0LHRitC10LrRgi3RhNC+0YLQvtCz0YDQsNGE0LjRjiDQv9C+IEpTT05cclxuICAgKiBAbWV0aG9kXHJcbiAgICogQHJldHVybnMge1Bob3RvW119XHJcbiAgICovXHJcbiAgUGhvdG9CYXNlLnByb3RvdHlwZS5nZXREYXRhID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YTtcclxuICB9O1xyXG4gIC8qKlxyXG4gICAqIENhbGxiYWNrINGB0L7QsdGL0YLQuNGPINC90LDQttCw0YLQuNGPINC90LAg0YTQvtGC0L7Qs9GA0LDRhNC40Y5cclxuICAgKiBAbWV0aG9kXHJcbiAgICogQHR5cGUge2Z1bmN0aW9ufVxyXG4gICAqL1xyXG4gIFBob3RvQmFzZS5wcm90b3R5cGUub25DbGljayA9IG51bGw7XHJcblxyXG4gbW9kdWxlLmV4cG9ydHMgPSBQaG90b0Jhc2U7XHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcbiAgLyoqXHJcbiAgICog0JrQvtC90YHRgtGA0YPQutGC0L7RgCDQs9Cw0LvQtdGA0LXQuFxyXG4gICAqIEBjb25zdHJ1Y3RvclxyXG4gICAqL1xyXG4gIHZhciBHYWxsZXJ5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvKipcclxuICAgICAqINCT0LDQu9C10YDQtdGPINC90LAg0YHRgtGA0LDQvdC40YbQtVxyXG4gICAgICogQHR5cGUge0hUTUxFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FsbGVyeS1vdmVybGF5Jyk7XHJcbiAgICAvKipcclxuICAgICAqINCa0YDQtdGB0YIg0LTQu9GPINC30LDQutGA0YvRgtC40Y8g0LPQsNC70LXRgNC10LhcclxuICAgICAqIEB0eXBlIHtIVE1MRWxlbWVudH1cclxuICAgICAqL1xyXG4gICAgdGhpcy5jbG9zZUJ1dHRvbiA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FsbGVyeS1vdmVybGF5LWNsb3NlJyk7XHJcbiAgICAvKipcclxuICAgICAqINCa0L7QvdGC0LXQudC90LXRgCDQtNC70Y8g0YTQvtGC0L7Qs9GA0LDRhNC40LhcclxuICAgICAqIEB0eXBlIHtIVE1MRWxlbWVudH1cclxuICAgICAqL1xyXG4gICAgdGhpcy5waG90byA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYWxsZXJ5LW92ZXJsYXktaW1hZ2UnKTtcclxuICAgIC8qKlxyXG4gICAgICog0JrQvtC90YLQtdC50L3QtdGAINC00LvRjyDQu9Cw0LnQutC+0LJcclxuICAgICAqIEB0eXBlIHtIVE1MRWxlbWVudH1cclxuICAgICAqL1xyXG4gICAgdGhpcy5saWtlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYWxsZXJ5LW92ZXJsYXktY29udHJvbHMtbGlrZScpO1xyXG4gICAgLyoqXHJcbiAgICAgKiDQmtC+0LvQuNGH0LXRgdGC0LLQviDQu9Cw0LnQutC+0LJcclxuICAgICAqIEB0eXBlIHtIVE1MRWxlbWVudH1cclxuICAgICAqL1xyXG4gICAgdGhpcy5saWtlc0NvdW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxpa2VzLWNvdW50Jyk7XHJcbiAgICAvKipcclxuICAgICAqINCa0L7QvdGC0LXQudC90LXRgCDQtNC70Y8g0LrQvtC80LzQtdC90YLQsNGA0LjQtdCyXHJcbiAgICAgKiBAdHlwZSB7SFRNTEVsZW1lbnR9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuY29tbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FsbGVyeS1vdmVybGF5LWNvbnRyb2xzLWNvbW1lbnRzJyk7XHJcbiAgICAvKipcclxuICAgICAqINGB0L/QuNGB0L7QuiDRhNC+0YLQvtCz0YDQsNGE0LjQuSDQuNC3IGpzb25cclxuICAgICAqIEB0eXBlIHtBcnJheX1cclxuICAgICAqL1xyXG4gICAgdGhpcy5waWN0dXJlcyA9IFtdO1xyXG4gICAgLyoqXHJcbiAgICAgKiDQotC10LrRg9GJ0LDRjyDRhNC+0YLQvtCz0YDQsNGE0LjRj1xyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgdGhpcy5jdXJyZW50UGljdHVyZSA9IDA7XHJcbiAgICAvKipcclxuICAgICAqINCf0L7QtNC/0LjRgdC60LAg0L3QsCDRgdC+0LHRi9GC0LjQtSDQvdCw0LbQsNGC0LjRjyDQvdCwINC60YDQtdGB0YLQuNC6INC00LvRjyDQt9Cw0LPRgNGL0YLQuNGPINCz0LDQu9C10YDQtdC4XHJcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb24odGhpczpHYWxsZXJ5KX1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX29uQ2xvc2VDbGljayA9IHRoaXMuX29uQ2xvc2VDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgLyoqXHJcbiAgICAgKiDQn9C+0LTQv9C40YHQutCwINC90LAg0YHQvtCx0YvRgtC40LUg0L3QsNC20LDRgtC40Y8g0LrQu9Cw0LLQuNGI0Lgg0L3QsCDQutC70LDQstC40LDRgtGD0YDQtVxyXG4gICAgICogQHR5cGUge2Z1bmN0aW9uKHRoaXM6R2FsbGVyeSl9XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICB0aGlzLl9vbkRvY3VtZW50S2V5RG93biA9IHRoaXMuX29uRG9jdW1lbnRLZXlEb3duLmJpbmQodGhpcyk7XHJcbiAgICAvKipcclxuICAgICAqINCf0L7QtNC/0LjRgdC60LAg0L3QsCDRgdC+0LHRi9GC0LjQtSDQutC70LjQutCwINC/0L4g0YTQvtGC0L7Qs9GA0LDRhNC40LhcclxuICAgICAqIEB0eXBlIHtmdW5jdGlvbih0aGlzOkdhbGxlcnkpfVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgdGhpcy5fb25QaG90b0NsaWNrID0gdGhpcy5fb25QaG90b0NsaWNrLmJpbmQodGhpcyk7XHJcbiAgICAvKipcclxuICAgICAqINCf0L7QtNC/0LjRgdC60LAg0L3QsCDRgdC+0LHRi9GC0LjQtSDQu9Cw0LnQutCwINGE0L7RgtC+0LPRgNCw0YTQuNC4XHJcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb24odGhpczpHYWxsZXJ5KX1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX29uU2V0TGlrZSA9IHRoaXMuX29uU2V0TGlrZS5iaW5kKHRoaXMpO1xyXG4gICAgLyoqXHJcbiAgICAgKiDQn9C+0LTQv9C40YHQutCwINC90LAg0YHQvtCx0YvRgtC40LUg0LjQt9C80LXQvdC10L3QuNC1INCw0LTRgNC10YHQvdC+0Lkg0YHRgtGA0L7QutC4XHJcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb24odGhpczpHYWxsZXJ5KX1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX29uSGFzaENoYW5nZSA9IHRoaXMuX29uSGFzaENoYW5nZS5iaW5kKHRoaXMpO1xyXG4gIH07XHJcbiAgLyoqIEBlbnVtIHtudW1iZXJ9ICovXHJcbiAgdmFyIEtFWUNPREUgPSB7XHJcbiAgICAnRVNDJzogMjcsXHJcbiAgICAnTEVGVCc6IDM3LFxyXG4gICAgJ1JJR0hUJzogMzlcclxuICB9O1xyXG4gIC8qKlxyXG4gICAqINCS0YvQt9GL0LLQsNGO0YnQuNC5INC80LXRgtC+0LQg0LTQu9GPINC+0YLQvtCx0YDQsNC20LXQvdC40Y8g0LPQsNC70LXRgNC10LhcclxuICAgKiBAbWV0aG9kXHJcbiAgICovXHJcbiAgR2FsbGVyeS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgcmVnZXhwID0gLyNwaG90b1xcLyhcXFMrKS87XHJcbiAgICBsb2NhdGlvbi5oYXNoID0gbG9jYXRpb24uaGFzaC5tYXRjaChyZWdleHApID8gJycgOiAncGhvdG8vJyArIHRoaXMucGljdHVyZXNbdGhpcy5jdXJyZW50UGljdHVyZV0udXJsO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLl9vbkhhc2hDaGFuZ2UpO1xyXG4gICAgdGhpcy5yZXN0b3JlRnJvbUhhc2guYmluZCh0aGlzKTtcclxuICB9O1xyXG4gIC8qKlxyXG4gICAqINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINGF0LXRiCDQsiDQsNC00YDQtdGB0L3Rg9GOINGB0YLRgNC+0LrRg1xyXG4gICAqIEBtZXRob2RcclxuICAgKi9cclxuICBHYWxsZXJ5LnByb3RvdHlwZS5fb25IYXNoQ2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLnJlc3RvcmVGcm9tSGFzaCgpO1xyXG4gIH07XHJcbiAgR2FsbGVyeS5wcm90b3R5cGUucmVzdG9yZUZyb21IYXNoID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAoIGxvY2F0aW9uLmhhc2ggPT09ICcnKSB7XHJcbiAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgfWVsc2Uge1xyXG4gICAgICB0aGlzLnNob3coKTtcclxuICAgICAgdGhpcy5zZXRDdXJyZW50UGljdHVyZSh0aGlzLmN1cnJlbnRQaWN0dXJlKTtcclxuICAgIH1cclxuICB9O1xyXG4gIC8qKlxyXG4gICAqINCe0YHQvdC+0LLQvdC+0Lkg0LzQtdGC0L7QtCDQtNC70Y8g0L7RgtC+0LHRgNCw0LbQtdC90LjRjyDQs9Cw0LvQtdGA0LXQuFxyXG4gICAqIEBtZXRob2RcclxuICAgKi9cclxuICBHYWxsZXJ5LnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaW52aXNpYmxlJyk7XHJcbiAgICB0aGlzLmNsb3NlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fb25DbG9zZUNsaWNrKTtcclxuICAgIHRoaXMucGhvdG8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9vblBob3RvQ2xpY2spO1xyXG4gICAgdGhpcy5saWtlcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX29uU2V0TGlrZSk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuX29uRG9jdW1lbnRLZXlEb3duKTtcclxuICB9O1xyXG4gIC8qKlxyXG4gICAqINCe0YHQvdC+0LLQvdC+0Lkg0LzQtdGC0L7QtCDQt9Cw0LrRgNGL0YLQuNGPINCz0LDQu9C10YDQtdC4XHJcbiAgICogQG1ldGhvZFxyXG4gICAqL1xyXG4gIEdhbGxlcnkucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdpbnZpc2libGUnKTtcclxuICAgIHRoaXMuY2xvc2VCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9vbkNsb3NlQ2xpY2spO1xyXG4gICAgdGhpcy5waG90by5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX29uUGhvdG9DbGljayk7XHJcbiAgICB0aGlzLmxpa2VzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fb25TZXRMaWtlKTtcclxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5fb25Eb2N1bWVudEtleURvd24pO1xyXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLl9vbkhhc2hDaGFuZ2UpO1xyXG4gIH07XHJcbiAgLyoqXHJcbiAgICog0JzQtdGC0L7QtCDRgdC+0LHRi9GC0LjRjyDQvdCw0LbQsNGC0LjRjyDQvdCwINC60LvQsNCy0LjRiNGDINC60LvQsNCy0LjQsNGC0YPRgNGLXHJcbiAgICogQG1ldGhvZFxyXG4gICAqIEBsaXN0ZW5zIGNsaWNrXHJcbiAgICogQHBhcmFtIHtFdmVudH0gZXZ0IC0g0YHQvtCx0YvRgtC40LUg0L3QsNC20LDRgtC40Y8g0LrQu9Cw0LLQuNGI0LhcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqL1xyXG4gIEdhbGxlcnkucHJvdG90eXBlLl9vbkRvY3VtZW50S2V5RG93biA9IGZ1bmN0aW9uKGV2dCkge1xyXG4gICAgc3dpdGNoIChldnQua2V5Q29kZSkge1xyXG4gICAgICBjYXNlIEtFWUNPREUuRVNDOlxyXG4gICAgICAgIGxvY2F0aW9uLmhhc2ggPSAnJztcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBLRVlDT0RFLkxFRlQ6XHJcbiAgICAgICAgdGhpcy5zZXRDdXJyZW50UGljdHVyZSh0aGlzLmN1cnJlbnRQaWN0dXJlIC0gMSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgS0VZQ09ERS5SSUdIVDpcclxuICAgICAgICB0aGlzLnNldEN1cnJlbnRQaWN0dXJlKHRoaXMuY3VycmVudFBpY3R1cmUgKyAxKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIHRoaXMuc2V0Q3VycmVudFBpY3R1cmUodGhpcy5jdXJyZW50UGljdHVyZSk7XHJcbiAgfTtcclxuICAvKipcclxuICAgKiDQnNC10YLQvtC0INC80LDRgdGB0LjQstCwINGE0L7RgtC+0LPRgNCw0YTQuNC5INC40LcganNvbiDRgdC+0YXRgNCw0L3Rj9C10YIg0LIg0L7QsdGK0LXQutGC0LVcclxuICAgKiBAbWV0aG9kXHJcbiAgICogQHBhcmFtIHtQaG90b1tdfSBwaWN0dXJlcyAtINC80LDRgdGB0LjQsiDRhNC+0YLQvtCz0YDQsNGE0LjQuVxyXG4gICAqL1xyXG4gIEdhbGxlcnkucHJvdG90eXBlLnNldFBpY3R1cmVzID0gZnVuY3Rpb24ocGljdHVyZXMpIHtcclxuICAgIHRoaXMucGljdHVyZXMgPSBwaWN0dXJlcztcclxuICB9O1xyXG4gIC8qKlxyXG4gICAqINCc0LXRgtC+0LQg0YPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0YTQvtGC0L7Qs9GA0LDRhNC40Y4sINC60L7RgtC+0YDRg9GOINC+0YLQvtCx0YDQsNC20LDQtdGCINCz0LDQu9C10YDQtdGPXHJcbiAgICogQG1ldGhvZFxyXG4gICAqQHBhcmFtIHtudW1iZXJ8c3RyaW5nfSBpIC0g0LjQvdC00LXQutGBINGE0L7RgtC+0LPRgNCw0YTQuNC4INCyINC80LDRgdGB0LjQstC1INC40LvQuCDQv9GD0YLRjCDQtNC+INGE0L7RgtC+0LPRgNCw0YTQuNC4XHJcbiAgICovXHJcbiAgR2FsbGVyeS5wcm90b3R5cGUuc2V0Q3VycmVudFBpY3R1cmUgPSBmdW5jdGlvbihpKSB7XHJcbiAgICB0aGlzLmN1cnJlbnRQaWN0dXJlID0gaTtcclxuICAgIHZhciBwaWN0dXJlO1xyXG4gICAgaWYgKHR5cGVvZiBpID09PSAnbnVtYmVyJykge1xyXG4gICAgICBwaWN0dXJlID0gdGhpcy5waWN0dXJlc1tpXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHBpY3R1cmUgPSB0aGlzLnBpY3R1cmVzW3RoaXMuZ2V0TnVtYmVyUGljdHVyZShpKV07XHJcbiAgICB9XHJcbiAgICB0aGlzLnBob3RvLnNyYyA9IHBpY3R1cmUudXJsO1xyXG4gICAgdGhpcy5saWtlcy5xdWVyeVNlbGVjdG9yKCcubGlrZXMtY291bnQnKS50ZXh0Q29udGVudCA9IHBpY3R1cmUubGlrZXM7XHJcbiAgICB0aGlzLmNvbW1lbnRzLnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50cy1jb3VudCcpLnRleHRDb250ZW50ID0gcGljdHVyZS5jb21tZW50cztcclxuXHJcbiAgICBpZiAocGljdHVyZS5zZXRMaWtlID09PSB0cnVlKSB7XHJcbiAgICAgIHRoaXMubGlrZXNDb3VudC5jbGFzc0xpc3QuYWRkKCdsaWtlcy1jb3VudC1saWtlZCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5saWtlc0NvdW50LmNsYXNzTGlzdC5yZW1vdmUoJ2xpa2VzLWNvdW50LWxpa2VkJyk7XHJcbiAgICB9XHJcbiAgfTtcclxuICAvKipcclxuICAgKiDQnNC10YLQvtC0INGB0L7QsdGL0YLQuNGPINC90LDQttCw0YLQuNGPINC60YDQtdGB0YLQuNC60LAg0LTQu9GPINC30LDQutGA0YvRgtC40Y8g0YTQvtGC0L7Qs9Cw0LvQtdGA0LjQuFxyXG4gICAqIEBtZXRob2RcclxuICAgKiBAbGlzdGVucyBjbGlja1xyXG4gICAqIEBwcml2YXRlXHJcbiAgICovXHJcbiAgR2FsbGVyeS5wcm90b3R5cGUuX29uQ2xvc2VDbGljayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgbG9jYXRpb24uaGFzaCA9ICcnO1xyXG4gIH07XHJcbiAgLyoqXHJcbiAgICog0JzQtdGC0L7QtCDRgdC+0LHRi9GC0LjRjyDQvdCw0LbQsNGC0LjRjyDQvdCwINGE0L7RgtC+0LPQsNC70LXRgNC10Y5cclxuICAgKiBAbWV0aG9kXHJcbiAgICogQGxpc3RlbnMgY2xpY2tcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqL1xyXG4gIEdhbGxlcnkucHJvdG90eXBlLl9vblBob3RvQ2xpY2sgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuc2V0Q3VycmVudFBpY3R1cmUodGhpcy5jdXJyZW50UGljdHVyZSArIDEpO1xyXG4gICAgbG9jYXRpb24uaGFzaCA9ICdwaG90by8nICsgdGhpcy5waWN0dXJlc1t0aGlzLmN1cnJlbnRQaWN0dXJlXS51cmw7XHJcblxyXG4gIH07XHJcbiAgLyoqXHJcbiAgICog0JzQtdGC0L7QtCDRg9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDQvtCx0YrQtdC60YIt0YTQvtGC0L7Qs9GA0LDRhNC40Y4g0LjQtyBKU09OXHJcbiAgICogQG1ldGhvZFxyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhXHJcbiAgICovXHJcbiAgR2FsbGVyeS5wcm90b3R5cGUuc2V0RGF0YSA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xyXG4gICAgdGhpcy5jdXJyZW50UGljdHVyZSA9IHRoaXMuZ2V0TnVtYmVyUGljdHVyZShkYXRhLnVybCk7XHJcbiAgfTtcclxuICAvKipcclxuICAgKiDQnNC10YLQvtC0INCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINC90L7QvNC10YAg0YTQvtGC0L7Qs9GA0LDRhtC40Lgg0LIg0LzQsNGB0YHQuNCy0LVcclxuICAgKiBAbWV0aG9kXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybCAtINC40LzRjyDRhNC+0YLQvtCz0YDQsNGE0LjQuFxyXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAgICovXHJcbiAgR2FsbGVyeS5wcm90b3R5cGUuZ2V0TnVtYmVyUGljdHVyZSA9IGZ1bmN0aW9uKHVybCkge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBpY3R1cmVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmICh1cmwgPT09IHRoaXMucGljdHVyZXNbaV0udXJsKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGljdHVyZSA9IGk7XHJcbiAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG4gIC8qKlxyXG4gICAqINCc0LXRgtC+0LQg0LvQsNC50LrQsCDQvdCwINGE0L7RgtC+0LPRgNCw0YTQuNC4XHJcbiAgICogQG1ldGhvZFxyXG4gICAqIEBwcml2YXRlXHJcbiAgICovXHJcbiAgR2FsbGVyeS5wcm90b3R5cGUuX29uU2V0TGlrZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGN1cnJlbnRPYmplY3QgPSB0aGlzLnBpY3R1cmVzW3RoaXMuY3VycmVudFBpY3R1cmVdO1xyXG4gICAgaWYgKGN1cnJlbnRPYmplY3Quc2V0TGlrZSAhPT0gdHJ1ZSkge1xyXG4gICAgICBjdXJyZW50T2JqZWN0Lmxpa2VzID0gY3VycmVudE9iamVjdC5saWtlcyArIDE7XHJcbiAgICAgIHRoaXMubGlrZXNDb3VudC5jbGFzc0xpc3QuYWRkKCdsaWtlcy1jb3VudC1saWtlZCcpO1xyXG4gICAgICB0aGlzLmxpa2VzQ291bnQuaW5uZXJIVE1MID0gY3VycmVudE9iamVjdC5saWtlcztcclxuICAgICAgY3VycmVudE9iamVjdC5zZXRMaWtlID0gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGN1cnJlbnRPYmplY3QubGlrZXMgPSBjdXJyZW50T2JqZWN0Lmxpa2VzIC0gMTtcclxuICAgICAgdGhpcy5saWtlc0NvdW50LmNsYXNzTGlzdC5yZW1vdmUoJ2xpa2VzLWNvdW50LWxpa2VkJyk7XHJcbiAgICAgIHRoaXMubGlrZXNDb3VudC5pbm5lckhUTUwgPSBjdXJyZW50T2JqZWN0Lmxpa2VzO1xyXG4gICAgICBjdXJyZW50T2JqZWN0LnNldExpa2UgPSBmYWxzZTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuIG1vZHVsZS5leHBvcnRzID0gIEdhbGxlcnk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuICAvKipcclxuICAgKiDQndCw0YHQu9C10LTRg9C10YIg0L7QtNC40L0g0L7QsdGK0LXQutGCINC+0YIg0LTRgNGD0LPQvtCz0L5cclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjaGlsZCAtINCa0L7QvdGB0YLRgNGD0LrRgtC+0YAg0L/QvtGC0L7QvNC60LBcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBwYXJlbnQgLSDQmtC+0L3RgdGC0YDRg9C60YLQvtGAINC/0YDQtdC00LrQsFxyXG4gICAqL1xyXG4gIHZhciBpbmhlcml0ID0gIGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHtcclxuICAgIHZhciBFbXB0eUNvbnN0cnVjdG9yID0gZnVuY3Rpb24oKSB7fTtcclxuICAgIEVtcHR5Q29uc3RydWN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTtcclxuICAgIGNoaWxkLnByb3RvdHlwZSA9IG5ldyBFbXB0eUNvbnN0cnVjdG9yKCk7XHJcbiAgfVxyXG4gIG1vZHVsZS5leHBvcnRzID0gaW5oZXJpdDtcclxuXHJcbiIsIid1c2Ugc3RyaWN0JztcclxudmFyIGluaGVyaXQgPSByZXF1aXJlKFwiLi9pbmhlcml0XCIpLFxyXG4gICAgUGhvdG9CYXNlID0gcmVxdWlyZShcIi4vUGhvdG9CYXNlXCIpO1xyXG4gICAgXHJcbiAgICBuZXcgUGhvdG9CYXNlKCk7XHJcbiAgLyoqXHJcbiAgICog0JrQvtC90YHRgtGA0YPQutGC0L7RgCDRhNC+0YLQvtCz0YDQsNGE0LjQuCDQsiDQvtCx0YnQtdC8INGB0L/QuNGB0LrQtVxyXG4gICAqIEBjb25zdHJ1Y3RvclxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIFBob3RvKCkge1xyXG4gICAgdGhpcy5vblBob3RvQ2xpY2sgPSB0aGlzLm9uUGhvdG9DbGljay5iaW5kKHRoaXMpO1xyXG4gIH1cclxuICBpbmhlcml0KFBob3RvLCBQaG90b0Jhc2UpO1xyXG4gIC8qKlxyXG4gICAqINCe0YLQvtCx0YDQsNC20LXQvdC40LUgRE9NLdGN0LvQtdC80LXQvdGC0LAg0L/QviDRiNCw0LHQu9C+0L3RgyDQtNC70Y8g0YTQvtGC0L7Qs9GA0LDRhNC40Lgg0LIg0YHQv9C40YHQutC1XHJcbiAgICogQG1ldGhvZFxyXG4gICAqIEBvdmVycmlkZVxyXG4gICAqL1xyXG4gIFBob3RvLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwaWN0dXJlLXRlbXBsYXRlJyk7XHJcbiAgICBpZiAoJ2NvbnRlbnQnIGluIHRlbXBsYXRlICkge1xyXG4gICAgICB0aGlzLmVsZW1lbnQgPSB0ZW1wbGF0ZS5jb250ZW50LmNoaWxkTm9kZXNbMV0uY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5lbGVtZW50ID0gdGVtcGxhdGUuY2hpbGROb2Rlc1sxXS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5waWN0dXJlLWNvbW1lbnRzJykudGV4dENvbnRlbnQgPSB0aGlzLl9kYXRhLmNvbW1lbnRzO1xyXG4gICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5waWN0dXJlLWxpa2VzJykudGV4dENvbnRlbnQgPSB0aGlzLl9kYXRhLmxpa2VzO1xyXG4gICAgdmFyIGJhY2tncm91bmRJbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgdmFyIGltYWdlTG9hZFRpbWVvdXQ7XHJcbiAgICBiYWNrZ3JvdW5kSW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIGNsZWFyVGltZW91dChpbWFnZUxvYWRUaW1lb3V0KTtcclxuICAgICAgdmFyIGVsZW1lbnRJbWFnZSA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdpbWcnKTtcclxuICAgICAgdGhpcy5lbGVtZW50LnJlcGxhY2VDaGlsZChiYWNrZ3JvdW5kSW1hZ2UsIGVsZW1lbnRJbWFnZSk7XHJcbiAgICAgIGJhY2tncm91bmRJbWFnZS53aWR0aCA9IDE4MjtcclxuICAgIH0uYmluZCh0aGlzKTtcclxuICAgIGJhY2tncm91bmRJbWFnZS5vbmVycm9yID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdwaWN0dXJlLWxvYWQtZmFpbHVyZScpO1xyXG4gICAgfS5iaW5kKHRoaXMpO1xyXG4gICAgYmFja2dyb3VuZEltYWdlLnNyYyA9IHRoaXMuX2RhdGEudXJsO1xyXG4gICAgdmFyIElNQUdFX1RJTUVPVVQgPSAxMDAwMDtcclxuICAgIGltYWdlTG9hZFRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICBiYWNrZ3JvdW5kSW1hZ2Uuc3JjID0gJyc7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdwaWN0dXJlLWxvYWQtZmFpbHVyZScpO1xyXG4gICAgfS5iaW5kKHRoaXMpLCBJTUFHRV9USU1FT1VUKTtcclxuXHJcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uUGhvdG9DbGljayk7XHJcbiAgfTtcclxuICAvKipcclxuICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDQutC70LjQutCwINC/0L4g0YTQvtGC0L7Qs9GA0LDRhNC40Lgg0LIg0L7QsdGJ0LXQvCDRgdC/0LjRgdC60LUg0YTQvtGC0L7Qs9GA0LDRhNC40LlcclxuICAgKiBAbWV0aG9kXHJcbiAgICogQGxpc3RlbnMgY2xpY2tcclxuICAgKiBAcGFyYW0gZXZ0XHJcbiAgICogQG92ZXJyaWRlXHJcbiAgICovXHJcbiAgUGhvdG8ucHJvdG90eXBlLm9uUGhvdG9DbGljayA9IGZ1bmN0aW9uKGV2dCkge1xyXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBpZiAoXHJcbiAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3BpY3R1cmUnKSAmJlxyXG4gICAgICAhdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncGljdHVyZS1sb2FkLWZhaWx1cmUnKVxyXG4gICAgKSB7XHJcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vbkNsaWNrID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgdGhpcy5vbkNsaWNrKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG4gIC8qKlxyXG4gICAqINCc0LXRgtC+0LQg0YPQtNCw0LvQtdC90LjRjyDQvtCx0YDQsNCx0L7RgtGH0LjQutC+0LIg0YHQvtCx0YvRgtC40Lkg0YEgRE9NLdGN0LvQtdC80LXQvdGC0LAg0YTQvtGC0L7Qs9GA0LDRhNC40Lgg0Lgg0YPQtNCw0LvQtdC90LjRjyDRjdC70LXQvNC10L3RgtCwINC40LcgRE9NLdC00LXRgNC10LLQsFxyXG4gICAqIEBtZXRob2RcclxuICAgKiBAb3ZlcnJpZGVcclxuICAgKi9cclxuICBQaG90by5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uUGhvdG9DbGljayk7XHJcbiAgfTtcclxuICBtb2R1bGUuZXhwb3J0cyA9IFBob3RvO1xyXG5cclxuXHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcbnZhciBQaG90byA9IHJlcXVpcmUoXCIuL3Bob3RvXCIpLFxyXG4gICAgR2FsbGVyeSA9IHJlcXVpcmUoXCIuL2dhbGxlcnlcIik7XHJcbiAgICBcclxuICAgIG5ldyBQaG90bygpO1xyXG4gICAgbmV3IEdhbGxlcnkoKTtcclxuICAvKipcclxuICAgKiBkb2N1bWVudCDQsiDQv9C10YDQtdC80LXQvdC+0LlcclxuICAgKiBAdHlwZSB7RWxlbWVudH1cclxuICAgKi9cclxuICB2YXIgZG9jID0gZG9jdW1lbnQ7XHJcbiAgLyoqXHJcbiAgICog0JrQvtC90YLQtdC50L3QtdGAINC00LvRjyDQstGB0LXRhSDQt9Cw0LPRgNGD0LbQtdC90L3Ri9GFINGE0L7RgtC+0LPRgNCw0YTQuNC5XHJcbiAgICogQHR5cGUge0VsZW1lbnR9XHJcbiAgICovXHJcbiAgdmFyIGNvbnRhaW5lciA9IGRvYy5xdWVyeVNlbGVjdG9yKCcucGljdHVyZXMnKTtcclxuICAvKipcclxuICAgKiDQkNC60YLQuNCy0L3Ri9C5INGE0LjQu9GM0YLRgFxyXG4gICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICovXHJcbiAgdmFyIGFjdGl2ZUZpbHRlciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdhY3RpdmVGaWx0ZXInKSB8fCAnZmlsdGVyLXBvcHVsYXInO1xyXG4gIC8qKlxyXG4gICAqINCc0LDRgdGB0LjQsiDQvtCx0YrQtdC60YLQvtCyINC30LDQs9GA0YPQttC10L3QvdGL0YUg0YTQvtGC0L7Qs9GA0LDRhNC40LlcclxuICAgKiBAdHlwZSB7UGhvdG9bXX1cclxuICAgKi9cclxuICB2YXIgcGljdHVyZXMgPSBbXTtcclxuICAvKipcclxuICAgKiDQnNCw0YHRgdC40LIg0L7QsdGK0LXQutGC0L7QsiDQt9Cw0LPRgNGD0LbQtdC90L3Ri9GFINGE0L7RgtC+0LPRgNCw0YTQuNC5XHJcbiAgICogQHR5cGUge1Bob3RvW119XHJcbiAgICovXHJcbiAgdmFyIGZpbHRlcmVkUGljdHVyZXMgPSBbXTtcclxuICAvKipcclxuICAgKiDQnNCw0YHRgdC40LIg0L7QsdGK0LXQutGC0L7QsiDQt9Cw0LPRgNGD0LbQtdC90L3Ri9GFINGE0L7RgtC+0LPRgNCw0YTQuNC5XHJcbiAgICogQHR5cGUge1Bob3RvW119XHJcbiAgICovXHJcbiAgdmFyIHJlbmRlcmVkRWxlbWVudHMgPSBbXTtcclxuICAvKipcclxuICAgKiBAdHlwZSAoR2FsbGVyeSlcclxuICAgKi9cclxuICB2YXIgZ2FsbGVyeSA9IG5ldyBHYWxsZXJ5KCk7XHJcbiAgLyoqXHJcbiAgICog0KLQtdC60YPRidCw0Y8g0YHRgtGA0LDQvdC40YbQsCDRgSDRhNC+0YLQvtCz0YDQsNGE0LjRj9C80LhcclxuICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAqL1xyXG4gIHZhciBjdXJyZW50UGFnZSA9IDA7XHJcbiAgLyoqXHJcbiAgICogQGNvbnN0XHJcbiAgICogQHR5cGUge251bWJlcn1cclxuICAgKi9cclxuICB2YXIgUEFHRV9TSVpFID0gMTI7XHJcbiAgdmFyIExBUkdFX1NDUkVFTl9TSVpFID0gMTM2NztcclxuICAvKipcclxuICAgKiDQpNC+0YDQvNCwINGBINGE0LjQu9GM0YLRgNCw0LzQuFxyXG4gICAqIEB0eXBlIHtFbGVtZW50fVxyXG4gICAqL1xyXG4gIHZhciBmaWx0ZXJzID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy5maWx0ZXJzJyk7XHJcbiAgLyoqXHJcbiAgICog0KLQsNC50LzQsNGD0YIg0LTQu9GPINGB0YLRgNC+0LvQsFxyXG4gICAqL1xyXG4gIHZhciBzY3JvbGxUaW1lb3V0O1xyXG4gIGZ1bmN0aW9uIHNldEZpbHRlcigpIHtcclxuICAgIGZpbHRlcnMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldnQpIHtcclxuICAgICAgdmFyIGNsaWNrZWRFbGVtZW50ID0gZXZ0LnRhcmdldDtcclxuICAgICAgaWYgKGNsaWNrZWRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnZmlsdGVycy1yYWRpbycpKSB7XHJcbiAgICAgICAgc2V0QWN0aXZlRmlsdGVyKGNsaWNrZWRFbGVtZW50LmlkKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIC8qKlxyXG4gICAqINCh0L7QsdGL0YLQuNC1INGB0LrRgNC+0LvQu9CwXHJcbiAgICovXHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgY2xlYXJUaW1lb3V0KHNjcm9sbFRpbWVvdXQpO1xyXG4gICAgc2Nyb2xsVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBjb250YWluZXJDb29yZGluYXRlcyA9IGNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgdmFyIHZpZXdwb3J0U2l6ZSA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuICAgICAgaWYgKGNvbnRhaW5lckNvb3JkaW5hdGVzLnRvcCA8PSB2aWV3cG9ydFNpemUgKSB7XHJcbiAgICAgICAgaWYgKGN1cnJlbnRQYWdlIDwgTWF0aC5jZWlsKGZpbHRlcmVkUGljdHVyZXMubGVuZ3RoIC8gUEFHRV9TSVpFKSkge1xyXG4gICAgICAgICAgcmVuZGVyUGljdHVyZXMoZmlsdGVyZWRQaWN0dXJlcywgKytjdXJyZW50UGFnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LCAxMDApO1xyXG4gIH0pO1xyXG4gIC8qKlxyXG4gICAqINCf0YDQvtCy0LXRgNC60LAg0L3QsCDRgNCw0LfQvNC10YAg0Y3QutGA0LDQvdCwXHJcbiAgICovXHJcbiAgdmFyIHdpbmRvd0xhcmdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAoZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCA+IExBUkdFX1NDUkVFTl9TSVpFKSB7XHJcbiAgICAgIGlmIChjdXJyZW50UGFnZSA8IE1hdGguY2VpbChmaWx0ZXJlZFBpY3R1cmVzLmxlbmd0aCAvIFBBR0VfU0laRSkpIHtcclxuICAgICAgICByZW5kZXJQaWN0dXJlcyhmaWx0ZXJlZFBpY3R1cmVzLCArK2N1cnJlbnRQYWdlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcbiAgZ2V0UGljdHVyZXMoKTtcclxuICBzZXRGaWx0ZXIoKTtcclxuICAvKipcclxuICAgKiDQntGC0YDQuNGB0L7QstC60LAg0LrQsNGA0YLQuNC90L7QulxyXG4gICAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IHBpY3R1cmVzVG9SZW5kZXJcclxuICAgKiBAcGFyYW0ge251bWJlcn0gcGFnZU51bWJlciAtINC90L7QvNC10YAg0YHRgtGA0LDQvdC40YbRiyDQvtGC0L7QsdGA0LDQttC10L3QuNGPXHJcbiAgICogQHBhcmFtIHtib29sZWFufSByZXBsYWNlIC0g0LXRgdC70Lgg0LjRgdGC0LjQvdCwLCDRgtC+INGD0LTQsNC70Y/QtdGCINCy0YHQtSDRgdGD0YnQtdGB0YLQstGD0Y7RidC40LUgRE9NLdGN0LvQtdC80LXQvdGC0Ysg0YEg0YTQvtGC0L7Qs9GA0LDRhNC40Y/QvNC4XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gcmVuZGVyUGljdHVyZXMocGljdHVyZXNUb1JlbmRlciwgcGFnZU51bWJlciwgcmVwbGFjZSkge1xyXG4gICAgaWYgKHJlcGxhY2UpIHtcclxuICAgICAgdmFyIGVsO1xyXG4gICAgICB3aGlsZSAoKGVsID0gcmVuZGVyZWRFbGVtZW50cy5zaGlmdCgpKSkge1xyXG4gICAgICAgIGNvbnRhaW5lci5yZW1vdmVDaGlsZChlbC5lbGVtZW50KTtcclxuICAgICAgICBlbC5vbkNsaWNrID0gbnVsbDtcclxuICAgICAgICBlbC5yZW1vdmUoKTtcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIHZhciBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuICAgIHZhciBmcm9tID0gcGFnZU51bWJlciAqIFBBR0VfU0laRTtcclxuICAgIHZhciB0byA9IGZyb20gKyBQQUdFX1NJWkU7XHJcbiAgICB2YXIgcGFnZVBpY3R1cmVzID0gcGljdHVyZXNUb1JlbmRlci5zbGljZShmcm9tLCB0byk7XHJcbiAgICByZW5kZXJlZEVsZW1lbnRzID0gcmVuZGVyZWRFbGVtZW50cy5jb25jYXQocGFnZVBpY3R1cmVzLm1hcChmdW5jdGlvbihwaWN0dXJlKSB7XHJcbiAgICAgIHZhciBwaG90b0VsZW1lbnQgPSBuZXcgUGhvdG8oKTtcclxuICAgICAgcGhvdG9FbGVtZW50LnNldERhdGEocGljdHVyZSk7XHJcbiAgICAgIHBob3RvRWxlbWVudC5yZW5kZXIoKTtcclxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHBob3RvRWxlbWVudC5lbGVtZW50KTtcclxuICAgICAgcGhvdG9FbGVtZW50Lm9uQ2xpY2sgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBnYWxsZXJ5LnNldERhdGEocGhvdG9FbGVtZW50LmdldERhdGEoKSk7XHJcbiAgICAgICAgbG9jYXRpb24uaGFzaCA9ICcjcGhvdG8nICsgJy8nICsgcGljdHVyZS51cmw7XHJcbiAgICAgIH07XHJcbiAgICAgIHJldHVybiBwaG90b0VsZW1lbnQ7XHJcbiAgICB9KSk7XHJcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xyXG4gIH1cclxuICBmaWx0ZXJzLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xyXG4gIC8qKlxyXG4gICAqINCj0YHRgtCw0L3QvtCy0LrQsCDQstGL0LHRgNCw0L3QvdC+0LPQviDRhNC40LvRjNGC0YDQsFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2VcclxuICAgKi9cclxuICBmdW5jdGlvbiBzZXRBY3RpdmVGaWx0ZXIoaWQsIGZvcmNlKSB7XHJcbiAgICBpZiAoYWN0aXZlRmlsdGVyID09PSBpZCAmJiAhZm9yY2UpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY3VycmVudFBhZ2UgPSAwO1xyXG4gICAgdmFyIHNlbGVjdGVkRmlsdGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyBhY3RpdmVGaWx0ZXIpO1xyXG4gICAgaWYgKHNlbGVjdGVkRmlsdGVyKSB7XHJcbiAgICAgIHNlbGVjdGVkRmlsdGVyLnNldEF0dHJpYnV0ZSgnY2hlY2tlZCcsICdmYWxzZScpO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyBpZCkuc2V0QXR0cmlidXRlKCdjaGVja2VkJywgJ3RydWUnKTtcclxuICAgIGZpbHRlcmVkUGljdHVyZXMgPSBwaWN0dXJlcy5zbGljZSgwKTtcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdhY3RpdmVGaWx0ZXInLCBpZCk7XHJcbiAgICBzd2l0Y2ggKGlkKSB7XHJcbiAgICAgIGNhc2UgJ2ZpbHRlci1kaXNjdXNzZWQnOlxyXG4gICAgICAgIGZpbHRlcmVkUGljdHVyZXMgPSBmaWx0ZXJlZFBpY3R1cmVzLnNvcnQoZnVuY3Rpb24oIGEsIGIgKSB7XHJcbiAgICAgICAgICByZXR1cm4gYi5jb21tZW50cyAtIGEuY29tbWVudHM7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYWN0aXZlRmlsdGVyID0gJ2ZpbHRlci1kaXNjdXNzZWQnO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdmaWx0ZXItbmV3JzpcclxuICAgICAgICBmaWx0ZXJlZFBpY3R1cmVzID0gZmlsdGVyZWRQaWN0dXJlcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShiLmRhdGUpLmdldFRpbWUoKSAtIG5ldyBEYXRlKGEuZGF0ZSkuZ2V0VGltZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciB3ZWVrMiA9IE51bWJlcihuZXcgRGF0ZShuZXcgRGF0ZSgpIC0gMTQgKiAyNCAqIDYwICogNjAgKiAxMDAwKSk7XHJcbiAgICAgICAgZmlsdGVyZWRQaWN0dXJlcyA9IGZpbHRlcmVkUGljdHVyZXMuZmlsdGVyKGZ1bmN0aW9uKHBpY3R1cmUpIHtcclxuICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShwaWN0dXJlLmRhdGUpLmdldFRpbWUoKSA+PSB3ZWVrMjtcclxuICAgICAgICB9KTtcclxuICAgICAgICBhY3RpdmVGaWx0ZXIgPSAnZmlsdGVyLW5ldyc7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ2ZpbHRlci1wb3B1bGFyJzpcclxuICAgICAgICBmaWx0ZXJlZFBpY3R1cmVzID0gcGljdHVyZXM7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICBnYWxsZXJ5LnNldFBpY3R1cmVzKGZpbHRlcmVkUGljdHVyZXMpO1xyXG4gICAgcmVuZGVyUGljdHVyZXMoZmlsdGVyZWRQaWN0dXJlcywgY3VycmVudFBhZ2UsIHRydWUpO1xyXG4gICAgYWN0aXZlRmlsdGVyID0gaWQ7XHJcbiAgICB3aW5kb3dMYXJnZSgpO1xyXG4gIH1cclxuICB2YXIgY2hlY2tIYXNoID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgcmVnZXhwID0gbG9jYXRpb24uaGFzaC5tYXRjaCgvI3Bob3RvXFwvKFxcUyspLyk7XHJcbiAgICBpZiAocmVnZXhwKSB7XHJcbiAgICAgIGdhbGxlcnkuc2V0Q3VycmVudFBpY3R1cmUocmVnZXhwWzFdKTtcclxuICAgICAgZ2FsbGVyeS5zaG93KCk7XHJcbiAgICB9ZWxzZSB7XHJcbiAgICAgIGdhbGxlcnkuaGlkZSgpO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgLyoqXHJcbiAgICog0JfQsNCz0YDRg9C30LrQsCDRgdC/0LjRgdC60LAg0LrQsNGA0YLQuNC90L7QulxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGdldFBpY3R1cmVzKCkge1xyXG4gICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3BpY3R1cmVzLWxvYWRpbmcnKTtcclxuICAgIHZhciBpbWFnZUxvYWRUaW1lb3V0O1xyXG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgeGhyLm9wZW4oJ0dFVCcsICdodHRwczovL28wLmdpdGh1Yi5pby9hc3NldHMvanNvbi9waWN0dXJlcy5qc29uJyk7XHJcbiAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKGV2dCkge1xyXG4gICAgICBjbGVhclRpbWVvdXQoaW1hZ2VMb2FkVGltZW91dCk7XHJcbiAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdwaWN0dXJlcy1sb2FkaW5nJyk7XHJcbiAgICAgIHZhciByYXdEYXRhID0gZXZ0LnRhcmdldC5yZXNwb25zZTtcclxuICAgICAgcGljdHVyZXMgPSBKU09OLnBhcnNlKHJhd0RhdGEpO1xyXG4gICAgICBmaWx0ZXJlZFBpY3R1cmVzID0gcGljdHVyZXMuc2xpY2UoMCk7XHJcbiAgICAgIGdhbGxlcnkuc2V0UGljdHVyZXMoZmlsdGVyZWRQaWN0dXJlcyk7XHJcbiAgICAgIHJlbmRlclBpY3R1cmVzKGZpbHRlcmVkUGljdHVyZXMsIGN1cnJlbnRQYWdlKTtcclxuICAgICAgc2V0QWN0aXZlRmlsdGVyKGFjdGl2ZUZpbHRlciwgdHJ1ZSk7XHJcbiAgICAgIGNoZWNrSGFzaCgpO1xyXG4gICAgICB3aW5kb3dMYXJnZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdwaWN0dXJlcy1mYWlsdXJlJyk7XHJcbiAgICB9KTtcclxuICAgIHZhciBJTUFHRV9USU1FT1VUID0gMTAwMDA7XHJcbiAgICBpbWFnZUxvYWRUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgcGljdHVyZXMgPSAnJztcclxuICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3BpY3R1cmVzLWZhaWx1cmUnKTtcclxuICAgIH0sIElNQUdFX1RJTUVPVVQpO1xyXG4gICAgeGhyLnNlbmQoKTtcclxuICB9XHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCBjaGVja0hhc2gpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbiAgLyoqXHJcbiAgICogQGNvbnN0cnVjdG9yXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGltYWdlXHJcbiAgICovXHJcbiAgdmFyIFJlc2l6ZXIgPSBmdW5jdGlvbihpbWFnZSkge1xyXG4gICAgLy8g0JjQt9C+0LHRgNCw0LbQtdC90LjQtSwg0YEg0LrQvtGC0L7RgNGL0Lwg0LHRg9C00LXRgiDQstC10YHRgtC40YHRjCDRgNCw0LHQvtGC0LAuXHJcbiAgICB0aGlzLl9pbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgdGhpcy5faW1hZ2Uuc3JjID0gaW1hZ2U7XHJcblxyXG4gICAgLy8g0KXQvtC70YHRgi5cclxuICAgIHRoaXMuX2NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgdGhpcy5fY3R4ID0gdGhpcy5fY29udGFpbmVyLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG4gICAgLy8g0KHQvtC30LTQsNC10Lwg0YXQvtC70YHRgiDRgtC+0LvRjNC60L4g0L/QvtGB0LvQtSDQt9Cw0LPRgNGD0LfQutC4INC40LfQvtCx0YDQsNC20LXQvdC40Y8uXHJcbiAgICB0aGlzLl9pbWFnZS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgLy8g0KDQsNC30LzQtdGAINGF0L7Qu9GB0YLQsCDRgNCw0LLQtdC9INGA0LDQt9C80LXRgNGDINC30LDQs9GA0YPQttC10L3QvdC+0LPQviDQuNC30L7QsdGA0LDQttC10L3QuNGPLiDQrdGC0L4g0L3Rg9C20L3QvlxyXG4gICAgICAvLyDQtNC70Y8g0YPQtNC+0LHRgdGC0LLQsCDRgNCw0LHQvtGC0Ysg0YEg0LrQvtC+0YDQtNC40L3QsNGC0LDQvNC4LlxyXG4gICAgICB0aGlzLl9jb250YWluZXIud2lkdGggPSB0aGlzLl9pbWFnZS5uYXR1cmFsV2lkdGg7XHJcbiAgICAgIHRoaXMuX2NvbnRhaW5lci5oZWlnaHQgPSB0aGlzLl9pbWFnZS5uYXR1cmFsSGVpZ2h0O1xyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqINCf0YDQtdC00LvQsNCz0LDQtdC80YvQuSDRgNCw0LfQvNC10YAg0LrQsNC00YDQsCDQsiDQstC40LTQtSDQutC+0Y3RhNGE0LjRhtC40LXQvdGC0LAg0L7RgtC90L7RgdC40YLQtdC70YzQvdC+INC80LXQvdGM0YjQtdC5XHJcbiAgICAgICAqINGB0YLQvtGA0L7QvdGLINC40LfQvtCx0YDQsNC20LXQvdC40Y8uXHJcbiAgICAgICAqIEBjb25zdFxyXG4gICAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICAgKi9cclxuICAgICAgdmFyIElOSVRJQUxfU0lERV9SQVRJTyA9IDAuNzU7XHJcbiAgICAgIC8vINCg0LDQt9C80LXRgCDQvNC10L3RjNGI0LXQuSDRgdGC0L7RgNC+0L3RiyDQuNC30L7QsdGA0LDQttC10L3QuNGPLlxyXG4gICAgICB2YXIgc2lkZSA9IE1hdGgubWluKFxyXG4gICAgICAgICAgdGhpcy5fY29udGFpbmVyLndpZHRoICogSU5JVElBTF9TSURFX1JBVElPLFxyXG4gICAgICAgICAgdGhpcy5fY29udGFpbmVyLmhlaWdodCAqIElOSVRJQUxfU0lERV9SQVRJTyk7XHJcblxyXG4gICAgICAvLyDQmNC30L3QsNGH0LDQu9GM0L3QviDQv9GA0LXQtNC70LDQs9Cw0LXQvNC+0LUg0LrQsNC00YDQuNGA0L7QstCw0L3QuNC1IOKAlCDRh9Cw0YHRgtGMINC/0L4g0YbQtdC90YLRgNGDINGBINGA0LDQt9C80LXRgNC+0Lwg0LIgMy80XHJcbiAgICAgIC8vINC+0YIg0YDQsNC30LzQtdGA0LAg0LzQtdC90YzRiNC10Lkg0YHRgtC+0YDQvtC90YsuXHJcbiAgICAgIHRoaXMuX3Jlc2l6ZUNvbnN0cmFpbnQgPSBuZXcgU3F1YXJlKFxyXG4gICAgICAgICAgdGhpcy5fY29udGFpbmVyLndpZHRoIC8gMiAtIHNpZGUgLyAyLFxyXG4gICAgICAgICAgdGhpcy5fY29udGFpbmVyLmhlaWdodCAvIDIgLSBzaWRlIC8gMixcclxuICAgICAgICAgIHNpZGUpO1xyXG5cclxuICAgICAgLy8g0J7RgtGA0LjRgdC+0LLQutCwINC40LfQvdCw0YfQsNC70YzQvdC+0LPQviDRgdC+0YHRgtC+0Y/QvdC40Y8g0LrQsNC90LLQsNGB0LAuXHJcbiAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICB9LmJpbmQodGhpcyk7XHJcblxyXG4gICAgLy8g0KTQuNC60YHQuNGA0L7QstCw0L3QuNC1INC60L7QvdGC0LXQutGB0YLQsCDQvtCx0YDQsNCx0L7RgtGH0LjQutC+0LIuXHJcbiAgICB0aGlzLl9vbkRyYWdTdGFydCA9IHRoaXMuX29uRHJhZ1N0YXJ0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLl9vbkRyYWdFbmQgPSB0aGlzLl9vbkRyYWdFbmQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuX29uRHJhZyA9IHRoaXMuX29uRHJhZy5iaW5kKHRoaXMpO1xyXG4gIH07XHJcblxyXG4gIFJlc2l6ZXIucHJvdG90eXBlID0ge1xyXG4gICAgLyoqXHJcbiAgICAgKiDQoNC+0LTQuNGC0LXQu9GM0YHQutC40Lkg0Y3Qu9C10LzQtdC90YIg0LrQsNC90LLQsNGB0LAuXHJcbiAgICAgKiBAdHlwZSB7RWxlbWVudH1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9lbGVtZW50OiBudWxsLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/QvtC70L7QttC10L3QuNC1INC60YPRgNGB0L7RgNCwINCyINC80L7QvNC10L3RgiDQv9C10YDQtdGC0LDRgdC60LjQstCw0L3QuNGPLiDQntGCINC/0L7Qu9C+0LbQtdC90LjRjyDQutGD0YDRgdC+0YDQsFxyXG4gICAgICog0YDQsNGB0YHRh9C40YLRi9Cy0LDQtdGC0YHRjyDRgdC80LXRidC10L3QuNC1INC90LAg0LrQvtGC0L7RgNC+0LUg0L3Rg9C20L3QviDQv9C10YDQtdC80LXRgdGC0LjRgtGMINC40LfQvtCx0YDQsNC20LXQvdC40LVcclxuICAgICAqINC30LAg0LrQsNC20LTRg9GOINC40YLQtdGA0LDRhtC40Y4g0L/QtdGA0LXRgtCw0YHQutC40LLQsNC90LjRjy5cclxuICAgICAqIEB0eXBlIHtDb29yZGluYXRlfVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2N1cnNvclBvc2l0aW9uOiBudWxsLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdGK0LXQutGCLCDRhdGA0LDQvdGP0YnQuNC5INC40YLQvtCz0L7QstC+0LUg0LrQsNC00YDQuNGA0L7QstCw0L3QuNC1OiDRgdGC0L7RgNC+0L3QsCDQutCy0LDQtNGA0LDRgtCwINC4INGB0LzQtdGJ0LXQvdC40LVcclxuICAgICAqINC+0YIg0LLQtdGA0YXQvdC10LPQviDQu9C10LLQvtCz0L4g0YPQs9C70LAg0LjRgdGF0L7QtNC90L7Qs9C+INC40LfQvtCx0YDQsNC20LXQvdC40Y8uXHJcbiAgICAgKiBAdHlwZSB7U3F1YXJlfVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX3Jlc2l6ZUNvbnN0cmFpbnQ6IG51bGwsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0YDQuNGB0L7QstC60LAg0LrQsNC90LLQsNGB0LAuXHJcbiAgICAgKi9cclxuICAgIHJlZHJhdzogZnVuY3Rpb24oKSB7XHJcbiAgICAgIC8vINCe0YfQuNGB0YLQutCwINC40LfQvtCx0YDQsNC20LXQvdC40Y8uXHJcbiAgICAgIHRoaXMuX2N0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5fY29udGFpbmVyLndpZHRoLCB0aGlzLl9jb250YWluZXIuaGVpZ2h0KTtcclxuXHJcbiAgICAgIC8vINCf0LDRgNCw0LzQtdGC0YDRiyDQu9C40L3QuNC4LlxyXG4gICAgICAvLyBOQiEg0KLQsNC60LjQtSDQv9Cw0YDQsNC80LXRgtGA0Ysg0YHQvtGF0YDQsNC90Y/RjtGC0YHRjyDQvdCwINCy0YDQtdC80Y8g0LLRgdC10LPQviDQv9GA0L7RhtC10YHRgdCwINC+0YLRgNC40YHQvtCy0LrQuFxyXG4gICAgICAvLyBjYW52YXMnYSDQv9C+0Y3RgtC+0LzRgyDQstCw0LbQvdC+INCy0L7QstGA0LXQvNGPINC/0L7QvNC10L3Rj9GC0Ywg0LjRhSwg0LXRgdC70Lgg0L3Rg9C20L3QviDQvdCw0YfQsNGC0Ywg0L7RgtGA0LjRgdC+0LLQutGDXHJcbiAgICAgIC8vINGH0LXQs9C+LdC70LjQsdC+INGBINC00YDRg9Cz0L7QuSDQvtCx0LLQvtC00LrQvtC5LlxyXG5cclxuICAgICAgLy8g0KLQvtC70YnQuNC90LAg0LvQuNC90LjQuC5cclxuICAgICAgdGhpcy5fY3R4LmxpbmVXaWR0aCA9IDY7XHJcbiAgICAgIC8vINCm0LLQtdGCINC+0LHQstC+0LTQutC4LlxyXG4gICAgICB0aGlzLl9jdHguc3Ryb2tlU3R5bGUgPSAnI2ZmZTc1Myc7XHJcbiAgICAgIC8vINCg0LDQt9C80LXRgCDRiNGC0YDQuNGF0L7Qsi4g0J/QtdGA0LLRi9C5INGN0LvQtdC80LXQvdGCINC80LDRgdGB0LjQstCwINC30LDQtNCw0LXRgiDQtNC70LjQvdGDINGI0YLRgNC40YXQsCwg0LLRgtC+0YDQvtC5XHJcbiAgICAgIC8vINGA0LDRgdGB0YLQvtGP0L3QuNC1INC80LXQttC00YMg0YHQvtGB0LXQtNC90LjQvNC4INGI0YLRgNC40YXQsNC80LguXHJcbiAgICAgIHRoaXMuX2N0eC5zZXRMaW5lRGFzaChbMTUsIDEwXSk7XHJcbiAgICAgIC8vINCh0LzQtdGJ0LXQvdC40LUg0L/QtdGA0LLQvtCz0L4g0YjRgtGA0LjRhdCwINC+0YIg0L3QsNGH0LDQu9CwINC70LjQvdC40LguXHJcbiAgICAgIHRoaXMuX2N0eC5saW5lRGFzaE9mZnNldCA9IDc7XHJcblxyXG4gICAgICAvLyDQodC+0YXRgNCw0L3QtdC90LjQtSDRgdC+0YHRgtC+0Y/QvdC40Y8g0LrQsNC90LLQsNGB0LAuXHJcbiAgICAgIC8vINCf0L7QtNGA0L7QsdC90LXQuSDRgdC8LiDRgdGC0YDQvtC60YMgMTMyLlxyXG4gICAgICB0aGlzLl9jdHguc2F2ZSgpO1xyXG5cclxuICAgICAgLy8g0KPRgdGC0LDQvdC+0LLQutCwINC90LDRh9Cw0LvRjNC90L7QuSDRgtC+0YfQutC4INGB0LjRgdGC0LXQvNGLINC60L7QvtGA0LTQuNC90LDRgiDQsiDRhtC10L3RgtGAINGF0L7Qu9GB0YLQsC5cclxuICAgICAgdGhpcy5fY3R4LnRyYW5zbGF0ZSh0aGlzLl9jb250YWluZXIud2lkdGggLyAyLCB0aGlzLl9jb250YWluZXIuaGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICB2YXIgZGlzcGxYID0gLSh0aGlzLl9yZXNpemVDb25zdHJhaW50LnggKyB0aGlzLl9yZXNpemVDb25zdHJhaW50LnNpZGUgLyAyKTtcclxuICAgICAgdmFyIGRpc3BsWSA9IC0odGhpcy5fcmVzaXplQ29uc3RyYWludC55ICsgdGhpcy5fcmVzaXplQ29uc3RyYWludC5zaWRlIC8gMik7XHJcbiAgICAgIC8vINCe0YLRgNC40YHQvtCy0LrQsCDQuNC30L7QsdGA0LDQttC10L3QuNGPINC90LAg0YXQvtC70YHRgtC1LiDQn9Cw0YDQsNC80LXRgtGA0Ysg0LfQsNC00LDRjtGCINC40LfQvtCx0YDQsNC20LXQvdC40LUsINC60L7RgtC+0YDQvtC1XHJcbiAgICAgIC8vINC90YPQttC90L4g0L7RgtGA0LjRgdC+0LLQsNGC0Ywg0Lgg0LrQvtC+0YDQtNC40L3QsNGC0Ysg0LXQs9C+INCy0LXRgNGF0L3QtdCz0L4g0LvQtdCy0L7Qs9C+INGD0LPQu9CwLlxyXG4gICAgICAvLyDQmtC+0L7RgNC00LjQvdCw0YLRiyDQt9Cw0LTQsNGO0YLRgdGPINC+0YIg0YbQtdC90YLRgNCwINGF0L7Qu9GB0YLQsC5cclxuICAgICAgdGhpcy5fY3R4LmRyYXdJbWFnZSh0aGlzLl9pbWFnZSwgZGlzcGxYLCBkaXNwbFkpO1xyXG5cclxuICAgICAgLy8g0J7RgtGA0LjRgdC+0LLQutCwINC/0YDRj9C80L7Rg9Cz0L7Qu9GM0L3QuNC60LAsINC+0LHQvtC30L3QsNGH0LDRjtGJ0LXQs9C+INC+0LHQu9Cw0YHRgtGMINC40LfQvtCx0YDQsNC20LXQvdC40Y8g0L/QvtGB0LvQtVxyXG4gICAgICAvLyDQutCw0LTRgNC40YDQvtCy0LDQvdC40Y8uINCa0L7QvtGA0LTQuNC90LDRgtGLINC30LDQtNCw0Y7RgtGB0Y8g0L7RgiDRhtC10L3RgtGA0LAuXHJcbiAgICAgIHRoaXMuX2N0eC5zdHJva2VSZWN0KFxyXG4gICAgICAgICAgKC10aGlzLl9yZXNpemVDb25zdHJhaW50LnNpZGUgLyAyKSAtIHRoaXMuX2N0eC5saW5lV2lkdGggLyAyLFxyXG4gICAgICAgICAgKC10aGlzLl9yZXNpemVDb25zdHJhaW50LnNpZGUgLyAyKSAtIHRoaXMuX2N0eC5saW5lV2lkdGggLyAyLFxyXG4gICAgICAgICAgdGhpcy5fcmVzaXplQ29uc3RyYWludC5zaWRlIC0gdGhpcy5fY3R4LmxpbmVXaWR0aCAvIDIsXHJcbiAgICAgICAgICB0aGlzLl9yZXNpemVDb25zdHJhaW50LnNpZGUgLSB0aGlzLl9jdHgubGluZVdpZHRoIC8gMik7XHJcblxyXG4gICAgICB2YXIgY29udGFpbmVyWCA9IC10aGlzLl9jb250YWluZXIud2lkdGggLyAyO1xyXG4gICAgICB2YXIgY29udGFpbmVyWSA9IC10aGlzLl9jb250YWluZXIuaGVpZ2h0IC8gMjtcclxuICAgICAgdmFyIGZpbGxSZWN0U3RhcnQgPSB0aGlzLl9yZXNpemVDb25zdHJhaW50LnNpZGUgLyAyO1xyXG5cclxuICAgICAgdGhpcy5fY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDAsIDAsIDAsIC44KSc7XHJcbiAgICAgIHRoaXMuX2N0eC5tb3ZlVG8oY29udGFpbmVyWCwgY29udGFpbmVyWSk7XHJcbiAgICAgIHRoaXMuX2N0eC5saW5lVG8oY29udGFpbmVyWCArIHRoaXMuX2NvbnRhaW5lci53aWR0aCwgY29udGFpbmVyWSk7XHJcbiAgICAgIHRoaXMuX2N0eC5saW5lVG8oY29udGFpbmVyWCArIHRoaXMuX2NvbnRhaW5lci53aWR0aCwgY29udGFpbmVyWSArIHRoaXMuX2NvbnRhaW5lci5oZWlnaHQpO1xyXG4gICAgICB0aGlzLl9jdHgubGluZVRvKGNvbnRhaW5lclgsIGNvbnRhaW5lclkgKyB0aGlzLl9jb250YWluZXIuaGVpZ2h0KTtcclxuICAgICAgdGhpcy5fY3R4LmxpbmVUbyhjb250YWluZXJYLCBjb250YWluZXJZKTtcclxuXHJcbiAgICAgIHRoaXMuX2N0eC5tb3ZlVG8oLWZpbGxSZWN0U3RhcnQgLSB0aGlzLl9jdHgubGluZVdpZHRoLCAtZmlsbFJlY3RTdGFydCAtIHRoaXMuX2N0eC5saW5lV2lkdGgpO1xyXG4gICAgICB0aGlzLl9jdHgubGluZVRvKC1maWxsUmVjdFN0YXJ0IC0gdGhpcy5fY3R4LmxpbmVXaWR0aCwgZmlsbFJlY3RTdGFydCAtIHRoaXMuX2N0eC5saW5lV2lkdGggLyAyKTtcclxuICAgICAgdGhpcy5fY3R4LmxpbmVUbyhmaWxsUmVjdFN0YXJ0IC0gdGhpcy5fY3R4LmxpbmVXaWR0aCAvIDIsIGZpbGxSZWN0U3RhcnQgLSB0aGlzLl9jdHgubGluZVdpZHRoIC8gMik7XHJcbiAgICAgIHRoaXMuX2N0eC5saW5lVG8oZmlsbFJlY3RTdGFydCAtIHRoaXMuX2N0eC5saW5lV2lkdGggLyAyLCAtZmlsbFJlY3RTdGFydCAtIHRoaXMuX2N0eC5saW5lV2lkdGgpO1xyXG4gICAgICB0aGlzLl9jdHgubGluZVRvKC1maWxsUmVjdFN0YXJ0IC0gdGhpcy5fY3R4LmxpbmVXaWR0aCwgLWZpbGxSZWN0U3RhcnQgLSB0aGlzLl9jdHgubGluZVdpZHRoKTtcclxuXHJcbiAgICAgIHRoaXMuX2N0eC5maWxsKCk7XHJcblxyXG4gICAgICB0aGlzLl9jdHguZm9udCA9ICcyMHB4IE9wZW4gU2Fucyc7XHJcbiAgICAgIHRoaXMuX2N0eC5maWxsU3R5bGUgPSAnI2ZmZic7XHJcbiAgICAgIHRoaXMuX2N0eC50ZXh0QWxpZ24gPSAnY2VudGVyJztcclxuICAgICAgdGhpcy5fY3R4LmZpbGxUZXh0KHRoaXMuX2ltYWdlLm5hdHVyYWxXaWR0aCArICcgeCAnICsgdGhpcy5faW1hZ2UubmF0dXJhbEhlaWdodCwgMCwgKC10aGlzLl9yZXNpemVDb25zdHJhaW50LnNpZGUgLyAyKSAtICh0aGlzLl9jdHgubGluZVdpZHRoICsgdGhpcy5fY3R4LmxpbmVXaWR0aCAvIDIpKTtcclxuXHJcblxyXG4gICAgICAvLyDQktC+0YHRgdGC0LDQvdC+0LLQu9C10L3QuNC1INGB0L7RgdGC0L7Rj9C90LjRjyDQutCw0L3QstCw0YHQsCwg0LrQvtGC0L7RgNC+0LUg0LHRi9C70L4g0LTQviDQstGL0LfQvtCy0LAgY3R4LnNhdmVcclxuICAgICAgLy8g0Lgg0L/QvtGB0LvQtdC00YPRjtGJ0LXQs9C+INC40LfQvNC10L3QtdC90LjRjyDRgdC40YHRgtC10LzRiyDQutC+0L7RgNC00LjQvdCw0YIuINCd0YPQttC90L4g0LTQu9GPINGC0L7Qs9C+LCDRh9GC0L7QsdGLXHJcbiAgICAgIC8vINGB0LvQtdC00YPRjtGJ0LjQuSDQutCw0LTRgCDRgNC40YHQvtCy0LDQu9GB0Y8g0YEg0L/RgNC40LLRi9GH0L3QvtC5INGB0LjRgdGC0LXQvNC+0Lkg0LrQvtC+0YDQtNC40L3QsNGCLCDQs9C00LUg0YLQvtGH0LrQsFxyXG4gICAgICAvLyAwIDAg0L3QsNGF0L7QtNC40YLRgdGPINCyINC70LXQstC+0Lwg0LLQtdGA0YXQvdC10Lwg0YPQs9C70YMg0YXQvtC70YHRgtCwLCDQsiDQv9GA0L7RgtC40LLQvdC+0Lwg0YHQu9GD0YfQsNC1XHJcbiAgICAgIC8vINC90LXQutC+0YDRgNC10LrRgtC90L4g0YHRgNCw0LHQvtGC0LDQtdGCINC00LDQttC1INC+0YfQuNGB0YLQutCwINGF0L7Qu9GB0YLQsCDQuNC70Lgg0L3Rg9C20L3QviDQsdGD0LTQtdGCINC40YHQv9C+0LvRjNC30L7QstCw0YLRjFxyXG4gICAgICAvLyDRgdC70L7QttC90YvQtSDRgNCw0YHRgdGH0LXRgtGLINC00LvRjyDQutC+0L7RgNC00LjQvdCw0YIg0L/RgNGP0LzQvtGD0LPQvtC70YzQvdC40LrQsCwg0LrQvtGC0L7RgNGL0Lkg0L3Rg9C20L3QviDQvtGH0LjRgdGC0LjRgtGMLlxyXG4gICAgICB0aGlzLl9jdHgucmVzdG9yZSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0LrQu9GO0YfQtdC90LjQtSDRgNC10LbQuNC80LAg0L/QtdGA0LXQvNC10YnQtdC90LjRjy4g0JfQsNC/0L7QvNC40L3QsNC10YLRgdGPINGC0LXQutGD0YnQtdC1INC/0L7Qu9C+0LbQtdC90LjQtSDQutGD0YDRgdC+0YDQsCxcclxuICAgICAqINGD0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGC0YHRjyDRhNC70LDQsywg0YDQsNC30YDQtdGI0LDRjtGJ0LjQuSDQv9C10YDQtdC80LXRidC10L3QuNC1INC4INC00L7QsdCw0LLQu9GP0Y7RgtGB0Y8g0L7QsdGA0LDQsdC+0YLRh9C40LrQuCxcclxuICAgICAqINC/0L7Qt9Cy0L7Qu9GP0Y7RidC40LUg0L/QtdGA0LXRgNC40YHQvtCy0YvQstCw0YLRjCDQuNC30L7QsdGA0LDQttC10L3QuNC1INC/0L4g0LzQtdGA0LUg0L/QtdGA0LXRgtCw0YHQutC40LLQsNC90LjRjy5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2VudGVyRHJhZ01vZGU6IGZ1bmN0aW9uKHgsIHkpIHtcclxuICAgICAgdGhpcy5fY3Vyc29yUG9zaXRpb24gPSBuZXcgQ29vcmRpbmF0ZSh4LCB5KTtcclxuICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9vbkRyYWcpO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLl9vbkRyYWdFbmQpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0YvQutC70Y7Rh9C10L3QuNC1INGA0LXQttC40LzQsCDQv9C10YDQtdC80LXRidC10L3QuNGPLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2V4aXREcmFnTW9kZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHRoaXMuX2N1cnNvclBvc2l0aW9uID0gbnVsbDtcclxuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9vbkRyYWcpO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLl9vbkRyYWdFbmQpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0LXRgNC10LzQtdGJ0LXQvdC40LUg0LjQt9C+0LHRgNCw0LbQtdC90LjRjyDQvtGC0L3QvtGB0LjRgtC10LvRjNC90L4g0LrQsNC00YDQsC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgdXBkYXRlUG9zaXRpb246IGZ1bmN0aW9uKHgsIHkpIHtcclxuICAgICAgdGhpcy5tb3ZlQ29uc3RyYWludChcclxuICAgICAgICAgIHRoaXMuX2N1cnNvclBvc2l0aW9uLnggLSB4LFxyXG4gICAgICAgICAgdGhpcy5fY3Vyc29yUG9zaXRpb24ueSAtIHkpO1xyXG4gICAgICB0aGlzLl9jdXJzb3JQb3NpdGlvbiA9IG5ldyBDb29yZGluYXRlKHgsIHkpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZ0XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfb25EcmFnU3RhcnQ6IGZ1bmN0aW9uKGV2dCkge1xyXG4gICAgICB0aGlzLl9lbnRlckRyYWdNb2RlKGV2dC5jbGllbnRYLCBldnQuY2xpZW50WSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdGA0LDQsdC+0YLRh9C40Log0L7QutC+0L3Rh9Cw0L3QuNGPINC/0LXRgNC10YLQsNGB0LrQuNCy0LDQvdC40Y8uXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfb25EcmFnRW5kOiBmdW5jdGlvbigpIHtcclxuICAgICAgdGhpcy5fZXhpdERyYWdNb2RlKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdGA0LDQsdC+0YLRh9C40Log0YHQvtCx0YvRgtC40Y8g0L/QtdGA0LXRgtCw0YHQutC40LLQsNC90LjRjy5cclxuICAgICAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZ0XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfb25EcmFnOiBmdW5jdGlvbihldnQpIHtcclxuICAgICAgdGhpcy51cGRhdGVQb3NpdGlvbihldnQuY2xpZW50WCwgZXZ0LmNsaWVudFkpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCU0L7QsdCw0LLQu9C10L3QuNC1INGN0LvQtdC80LXQvdGC0LAg0LIgRE9NLlxyXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XHJcbiAgICAgKi9cclxuICAgIHNldEVsZW1lbnQ6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuICAgICAgaWYgKHRoaXMuX2VsZW1lbnQgPT09IGVsZW1lbnQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuX2VsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICB0aGlzLl9lbGVtZW50Lmluc2VydEJlZm9yZSh0aGlzLl9jb250YWluZXIsIHRoaXMuX2VsZW1lbnQuZmlyc3RDaGlsZCk7XHJcbiAgICAgIC8vINCe0LHRgNCw0LHQvtGC0YfQuNC60Lgg0L3QsNGH0LDQu9CwINC4INC60L7QvdGG0LAg0L/QtdGA0LXRgtCw0YHQutC40LLQsNC90LjRjy5cclxuICAgICAgdGhpcy5fY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuX29uRHJhZ1N0YXJ0KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQktC+0LfQstGA0LDRidCw0LXRgiDQutCw0LTRgNC40YDQvtCy0LDQvdC40LUg0Y3Qu9C10LzQtdC90YLQsC5cclxuICAgICAqIEByZXR1cm4ge1NxdWFyZX1cclxuICAgICAqL1xyXG4gICAgZ2V0Q29uc3RyYWludDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNpemVDb25zdHJhaW50O1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0LzQtdGJ0LDQtdGCINC60LDQtNGA0LjRgNC+0LLQsNC90LjQtSDQvdCwINC30L3QsNGH0LXQvdC40LUg0YPQutCw0LfQsNC90L3QvtC1INCyINC/0LDRgNCw0LzQtdGC0YDQsNGFLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRlbHRhWFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRlbHRhWVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRlbHRhU2lkZVxyXG4gICAgICovXHJcbiAgICBtb3ZlQ29uc3RyYWludDogZnVuY3Rpb24oZGVsdGFYLCBkZWx0YVksIGRlbHRhU2lkZSkge1xyXG4gICAgICB0aGlzLnNldENvbnN0cmFpbnQoXHJcbiAgICAgICAgICB0aGlzLl9yZXNpemVDb25zdHJhaW50LnggKyAoZGVsdGFYIHx8IDApLFxyXG4gICAgICAgICAgdGhpcy5fcmVzaXplQ29uc3RyYWludC55ICsgKGRlbHRhWSB8fCAwKSxcclxuICAgICAgICAgIHRoaXMuX3Jlc2l6ZUNvbnN0cmFpbnQuc2lkZSArIChkZWx0YVNpZGUgfHwgMCkpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNpZGVcclxuICAgICAqL1xyXG4gICAgc2V0Q29uc3RyYWludDogZnVuY3Rpb24oeCwgeSwgc2lkZSkge1xyXG4gICAgICBpZiAodHlwZW9mIHggIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGhpcy5fcmVzaXplQ29uc3RyYWludC54ID0geDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHR5cGVvZiB5ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHRoaXMuX3Jlc2l6ZUNvbnN0cmFpbnQueSA9IHk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0eXBlb2Ygc2lkZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICB0aGlzLl9yZXNpemVDb25zdHJhaW50LnNpZGUgPSBzaWRlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3Jlc2l6ZXJjaGFuZ2UnKSk7XHJcbiAgICAgIH0uYmluZCh0aGlzKSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KPQtNCw0LvQtdC90LjQtS4g0KPQsdC40YDQsNC10YIg0LrQvtC90YLQtdC50L3QtdGAINC40Lcg0YDQvtC00LjRgtC10LvRjNGB0LrQvtCz0L4g0Y3Qu9C10LzQtdC90YLQsCwg0YPQsdC40YDQsNC10YJcclxuICAgICAqINCy0YHQtSDQvtCx0YDQsNCx0L7RgtGH0LjQutC4INGB0L7QsdGL0YLQuNC5INC4INGD0LHQuNGA0LDQtdGCINGB0YHRi9C70LrQuC5cclxuICAgICAqL1xyXG4gICAgcmVtb3ZlOiBmdW5jdGlvbigpIHtcclxuICAgICAgdGhpcy5fZWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLl9jb250YWluZXIpO1xyXG5cclxuICAgICAgdGhpcy5fY29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuX29uRHJhZ1N0YXJ0KTtcclxuICAgICAgdGhpcy5fY29udGFpbmVyID0gbnVsbDtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQrdC60YHQv9C+0YDRgiDQvtCx0YDQtdC30LDQvdC90L7Qs9C+INC40LfQvtCx0YDQsNC20LXQvdC40Y8g0LrQsNC6IEhUTUxJbWFnZUVsZW1lbnQg0Lgg0LjRgdGF0L7QtNC90LjQutC+0LxcclxuICAgICAqINC60LDRgNGC0LjQvdC60Lgg0LIgc3JjINCyINGE0L7RgNC80LDRgtC1IGRhdGFVUkwuXHJcbiAgICAgKiBAcmV0dXJuIHtJbWFnZX1cclxuICAgICAqL1xyXG4gICAgZXhwb3J0SW1hZ2U6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAvLyDQodC+0LfQtNCw0LXQvCBJbWFnZSwg0YEg0YDQsNC30LzQtdGA0LDQvNC4LCDRg9C60LDQt9Cw0L3QvdGL0LzQuCDQv9GA0Lgg0LrQsNC00YDQuNGA0L7QstCw0L3QuNC4LlxyXG4gICAgICB2YXIgaW1hZ2VUb0V4cG9ydCA9IG5ldyBJbWFnZSgpO1xyXG5cclxuICAgICAgLy8g0KHQvtC30LTQsNC10YLRgdGPINC90L7QstGL0LkgY2FudmFzLCDQv9C+INGA0LDQt9C80LXRgNCw0Lwg0YHQvtCy0L/QsNC00LDRjtGJ0LjQuSDRgSDQutCw0LTRgNC40YDQvtCy0LDQvdC90YvQvFxyXG4gICAgICAvLyDQuNC30L7QsdGA0LDQttC10L3QuNC10LwsINCyINC90LXQs9C+INC00L7QsdCw0LLQu9GP0LXRgtGB0Y8g0LjQt9C+0LHRgNCw0LbQtdC90LjQtSDQstC30Y/RgtC+0LUg0LjQtyDQutCw0L3QstCw0YHQsFxyXG4gICAgICAvLyDRgSDQuNC30LzQtdC90LXQvdC90YvQvNC4INC60L7QvtGA0LTQuNC90LDRgtCw0LzQuCDQuCDRgdC+0YXRgNCw0L3Rj9C10YLRgdGPINCyIGRhdGFVUkwsINGBINC/0L7QvNC+0YnRjNGOINC80LXRgtC+0LTQsFxyXG4gICAgICAvLyB0b0RhdGFVUkwuINCf0L7Qu9GD0YfQtdC90L3Ri9C5INC40YHRhdC+0LTQvdGL0Lkg0LrQvtC0LCDQt9Cw0L/QuNGB0YvQstCw0LXRgtGB0Y8g0LIgc3JjINGDINGA0LDQvdC10LVcclxuICAgICAgLy8g0YHQvtC30LTQsNC90L3QvtCz0L4g0LjQt9C+0LHRgNCw0LbQtdC90LjRjy5cclxuICAgICAgdmFyIHRlbXBvcmFyeUNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgICB2YXIgdGVtcG9yYXJ5Q3R4ID0gdGVtcG9yYXJ5Q2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgIHRlbXBvcmFyeUNhbnZhcy53aWR0aCA9IHRoaXMuX3Jlc2l6ZUNvbnN0cmFpbnQuc2lkZTtcclxuICAgICAgdGVtcG9yYXJ5Q2FudmFzLmhlaWdodCA9IHRoaXMuX3Jlc2l6ZUNvbnN0cmFpbnQuc2lkZTtcclxuICAgICAgdGVtcG9yYXJ5Q3R4LmRyYXdJbWFnZSh0aGlzLl9pbWFnZSxcclxuICAgICAgICAgIC10aGlzLl9yZXNpemVDb25zdHJhaW50LngsXHJcbiAgICAgICAgICAtdGhpcy5fcmVzaXplQ29uc3RyYWludC55KTtcclxuICAgICAgaW1hZ2VUb0V4cG9ydC5zcmMgPSB0ZW1wb3JhcnlDYW52YXMudG9EYXRhVVJMKCdpbWFnZS9wbmcnKTtcclxuXHJcbiAgICAgIHJldHVybiBpbWFnZVRvRXhwb3J0O1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqINCS0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvQuSDRgtC40L8sINC+0L/QuNGB0YvQstCw0Y7RidC40Lkg0LrQstCw0LTRgNCw0YIuXHJcbiAgICogQGNvbnN0cnVjdG9yXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHhcclxuICAgKiBAcGFyYW0ge251bWJlcn0geVxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzaWRlXHJcbiAgICogQHByaXZhdGVcclxuICAgKi9cclxuICB2YXIgU3F1YXJlID0gZnVuY3Rpb24oeCwgeSwgc2lkZSkge1xyXG4gICAgdGhpcy54ID0geDtcclxuICAgIHRoaXMueSA9IHk7XHJcbiAgICB0aGlzLnNpZGUgPSBzaWRlO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqINCS0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvQuSDRgtC40L8sINC+0L/QuNGB0YvQstCw0Y7RidC40Lkg0LrQvtC+0YDQtNC40L3QsNGC0YMuXHJcbiAgICogQGNvbnN0cnVjdG9yXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHhcclxuICAgKiBAcGFyYW0ge251bWJlcn0geVxyXG4gICAqIEBwcml2YXRlXHJcbiAgICovXHJcbiAgdmFyIENvb3JkaW5hdGUgPSBmdW5jdGlvbih4LCB5KSB7XHJcbiAgICB0aGlzLnggPSB4O1xyXG4gICAgdGhpcy55ID0geTtcclxuICB9O1xyXG5cclxuICAgbW9kdWxlLmV4cG9ydHMgPSAgUmVzaXplcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5yZXF1aXJlKFwiLi9waWN0dXJlc1wiKSxcclxucmVxdWlyZShcIi4vdXBsb2FkXCIpO1xyXG5cclxuXHJcbiIsIi8qKlxyXG4gKiBAZmlsZW92ZXJ2aWV3XHJcbiAqIEBhdXRob3IgSWdvciBBbGV4ZWVua28gKG8wKVxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxudmFyIFJlc2l6ZXIgPSByZXF1aXJlKFwiLi9yZXNpemVyXCIpO1xyXG5cclxuICAgIG5ldyBSZXNpemVyKCk7XHJcblxyXG4gIC8qKiBAZW51bSB7c3RyaW5nfSAqL1xyXG4gIHZhciBGaWxlVHlwZSA9IHtcclxuICAgICdHSUYnOiAnJyxcclxuICAgICdKUEVHJzogJycsXHJcbiAgICAnUE5HJzogJycsXHJcbiAgICAnU1ZHK1hNTCc6ICcnXHJcbiAgfTtcclxuXHJcbiAgLyoqIEBlbnVtIHtudW1iZXJ9ICovXHJcbiAgdmFyIEFjdGlvbiA9IHtcclxuICAgIEVSUk9SOiAwLFxyXG4gICAgVVBMT0FESU5HOiAxLFxyXG4gICAgQ1VTVE9NOiAyXHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICog0KDQtdCz0YPQu9GP0YDQvdC+0LUg0LLRi9GA0LDQttC10L3QuNC1LCDQv9GA0L7QstC10YDRj9GO0YnQtdC1INGC0LjQvyDQt9Cw0LPRgNGD0LbQsNC10LzQvtCz0L4g0YTQsNC50LvQsC4g0KHQvtGB0YLQsNCy0LvRj9C10YLRgdGPXHJcbiAgICog0LjQtyDQutC70Y7Rh9C10LkgRmlsZVR5cGUuXHJcbiAgICogQHR5cGUge1JlZ0V4cH1cclxuICAgKi9cclxuICB2YXIgZmlsZVJlZ0V4cCA9IG5ldyBSZWdFeHAoJ15pbWFnZS8oJyArIE9iamVjdC5rZXlzKEZpbGVUeXBlKS5qb2luKCd8JykucmVwbGFjZSgnXFwrJywgJ1xcXFwrJykgKyAnKSQnLCAnaScpO1xyXG5cclxuICAvKipcclxuICAgKiBAdHlwZSB7T2JqZWN0LjxzdHJpbmcsIHN0cmluZz59XHJcbiAgICovXHJcbiAgdmFyIGZpbHRlck1hcDtcclxuXHJcbiAgLyoqXHJcbiAgICog0J7QsdGK0LXQutGCLCDQutC+0YLQvtGA0YvQuSDQt9Cw0L3QuNC80LDQtdGC0YHRjyDQutCw0LTRgNC40YDQvtCy0LDQvdC40LXQvCDQuNC30L7QsdGA0LDQttC10L3QuNGPLlxyXG4gICAqIEB0eXBlIHtSZXNpemVyfVxyXG4gICAqL1xyXG4gIHZhciBjdXJyZW50UmVzaXplcjtcclxuXHJcbiAgLyoqXHJcbiAgICog0KPQtNCw0LvRj9C10YIg0YLQtdC60YPRidC40Lkg0L7QsdGK0LXQutGCIHtAbGluayBSZXNpemVyfSwg0YfRgtC+0LHRiyDRgdC+0LfQtNCw0YLRjCDQvdC+0LLRi9C5INGBINC00YDRg9Cz0LjQvFxyXG4gICAqINC40LfQvtCx0YDQsNC20LXQvdC40LXQvC5cclxuICAgKi9cclxuICBmdW5jdGlvbiBjbGVhbnVwUmVzaXplcigpIHtcclxuICAgIGlmIChjdXJyZW50UmVzaXplcikge1xyXG4gICAgICBjdXJyZW50UmVzaXplci5yZW1vdmUoKTtcclxuICAgICAgY3VycmVudFJlc2l6ZXIgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuICAvKipcclxuICAgKiDQodGC0LDQstC40YIg0L7QtNC90YMg0LjQtyDRgtGA0LXRhSDRgdC70YPRh9Cw0LnQvdGL0YUg0LrQsNGA0YLQuNC90L7QuiDQvdCwINGE0L7QvSDRhNC+0YDQvNGLINC30LDQs9GA0YPQt9C60LguXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gdXBkYXRlQmFja2dyb3VuZCgpIHtcclxuICAgIHZhciBpbWFnZXMgPSBbXHJcbiAgICAgICdpbWcvbG9nby1iYWNrZ3JvdW5kLTEuanBnJyxcclxuICAgICAgJ2ltZy9sb2dvLWJhY2tncm91bmQtMi5qcGcnLFxyXG4gICAgICAnaW1nL2xvZ28tYmFja2dyb3VuZC0zLmpwZydcclxuICAgIF07XHJcblxyXG4gICAgdmFyIGJhY2tncm91bmRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVwbG9hZCcpO1xyXG4gICAgdmFyIHJhbmRvbUltYWdlTnVtYmVyID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogKGltYWdlcy5sZW5ndGggLSAxKSk7XHJcbiAgICBiYWNrZ3JvdW5kRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKCcgKyBpbWFnZXNbcmFuZG9tSW1hZ2VOdW1iZXJdICsgJyknO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog0J/RgNC+0LLQtdGA0Y/QtdGCLCDQstCw0LvQuNC00L3RiyDQu9C4INC00LDQvdC90YvQtSwg0LIg0YTQvtGA0LzQtSDQutCw0LTRgNC40YDQvtCy0LDQvdC40Y8uXHJcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cclxuICAgKi9cclxuICBmdW5jdGlvbiByZXNpemVGb3JtSXNWYWxpZCgpIHtcclxuICAgIGlmIChjdXJyZW50UmVzaXplcikge1xyXG4gICAgICBpZiAoKE51bWJlcihzaWRlRm9ybS52YWx1ZSkgKyBOdW1iZXIobGVmdEZvcm0udmFsdWUpIDw9IGN1cnJlbnRSZXNpemVyLl9pbWFnZS5uYXR1cmFsV2lkdGgpICYmIChOdW1iZXIoc2lkZUZvcm0udmFsdWUpICsgTnVtYmVyKGFib3ZlRm9ybS52YWx1ZSkgPD0gY3VycmVudFJlc2l6ZXIuX2ltYWdlLm5hdHVyYWxIZWlnaHQgKSAmJiBOdW1iZXIoc2lkZUZvcm0udmFsdWUpICE9PSAwICYmIE51bWJlcihsZWZ0Rm9ybS52YWx1ZSkgIT09IDAgJiYgTnVtYmVyKGFib3ZlRm9ybS52YWx1ZSkgIT09IDAgKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHZhbHVlRm9ybSgpIHtcclxuICAgIHZhciBjaGFuZ2UgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcclxuICAgIGNoYW5nZS5pbml0Q3VzdG9tRXZlbnQoJ3Jlc2l6ZXJjaGFuZ2UnLCBmYWxzZSwgZmFsc2UsIHt9KTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemVyY2hhbmdlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGxlZnRGb3JtLnZhbHVlID0gY3VycmVudFJlc2l6ZXIuZ2V0Q29uc3RyYWludCgpLng7XHJcbiAgICAgIGFib3ZlRm9ybS52YWx1ZSA9IGN1cnJlbnRSZXNpemVyLmdldENvbnN0cmFpbnQoKS55O1xyXG4gICAgICBzaWRlRm9ybS52YWx1ZSA9IGN1cnJlbnRSZXNpemVyLmdldENvbnN0cmFpbnQoKS5zaWRlO1xyXG4gICAgfSk7XHJcbiAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChjaGFuZ2UpO1xyXG4gIH1cclxuXHJcbiAgLy/Qo9GB0YLQsNC90L7QstC60LAg0LfQvdCw0YfQtdC90LjQuSDRgdC80LXRidC10L3QuNGPINC90LAg0YTQvtGA0LzRg1xyXG4gIC8qKlxyXG4gICAqINCk0L7RgNC80LAg0LfQsNCz0YDRg9C30LrQuCDQuNC30L7QsdGA0LDQttC10L3QuNGPLlxyXG4gICAqIEB0eXBlIHtIVE1MRm9ybUVsZW1lbnR9XHJcbiAgICovXHJcbiAgdmFyIHVwbG9hZEZvcm0gPSBkb2N1bWVudC5mb3Jtc1sndXBsb2FkLXNlbGVjdC1pbWFnZSddO1xyXG5cclxuICAvKipcclxuICAgKiDQpNC+0YDQvNCwINC60LDQtNGA0LjRgNC+0LLQsNC90LjRjyDQuNC30L7QsdGA0LDQttC10L3QuNGPLlxyXG4gICAqIEB0eXBlIHtIVE1MRm9ybUVsZW1lbnR9XHJcbiAgICovXHJcbiAgdmFyIHJlc2l6ZUZvcm0gPSBkb2N1bWVudC5mb3Jtc1sndXBsb2FkLXJlc2l6ZSddO1xyXG4gIHZhciBzdWJtaXRCdXR0b24gPSByZXNpemVGb3JtWydyZXNpemUtZndkJ107XHJcblxyXG5cclxuICAvKipcclxuICAgKiDQpNC+0YDQvNCwINC00L7QsdCw0LLQu9C10L3QuNGPINGE0LjQu9GM0YLRgNCwLlxyXG4gICAqIEB0eXBlIHtIVE1MRm9ybUVsZW1lbnR9XHJcbiAgICovXHJcbiAgdmFyIGZpbHRlckZvcm0gPSBkb2N1bWVudC5mb3Jtc1sndXBsb2FkLWZpbHRlciddO1xyXG4gIHZhciBmaWx0ZXJDb29raWUgPSB3aW5kb3cuZG9jQ29va2llcy5nZXRJdGVtKCd1cGxvYWQtZmlsdGVyJyk7XHJcbiAgdmFyIGZpbHRlckZvcm1Db250cm9scyA9IGZpbHRlckZvcm0ucXVlcnlTZWxlY3RvcignLnVwbG9hZC1maWx0ZXItY29udHJvbHMnKTtcclxuICB2YXIgZmlsdGVyaW5wdXQgPSBmaWx0ZXJGb3JtQ29udHJvbHMucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbHRlcmlucHV0Lmxlbmd0aDsgaSsrICkge1xyXG4gICAgaWYgKGZpbHRlcmlucHV0W2ldLmlkID09PSBmaWx0ZXJDb29raWUgKSB7XHJcbiAgICAgIGZpbHRlcmlucHV0W2ldLmNoZWNrZWQgPSAnY2hlY2tlZCc7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8qKlxyXG4gICAqIEB0eXBlIHtIVE1MSW1hZ2VFbGVtZW50fVxyXG4gICAqL1xyXG4gIHZhciBmaWx0ZXJJbWFnZSA9IGZpbHRlckZvcm0ucXVlcnlTZWxlY3RvcignLmZpbHRlci1pbWFnZS1wcmV2aWV3Jyk7XHJcbiAgZmlsdGVySW1hZ2UuY2xhc3NOYW1lID0gd2luZG93LmRvY0Nvb2tpZXMuZ2V0SXRlbSgnZmlsdGVyLWltYWdlLXByZXZpZXcnKTtcclxuICAvKipcclxuICAgKiBAdHlwZSB7SFRNTEVsZW1lbnR9XHJcbiAgICovXHJcbiAgdmFyIHVwbG9hZE1lc3NhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudXBsb2FkLW1lc3NhZ2UnKTtcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtBY3Rpb259IGFjdGlvblxyXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gbWVzc2FnZVxyXG4gICAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gc2hvd01lc3NhZ2UoYWN0aW9uLCBtZXNzYWdlKSB7XHJcbiAgICB2YXIgaXNFcnJvciA9IGZhbHNlO1xyXG5cclxuICAgIHN3aXRjaCAoYWN0aW9uKSB7XHJcbiAgICAgIGNhc2UgQWN0aW9uLlVQTE9BRElORzpcclxuICAgICAgICBtZXNzYWdlID0gbWVzc2FnZSB8fCAn0JrQtdC60YHQvtCz0YDQsNC80LjQvCZoZWxsaXA7JztcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgQWN0aW9uLkVSUk9SOlxyXG4gICAgICAgIGlzRXJyb3IgPSB0cnVlO1xyXG4gICAgICAgIG1lc3NhZ2UgPSBtZXNzYWdlIHx8ICfQndC10L/QvtC00LTQtdGA0LbQuNCy0LDQtdC80YvQuSDRhNC+0YDQvNCw0YIg0YTQsNC50LvQsDxicj4gPGEgaHJlZj1cIicgKyBkb2N1bWVudC5sb2NhdGlvbiArICdcIj7Qn9C+0L/RgNC+0LHQvtCy0LDRgtGMINC10YnQtSDRgNCw0Lc8L2E+Lic7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gICAgdXBsb2FkTWVzc2FnZS5xdWVyeVNlbGVjdG9yKCcudXBsb2FkLW1lc3NhZ2UtY29udGFpbmVyJykuaW5uZXJIVE1MID0gbWVzc2FnZTtcclxuICAgIHVwbG9hZE1lc3NhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnaW52aXNpYmxlJyk7XHJcbiAgICB1cGxvYWRNZXNzYWdlLmNsYXNzTGlzdC50b2dnbGUoJ3VwbG9hZC1tZXNzYWdlLWVycm9yJywgaXNFcnJvcik7XHJcbiAgICByZXR1cm4gdXBsb2FkTWVzc2FnZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhpZGVNZXNzYWdlKCkge1xyXG4gICAgdXBsb2FkTWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdpbnZpc2libGUnKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqINCe0LHRgNCw0LHQvtGC0YfQuNC6INC40LfQvNC10L3QtdC90LjRjyDQuNC30L7QsdGA0LDQttC10L3QuNGPINCyINGE0L7RgNC80LUg0LfQsNCz0YDRg9C30LrQuC4g0JXRgdC70Lgg0LfQsNCz0YDRg9C20LXQvdC90YvQuVxyXG4gICAqINGE0LDQudC7INGP0LLQu9GP0LXRgtGB0Y8g0LjQt9C+0LHRgNCw0LbQtdC90LjQtdC8LCDRgdGH0LjRgtGL0LLQsNC10YLRgdGPINC40YHRhdC+0LTQvdC40Log0LrQsNGA0YLQuNC90LrQuCwg0YHQvtC30LTQsNC10YLRgdGPXHJcbiAgICogUmVzaXplciDRgSDQt9Cw0LPRgNGD0LbQtdC90L3QvtC5INC60LDRgNGC0LjQvdC60L7QuSwg0LTQvtCx0LDQstC70Y/QtdGC0YHRjyDQsiDRhNC+0YDQvNGDINC60LDQtNGA0LjRgNC+0LLQsNC90LjRj1xyXG4gICAqINC4INC/0L7QutCw0LfRi9Cy0LDQtdGC0YHRjyDRhNC+0YDQvNCwINC60LDQtNGA0LjRgNC+0LLQsNC90LjRjy5cclxuICAgKiBAcGFyYW0ge0V2ZW50fSBldnRcclxuICAgKi9cclxuICB2YXIgbGVmdEZvcm0gPSByZXNpemVGb3JtWydyZXNpemUteCddO1xyXG4gIHZhciBhYm92ZUZvcm0gPSByZXNpemVGb3JtWydyZXNpemUteSddO1xyXG4gIHZhciBzaWRlRm9ybSA9IHJlc2l6ZUZvcm1bJ3Jlc2l6ZS1zaXplJ107XHJcblxyXG4gIGFib3ZlRm9ybS5taW4gPSAwO1xyXG4gIGxlZnRGb3JtLm1pbiA9IDA7XHJcbiAgc2lkZUZvcm0ubWluID0gMTtcclxuICByZXNpemVGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgY3VycmVudFJlc2l6ZXIuc2V0Q29uc3RyYWludCgrbGVmdEZvcm0udmFsdWUsICthYm92ZUZvcm0udmFsdWUsICtzaWRlRm9ybS52YWx1ZSk7XHJcbiAgfSk7XHJcbiAgdXBsb2FkRm9ybS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihldnQpIHtcclxuICAgIHZhciBlbGVtZW50ID0gZXZ0LnRhcmdldDtcclxuICAgIGlmIChlbGVtZW50LmlkID09PSAndXBsb2FkLWZpbGUnKSB7XHJcbiAgICAgIC8vINCf0YDQvtCy0LXRgNC60LAg0YLQuNC/0LAg0LfQsNCz0YDRg9C20LDQtdC80L7Qs9C+INGE0LDQudC70LAsINGC0LjQvyDQtNC+0LvQttC10L0g0LHRi9GC0Ywg0LjQt9C+0LHRgNCw0LbQtdC90LjQtdC8XHJcbiAgICAgIC8vINC+0LTQvdC+0LPQviDQuNC3INGE0L7RgNC80LDRgtC+0LI6IEpQRUcsIFBORywgR0lGINC40LvQuCBTVkcuXHJcbiAgICAgIGlmIChmaWxlUmVnRXhwLnRlc3QoZWxlbWVudC5maWxlc1swXS50eXBlKSkge1xyXG4gICAgICAgIHZhciBmaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcbiAgICAgICAgc2hvd01lc3NhZ2UoQWN0aW9uLlVQTE9BRElORyk7XHJcblxyXG4gICAgICAgIGZpbGVSZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgY2xlYW51cFJlc2l6ZXIoKTtcclxuXHJcbiAgICAgICAgICBjdXJyZW50UmVzaXplciA9IG5ldyBSZXNpemVyKGZpbGVSZWFkZXIucmVzdWx0KTtcclxuICAgICAgICAgIGN1cnJlbnRSZXNpemVyLnNldEVsZW1lbnQocmVzaXplRm9ybSk7XHJcblxyXG4gICAgICAgICAgdXBsb2FkTWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdpbnZpc2libGUnKTtcclxuICAgICAgICAgIHVwbG9hZEZvcm0uY2xhc3NMaXN0LmFkZCgnaW52aXNpYmxlJyk7XHJcbiAgICAgICAgICByZXNpemVGb3JtLmNsYXNzTGlzdC5yZW1vdmUoJ2ludmlzaWJsZScpO1xyXG4gICAgICAgICAgaGlkZU1lc3NhZ2UoKTtcclxuICAgICAgICAgIHNldFRpbWVvdXQodmFsdWVGb3JtLCAxKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZmlsZVJlYWRlci5yZWFkQXNEYXRhVVJMKGVsZW1lbnQuZmlsZXNbMF0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vINCf0L7QutCw0Lcg0YHQvtC+0LHRidC10L3QuNGPINC+0LEg0L7RiNC40LHQutC1LCDQtdGB0LvQuCDQt9Cw0LPRgNGD0LbQsNC10LzRi9C5INGE0LDQudC7LCDQvdC1INGP0LLQu9GP0LXRgtGB0Y9cclxuICAgICAgICAvLyDQv9C+0LTQtNC10YDQttC40LLQsNC10LzRi9C8INC40LfQvtCx0YDQsNC20LXQvdC40LXQvC5cclxuICAgICAgICBzaG93TWVzc2FnZShBY3Rpb24uRVJST1IpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIC8qKlxyXG4gICAqINCe0LHRgNCw0LHQvtGC0LrQsCDRgdCx0YDQvtGB0LAg0YTQvtGA0LzRiyDQutCw0LTRgNC40YDQvtCy0LDQvdC40Y8uINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINCyINC90LDRh9Cw0LvRjNC90L7QtSDRgdC+0YHRgtC+0Y/QvdC40LVcclxuICAgKiDQuCDQvtCx0L3QvtCy0LvRj9C10YIg0YTQvtC9LlxyXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dFxyXG4gICAqL1xyXG4gIHJlc2l6ZUZvcm0uYWRkRXZlbnRMaXN0ZW5lcigncmVzZXQnLCBmdW5jdGlvbihldnQpIHtcclxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGNsZWFudXBSZXNpemVyKCk7XHJcbiAgICB1cGRhdGVCYWNrZ3JvdW5kKCk7XHJcblxyXG4gICAgcmVzaXplRm9ybS5jbGFzc0xpc3QuYWRkKCdpbnZpc2libGUnKTtcclxuICAgIHVwbG9hZEZvcm0uY2xhc3NMaXN0LnJlbW92ZSgnaW52aXNpYmxlJyk7XHJcbiAgfSk7XHJcblxyXG4gIC8qKlxyXG4gICAqINCe0LHRgNCw0LHQvtGC0LrQsCDQvtGC0L/RgNCw0LLQutC4INGE0L7RgNC80Ysg0LrQsNC00YDQuNGA0L7QstCw0L3QuNGPLiDQldGB0LvQuCDRhNC+0YDQvNCwINCy0LDQu9C40LTQvdCwLCDRjdC60YHQv9C+0YDRgtC40YDRg9C10YJcclxuICAgKiDQutGA0L7Qv9C90YPRgtC+0LUg0LjQt9C+0LHRgNCw0LbQtdC90LjQtSDQsiDRhNC+0YDQvNGDINC00L7QsdCw0LLQu9C10L3QuNGPINGE0LjQu9GM0YLRgNCwINC4INC/0L7QutCw0LfRi9Cy0LDQtdGCINC10LUuXHJcbiAgICogQHBhcmFtIHtFdmVudH0gZXZ0XHJcbiAgICovXHJcblxyXG4gIHJlc2l6ZUZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZnVuY3Rpb24oZXZ0KSB7XHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBpZiAocmVzaXplRm9ybUlzVmFsaWQoKSkge1xyXG4gICAgICBmaWx0ZXJJbWFnZS5zcmMgPSBjdXJyZW50UmVzaXplci5leHBvcnRJbWFnZSgpLnNyYztcclxuXHJcbiAgICAgIHJlc2l6ZUZvcm0uY2xhc3NMaXN0LmFkZCgnaW52aXNpYmxlJyk7XHJcbiAgICAgIGZpbHRlckZvcm0uY2xhc3NMaXN0LnJlbW92ZSgnaW52aXNpYmxlJyk7XHJcbiAgICAgIHN1Ym1pdEJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzdWJtaXRCdXR0b24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKTtcclxuICAgIH1cclxuICB9KTtcclxuICAvKipcclxuICAgKiDQodCx0YDQvtGBINGE0L7RgNC80Ysg0YTQuNC70YzRgtGA0LAuINCf0L7QutCw0LfRi9Cy0LDQtdGCINGE0L7RgNC80YMg0LrQsNC00YDQuNGA0L7QstCw0L3QuNGPLlxyXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dFxyXG4gICAqL1xyXG4gIGZpbHRlckZvcm0uYWRkRXZlbnRMaXN0ZW5lcigncmVzZXQnLCBmdW5jdGlvbihldnQpIHtcclxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGZpbHRlckZvcm0uY2xhc3NMaXN0LmFkZCgnaW52aXNpYmxlJyk7XHJcbiAgICByZXNpemVGb3JtLmNsYXNzTGlzdC5yZW1vdmUoJ2ludmlzaWJsZScpO1xyXG4gIH0pO1xyXG5cclxuICAvKipcclxuICAgKiDQntGC0L/RgNCw0LLQutCwINGE0L7RgNC80Ysg0YTQuNC70YzRgtGA0LAuINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINCyINC90LDRh9Cw0LvRjNC90L7QtSDRgdC+0YHRgtC+0Y/QvdC40LUsINC/0YDQtdC00LLQsNGA0LjRgtC10LvRjNC90L5cclxuICAgKiDQt9Cw0L/QuNGB0LDQsiDRgdC+0YXRgNCw0L3QtdC90L3Ri9C5INGE0LjQu9GM0YLRgCDQsiBjb29raWUuXHJcbiAgICogQHBhcmFtIHtFdmVudH0gZXZ0XHJcbiAgICovXHJcbiAgZmlsdGVyRm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBmdW5jdGlvbihldnQpIHtcclxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGNsZWFudXBSZXNpemVyKCk7XHJcbiAgICB1cGRhdGVCYWNrZ3JvdW5kKCk7XHJcblxyXG4gICAgZmlsdGVyRm9ybS5jbGFzc0xpc3QuYWRkKCdpbnZpc2libGUnKTtcclxuICAgIHVwbG9hZEZvcm0uY2xhc3NMaXN0LnJlbW92ZSgnaW52aXNpYmxlJyk7XHJcblxyXG4gICAgdmFyIGRhdGVUb0V4cGlyZSA9IE51bWJlcihEYXRlLm5vdygpKSArIDIyOCAqIDI0ICogNjAgKiA2MCAqIDEwMDtcclxuICAgIHZhciBmb3JtYXR0ZWREYXRlVG9FeHBpcmUgPSBuZXcgRGF0ZShkYXRlVG9FeHBpcmUpLnRvVVRDU3RyaW5nKCk7XHJcbiAgICB3aW5kb3cuZG9jQ29va2llcy5zZXRJdGVtKCd1cGxvYWQtZmlsdGVyJywgZmlsdGVyTWFwLmNsYXNzTmFtZSwgZm9ybWF0dGVkRGF0ZVRvRXhwaXJlKTtcclxuICAgIHdpbmRvdy5kb2NDb29raWVzLnNldEl0ZW0oJ2ZpbHRlci1pbWFnZS1wcmV2aWV3JywgZmlsdGVySW1hZ2UuY2xhc3NOYW1lLCBmb3JtYXR0ZWREYXRlVG9FeHBpcmUpO1xyXG4gIH0pO1xyXG5cclxuICAvKipcclxuICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDQuNC30LzQtdC90LXQvdC40Y8g0YTQuNC70YzRgtGA0LAuINCU0L7QsdCw0LLQu9GP0LXRgiDQutC70LDRgdGBINC40LcgZmlsdGVyTWFwINGB0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LjQuVxyXG4gICAqINCy0YvQsdGA0LDQvdC90L7QvNGDINC30L3QsNGH0LXQvdC40Y4g0LIg0YTQvtGA0LzQtS5cclxuICAgKi9cclxuICBmaWx0ZXJGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKCFmaWx0ZXJNYXApIHtcclxuICAgICAgLy8g0JvQtdC90LjQstCw0Y8g0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8uINCe0LHRitC10LrRgiDQvdC1INGB0L7Qt9C00LDQtdGC0YHRjyDQtNC+INGC0LXRhSDQv9C+0YAsINC/0L7QutCwXHJcbiAgICAgIC8vINC90LUg0L/QvtC90LDQtNC+0LHQuNGC0YHRjyDQv9GA0L7Rh9C40YLQsNGC0Ywg0LXQs9C+INCyINC/0LXRgNCy0YvQuSDRgNCw0LcsINCwINC/0L7RgdC70LUg0Y3RgtC+0LPQviDQt9Cw0L/QvtC80LjQvdCw0LXRgtGB0Y9cclxuICAgICAgLy8g0L3QsNCy0YHQtdCz0LTQsC5cclxuICAgICAgZmlsdGVyTWFwID0ge1xyXG4gICAgICAgICdub25lJzogJ2ZpbHRlci1ub25lJyxcclxuICAgICAgICAnY2hyb21lJzogJ2ZpbHRlci1jaHJvbWUnLFxyXG4gICAgICAgICdzZXBpYSc6ICdmaWx0ZXItc2VwaWEnXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHNlbGVjdGVkRmlsdGVyID0gW10uZmlsdGVyLmNhbGwoZmlsdGVyRm9ybVsndXBsb2FkLWZpbHRlciddLCBmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgIHJldHVybiBpdGVtLmNoZWNrZWQ7XHJcbiAgICB9KVswXS52YWx1ZTtcclxuXHJcbiAgICAvLyDQmtC70LDRgdGBINC/0LXRgNC10LfQsNC/0LjRgdGL0LLQsNC10YLRgdGPLCDQsCDQvdC1INC+0LHQvdC+0LLQu9GP0LXRgtGB0Y8g0YfQtdGA0LXQtyBjbGFzc0xpc3Qg0L/QvtGC0L7QvNGDINGH0YLQviDQvdGD0LbQvdC+XHJcbiAgICAvLyDRg9Cx0YDQsNGC0Ywg0L/RgNC10LTRi9C00YPRidC40Lkg0L/RgNC40LzQtdC90LXQvdC90YvQuSDQutC70LDRgdGBLiDQlNC70Y8g0Y3RgtC+0LPQviDQvdGD0LbQvdC+INC40LvQuCDQt9Cw0L/QvtC80LjQvdCw0YLRjCDQtdCz0L5cclxuICAgIC8vINGB0L7RgdGC0L7Rj9C90LjQtSDQuNC70Lgg0L/RgNC+0YHRgtC+INC/0LXRgNC10LfQsNC/0LjRgdGL0LLQsNGC0YwuXHJcbiAgICBmaWx0ZXJJbWFnZS5jbGFzc05hbWUgPSAnZmlsdGVyLWltYWdlLXByZXZpZXcgJyArIGZpbHRlck1hcFtzZWxlY3RlZEZpbHRlcl07XHJcbiAgICBmaWx0ZXJNYXAuY2xhc3NOYW1lID0gJ3VwbG9hZC0nICsgZmlsdGVyTWFwW3NlbGVjdGVkRmlsdGVyXTtcclxuICB9KTtcclxuXHJcbiAgY2xlYW51cFJlc2l6ZXIoKTtcclxuICB1cGRhdGVCYWNrZ3JvdW5kKCk7XHJcblxyXG4iXX0=
