import $ from 'jquery';

// Функция для ожидания загрузки списка.
export async function loadingList($ctrlForClick, list, records) {
  return new Promise((resolve, reject) => {
    let checkIntervalId;
    let checkIntervalSucceed = false;
    const checkInterval = 500;
    const timeout = 10000;

    // Клик по контроллеру.
    click($ctrlForClick);

    checkIntervalId = window.setInterval(() => {
      const $list = $(list);
      const $records = $(records, $list);
      if ($records.length === 0) {
        // Данные еще не загружены.
        return;
      }

      // Данные загружены.
      // Остановить интервал и разрешить промис.
      window.clearInterval(checkIntervalId);
      checkIntervalSucceed = true;
      resolve($list);
    }, checkInterval);

    // Установить тайм-аут ожидания.
    window.setTimeout(() => {
      if (checkIntervalSucceed) {
        return;
      }

      // Время вышло.
      // Остановить интервалы и отклонить промис.
      window.clearInterval(checkIntervalId);
      reject('editForm load operation is timed out');
    }, timeout);
  });
}

// Функция для ожидания загрузки локалей.
export async function loadingLocales(locale, app) {
  return new Promise((resolve) => {
    const i18n = app.__container__.lookup('service:i18n');

    i18n.set('locale', locale);

    const timeout = 500;
    setTimeout(() => {
      resolve({ msg: 'ok' });
    }, timeout);
  });
}
