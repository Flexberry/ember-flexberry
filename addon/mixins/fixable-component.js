/**
  @module ember-flexberry
 */

import Mixin from '@ember/object/mixin';
import $ from 'jquery';
import Ember from 'ember';
import { isEmpty, typeOf } from '@ember/utils';

const {
  Logger
} = Ember;

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
    const olv = component.closest(this.get('olvClasses'));
    const modal = component.closest(this.get('modalClasses'));

    if (isEmpty(olv) && isEmpty(modal)) return Logger.warn(`Компонент находится вне спискового компонента или модального окна`);
    if (isEmpty(elements)) return Logger.warn(`Элемент с классом '${elementClass}' не найден`);
    if (elements.length > 1) return Logger.warn(`Найдено больше одного элемента с классом '${elementClass}'`);

    const element = elements[0];
    element.style.position = 'fixed';
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
    if (!this.get('canFixElement')) return;
    if (typeOf(options) !== 'object') return Logger.warn(`Параметр 'options' имеет неверный тип`);

    const element = this.get('fixedElementRef');
    const component = this.get('componentRef');
    const isVisible = element.classList.contains('visible');
    const fixedOnVisible = options.fixedOnVisible || false;

    if (!isVisible || fixedOnVisible) {
      const { height, left, width, bottom } = component.getBoundingClientRect();
      let { top } = component.getBoundingClientRect();
      const optionWidth = options.width || 0;

      if (this.get('isInsideOlv')) {
        let elementHeight = $(element).outerHeight();

        const upward = window.innerHeight - bottom < elementHeight;
        const optionLeft = options.left || 0;
        const optionTop = options.top || 0;

        if (upward) {
          element.style.overflowY = 'auto';
          if (elementHeight > top) {
            let logoHeight = $(this.get('logoClass')).outerHeight();
            element.style.maxHeight = `${top - logoHeight}px`;
            top = `${top - optionTop - elementHeight + (elementHeight - (top - logoHeight))}px`;
          } else {
            top = `${top - optionTop - elementHeight}px`;
          }

          element.style.bottom = 'auto';
          component.classList.add('upward');
        } else {
          top = `${top + height + optionTop}px`;
          component.classList.remove('upward');
        }

        element.style.top = top;
        element.style.left = `${left + optionLeft}px`;
      }

      if (this.get('isInsideModal')) element.style.left = 0;

      element.style.width = `${width + optionWidth}px`;

      this.addScrollListeners();
    }
  },

  /**
   * Скрывает фиксированный элемент.
   */
  hideFixedElement() {
    if (!this.get('canFixElement')) return;

    const element = this.get('fixedElementRef');
    element.style.left = '-9999px';
    element.style.maxHeight = 'none';

    const component = this.get('componentRef');
    $(component).blur();

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
