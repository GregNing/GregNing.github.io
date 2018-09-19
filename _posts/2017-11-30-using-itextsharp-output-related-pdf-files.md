---
layout: post
title: 'MVC 使用iTextsharp 產出相關 PDF檔案'
date: 2017-11-30 01:47
comments: true
categories:
tags: MVC Csharp
---
請先自行使用Nutget安裝 iTextsharp
以下範例是在圖片上加上文字 產出PDF檔案此篇是利用絕對位置在圖片上加上字元
```cs
using iTextSharp.text;
using iTextSharp.text.pdf;
//建立(創建iTextsharp第一步驟建立檔案)
//第一個參數設定 pagesize 接下來則是 Marginleft, Marginright, MarginTop, MarginBottom
Document document = new Document(PageSize.A4);
```
如果是已知產檔位置
```cs
//您所創建檔案位置
string  documentpath = Path.Combine(@"D:\testdocument.pdf");
//第二步，為該Document創建一個Writer實例：
//產出檔案到指定位置
PdfWriter pdfwriter = PdfWriter.GetInstance(document, new FileStream(documentpath, FileMode.Create));
```
如果是需要傳送前端
```cs
//web application 以下使用方式是產出到 stream 內以及傳到前端 讓使用者下載 或 預覽 dispose()
PdfWriter pdfwriter = PdfWriter.GetInstance(document, mstream);
```
以下程式碼開始
首先先設定我們接下來會在PDF檔所使用到的相關字型
字型設定 Garamond

	private static readonly string garafont = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Fonts),"GARA.TTF");
	以下方式是使用直接下載字樣存在專案檔裡面需要時再取出從 fonts裡取出您所需要的字型
	private static readonly string edwardianfont = Path.Combie(Server.MapPath("~/fonts"),"GARA.TTF")

字型為 Edwardian Script ITC Regular

	直接從取local端磁碟區的C://Windows//fonts//ITCEDSCR.TTF
	private static readonly string edwardianfont = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Fonts),"ITCEDSCR.TTF");
	以下方式是使用直接下載字樣存在專案檔裡面需要時再取出從 fonts裡取出您所需要的字型
	private static readonly string edwardianfont = Path.Combie(Server.MapPath("~/fonts"),"ITCEDSCR.TTF")

字型為 Modern No. 20 Regular

	private static readonly string modernfont = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Fonts),"MOD20.TTF");
	以下方式是使用直接下載字樣存在專案檔裡面需要時再取出從 fonts裡取出您所需要的字型
	private static readonly string edwardianfont = Path.Combie(Server.MapPath("~/fonts"),"MOD20.TTF")

字行樣式 因要顯示中文 需使用 kaiu.ttf標楷體字型 OR 蘋方體 PingFangTC_0.ttf使用在有關中文字

	private static readonly string pingFangTCfont = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Fonts),"PingFangTC_0.ttf");
	以下方式是使用直接下載字樣存在專案檔裡面需要時再取出從 fonts裡取出您所需要的字型
	private static readonly string edwardianfont = Path.Combie(Server.MapPath("~/fonts"),"PingFangTC_0.ttf")

iTextsharp 範例開始
```cs
//句子
Phrase phrase = new Phrase();
//字型設定
BaseFont bfChinese = BaseFont.CreateFont();
Font chfont = new Font();
//寬度 width
float x = default(float);
//高 heigh
float y = default(float);
using (MemoryStream mstream = new MemoryStream())
{
  using (Document document = new Document(PageSize.A4))
  {
    using (PdfWriter pdfwriter = PdfWriter.GetInstance(document, mstream))
    {
      //開起文件
      document.Open();
      //範例中會使用到的是PdfContentByte及ColumnText 2個類別。首先於頁面中加入一張圖檔，
      //我們在圖片的內文寫字。
      //主要使用到的方法是PdfWriter.DirectContent 及PdfWriter.DirectContentUnder：
      //Direct content 是指在頁面的絕對位置中插入內容。
      PdfContentByte over = pdfwriter.DirectContent;
      //照片檔案路徑因我把檔案放在FTP Server上所以使用自己寫得GetFTPdocument去做取得檔案動作並且回傳Byte[]
      Byte[] documentName = GetFTPdocument(fileName, serverName);
      //讀取圖片來源
      Image image = Image.GetInstance(documentName);
      //圖片縮放大小
      image.ScalePercent(24f);
      //將圖片加入到某個座標位置absolute position 需使用此方式讓圖片定住而不跑掉
      image.SetAbsolutePosition(0, 0);
      image.Alignment = Element.ALIGN_MIDDLE;
      image.Alignment = Element.ALIGN_CENTER;
      image.BorderWidth = 0;
      image.PaddingTop = 0;
      //加進去pdf檔案裡面
      document.Add(image);
      //使用 FontFactory 建立所需的字形
      //Ex:
      //1. 需先註冊 FontFactory.Register(Path.Combine(@"C:\Windows\Fonts\ITCEDSCR.TTF"), "Edwardian");
      //2. 在進行使用字型相關設定
      FontFactory.GetFont("Edwardian", BaseFont.IDENTITY_H, 20, Font.NORMAL, new BaseColor(52, 52, 52));
      字型為 Edwardian Script ITC Regular 暱稱所使用
      FontFactory.Register(edwardianfont, "Edwardian");
      字型為 Modern No. 20 Regular 數據顯示所使用
      FontFactory.Register(modernfont, "Modern");

      //使用CreateFont 使用 RandomAccessSourceFactory 來轉換 任何傳入stream格式
      //第一種設定字元的方法使用CreateFont
      bfChinese = BaseFont.CreateFont(garafont, BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED);
      chfont = new Font(bfChinese, 20, Font.NORMAL, new BaseColor(52, 52, 52));
      text = string.Format("{0} - {1}", DateTime.Now.ToString("yyyy/MM/dd"), DateTime.Now.AddMonths(1).ToString("yyyy/MM/dd"));
      //加入字元以及字的型式到句子裡面
      phrase = new Phrase(text, chfont);
      //設定水平置中(打印的位置)
      x = (PageSize.A4.Width / 2);
      //高度請自行決定(打印的位置)
      y = (PageSize.A4.Height / 2) + 180;
      //利用ColumnText 使用示文字內容於頁面絕對位置
      ColumnText.ShowTextAligned(over, Element.ALIGN_CENTER, phrase, x, y, 0);
      //姓名
      text = "iTextsharp測試使用絕對位置以及加載圖片"
      //第二種設定文字方式
      chfont = FontFactory.GetFont("Edwardian", BaseFont.IDENTITY_H, 55, Font.NORMAL, new BaseColor(52, 52, 52));
      phrase = new Phrase(text, chfont);
      //設定水平位置
      x = (PageSize.A4.Width / 2) - 12;
      //設定高度
      y = (PageSize.A4.Height / 2) - 310;
      //利用ColumnText 顯示文字內容於頁面絕對位置
      ColumnText.ShowTextAligned(over, Element.ALIGN_CENTER, phrase, x, y, 0);

      //字行樣式 因要顯示中文 需使用 kaiu.ttf標楷體字型 OR 蘋方體 PingFangTC_0.ttf
      //IDENTITY_H 橫式中文 .ttc則是True Type Collection字型檔，ttf的集合
      //若要選ttc檔 C:\WINDOWS\Fonts\msjh.ttc,1 使用此方式
      //因為 iTextSharp 只支援 14 個標準的 Type 1 英文字型，並沒有直接支援中文字型的顯示，取而代之的是你必須自行指定中文字型來源才能獲得解決，所以在此整理顯示中文字的幾種解決方案。
      bfChinese = BaseFont.CreateFont(pingFangTCfont, BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED);
      //處理文字顯示 Ex: 票數
      chfont = new Font(bfChinese, 15, Font.NORMAL, new BaseColor(154, 154, 154));
      text = exitsdatatype.FirstOrDefault().Text;
      phrase = new Phrase(text, chfont);
      //x軸不動已設定好
      x = (PageSize.A4.Width / 2) - 75;
      //高度中心點的變化 取決於選項datatype的多寡
      if (datatype.Length == 1)
      {
        y = PageSize.A4.Height - (PageSize.A4.Height / 2);
      }
      else
      {
        if (i == 0)
        {
          y = PageSize.A4.Height - (PageSize.A4.Height / 2) + 130;
        }
        else
        {
          y = y - 40;
        }
      }
      //利用ColumnText 顯示文字內容於頁面絕對位置
      //數據資料名字顯示
      ColumnText.ShowTextAligned(over, Element.ALIGN_CENTER, phrase, x, y, 0);
      //處理文字顯示 Ex: 票數
      //處理數據顯示顯示 Ex: 555
      chfont = FontFactory.GetFont("Modern", BaseFont.IDENTITY_H, 30, Font.NORMAL, new BaseColor(226, 164, 62));
      text= "測試名稱";
      phrase = new Phrase(text, chfont);
      //x軸不動已設定好
      x = (PageSize.A4.Width / 2) + 45;
      //利用ColumnText 顯示文字內容於頁面絕對位置
      //數據資料顯示
      ColumnText.ShowTextAligned(over, Element.ALIGN_CENTER, phrase, x, y, 0);
      //處理數據顯示顯示 Ex: 555
      //以下開始畫底線
      //數據所使用的底線
      over.SaveState();
      over.SetTextRenderingMode(PdfContentByte.TEXT_RENDER_MODE_STROKE);
      over.SetLineWidth(0.5);
      //底線顏色 #efebeb = (235,235,235)
      over.SetRGBColorStroke(235, 235, 235);
      over.MoveTo(x - 60, y - 4);
      over.LineTo(x + 60, y - 4);
      over.Stroke();
      over.RestoreState();
      //數據所使用的底線
      }
    //關閉文件
    document.Close();
    //在這注意當文件關閉時才能完整取得檔案串流並且直接轉成byte[]
    //中途取得stream一律尚未完成
    //在將byte 傳送至前端即可
    Byte[] bytes = mstream.ToArray();
  }
}
```
[itextpdf](https://developers.itextpdf.com/fr/node/1798)
[why-doesnt-fontfactory-getfontknown-font-name-floatsize-work](https://stackoverflow.com/questions/24007492/why-doesnt-fontfactory-getfontknown-font-name-floatsize-work)