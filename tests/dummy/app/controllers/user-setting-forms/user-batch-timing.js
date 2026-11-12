import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';
import Ember from 'ember';

// Демо-стенд: воспроизведение тайминговой проблемы batchUpdate.
//
// Сценарий (два хранилища — OData через ember-flexberry-data и внешний API):
//   1. У модели меняется поле (model.set('name', 'ChangedName')).
//   2. model уходит в store.batchUpdate([model]) для сохранения через OData.
//   3. В .then() у batchUpdate сразу вызывается внешний запрос; при его ошибке
//      выполняется откат rollbackFunc(), который возвращает модели старое значение
//      поля и повторно отправляет её в store.batchUpdate([model]).
//
// При баге (addon/adapters/odata.js: Ember.run без возврата промиса) к моменту
// вызова кода внутри .then() ответ батча ещё не намазан на модель, поэтому
// повторный запрос из rollbackFunc не персистит откат на бэкенде.
export default Ember.Controller.extend({
  status: 'idle',
  batchRequests: null,
  thenBeforeExternalJson: null,
  rollbackBeforeRebatchJson: null,
  modelNameAfter: null,
  backendNameAfter: null,
  errorMessage: null,

  actions: {
    runScenario() {
      Ember.set(this, 'status', 'running');
      Ember.set(this, 'batchRequests', null);
      Ember.set(this, 'thenBeforeExternalJson', null);
      Ember.set(this, 'rollbackBeforeRebatchJson', null);
      Ember.set(this, 'modelNameAfter', null);
      Ember.set(this, 'backendNameAfter', null);
      Ember.set(this, 'errorMessage', null);

      const controller = this;
      const store = Ember.get(this, 'store');

      // Свежая запись, чтобы не засорять стенд и не зависеть от существующих данных.
      return store.createRecord('ember-flexberry-dummy-application-user', {
        id: generateUniqueId(),
        name: 'InitialName',
        eMail: '1@mail.ru',
        phone1: '1',
      }).save()
        .then((model) => {
          const adapter = store.adapterFor('application');
          const originalBatch = adapter.batchUpdate;
          let batchRequestCount = 0;

          // Счётчик реально отправляемых batch-запросов (через адаптер).
          adapter.batchUpdate = function(aStore, models) {
            batchRequestCount += 1;
            console.log(`[batch-timing] ОТПРАВКА batch-запроса №${batchRequestCount}, dirtyType=${Ember.get(models[0], 'dirtyType')}, name=${Ember.get(models[0], 'name')}`);
            return originalBatch.call(adapter, aStore, models);
          };

          const oldValue = Ember.get(model, 'name'); // 'InitialName'
          Ember.set(model, 'name', 'ChangedName');

          const rollbackFunc = () => {
            Ember.set(controller, 'rollbackBeforeRebatchJson', JSON.stringify({
              name: Ember.get(model, 'name'),
              dirty: Ember.get(model, 'hasDirtyAttributes'),
              dirtyType: Ember.get(model, 'dirtyType'),
            }));
            console.log('[batch-timing] rollbackFunc: до отката', Ember.get(model, 'name'), 'dirty=', Ember.get(model, 'hasDirtyAttributes'), 'dirtyType=', Ember.get(model, 'dirtyType'));

            // Возвращаем модели старое значение поля.
            Ember.set(model, 'name', oldValue);

            // Повторная отправка модели в batchUpdate — при баге этот запрос
            // может вообще не дойти до адаптера (модель «не изменена»).
            return store.batchUpdate(Ember.A([model]))
              .then(() => {
                Ember.set(controller, 'modelNameAfter', Ember.get(model, 'name'));
              });
          };

          return store.batchUpdate(Ember.A([model]))
            .then(() => {
              // Момент, где в реальном сценарии стоит внешний API-вызов.
              Ember.set(controller, 'thenBeforeExternalJson', JSON.stringify({
                name: Ember.get(model, 'name'),
                dirty: Ember.get(model, 'hasDirtyAttributes'),
                dirtyType: Ember.get(model, 'dirtyType'),
              }));
              console.log('[batch-timing] .then(batchUpdate): name=', Ember.get(model, 'name'), 'dirty=', Ember.get(model, 'hasDirtyAttributes'), 'dirtyType=', Ember.get(model, 'dirtyType'));

              // Внешний запрос отклоняется -> вызывается откат.
              return Ember.RSVP.reject(new Error('external API failed'))
                .catch(rollbackFunc);
            })
            .then(() => {
              Ember.set(controller, 'batchRequests', batchRequestCount);
              console.log('[batch-timing] ИТОГО batch-запросов:', batchRequestCount);

              // Восстанавливаем оригинальный batchUpdate адаптера.
              adapter.batchUpdate = originalBatch;

              // Проверка реального состояния БД: выгружаем и заново читаем запись.
              store.unloadAll('ember-flexberry-dummy-application-user');
              return store.findRecord('ember-flexberry-dummy-application-user', Ember.get(model, 'id'))
                .then((fresh) => {
                  Ember.set(controller, 'backendNameAfter', Ember.get(fresh, 'name'));
                  Ember.set(controller, 'status', 'done');
                  Ember.set(controller, 'errorMessage', null);
                  console.log('[batch-timing] значение в БД после сценария:', Ember.get(fresh, 'name'));
                });
            });
        })
        .catch((e) => {
          console.error('[batch-timing] ОШИБКА сценария:', e);
          Ember.set(controller, 'status', 'error');
          Ember.set(controller, 'errorMessage', (e && (e.message || e.toString())) || 'unknown error');
        });
    },

    // Дословное воспроизведение кода из задачи:
    //   store.batchUpdate([model]).then(externalApi.execChangePromise().catch(rollbackFunc()))
    // За счёт `rollbackFunc()` со скобками откат исполняется СРАЗУ (в момент построения цепочки),
    // т.е. повторный `store.batchUpdate([model])` идёт по чистой модели — реального отката на бэкенде нет.
    runScenarioTask() {
      Ember.set(this, 'status', 'running');
      Ember.set(this, 'batchRequests', null);
      Ember.set(this, 'thenBeforeExternalJson', null);
      Ember.set(this, 'rollbackBeforeRebatchJson', null);
      Ember.set(this, 'modelNameAfter', null);
      Ember.set(this, 'backendNameAfter', null);
      Ember.set(this, 'errorMessage', null);

      const controller = this;
      const store = Ember.get(this, 'store');

      return store.createRecord('ember-flexberry-dummy-application-user', {
        id: generateUniqueId(),
        name: 'InitialName',
        eMail: '1@mail.ru',
        phone1: '1',
      }).save()
        .then((model) => {
          const adapter = store.adapterFor('application');
          const originalBatch = adapter.batchUpdate;
          let batchRequestCount = 0;

          adapter.batchUpdate = function(aStore, models) {
            batchRequestCount += 1;
            console.log('[batch-timing-task] ОТПРАВКА batch-запроса №' + batchRequestCount + ', dirtyType=' + Ember.get(models[0], 'dirtyType') + ', name=' + Ember.get(models[0], 'name'));
            return originalBatch.call(adapter, aStore, models);
          };

          const oldValue = Ember.get(model, 'name'); // 'InitialName'
          Ember.set(model, 'name', 'ChangedName');

          const rollbackFunc = () => {
            Ember.set(controller, 'rollbackBeforeRebatchJson', JSON.stringify({
              name: Ember.get(model, 'name'),
              dirty: Ember.get(model, 'hasDirtyAttributes'),
              dirtyType: Ember.get(model, 'dirtyType'),
            }));
            console.log('[batch-timing-task] rollbackFunc (вызвана сразу):', Ember.get(model, 'name'), 'dirty=', Ember.get(model, 'hasDirtyAttributes'), 'dirtyType=', Ember.get(model, 'dirtyType'));

            Ember.set(model, 'name', oldValue);

            return store.batchUpdate(Ember.A([model]))
              .then(() => {
                Ember.set(controller, 'modelNameAfter', Ember.get(model, 'name'));
              });
          };

          // Внешний запрос возвращает отклонённый промис; его .catch — это обработчик,
          // который (из-за `rollbackFunc()`) уже вызван при построении аргумента .then().
          const externalApi = () => Ember.RSVP.reject(new Error('external API failed'));

          return store.batchUpdate(Ember.A([model]))
            .then(externalApi().catch(rollbackFunc))
            .then(() => {
              Ember.set(controller, 'thenBeforeExternalJson', JSON.stringify({
                name: Ember.get(model, 'name'),
                dirty: Ember.get(model, 'hasDirtyAttributes'),
                dirtyType: Ember.get(model, 'dirtyType'),
              }));
              Ember.set(controller, 'batchRequests', batchRequestCount);
              console.log('[batch-timing-task] ИТОГО batch-запросов:', batchRequestCount);

              adapter.batchUpdate = originalBatch;

              store.unloadAll('ember-flexberry-dummy-application-user');
              return store.findRecord('ember-flexberry-dummy-application-user', Ember.get(model, 'id'))
                .then((fresh) => {
                  Ember.set(controller, 'backendNameAfter', Ember.get(fresh, 'name'));
                  Ember.set(controller, 'status', 'done');
                  Ember.set(controller, 'errorMessage', null);
                  console.log('[batch-timing-task] значение в БД после сценария:', Ember.get(fresh, 'name'));
                });
            });
        })
        .catch((e) => {
          console.error('[batch-timing-task] ОШИБКА сценария:', e);
          Ember.set(controller, 'status', 'error');
          Ember.set(controller, 'errorMessage', (e && (e.message || e.toString())) || 'unknown error');
        });
    },

    // Вариант с НЕСКОЛЬКИМИ моделями в одном батче: изменяем 3 записи, гоним один batchUpdate,
    // затем в .then() делаем внешний запрос, при его ошибке — откат всех трёх повторным batchUpdate.
    // Гипотеза: при нескольких моделях намазывание ответа не успевает до .then()/rollback.
    runScenarioMulti() {
      Ember.set(this, 'status', 'running');
      Ember.set(this, 'batchRequests', null);
      Ember.set(this, 'thenBeforeExternalJson', null);
      Ember.set(this, 'rollbackBeforeRebatchJson', null);
      Ember.set(this, 'modelNameAfter', null);
      Ember.set(this, 'backendNameAfter', null);
      Ember.set(this, 'errorMessage', null);

      const controller = this;
      const store = Ember.get(this, 'store');
      const names = ['InitialName1', 'InitialName2', 'InitialName3'];

      const created = names.map((name, i) => store.createRecord('ember-flexberry-dummy-application-user', {
        id: generateUniqueId(),
        name,
        eMail: i + '@mail.ru',
        phone1: '1',
      }).save());

      return Ember.RSVP.all(created)
        .then((models) => {
          const adapter = store.adapterFor('application');
          const originalBatch = adapter.batchUpdate;
          let batchRequestCount = 0;

          adapter.batchUpdate = function(aStore, modelList) {
            batchRequestCount += 1;
            console.log('[batch-timing-multi] ОТПРАВКА batch-запроса №' + batchRequestCount + ', моделей=' + modelList.length + ', names=' + modelList.map((m) => Ember.get(m, 'name')).join(','));
            return originalBatch.call(adapter, aStore, modelList);
          };

          const oldValues = models.map((m) => Ember.get(m, 'name'));
          models.forEach((m, i) => Ember.set(m, 'name', 'ChangedName' + (i + 1)));

          const rollbackFunc = () => {
            Ember.set(controller, 'rollbackBeforeRebatchJson', JSON.stringify(
              models.map((m) => ({ name: Ember.get(m, 'name'), dirty: Ember.get(m, 'hasDirtyAttributes'), dirtyType: Ember.get(m, 'dirtyType') }))
            ));
            console.log('[batch-timing-multi] rollbackFunc: до отката', models.map((m) => Ember.get(m, 'name')).join(','), 'dirty=', models.map((m) => Ember.get(m, 'hasDirtyAttributes')).join(','));

            models.forEach((m, i) => Ember.set(m, 'name', oldValues[i]));

            return store.batchUpdate(Ember.A(models))
              .then(() => {
                Ember.set(controller, 'modelNameAfter', JSON.stringify(models.map((m) => Ember.get(m, 'name'))));
              });
          };

          return store.batchUpdate(Ember.A(models))
            .then(() => {
              Ember.set(controller, 'thenBeforeExternalJson', JSON.stringify(
                models.map((m) => ({ name: Ember.get(m, 'name'), dirty: Ember.get(m, 'hasDirtyAttributes'), dirtyType: Ember.get(m, 'dirtyType') }))
              ));
              console.log('[batch-timing-multi] .then(batchUpdate): dirty=', models.map((m) => Ember.get(m, 'hasDirtyAttributes')).join(','), 'names=', models.map((m) => Ember.get(m, 'name')).join(','));

              return Ember.RSVP.reject(new Error('external API failed'))
                .catch(rollbackFunc);
            })
            .then(() => {
              Ember.set(controller, 'batchRequests', batchRequestCount);
              console.log('[batch-timing-multi] ИТОГО batch-запросов:', batchRequestCount);

              adapter.batchUpdate = originalBatch;

              store.unloadAll('ember-flexberry-dummy-application-user');
              return Ember.RSVP.all(models.map((m) => store.findRecord('ember-flexberry-dummy-application-user', Ember.get(m, 'id'))))
                .then((fresh) => {
                  Ember.set(controller, 'backendNameAfter', JSON.stringify(fresh.map((f) => Ember.get(f, 'name'))));
                  Ember.set(controller, 'status', 'done');
                  Ember.set(controller, 'errorMessage', null);
                  console.log('[batch-timing-multi] значения в БД после сценария:', fresh.map((f) => Ember.get(f, 'name')).join(','));
                });
            });
        })
        .catch((e) => {
          console.error('[batch-timing-multi] ОШИБКА сценария:', e);
          Ember.set(controller, 'status', 'error');
          Ember.set(controller, 'errorMessage', (e && (e.message || e.toString())) || 'unknown error');
        });
    }
  }
});
