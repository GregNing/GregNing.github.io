---
layout: post
title: 'jQuery File Upload 檔案上傳 + 使用 [jQuery] Jcrop 做圖片裁切'
date: 2017-12-11 03:33
comments: true
categories: MVC
tags: MVC Csharp
reference:
  name:
    - jQuery File Upload Demo
    - Jcrop
  link:
    - https://blueimp.github.io/jQuery-File-Upload/
    - http://jsgears.com/thread-173-1-1.html
---
上傳檔案[jQuery File Upload Demo](https://blueimp.github.io/jQuery-File-Upload/)<br>
裁切圖片[jQuery Jcrop](http://jsgears.com/thread-173-1-1.html)
```HTML
<div class="uploadcontainer">
  <div class="managementupload">
    <i class="fa fa-cloud-upload " aria-hidden="true"></i><br />
    <input id="fileupload" type="file" name="files[]" multiple>
    <div class="userimges" style="display:none">
      <img id="target" src="#" alt="usersimage" />
    </div>
  </div>
  <span class="filename">Files Name</span><br />
    <div class="progress" style="display:none">
    <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">
      <span class="sr-only">0% complete</span>
    </div>
  </div>
</div>
```
```js
$('#fileupload').fileupload({
dropZone: $('.managementupload'),
url: '@Url.Action("Upload", "ManagementMember")',
dataType: 'json',
beforeSend: function (xhr, data) {
xhr.setRequestHeader('RequestVerificationToken', '@CommonRazorFunctions.GetAntiForgeryToken()');},
add: function (e, data) {
  var goUpload = true;
  var uploadFile = data.files[0];
  //判斷是否有檔案
  if (uploadFile.size <= 0) {
    displaybox('新增圖片檔案', '請選擇圖片!', 0);
    goUpload = false;
  }
  //檔案大小不得超過5 MB
  if (uploadFile.size > 5242880) {
    displaybox('新增圖片檔案', '圖片不可以超過 5 MB!', 0);
    goUpload = false;
  }
  //檔案格式 除了 JPG JPEG 檔能上傳 其他則不允許
  var acceptFileTypes = /(\.|\/)(jpe?g)$/i;
  if (!acceptFileTypes.test(uploadFile.name)) {
    displaybox('新增圖片檔案', '檔案格式有問題，請選擇JPG檔或是PDF檔。', 0);
    goUpload = false;
  }
  if (goUpload === true) {
    loadImage(data);
    setTimeout(function () {
    //開始擷取圖片
    applyCrop();
    data.submit();
  }, 10);
  }
},
  maxFileSize: 5242880,
  autoUpload: true,
  done: function (e, data) {
  if (data.result.isUploaded) {
  $(".uploadcontainer .filename").text(data.originalFiles[0].name);
  $("#OrgFileName").val(data.originalFiles[0].name);
  $("#FileSize").val(data.originalFiles[0].size);
  $("#NewFileName").val(data.result.newFileName);
  }
  else {
  displaybox('上傳圖片發生錯誤!', data.result.message, 2);
  }
  },
  fail: function (event, data) {
    if (data.files[0].error) {
    displaybox('上傳圖片發生錯誤!', data.files[0].error, 2);
    }
  },
//上傳所顯示的 bar
progressall: function (e, data) {
  $(".progress").show();
  var progress = parseInt(data.loaded / data.total * 100, 10);
  $('.progress .progress-bar').css('width', progress + '%');
  $('.progress .progress-bar').text(progress + '%');
  },
});
//圖片裁切Function
  var crop_max_width = 226,
  crop_max_height = 500,
  jcrop_api,
  canvas,
  context,
  image,
  prefsize;
	將圖片載進
  function loadImage(input) {
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
  }
  function validateImage() {
    if (canvas != null) {
    image = new Image();
    image.onload = restartJcrop;
    image.src = canvas.toDataURL('image/png');
    } else restartJcrop();
  }
  function restartJcrop() {
  if (jcrop_api != null) {
  jcrop_api.destroy();
  }
  $(".userimges").empty();
  $(".userimges").append("<canvas id=\"canvas\">");
  canvas = $("#canvas")[0];
  context = canvas.getContext("2d");
  canvas.width = image.width;
  canvas.height = image.height;
  context.drawImage(image, 0, 0);
  $("#canvas").Jcrop({
    onSelect: selectcanvas,
    onRelease: clearcanvas,
    boxWidth: crop_max_width,
    boxHeight: crop_max_height,
    allowSelect: false,
    },
  function () {
    jcrop_api = this;
    });
    clearcanvas();
  }
  function clearcanvas() {
    prefsize = {
      x: 0,
      y: 0,
      w: canvas.width,
      h: canvas.height,
    }
  }

  function selectcanvas(coords) {
    prefsize = {
      x: Math.round(coords.x),
      y: Math.round(coords.y),
      w: Math.round(coords.w),
      h: Math.round(coords.h)
    };
  }
  //裁切圖片
  function applyCrop() {
    prefsize.h = 226;
    prefsize.w = 280;
    prefsize.x = 121;
    prefsize.y = 47;
    canvas.width = prefsize.w;
    canvas.height = prefsize.h;
    context.drawImage(image, prefsize.x, prefsize.y, prefsize.w, prefsize.h, 0, 0, canvas.width, canvas.height);
    validateImage();
    setTimeout(function () {
    //顯示照片
    $(".userimges").children('.jcrop-holder').css({ "border-radius": "50%", "width": "80px", "height": "80px" });
    $("#canvas").css({ "border-radius": "50%", "width": "80px", "height": "80px" });
    $(".managementupload .userimges").fadeIn();
    }, 1)
    }
  function dataURLtoBlob(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
    var parts = dataURL.split(',');
    var contentType = parts[0].split(':')[1];
    var raw = decodeURIComponent(parts[1]);
  return new Blob([raw], {
  type: contentType
  });
  }
  var parts = dataURL.split(BASE64_MARKER);
  var contentType = parts[0].split(':')[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;
  var uInt8Array = new Uint8Array(rawLength);
  for (var i = 0; i < rawLength; ++i) {
  uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], {
  type: contentType
  });
}
```
```cs
//上傳檔案
[HttpPost]
public ActionResult Upload()
{
  HttpPostedFileBase myFile = Request.Files[0];
  WebImage img = new WebImage(myFile.InputStream);

  int width = img.Width;
  int height = img.Height;

  if (width > height)
  {
  int leftRightCrop = (width - height) / 2;
  img.Crop(0, leftRightCrop, 0, leftRightCrop);
  }
  else if (height > width)
  {
  int topBottomCrop = (height - width) / 2;
  img.Crop(topBottomCrop, 0, topBottomCrop, 0);
  }
  WebImage img_cropped = img.Resize(226, 280, true, true);
  UploadModel model = new UploadModel();
  bool isUploaded = false;
  string message = string.Empty;
  model.FileContent = img_cropped.GetBytes();
  model.FileSize = img_cropped.GetBytes().Length;
  model.FileType = myFile.ContentType;
  model.OriginalFileName = myFile.FileName;
	//取得檔案限制所需的參數
	//預設 上傳檔案最大容量為 5MB
	string fileContent = 5242880;
	//上傳檔案限制5MB容量 在這做轉型動作
	int fileSize = Int32.Parse(fileContent);
	//取得 JPG
	string filJPG = JPG;
	//取得JPEG
	string fileJPEG = JPEG;
	//檔案 格式判斷
	if (model != null)
  {
    //抓取副檔名
    string fileExtension = Path.GetExtension(model.OriginalFileName).ToUpper();
    fileExtension = fileExtension.Substring(1, fileExtension.Length - 1);
    if (!string.IsNullOrWhiteSpace(fileExtension))
    {
      //檔案格式 除了 JPG JPEG PDF 檔能上傳 其他則不允許
      if (fileExtension != filJPG && fileExtension != fileJPEG)
      {
      return Json(new { isUploaded = false, message = "檔案格式有問題，請選擇JPG檔或是JPEG檔。" });
      }
    }
    if (model.FileSize > fileSize)
    {
      return Json(new { isUploaded = false, message = "檔案格式有問題，檔案太大請修正。" });
    }
	}
  try
  {
    //開始上傳檔案至路徑
    model = commonInfoSetings.UploadFiles(model);
    if (!string.IsNullOrWhiteSpace(model.message))
    {
      return Json(new { isUploaded = false, message = message });
    }
    if (model != null && model.FileSize != 0)
    {
      isUploaded = true;
      message = "檔案上傳成功!";
    }
  }
  catch (Exception ex)
  {
    message = string.Format("檔案上傳失敗: {0}", ex.Message);
  }
  return Json(new { isUploaded = isUploaded, message = message, newFileName = model.NewFileName }, "text/html");
}
```