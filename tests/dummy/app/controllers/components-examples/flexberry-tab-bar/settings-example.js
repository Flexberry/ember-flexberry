import Ember from 'ember';

export default Ember.Controller.extend({
  tenTabBarItems: [
        { selector: 'tab1', caption: 'Вкладка первая', active: true },
        { selector: 'tab2', caption: 'Вкладка вторая' },
        { selector: 'tab3', caption: 'Вкладка третья' },
        { selector: 'tab4', caption: 'Вкладка четвертая' },
        { selector: 'tab5', caption: 'Вкладка пятая' },
        { selector: 'tab6', caption: 'Вкладка шестая' },
        { selector: 'tab7', caption: 'Вкладка седьмая' },
        { selector: 'tab8', caption: 'Вкладка восьмая' },
        { selector: 'tab9', caption: 'Вкладка девятая' },
        { selector: 'tab10', caption: 'Вкладка десятая' }
    ],
  actions: {
    }
});

