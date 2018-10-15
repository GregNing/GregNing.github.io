---
layout: post
title: '使用 Angularjs dynamic ng-pattern validation'
date: 2018-07-11 13:24
comments: true
categories: Angularjs
tags: Angularjs
reference:
  name:
    - 正規化表達式
    - Angularjs dynamic ng-pattern validation
    - Angularjs change value use ngModel
    - Angular add key code
    - Javascript - Emulate a space bar keypress
    - How to get keypress if press a key anywhere in the document?
  link:
    - http://blog.jex.tw/blog/2013/01/16/regex/
    - https://stackoverflow.com/questions/18900308/angularjs-dynamic-ng-pattern-validation
    - https://stackoverflow.com/questions/22639485/angularjs-how-to-change-the-value-of-ngmodel-in-custom-directive
    - https://stackoverflow.com/questions/17470790/how-to-use-a-keypress-event-in-angularjs
    - https://stackoverflow.com/questions/34017695/javascript-emulate-a-space-bar-keypress
    - https://stackoverflow.com/questions/46329525/how-to-get-keypress-if-press-a-key-anywhere-in-the-document
---
我們要使用正規化來限制使用者輸入某些特殊字元
原本是
```HTML
<input type="text" name="country_code" pattern="[A-Za-z]">
```
我們要改成`ng-pattern`
```HTML
<input type="text" name="country_code" ng-pattern="[A-Za-z]">
```
接下來直接上程式
```js
app.directive("checkLanguageLimitPattern", function() {
  return {
    restrict: "A",
    require: "ngModel",
    scope: {
         ngModel: '='
    },
    link: function(scope, el, attrs, ngModel) {
      el.bind('keypress',function (event) {
        var key = document.all ? key= event.keyCode : key= event.which;
        // 禁止輸入特殊字元包括空格
        if (!((key > 64 && key < 91) || (key > 96 && key < 123) || key === 8 || (key >= 48 && key <= 57)) || key === 32)
        {
          event.preventDefault();
        }
      })
      var patternValidator, required = true,
        patternCH = new RegExp("[\u4E00-\u9FA5]+"), //中文
        patternEN = new RegExp("[A-Za-z]+"); //英文

      patternValidator = function(value) {
        if (patternCH.test(value)) {
          return validate(/^[\u4e00-\u9fa5a-zA-Z0-9]{1,20}$/, value);
        }

        if (patternEN.test(value)){
          return validate(/^[A-Za-z0-9]{1,30}$/, value);
        }
      };

      ngModel.$formatters.push(patternValidator);
      ngModel.$parsers.push(patternValidator);

      attrs.$observe("required", function(newval) {
        required = newval;
        patternValidator(ngModel.$viewValue);
      });

      function validate(regexp, value) {
        if(!required || regexp.test(value)) {
          ngModel.$setValidity('pattern', true);
          return value;
        }
        else {
          ngModel.$setValidity('pattern', false);
          value = value.replace(/\s+/g, "").replace(/[`~!@#$%^&*()|+=?;:'",.<>\{\}\[\]\\\/]/gi, '').substr(0, 160) // 取代空格 or 特殊符號
          ngModelCtrl.$modelValue = value;
          scope.ngModel = value; // overwrites ngModel value
          return;
        }
     }
    }
  };
});
```
當然你也可以這樣寫(不推薦寫法)
```js
$scope.phoneNumberPattern = (function() {
    var regexp = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
    return {
        test: function(value) {
            if( $scope.requireTel === false ) {
                return true;
            }
            return regexp.test(value);
        }
    };
})();
```