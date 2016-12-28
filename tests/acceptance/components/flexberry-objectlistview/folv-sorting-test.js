import Ember from 'ember';
import moduleForAcceptance from './execute-folv-test';

moduleForAcceptance('check sorting', (store, assert) => {

  assert.expect(7);
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(function() {
    assert.equal(currentPath(), path);

    let $olv = Ember.$('.object-list-view ');
    let th = function(item){ return Ember.$('th.dt-head-left', $olv)[item]; };

    assert.equal( th(0).children[0].children.length, 1, 'not ordr' );
    $(th(0)).click();
    let timeout = 2000;

    Ember.run.later((function() {
      let ord = function(){ return Ember.$(th(0).children[0].children[1].children[0]); };
      assert.equal( ord().attr('title'), 'Order ascending', 'title is Order ascending' );
      assert.equal( Ember.$.trim(ord().text()), String.fromCharCode('9650')+'1', 'sorting symbol added' );
      $(th(0)).click();

      Ember.run.later((function() {
        assert.equal( ord().attr('title'), 'Order descending', 'title is Order descending' );
        assert.equal( Ember.$.trim(ord().text()), String.fromCharCode('9660')+'1', 'sorting symbol changed' );
        $(th(0)).click();

        Ember.run.later((function() {
          assert.equal( th(0).children[0].children.length, 1, 'not ordr' );
        }), timeout);

      }), timeout);

    }), timeout);
  });

});
