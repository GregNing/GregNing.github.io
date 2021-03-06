---
layout: post
title: '使用WebImage 調整圖像大小像速比'
date: 2017-09-18 15:42
comments: true
categories: WebImage
tags: WebImage Csharp
reference:
  name:
    - webimage-crop-to-square
  link:
    - https://stackoverflow.com/questions/4535193/webimage-crop-to-square
---
```cs
private static void CropImage (HttpPostedFileBase sourceImage) {
  var newImage = new WebImage(sourceImage.InputStream);
  var width = newImage.Width;
  var height = newImage.Height;
  if (width > height) {
    var leftRightCrop = (width - height) / 2;
    newImage.Crop(0, leftRightCrop, 0, leftRightCrop);
  }
  else if (height > width) {
    var topBottomCrop = (height - width) / 2;
    newImage.Crop(topBottomCrop, 0, topBottomCrop, 0);
  }
//do something with cropped image...
newImage.GetBytes();
}
```
```cs
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
```
##### 下面這段式調整好的大小比因為寬高有固定所以直接設等比
```cs
WebImage img_cropped = img.Resize(226, 280, true, true);
```
