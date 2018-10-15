---
layout: post
title: 'MVC Use FTP Server Show imge'
date: 2017-09-27 06:31
comments: true
categories: MVC
tags: MVC FTP Csharp
reference:
  name:
    - upload-file-to-ftp-using-c-sharp
    - show-image-directly-from-ftp
    - asp-net-image-source-from-ftp-address
  link:
    - https://stackoverflow.com/questions/15268760/upload-file-to-ftp-using-c-sharp
    - https://stackoverflow.com/questions/30431513/show-image-directly-from-ftp
    - https://stackoverflow.com/questions/14396744/asp-net-image-source-from-ftp-address
---
首先上傳圖片有兩種方式 使用FtpWebRequest方式做上傳動作

1. Use FtpWebRequest

建立 FTP 所需 class

	FtpSettings _ftpsettings;
	private struct FtpSettings
	{
	//存放 fpt網址
	public string Server { get; set; }
	//帳號
	public string UserName { get; set; }
	//密碼
	public string Password { get; set; }
	//檔案名字
	public string FileName { get; set; }
	};

找到 路徑以及檔案  假路徑檔案的資料(因為在上傳時會先製造假路徑在使用者電腦等到真正送出才上傳到FTP Server)

	string pathCombieName = Path.Combine(fakenamepath, model.NewFileName);

取得檔案名稱 真實名.jpg檔

	model.NewFileName = string.Format("{0}{1}", cn, Path.GetExtension(model.NewFileName));

取得FTP 相關設定

	_ftpsettings.FileName = model.NewFileName;
	_ftpsettings.Password = UserPassword;
	_ftpsettings.Server = ServerName;
	_ftpsettings.UserName =UserName;

使用WebClient 三行完成

	using (WebClient client = new WebClient())
	{
	  client.Credentials = new NetworkCredential(_ftpsettings.UserName, _ftpsettings.Password);
	  client.UploadFile(new Uri(string.Format("{0}/{1}", _ftpsettings.Server, _ftpsettings.FileName)), "STOR",pathCombieName);
	}

使用 FtpWebRequest 好幾行完成
開始建立 FTP連接資訊

	FtpWebRequest request = (FtpWebRequest)WebRequest.Create(new Uri(string.Format("{0}/{1}", _ftpsettings.Server, _ftpsettings.FileName)));

上傳方式 使用檔案

	request.Method = WebRequestMethods.Ftp.UploadFile;

上傳檔案密碼

	request.Credentials = new NetworkCredential(_ftpsettings.UserName, _ftpsettings.Password);

讀取 假目錄的檔案

	using (FileStream istreamread = new FileStream(pathCombieName, FileMode.Open, FileAccess.Read, FileShare.Read))
	{
	//轉byte
	byte[] imgbyte = new byte[istreamread.Length];
	istreamread.Read(imgbyte, 0, imgbyte.Length - 1);
	request.ContentLength = imgbyte.Length;
	Stream filestream = request.GetRequestStream();
	for (int i = 0; i < imgbyte.Length; i++)
	{
	    filestream.WriteByte(imgbyte[i]);
	}

將資料流關掉否則等等無法刪除該資料夾

	FtpWebResponse response = (FtpWebResponse)request.GetResponse();

問題代碼 response.StatusDescription

	ActionLogHelper.LogAction<Model>(0, 0, response.StatusDescription);
	response.Close();
	istreamread.Dispose();
	istreamread.Close();
	filestream.Dispose();
	filestream.Close();
	}

刪除假檔案目錄所有的資料

	Directory.Delete(fakenamepath, true);

可以這樣接 是上傳檔案發生錯誤

	catch (WebException ex)
	{
	//上傳檔案發生錯誤
	model.message = ((FtpWebResponse)ex.Response).StatusDescription;
	return model;
	}

[來源](https://www.youtube.com/watch?v=5d-AE21Zjog)
使用WebClient 做顯示圖 或下載等等項目

	byte[] imgbyte = new byte[0];
	using (WebClient client = new WebClient())
	{
	client.Credentials = new NetworkCredential(_ftpsettings.UserName, _ftpsettings.Password);
	client.DownloadData(new Uri(string.Format("{0}/{1}", _ftpsettings.Server, _ftpsettings.FileName)));
	byte[] imageBytes = client.DownloadData(new Uri(string.Format("{0}/{1}", _ftpsettings.Server, _ftpsettings.FileName)));
	imgbyte = imageBytes;
	ontext.Response.Buffer = true;
	context.Response.Charset = "";
	context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
	context.Response.ContentType = "image/png";
	context.Response.AddHeader("content-disposition", "attachment;filename=Image.png");
	context.Response.BinaryWrite(imgbyte);
	}
	return imgbyte;
	//前端 Controller
	byte[] result = new byte[0];
	result = listInfoSetings.GetUsersFTPImages(pic, HttpContext);
	if (result.Length == 0)
	{
	//do error something
	}
	return File(result, "image/jpeg");
