---
layout: post
title: 'Highcharts  折線圖使用'
date: 2017-09-08 17:26
comments: true
categories: Hihcharts
tags: Highcharts MVC Csharp Jquery
---

##### 先設定折線圖所需要元件
```HTML
<div id="highchartfaded">
  //折線圖所聯繫的id highchartscontainer
  <div id="highchartscontainer" class="highchartsclas"></div>
</div>
```
##### 折線圖Function
```js
var chart = new Highcharts.Chart({
  chart: {
    //折線圖所聯繫的id
    renderTo: 'highchartscontainer',
    width: 1674,
    height:621,
  },
  //將右下角的 highchart.com連結隱藏起來
  credits: {
    enabled: false
  },
  //顯示x軸使用者背景
  legend: {
    //backgroundColor: '#ffffff',
    //borderColor: '#9a9a9a',
    useHTML: true,
    // layout: 'horizontal', // default
    itemDistance: 20,
  },
  //自訂X軸座標，也可以從Server塞資料進來
  //xAxis: {categories: ['']},
  yAxis: {
    title: {
    text: 'title'
    }
  },
  //處理數據上在折線圖顯示部分
  tooltip: {
    //一次看多點數據
    shared: true,
    //當滑鼠移動至月份區塊時 整塊區塊會產生底色
    crosshairs: false,
    useHTML: true,
    borderRadius: 10,
    borderWidth: 3,
  },
  //這是資料部分一開始都是空的因為要使用dynamic
  //series: [{      }]
});
```
##### 取得相關highchart相關資訊
```js
var chart = $("#highchartscontainer").highcharts()
//or 兩者皆可
var chart = $("#highchartscontainer").highcharts().legend.allItems
```
##### 顯示於折線圖上方 設定折線圖 title
```js
chart.setTitle({ text: Title, style: { color: "#145c74" } });
```
##### 設定hichchart title相關樣式
```js
$("#highchartfaded #highchartscontainer .highcharts-title").css({ "cursor": "pointer" });
```
##### 設定x軸的名稱日期categoriesUse請以字串陣列方式帶入
```js
chart.xAxis[0].setCategories(Array.from(categoriesUse));
```
##### 設定文章TITLE可以清除線條
```js
$("#highchartfaded #highchartscontainer .highcharts-title").click(function () {
  for (var i = 0; i < UserIdlist.length; i++) {
    var seris = chart.series[i]
    if (seris.visible) {
      $('li#' + UserIdlist[i]).css("background-color", "");
    }
  }
});
```
##### 讓折線圖隱藏
```js
$.each(chart.series, function (i, ser) {
ser.hide();
});
```
##### 新增X軸名稱 以及 新增資料通(筆)數，data請以int array方式去做帶入
可以參考不同的方法[how-to-set-dynamic-data-in-highcharts](https://stackoverflow.com/questions/11775385/how-to-set-dynamic-data-in-highcharts)<br>
改變x軸的名稱[changeXname](https://stackoverflow.com/questions/14409821/highcharts-update-the-series-name-label-dynamically)
##### 設定 顏色不重複
```js
function randomNewcolor() {
  let remarning = [];
  //在這迴圈的length值可以說是你的x軸數量
  for (var i = 0; i < listmodel.length; i++) {
    let newcolor = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
    remarning.push(newcolor);
    remarning = $.unique(remarning)
    return remarning;
  }

  for (var i = 0; i < UserIdlist.length; i++) {
    chart.addSeries({
    data: ConatactCount[i],
    name: UserIdlist[i],
    //設定顏色盡量不重複function
    color: randomNewcolor()[i],
    events: {
      $($("#highchartscontainer").highcharts().series[0].legendItem.element).on('click',function(){console.log('click') })
      //legendItemClick 意思就是 highchart  click function也就是
      //也可以這樣觸發 chart.legend.allItems[0].legendItem.element).trigger('click')
      //以下是使用highcharts方式去做觸發(可以使用chart.update方式去做處理)
      legendItemClick: function () {
      //do somethings.....}}
      //先新增完成 在callredraw 所以先將addSeries false
      }, false);
     }
    }
  }
}
```
##### 將第一個顯示其餘暫時不顯示
```js
if (i !== 0) {hart.series[i].hide();}}
```
##### [增進performance](https://stackoverflow.com/questions/18977112/best-performance-for-updating-many-highcharts-instances-on-demand)
```js
chart: {
  //將animation關閉會增進performancer
  animation: false,
}
```
##### 如果有呼叫`chart.series[0].setData(Data)` 就不需要再call redraw因為setData完之後會自動callredraw
將折線圖重新規劃一次
```js
chart.redraw();
```
##### 將會顯示於X軸上方的數據顯示也就是Y軸 使用`plotOptions => series => dataLabels => enabled`可以將數據直接顯示在折線圖上方 align是位置有點類似padding left概念
將顯示的數據位移
```js
plotOptions:{
  series: {
    dataLabels: {
      align: 'left',
      enabled: true
	}
  }
}
```
##### 如果要自行設計x軸上方所顯示數據請使用以下範例
[自行設計x軸上方所顯示數據](https://stackoverflow.com/questions/17316856/is-there-a-way-to-set-highchart-options-dynamically)
```js
let v;
for (let i = 0; i < listmodel.length; i++) {
  chart.series[i].update({
    dataLabels: {
      formatter: function () {
        if (this.series.name === listmodel[i].DataName) {
          for (let datei = 0; datei < listmodel[i].DataDate.length; datei++)
          {
            if (listmodel[i].DataDate[datei] === this.x) {
              v = listmodel[i].datadatei];
              break;
            }
          }
        }
        return this.y + '(' + v + ')';
      }
    }
  });
}
```
##### [會顯示在折線圖上面呈現的樣式](https://stackoverflow.com/questions/13479476/change-highcharts-tooltip-formatter-from-chart-object-after-chart-is-rendered)
##### 新增tooltip的相關資訊
```js
chart.tooltip.options.formatter = function () {
var xyArr = [];
$.each(this.points, function () {xyArr.push('名稱: ' + this.series.name + ', ' + '日期: ' + this.x + ',數量: ' + this.y);});
return xyArr.join('<br/>'); }
//設定 圖片字行顏色
for (var i = 0; i < UserIdlist.length; i++) {
  //設定y軸title名稱有兩種方式以下三種方式都可以使用
  chart.yAxis[0].setTitle({ text: "Bananas" });
  $($("#highchartscontainerdata").highcharts().yAxis[0].axisTitle.element).text('New Label');
  chart.yAxis[0].update({
    title: {
      text: "titleName",
      align: 'high',
      offset: 0,
      rotation: 0,
      y: -15,
      style: { "font-size": "18px" }
    }
});
```
##### 再來是折線圖的清空以及重劃
```js
while ($("#highchartscontainerdata").highcharts().series.length > 0)
$("#highchartscontainerdata").highcharts().series[0].remove(true);
$("#highchartscontainerdata").highcharts().destroy();
```