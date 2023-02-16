/**
@module ember-flexberry
*/

import $ from 'jquery';
import Ember from 'ember';

const {
  Logger, typeOf, isEmpty
} = Ember;

/**
 * Добавляет возможность компоненту в списке или модальном окне
 * фиксировать дочерний элемент для отображения элемента поверх формы.
 * @class FixableComponentMixin
  @uses <a href="https://www.emberjs.com/api/ember/release/classes/Mixin">Mixin</a>
  @for Ember.Component
  @public
*/
export default Ember.Mixin.create({
  /**
   * Флаг, может ли компонент фиксировать свой элемент.
   */
  canFixElement: false,

  /**
   * Флаг, компонент находится в модальном окне.
   */
  isInsideModal: false,

  /**
   * Флаг, компонент находится в списковом компоненте.
   */
  isInsideOlv: false,

  /**
   * Ссылка на компонент, который имеет фиксированный элемент.
   */
  componentRef: null,

  /**
   * Ссылка на дочерний элемент, который надо фиксировать.
   */
  fixedElementRef: null,

  /**
   * Класс фиксированного элемента.
   */
  fixedElementClass: 'fixed-element',

  /**
   * Класс спискового компонента, который имеет скролл.
   */
  olvClasses: '.groupedit-container.object-list-view-container',

  /**
   * Класс модального, который имеет скролл.
   */
  modalClasses: '.flexberry-modal .content',

  /**
   * Класс формы, которая имеет скролл.
   */
  formClasses: '.full.height',

  /**
   * Класс логотипа
   */
  logoClass: '.background-logo',

  /**
   * Класс родительского элемента.
   */
  parentComponentClasses: 'body > .pushable > .pusher',

  /**
   * Находит и сохраняет ссылки на компонент и дочерний элемент
   * Задает начальное значение фиксированному элементу.
   * @inheritdoc
   */
  didInsertElement() {
    this._super(...arguments);

    if (!Ember.get(this, 'canFixElement')) return;

    const component = this.element || this.dropdownDomElement.context;

    if (isEmpty(component)) return Logger.warn(`Компонент не найден`);

    const elementClass = Ember.get(this, 'fixedElementClass');
    const elements = component.getElementsByClassName(elementClass);
    const olv = $(component).closest(Ember.get(this, 'olvClasses')).get(0);
    const modal = $(component).closest(Ember.get(this, 'modalClasses')).get(0);

    if (isEmpty(olv) && isEmpty(modal)) return Logger.warn(`Компонент находится вне спискового компонента или модального окна`);
    if (isEmpty(elements)) return Logger.warn(`Элемент с классом '${elementClass}' не найден`);
    if (elements.length > 1) return Logger.warn(`Найдено больше одного элемента с классом '${elementClass}'`);

    const element = elements[0];
    element.style.zIndex = 100;
    element.classList.add('hidden');
    this.setProperties({
      componentRef: component,
      fixedElementRef: element,
      isInsideModal: !isEmpty(modal),
      isInsideOlv: !isEmpty(olv)
    });
  },

  /**
   * Показывает фиксированный элемент.
   * @param {Object} options Корректировка позиции фиксированного элемента и т.д...
   */
  showFixedElement(options = {}) {
    if (!Ember.get(this, 'canFixElement')) return;
    if (typeOf(options) !== 'object') return Logger.warn(`Параметр 'options' имеет неверный тип`);

    const element = Ember.get(this, 'fixedElementRef');
    const component = Ember.get(this, 'componentRef');
    const isVisible = element.classList.contains('visible');
    const fixedOnVisible = options.fixedOnVisible || false;
    const parentComponentClasses = Ember.get(this, 'parentComponentClasses');
    let parentComponent = $(parentComponentClasses).get(0);

    if (!isVisible || fixedOnVisible) {
      const { height, left, width, bottom } = component.getBoundingClientRect();
      let { top } = component.getBoundingClientRect();
      const optionWidth = options.width || 0;

      if (Ember.get(this, 'isInsideOlv')) {
        element.style.maxHeight = 'none';
        let elementHeight = $(element).outerHeight();

        const upward = window.innerHeight - bottom < elementHeight;
        const optionLeft = options.left || 0;
        const optionTop = options.top || 0;

        if (upward) {
          element.style.overflowY = 'auto';

          if (elementHeight > top) {
            let logoHeight = $(Ember.get(this, 'logoClass')).outerHeight();
            element.style.maxHeight = `${top - logoHeight}px`;
          }

          element.style.bottom = `${window.innerHeight - top}px`;
          element.style.top = `auto`;

          component.classList.add('upward');
        } else {
          element.style.top = `${top + height + optionTop}px`;
          element.style.bottom = `auto`;

          component.classList.remove('upward');
        }

        let offsetLeft = left - parentComponent.getBoundingClientRect().left + optionLeft;
        $(element).attr('style', function(i, s) { return (s || '') + `left: ${offsetLeft}px !important;` });
      }

      if (Ember.get(this, 'isInsideModal')) element.style.left = 0;

      element.style.width = `${width + optionWidth}px`;
      element.style.position = 'fixed';

      this.addScrollListeners();
    }
  },

  /**
   * Скрывает фиксированный элемент.
   */
  hideFixedElement() {
    if (!Ember.get(this, 'canFixElement')) return;

    const element = Ember.get(this, 'fixedElementRef');
    element.style.left = '-9999px';
    element.style.maxHeight = 'none';
    element.style.position = '';

    const component = Ember.get(this, 'componentRef');
    $(component).blur();

    this.removeScrollListeners();
  },

  willDestroyElement() {
    this.removeScrollListeners();
    this._super(...arguments);
  },

  addScrollListeners() {
    if (Ember.get(this, 'isInsideOlv')) $(Ember.get(this, 'olvClasses')).on('scroll.flexberry-dropdown-custom', () => this.hideFixedElement());
    if (Ember.get(this, 'isInsideModal')) $(Ember.get(this, 'modalClasses')).on('scroll.flexberry-dropdown-custom', () => this.hideFixedElement());
    $(Ember.get(this, 'formClasses')).on('scroll.flexberry-dropdown-custom', () => this.hideFixedElement());
  },

  removeScrollListeners() {
    if (Ember.get(this, 'isInsideOlv')) $(Ember.get(this, 'olvClasses')).off('scroll.flexberry-dropdown-custom');
    if (Ember.get(this, 'isInsideModal')) $(Ember.get(this, 'modalClasses')).off('scroll.flexberry-dropdown-custom');
    $(Ember.get(this, 'formClasses')).off('scroll.flexberry-dropdown-custom');
  }
});