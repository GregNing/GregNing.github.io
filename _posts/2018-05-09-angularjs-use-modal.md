---
layout: post
title: 'Angularjs use modal settings'
date: 2018-05-09 05:16
comments: true
categories:
description: 'Angularjs use modal settings(使用 Angularjs 設定 Bootstrap視窗)'
---
`<%= t('message')%>` 是用I18n轉換而來
```
<div class="modal-footer">
<button type="button" class="btn btn-cancle"
data-dismiss="modal" ng-click="cancel()">
<%= t('message')%>
</button>
<button class="btn btn-confirm"
type="button"
name="button"
ng-click="submitConfirm()">
</button>
</div>
```
```
$rootScope.currentModal = $modal.open({
  templateUrl: '/messages/confirm/modal?messages=' + message
})
//關閉視窗後所要做的事情
$rootScope.currentModal.result.then(function(datapassedinwhileclosing){
//Do stuff with respect to closure
});
//dismisss後所要做的事情
$rootScope.currentModal.result.catch(function(){
//Do stuff with respect to dismissal
});
//打開 modal所要做的事情
$rootScope.currentModal.opened.then(function(){
/open modal do somethings
});
//設定按鈕關閉(dismiss)
//dismiss(reason) - a method that can be used to dismiss a modal, passing a reason
$rootScope.cancel = function () {
	$rootScope.currentModal.dismiss('cancel');
}
//設定按鈕關閉(closure)
//close(result) - a method that can be used to close a modal, passing a result
$rootScope.submitConfirm = function () {
  $rootScope.currentModal.close()
}
```
{% capture string_with_newlines %}
`dismiss` : 單純的關閉不需要觸發任何的callback可以使用這個。
`close` : 關閉且觸發所需的callback可以使用這個。
[angular close modal doing things](https://stackoverflow.com/questions/30356844/angularjs-bootstrap-modal-closing-call-when-clicking-outside-esc)
{% endcapture %}
{{ string_with_newlines | newline_to_br }}