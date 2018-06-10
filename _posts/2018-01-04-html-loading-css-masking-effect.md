---
layout: post
title: 'HTML loading css + 遮蔽效果(使用JAVASCRIPT)'
date: 2018-01-04 06:36
comments: true
categories: 
---
首先建立HTML

	<div class="shaded" id="shaded">
		<div class="spinner">
			<div class="spinneritem1"></div>
			<div class="spinneritem2"></div>
			<div class="spinneritem3"></div>
			<div class="spinneritem4"></div>
			<div class="spinneritem5"></div>
		</div>
	</div>

	Css代碼如下
	遮罩效果如下 className 為shaded
	.shaded{
		opacity: .5;
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 1030;
		background-color: #000;
		display: none;
	}
	.spinner {
		margin: 100px auto;
		width: 150px;
		height: 80px;
		text-align: center;
		font-size: 17px;
		position: fixed;
		z-index: 9999;
		opacity: 1;
		bottom: 40%;
		right: 46%;        
	}
	.spinner > div {
		background-color: #8d8d8d;
		height: 100%;
		width: 15px;
		display: inline-block;
		-webkit-animation: stretchdelay 1.2s infinite ease-in-out;
		animation: stretchdelay 1.2s infinite ease-in-out;
		border-radius: 15%;
	}
	.spinner .spinneritem2 {
	-webkit-animation-delay: -1.1s;
	animation-delay: -1.1s;
	}
	.spinner .spinneritem3 {
	-webkit-animation-delay: -1.0s;
	animation-delay: -1.0s;
	}
	.spinner .spinneritem4 {
	-webkit-animation-delay: -0.9s;
	animation-delay: -0.9s;
	}
	.spinner .spinneritem5 {
	-webkit-animation-delay: -0.8s;
	animation-delay: -0.8s;
	}
	@-webkit-keyframes stretchdelay {
	0%, 40%, 100% {
	-webkit-transform: scaleY(0.4)
	}
	20% {
	-webkit-transform: scaleY(1.0)
		}}
	@keyframes stretchdelay {
	0%, 40%, 100% {
	transform: scaleY(0.4);
	-webkit-transform: scaleY(0.4);
	}
	20% {
	transform: scaleY(1.0);
	-webkit-transform: scaleY(1.0);
	}}

	JavaScript代碼如下 
	使用 fadeout 讓遮屏消失大部分使用opacity去做設定
	function shadeout() {   
		let op = 1;
		let element = document.getElementById("shaded");
		設定 opacity
		let timer = setInterval(function () {
		    if (op <= 0.1) {
		        clearInterval(timer);
		        element.style.display = 'none';
		    }
		    element.style.opacity = op;
		    element.style.filter = 'alpha(opacity=' + op * 100 + ")";
		    op -= op * 0.1;
    }, 50);};
	使用 fadein 讓遮屏出現 
	function shadein() {
    let op = 0.1;
    設定 opacity
    document.getElementById("shaded").setAttribute("style", "display:block");
    let element = document.getElementById("shaded");
    let timer = setInterval(function () {
        if (op > 0.5) {
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.5;
    }, 10);};

來源:
Javascript fadein fadeout 參考如下
https://stackoverflow.com/questions/6121203/how-to-do-fade-in-and-fade-out-with-javascript-and-css
使用CSS 做LOADING動作
http://www.cnblogs.com/lhb25/p/loading-spinners-animated-with-css3.html
loading 的 svg
https://loading.io/
