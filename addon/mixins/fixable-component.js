/**
  @module ember-flexberry
 */

import Mixin from '@ember/object/mixin';
import $ from 'jquery';
import { isEmpty, typeOf } from '@ember/utils';
import { get } from '@ember/object';

/**
 * Добавляет возможность компоненту в списке или модальном окне
 * фиксировать дочерний элемент для отображения элемента поверх формы.
 * @class FixableComponentMixin
  @uses <a href="https://www.emberjs.com/api/ember/release/classes/Mixin">Mixin</a>
  @for Ember.Component
  @public
 */
export default Mixin.create({
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

    if (!this.get('canFixElement')) return;

    const component = this.element || this.dropdownDomElement.context;

    if (isEmpty(component)) return Logger.warn(`Компонент не найден`);

    const elementClass = this.get('fixedElementClass');
    const elements = component.getElementsByClassName(elementClass);
    const olv = get($(component).closest(this.get('olvClasses')), 0);
    const modal = get($(component).closest(this.get('modalClasses')), 0);

    if (isEmpty(olv) && isEmpty(modal)) return /*Logger.warn(`Компонент находится вне спискового компонента или модального окна`)*/;
    if (isEmpty(elements)) return /*Logger.warn(`Элемент с классом '${elementClass}' не найден`)*/;
    if (elements.length > 1) return /*Logger.warn(`Найдено больше одного элемента с классом '${elementClass}'`)*/;

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
   * Show a fixed element.
   *
   * @function showFixedElement
   * @param {object} options Correction of the position of a fixed element.
   * @returns {void}
   */
  showFixedElement(options = {}) {
    if (!this.get('canFixElement')) return;
    if (typeOf(options) !== 'object') return /*Logger.warn(`Параметр 'options' имеет неверный тип`)*/;

    const element = this.get('fixedElementRef');
    const component = this.get('componentRef');
    const isVisible = element.classList.contains('visible');
    const fixedOnVisible = options.fixedOnVisible || false;
    const parentComponentClasses = this.get('parentComponentClasses');
    const parentComponent = get($(parentComponentClasses), 0);

    if (!isVisible || fixedOnVisible) {
      const { height, left, width, bottom, top } = component.getBoundingClientRect();
      const optionWidth = options.width || 0;

      if (this.get('isInsideOlv')) {
        const elementHeight = $(element).outerHeight();
        const logoHeight = $(this.get('logoClass')).outerHeight();
        const heightToEndWindow = window.innerHeight - bottom;
        const heightToStartWindow = top - logoHeight;

        const upward = (heightToEndWindow < elementHeight) && (heightToStartWindow > heightToEndWindow);
        const optionLeft = options.left || 0;
        const optionTop = options.top || 0;

        if (upward) {
          element.style.overflowY = 'auto';
          element.style.maxHeight = `${heightToStartWindow}px`;
          element.style.bottom = `${window.innerHeight - top}px`;
          element.style.top = `auto`;

          component.classList.add('upward');
        } else {
          element.style.maxHeight = `${heightToEndWindow}px`;
          element.style.top = `${top + height + optionTop}px`;
          element.style.bottom = `auto`;

          component.classList.remove('upward');
        }

        const offsetLeft = left - parentComponent.getBoundingClientRect().left + optionLeft;
        $(element).attr('style', function(i, s) { return (s || '') + `left: ${offsetLeft}px !important;` });
      }

      if (this.get('isInsideModal')) {
        element.style.left = 0;
      }

      element.style.width = `${width + optionWidth}px`;
      element.style.position = 'fixed';

      this.addScrollListeners();
    }
  },

  /**
   * Hide a fixed element.
   *
   * @function hideFixedElement
   */
  hideFixedElement() {
    if (!this.get('canFixElement')) return;

    const element = this.get('fixedElementRef');
    element.style.left = '-9999px';
    element.style.maxHeight = 'none';
    element.classList.remove('visible');

    const component = this.get('componentRef');
    $(component).blur();
    component.classList.remove('active');
    component.classList.remove('visible');

    this.removeScrollListeners();
  },

  willDestroyElement() {
    this.removeScrollListeners();
    this._super(...arguments);
  },

  addScrollListeners() {
    if (this.get('isInsideOlv')) $(this.get('olvClasses')).on('scroll.flexberry-dropdown-custom', () => this.hideFixedElement());
    if (this.get('isInsideModal')) $(this.get('modalClasses')).on('scroll.flexberry-dropdown-custom', () => this.hideFixedElement());
    $(this.get('formClasses')).on('scroll.flexberry-dropdown-custom', () => this.hideFixedElement());
  },

  removeScrollListeners() {
    if (this.get('isInsideOlv')) $(this.get('olvClasses')).off('scroll.flexberry-dropdown-custom');
    if (this.get('isInsideModal')) $(this.get('modalClasses')).off('scroll.flexberry-dropdown-custom');
    $(this.get('formClasses')).off('scroll.flexberry-dropdown-custom');
  }
});
