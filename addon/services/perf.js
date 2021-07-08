/**
  @module ember-flexberry
*/

import { A } from '@ember/array';
import Service from '@ember/service';
import { schedule } from '@ember/runloop';
import Route from '@ember/routing/route';
import { subscribe, unsubscribe } from '@ember/instrumentation';

export default Service.extend({
  /**
    Flag indicates whether perf service is enabled or not.

    @property enabled
    @type Boolean
    @default false

    @example
      ```
      // PerfServise 'enabled' setting could be also defined through application config/environment.js
      module.exports = function(environment) {
        let ENV = {
          ...
          APP: {
            ...
            perf: {
              enabled: true
            }
            ...
          }
          ...
      };
      ```
  */
  enabled: false,

  tagsHaveBeenPlaced: false,
  perfObjects: undefined,

  /**
    Initializes perf service.
    Ember services are singletons, so this code will be executed only once since application initialization.
  */
  init() {
    this._super(...arguments);
    this.set('perfObjects', []);
    let enabled = this.get('enabled');
    if (!enabled) {
      return;
    } else {
      this._init();
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    this._turnOff();
  },

  handleClick(e) {
    let elem = e.target.tagName === 'PERF' ? e.target : e.target.parentElement;
    if (elem.tagName === 'PERF') {

      elem.style.top = elem.offsetTop + 13 + 'px';
      elem.style.left = elem.offsetLeft + 20 + 'px';

      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
    }
  },

  _init() {
    let PERF_SELECTORS = 'perf_selectors';
    window.perf = {
      runningTime: null,
      selectionStartTime: null,
      selectionEndTime: null,
      selection: {},
      results: [],
      /**
        accepts regExp or array of regExp e.g.   `componentName` | `/componentName/` |  `[/componentName/, /componentNamePartial/]`
        @param  selector filters on Component.className
        // e.g. the following line is a wildcard pattern (default)
        window.perf.setSectors(/./);
      */
      setSelectors: (selectorArr) => {
        selectorArr = [].concat(selectorArr);
        selectorArr.forEach(selector => selector.toString());
        localStorage.setItem(PERF_SELECTORS, selectorArr.toString());
      },
      getSelectors: () => {
        if (!localStorage) {
          return;
        }

        let selectors = localStorage.getItem(PERF_SELECTORS);
        return selectors ? selectors.split(',').map((selector) => new RegExp(selector.replace(/(^\/)|(\/$)/g, ''))) : [/./];
      },
      clearSelectors() {
        localStorage.setItem(PERF_SELECTORS, '');
      }
    };

    let selectorArr = '/./';
    localStorage.setItem(PERF_SELECTORS, selectorArr.toString());

    this._turnOn();
  },

  _decorateElementWithPerf(perfObject) {
    let element = perfObject.element;

    if (!element) {
      return;
    }

    let dataElement = document.createElement('perf');
    let hasChildren = !![].concat.apply([], element.children).length;
    let parentClasses = [].concat.apply([], element.classList);
    let emberIndex = parentClasses.indexOf('ember-view');
    let elementPosition = window.getComputedStyle(element).position;

    if (!hasChildren || elementPosition === 'static') {
      element.style.position = 'relative';
    }

    dataElement.classList.add('perf-data');

    if (perfObject.totalRenderTime < 10) {
      dataElement.classList.add('perf-fast');
    } else if (perfObject.totalRenderTime < 20) {
      dataElement.classList.add('perf-medium');
    } else {
      dataElement.classList.add('perf-slow');
    }

    dataElement.innerHTML = `<span class="perf-time">${perfObject.totalRenderTime + 'ms'}</span>`;
    parentClasses.splice(emberIndex, 1);
    parentClasses.unshift(`#${element.id}`);
    dataElement.setAttribute('data-parent-classes', parentClasses.join('.'));

    if (perfObject.isRerender) {
      dataElement.classList.add('perf-rerendered');
    }

    schedule('afterRender', this, () => {
      let nudgeCount = 0;
      let isClosedTag = element.tagName === 'IMG' || element.tagName === 'INPUT';
      let isNudger = false;
      let perfElem;

      element.classList.add('has-perf');
      element.insertAdjacentElement(isClosedTag ? 'afterEnd' : 'beforeEnd', dataElement);
      let dims = dataElement.getBoundingClientRect();
      let sizeWidth = dims.left + (dims.width / 2);
      let sizeHeight = dims.top + (dims.height / 2);

      let perfElems = A(document.elementsFromPoint(sizeWidth, sizeHeight).filter((item) => item.tagName === 'PERF')).without(dataElement);

      if (perfElems.length) {
        perfElem = perfElems.find((item) => item.classList.includes('nudger')) || perfElems[0];
        isNudger = perfElem.classList.includes('nudger');

        if (isNudger) {
          nudgeCount = perfElem.getAttribute('data-nudge-count');
        } else {
          perfElem.classList.add('nudger');
        }

        perfElem.setAttribute('data-nudge-count', ++nudgeCount);

        dataElement.style.top = dataElement.offsetTop + (13 * nudgeCount) + 'px';
        dataElement.classList.add('nudged');
      }
    });
  },

  _preDash(string, numberOfDashes) {
    return new Array(numberOfDashes + 1).join('|––') + string;
  },

  _runOnTransitionEnd() {
    let perfObjects = this.get('perfObjects');

    if (perfObjects === undefined) {
      return;
    }

    schedule('afterRender', () => {
      for (let i = 0, len = perfObjects.length; i < len; i++) {
        let obj = perfObjects[i];
        let parent;
        this._decorateElementWithPerf(obj);

        if (obj.element) {
          parent = obj.element.parentElement;
          parent.removeEventListener('click', this.handleClick);
          parent.addEventListener('click', this.handleClick);
        }
      }

      this.set('tagsHaveBeenPlaced', true);
    });
  },

  _turnOn() {
    let isQueueRendering = false;
    let selectors = window.perf.getSelectors();
    let perfObjects = this.get('perfObjects');
    let _this = this;

    if (selectors) {
      Route.reopen({
        actions: {
          willTransition: function() {
            perfObjects = [];
            this.set('tagsHaveBeenPlaced', false);
            this._super(...arguments);
          },
          didTransition: function() {
            this._super(...arguments);
            _this._runOnTransitionEnd();
          }
        }
      });

      subscribe('render', {
        before(name, timestamp, payload) {
          let className = payload.containerKey;
          if (className && selectors.filter(regEx => regEx.test(className)).length) {

            if (!window.perf.runningTime) {
              window.perf.runningTime = timestamp;
            }

            if (!isQueueRendering) {
              isQueueRendering = true;

              // console.profile();

              // eslint-disable-next-line no-console
              console.timeStamp('Render queue running.');
              window.perf.startTime = timestamp;
            }

            // Rename if re-rendering, causes a new render object to be tracked.
            if (window.perf.selection[payload.object]) {
              payload.object = payload.object + '_+';
            }

            name = payload.object.replace(/(<voyager-web@)|(>)/g, '');
            window.perf.selection[payload.object] = {
              name: name,
              beforeInsertTime: Math.round(timestamp * 100) / 100
            };

            // eslint-disable-next-line no-console
            console.time(name);
          }
        },

        after(name, timestamp, payload) {
          let perfObject = window.perf.selection[payload.object];
          if (perfObject) {

            // eslint-disable-next-line no-console
            console.timeEnd(perfObject.name);

            perfObject.afterInsertTime = Math.round(timestamp * 100) / 100;
            perfObject.totalRenderTime = Math.round((perfObject.afterInsertTime - perfObject.beforeInsertTime) * 100) / 100;
            perfObject.renderIndex = Object.keys(window.perf.selection).filter(key => !window.perf.selection[key].afterInsertTime).length;
            perfObject.dashedName = _this._preDash(perfObject.name, perfObject.renderIndex);
            perfObject.element = payload.view.element;
            perfObject.isReRender = /_\+/.test(payload.object);
            perfObject.view = payload.view;

            let displayObj = {
              totalRenderTime: perfObject.totalRenderTime,
              name: perfObject.dashedName,
              element: perfObject.element,
              isReRender: perfObject.isReRender,
            };

            perfObjects.unshift(perfObject);

            window.perf.results.push(displayObj);

            if (!perfObject.renderIndex) {
              isQueueRendering = false;

              // console.profileEnd();
              window.perf.selectionEndTime = performance.now();
              window.perf.selectionRenderTime = Math.round((window.perf.selectionEndTime - window.perf.runningTime) * 100) / 100;
              window.perf.results.reverse();

              // console.table(window.perf.results);

            // eslint-disable-next-line no-console
              console.log('Render queue is flushed: ', window.perf.selectionRenderTime + 'ms');

              // eslint-disable-next-line no-console
              console.timeStamp('Render queue is flushed: ', window.perf.selectionRenderTime + 'ms');

              // window.perf.results.forEach(result => console.log(result.totalRenderTime + 'ms', result.element))
              window.perf.results = [];
            }
          }
        }
      });
    }
  },

  _turnOff() {
    let elems = document.getElementsByClassName('has-perf');
    for (let i = 0, len = elems.length; i < len; i++) {
      elems[i].removeEventListener('click', this.handleClick);
    }

    unsubscribe('render');
  }
});
