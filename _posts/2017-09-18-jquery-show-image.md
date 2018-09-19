---
layout: post
title: '使用Jquery將照片載入顯示'
date: 2017-09-18 16:46
comments: true
categories:
tags: Jquery CSS
---
```js
var reader = new FileReader();
reader.onload = function (e) {
  $('#target').attr('src', e.target.result);
}
reader.readAsDataURL(data.files[0]);
$(".managementupload .userimges").show();
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    canvas = null;
    reader.onload = function (e) {
      image = new Image();
      image.onload = validateImage;
      image.src = e.target.result;
    }
  reader.readAsDataURL(input.files[0]);
}
```
 [jquery-file-upload-preview-image](https://stackoverflow.com/questions/21128634/jquery-file-upload-preview-image)<br>
 [preview-an-image-before-it-is-uploaded](https://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded)