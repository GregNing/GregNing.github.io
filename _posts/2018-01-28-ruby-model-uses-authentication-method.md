---
layout: post
title: 'Ruby model使用欄位驗證方式'
date: 2018-01-28 10:34
comments: true
categories: 
---
從畫面中直接帶參數進 controller
View畫面

	jobs_path(:order => "by_lower_bound")

	@jobs = case params[:order] # 傳送 order進來判斷是哪個參數
			when 'by_upper_bound'
			Job.whereis_hidden_is_false.recentwage_upper_bound.paginate(page: params[:page], per_page: 5)
			when 'by_lower_bound'
			Job.whereis_hidden_is_false.recentwage_lower_bound.paginate(page: params[:page], per_page: 5)
			else
			Job.whereis_hidden_is_false.recent.paginate(page: params[:page], per_page: 5)
			end

我會在model 定義好方便在 controller呼叫

	scope :recentwage_upper_bound, -> { order('wage_upper_bound DESC') }
	scope :recentwage_lower_bound, -> { order('wage_lower_bound DESC') }
	scope :whereis_hidden_is_false, -> { where(is_hidden: false) }

下面驗證是使用於數字驗證方式

	validates_numericality_of :wage_upper_bound, :wage_lower_bound, :only_integer => true #必須是整數
	validates :wage_upper_bound, numericality: { greater_than: 0, message: '必須為數字，且大於0' }
	validates :wage_lower_bound, numericality: { greater_than: 0, message: '必須為數字，且大於0' }
