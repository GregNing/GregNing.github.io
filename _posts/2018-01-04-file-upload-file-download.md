---
layout: post
title: 'File Download 檔案下載 & 使用 iframe'
date: 2018-01-04 08:35
comments: true
categories:
tags: iframe JS Csharp MVC
---

若使用例如:<br>
Application、Session、Cookie、Cache、ViewState ViewData ViewBage TempData等....
要記得序列化該類別。<br>
序列化是將資訊轉換成，可被儲存或傳送位元資料流的一種過程。
```cs
[DataContract]
[Serializable]
public class VMFileData
{
  //回傳至前端所使用
  [DataMember]
  public Byte[] databyte { get; set; }
  //檔案名稱
  [DataMember]
  public string fileName { get; set; }
  //檔案key值
  [DataMember]
  public int key { get; set; }
}
```
一開始先搜尋資料以及驗證輸入是否正確，如一切都驗證過再將資訊傳給`TempData["File"] = result`;
```js
function exportfunciton(salesid) {
//生一個IFRAME出來
var iframe = document.createElement("iframe");
//在這先宣告網址如果輸入資料正確才會真正下載
var url = '@Url.Action("DonwloadFile", CommonRazorFunctions.GetControllerName())?id= ' + id;
$.ajax({
  type: 'POST',
  contentType: "application/json; charset=utf-8",
  url: "@Url.Action('SearchData', CommonRazorFunctions.GetControllerName())",
  data: JSON.stringify({ id: id }),
  datatype: 'json',
  cache: false,
  //設定Token
  headers: { 'RequestVerificationToken': '@CommonRazorFunctions.GetAntiForgeryToken()' },
  success: function (result) {
    //成功後執行function
    if (result.success) {
      //把檔案網址丟給IFRAM
      iframe.src = url;
      //把IFRAME設為不顯示
      iframe.style.display = "none";
      //把IRAME 附加到BODY
      document.body.appendChild(iframe);
	}}
  ,error: function (response) {
    if (response.status == "200") {
      //把檔案網址丟給IFRAM
      iframe.src = url;
      //把IFRAME設為不顯示
      iframe.style.display = "none";
      //把IRAME 附加到BODY
      document.body.appendChild(iframe);
    }},
  });
}
```