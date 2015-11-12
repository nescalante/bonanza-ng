'use strict';

var bonanza = require('bonanza');

angular.module('bonanza')
  .directive('bonanza', function ($parse, $q) {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function (scope, element, attrs, ngModel) {
        var lastItemSelected;

        element
          .unbind('input')
          .unbind('keydown')
          .unbind('change');

        var options = {};

        if (attrs.bonanzaValueTemplate) {
          options.templates.label = resolveTemplate(attrs.bonanzaValueTemplate);
          options.templates.item = options.templates.label;
        }

        if (attrs.bonanzaItemTemplate) {
          options.templates.item = resolveTemplate(attrs.bonanzaItemTemplate);
        }

        if (attrs.bonanzaLoading) {
          options.templates.loading = resolveTemplate(attrs.bonanzaLoading);
        }

        var requestFn = $parse(attrs.bonanzaRequest);
        var onSelectFn = attrs.bonanzaOnSelect && $parse(attrs.bonanzaOnSelect);
        var container = bonanza(element[0], options, doQuery);

        container.on('change', changeItem);

        container.on('select', function (item) {
          lastItemSelected = item;
        });

        element.on('blur', function () {
          if (lastItemSelected) {
            changeItem(lastItemSelected);

            lastItemSelected = null;
          }
        });

        if (attrs.bonanzaIsLoading) {
          container.on('search', function () {
            $parse(attrs.bonanzaIsLoading).assign(scope, true);
          });

          container.on('success', function () {
            $parse(attrs.bonanzaIsLoading).assign(scope, false);
          });
        }

        if (ngModel) {
          scope.$watch(function () {
            return ngModel.$modelValue;
          }, updateValue, true);
        }

        function changeItem(item) {
          scope.$apply(function () {
            if (ngModel) {
              ngModel.$setViewValue(item);
            }

            if (onSelectFn) {
              onSelectFn(scope, { $item: item });
            }
          });

          lastItemSelected = null;
        }

        function updateValue(obj) {
          if (!obj) {
            element[0].value = '';
          }
          else {
            element[0].value = bonanza.render(options.templates.label, obj);
          }
        }

        function resolveTemplate(attr) {
          return function (item) {
            return $parse(attr)(scope, item);
          };
        }

        function doQuery(query, callback) {
          var request = requestFn(scope, { $query: query });

          $q.when(request)
            .then(function (result) {
              callback(null, result);
            })
            .catch(function (err) {
              callback(err);
            });
        }
      }
    };
  });
