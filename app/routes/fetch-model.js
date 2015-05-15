import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

// TODO: deprecated since id+view was implemented?
/*
 * Костыльный базовый класс для роута, чтобы модель всегда вычитывалась с сервера.
 * Внимание: может поломаться при обновлении версии Ember.
 */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
    /* Model is loaded from API. */
    _modelIsFetched: false,

    activate: function() {
        if (!this._modelIsFetched) {
            this.refresh();
        }

        return this;
    },

    actions: {
        willTransition: function(transition) {
            // Поскольку route существует в единственном экземпляре,
            // то нужно сбросить флаг, когда с этого роута уходят.
            // Хук deactivate не используется, а используется событие willTransition
            // (причем флаг сбрасывается с условием) из-за того, что при переходах
            // на одном и том же route (например, employees/1 -> employees/2) хук model
            // вызывается раньше хука deactivate, и при попытке использования deactivate
            // для сброса флага модель вычитывалась с сервера дважды.
            if (this.routeName !== transition.targetName) {
                this._modelIsFetched = false;
            }
        }
    },

    // Этот хук не вызывается при переходе в дочерний route (например с listForm в editForm),
    // т.к. объект с нужным ID уже в store, и он берется из кэша, запрос в api не производится.
    // Это проблема, т.к. у нас используются различные представления для вычитки объектов на listForm и editForm,
    // плюсом к этому, каждая загрузка формы редактирования должна предоставлять "свежий" объект данных с сервера.
    // На текущий момент (03.2015) без костылей от такого кэширования в Ember не избавиться.
    // Существует решение с вычиткой модели в методе setupController, который вызывается всегда, но тогда отваливается
    // стандартный "loading"-шаблон, который должен отображаться на время загрузки модели.
    // Ситуация решается с помощью определения в хуке activate(), был ли вызван хук model() до него.
    // Если не был вызван, то текущий route обновляется (метод refresh), в результате чего модель вычитывается заново.
    model: function() {
        this._modelIsFetched = true;
    }
});
