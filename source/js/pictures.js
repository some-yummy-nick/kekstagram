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
