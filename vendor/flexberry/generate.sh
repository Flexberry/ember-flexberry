#!/bin/sh
cp -r tests tests-save
rm -rf tests/dummy/app/*
cp tests-save/dummy/app/index.html tests/dummy/app/
ember generate flexberry-model --dummy ember-flexberry-dummy-suggestion-type --file=ember-flexberry-dummy-suggestion-type.json --metadata-dir=vendor/flexberry   || { exit 1; }
ember generate flexberry-model --dummy ember-flexberry-dummy-vote --file=ember-flexberry-dummy-vote.json --metadata-dir=vendor/flexberry   || { exit 1; }
ember generate flexberry-model --dummy ember-flexberry-dummy-suggestion --file=ember-flexberry-dummy-suggestion.json --metadata-dir=vendor/flexberry   || { exit 1; }
ember generate flexberry-model --dummy ember-flexberry-dummy-localized-suggestion-type --file=ember-flexberry-dummy-localized-suggestion-type.json --metadata-dir=vendor/flexberry   || { exit 1; }
ember generate flexberry-model --dummy ember-flexberry-dummy-comment-vote --file=ember-flexberry-dummy-comment-vote.json --metadata-dir=vendor/flexberry   || { exit 1; }
ember generate flexberry-model --dummy ember-flexberry-dummy-comment --file=ember-flexberry-dummy-comment.json --metadata-dir=vendor/flexberry   || { exit 1; }
ember generate flexberry-model --dummy ember-flexberry-dummy-suggestion-file --file=ember-flexberry-dummy-suggestion-file.json --metadata-dir=vendor/flexberry   || { exit 1; }
ember generate flexberry-model --dummy ember-flexberry-dummy-application-user --file=ember-flexberry-dummy-application-user.json --metadata-dir=vendor/flexberry   || { exit 1; }
ember generate flexberry-model --dummy ember-flexberry-dummy-localization --file=ember-flexberry-dummy-localization.json --metadata-dir=vendor/flexberry   || { exit 1; }
ember generate flexberry-enum --dummy ember-flexberry-dummy-gender --file=ember-flexberry-dummy-gender.json --metadata-dir=vendor/flexberry   || { exit 1; }
ember generate flexberry-enum --dummy ember-flexberry-dummy-vote-type --file=ember-flexberry-dummy-vote-type.json --metadata-dir=vendor/flexberry   || { exit 1; }
ember generate flexberry-list-form --dummy ember-flexberry-dummy-comment-list --file=ember-flexberry-dummy-comment-list.json --metadata-dir=vendor/flexberry   || { exit 1; }
ember generate flexberry-list-form --dummy ember-flexberry-dummy-localization-list --file=ember-flexberry-dummy-localization-list.json --metadata-dir=vendor/flexberry   || { exit 1; }
ember generate flexberry-list-form --dummy ember-flexberry-dummy-suggestion-type-list --file=ember-flexberry-dummy-suggestion-type-list.json --metadata-dir=vendor/flexberry   || { exit 1; }
ember generate flexberry-list-form --dummy ember-flexberry-dummy-suggestion-list --file=ember-flexberry-dummy-suggestion-list.json --metadata-dir=vendor/flexberry   || { exit 1; }
ember generate flexberry-list-form --dummy ember-flexberry-dummy-application-user-list --file=ember-flexberry-dummy-application-user-list.json --metadata-dir=vendor/flexberry   || { exit 1; }
ember generate flexberry-edit-form --dummy ember-flexberry-dummy-application-user-edit --file=ember-flexberry-dummy-application-user-edit.json --metadata-dir=vendor/flexberry   || { exit 1; }
ember generate flexberry-edit-form --dummy ember-flexberry-dummy-localization-edit --file=ember-flexberry-dummy-localization-edit.json --metadata-dir=vendor/flexberry   || { exit 1; }
ember generate flexberry-edit-form --dummy ember-flexberry-dummy-suggestion-edit --file=ember-flexberry-dummy-suggestion-edit.json --metadata-dir=vendor/flexberry   || { exit 1; }
ember generate flexberry-edit-form --dummy ember-flexberry-dummy-suggestion-type-edit --file=ember-flexberry-dummy-suggestion-type-edit.json --metadata-dir=vendor/flexberry   || { exit 1; }
ember generate flexberry-edit-form --dummy ember-flexberry-dummy-comment-edit --file=ember-flexberry-dummy-comment-edit.json --metadata-dir=vendor/flexberry   || { exit 1; }
ember generate flexberry-application --dummy app --metadata-dir=vendor/flexberry   || { exit 1; }
ember build   || { exit 1; }
rm -rf tests/
mv tests-save tests
exit 0;
