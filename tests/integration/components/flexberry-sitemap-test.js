import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-sitemap', 'Integration | Component | flexberry-sitemap', {
  integration: true
});

test('it renders and works', function(assert) {
  this.render(hbs`{{flexberry-sitemap}}`);
  assert.equal(this.$().text().trim(), '', 'Empty sitemap, empty result.');

  this.render(hbs`
    {{#flexberry-sitemap}}
      template block text
    {{/flexberry-sitemap}}
  `);
  assert.equal(this.$().text().trim(), '', 'Block params not used.');

  this.set('sitemap', {
    nodes: [
      {
        caption: 'Superheroes',
        children: [
          { link: 'superman', caption: 'Superman' },
          { link: 'ironman', caption: 'Ironman' },
        ],
      },
    ],
  });
  this.render(hbs`{{flexberry-sitemap sitemap=sitemap}}`);
  assert.equal(this.$('.title-item-menu:visible').text().trim(), 'Superheroes', 'Menu is closed.');
  this.$('.title-item-menu:visible').click();
  assert.equal(this.$('.title-item-menu:visible').text().trim().replace(/\s+/g, ''), 'SuperheroesSupermanIronman', 'Menu is open.');
});
