---
layout: post
title: 'Ruby carrierwave上傳檔案以及使用多檔案上傳'
date: 2018-01-27 13:05
comments: true
categories: 
---
```c Gemfile安裝 https://github.com/carrierwaveuploader/carrierwave carrierwave
	gem 'carrierwave'
```
創建uploader 給carrierwave使用

	rails generate uploader attachment

創立一個model 給上傳所使用

	rails g model attachment attachment:string
	rake db:migrate

在moedl 裡面驗證內容不得為空
```c Attachment欄位掛上uploader機制
mount_uploader :attachment, AttachmentUploader
```
```c view 只要寫入以下方式即可 這是使用 simple_form_for
<%= f.input :attachment %>
```
```c Controller
	params.require(:attachment).permit(:attachment)
```
檔案上傳完會在此目錄裡面`public/uploads/(model名字)/(欄位名稱)/你上傳的檔案`
如果不想要加入版本控管請在加入底下指令即可完成
```c .gitignore
	public/uploads
```
使用[mini_magick](https://github.com/minimagick/minimagick)方式裁圖片
```c Gemfile 安裝 https://github.com/minimagick/minimagick mini_magick
	gem "mini_magick"
```
在 uploader裡面 class裡面打上以下指令就可以藉由 carrierwave去做使用連結
```c ImageUploader
	class ImageUploader < CarrierWave::Uploader::Base
	include CarrierWave::MiniMagick
	end
```
我們在uploader裡面定義這樣的方式
1. 注意上傳時會自動使用thumb方法裁切圖片但如果這是後來才加上去的等於是之前的圖片會都沒有切到
2. 限制檔案上傳規格

```c ImageUploader
version :thumb do
	process resize_to_fill: [200,200]
end
def extension_white_list
	%w(jpg jpeg gif png)
end
```
```c 畫面中去呼叫顯示裁切的圖片以及使用圖片做連結 以及加(present?)判斷
	<%= link_to image_tag(@products.image.thumb.url.to_s) if @products.image.present?  %> 
```
```c 也可以使用以下判斷如果找不到圖片會連接到 placeholder網址顯示 No
 	<% if @products.image.present? %>
	<%= image_tag(@products.image.medium.url, class: "thumbnail") %>
	<% else %>
	<%= image_tag("http://placehold.it/400x400&text=No Pic", class: "thumbnail") %>
	<% end %>
```
如果要在 rails c的互動模式中 取得 image相關資訊請使用以下方式
```c config/application.rb
	config.active_record.raise_in_transactional_callbacks = true
	config.autoload_paths += %W(#{config.root}/app/uploaders)
```
這樣輸入 modelname.image. 如果有連接到 Uploader 就會有相關資訊
***
# 如果是多檔案上傳 (比較屬於沒有那麼靈活上傳因為這是在上傳時同時選擇多樣圖片)

首先新增一個欄位最好是復數加s 因為會存陣列進來

	rails g migration add_images_to_people images:string

在使用Uploaders

	rails g uploader PeopleImage

```c 編輯 PeopleImageUploader 
	class PeopleImageUploader < CarrierWave::Uploader::Base
		include CarrierWave::MiniMagick
		version :small do
		process resize_to_fit: [250, 250]
		end
	end
```
```c model裡面新增以下其中	mount_uploaders是復數好讓官方確認這是多重檔案上傳
	mount_uploaders :images, PeopleImageUploader
	serialize :images, JSON # If you use SQLite, add this line.
```
如果發生下列這問題請在Gemfile重新安裝carrierwave
**undefined method `mount_uploaders' when using carrierwave multiple uploads**
因mount_uploaders方法的多次上傳尚未在穩定版本中發布。
所以請使用下列方式安裝取得最新版本

	gem 'carrierwave', github: 'carrierwaveuploader/carrierwave'

***
Controller 這邊要注意一下:images => [] 要放在最後面，默認的hash哈希參數都是放在參數最後面

	params.require(:people).permit(:name, :description, :status, :remove_images , :images => [])

View多重新增圖片 裡面照下面這樣寫就可以多重上傳了

	 <%= f.file_field :images, :multiple => true, :class => "form-control" %>

View刪除使用方式

	<% if f.object.images.present? %>
		<label>
		<%= f.check_box :remove_images %> 刪除圖片
		</label>
		<% f.object.images.each do |i| %>
			<%= link_to i.filename, i.url, :target => "_blank" %>
		<% end %>
	<% end %>
***
## 在這介紹另外一種多圖片上傳方式

要配合動態新增Form[nested_form_fields](https://github.com/ncri/nested_form_fields)
我們先建一個Model 用來專門存放圖片的

	rails g model event_attachment

建立完成model Table內以下大概的內容

	t.integer :event_id, :index => true
	t.string :attachment
	t.string :description

完成後 rake db:migrate
建立 Uploaders(上傳工具) 所需的資訊

	rails g uploader EventAttachment

```c 假設在這的另外一個主Model 是 Event
	class EventAttachment < ApplicationRecord
	has_many :attachments, :class_name => "EventAttachment", :dependent => :destroy
	accepts_nested_attributes_for :attachments, :allow_destroy => true, :reject_if => :all_blank
	end
```
accepts_nested_attributes_for這個方法可以讓更新event資料時，也可以直接更新location的關聯資料。
也就是說，我們可以完全不需要修改events_controller的新增和編輯Action，就可以透過本來的params[:event]參數來新增或修改location了。
這裡有兩個特別的參數，:allow_destroy是說我們可以在表單中多放一個_destroy核選塊來表示刪除，而:reject_if表示說在什麼條件下，就當做沒有要真的動作，例如:all_blank就表示如果資料都是空的，就不建立location資料(當然也就不會檢查location的驗證了)。這是因為雖然要顯示location表單，但是不表示使用者一定要輸入。有輸入就表示必須通過Location Model的資料驗證。詳情可以參考 [ihower大神](https://ihower.tw/rails/restful-practices.html)

我們要再上傳的model上面跟 Uploader做連結

	class EventAttachment < ApplicationRecord
	mount_uploader :attachment, EventAttachmentUploader
	belongs_to :event
	end

在這注意mount_uploader沒有額外多加s因為要在畫面上建立多個上傳檔案批次上傳的意思

在EventAttachmentUploader加上以下

	class EventAttachmentUploader < CarrierWave::Uploader::Base
	include CarrierWave::MiniMagick
	version :small do
		process resize_to_fit: [350, 350]
	end

因為要設定裁切模式所以加上[MiniMagick](https://github.com/minimagick/minimagick)
在這介紹動態新增Form[nested_form_fields](https://github.com/ncri/nested_form_fields)
上傳檔案的View

	<%= f.nested_fields_for :attachments do |ff| %>
	<fieldset style="border-left: 5px solid #bbb; margin-bottom: 10px; padding: 10px;">
	<legend>Attachment</legend>
	<div class="form-group">
	<%= ff.label :attachment %>
	<%= ff.file_field :attachment, :class => "form-control" %>
		<% if ff.object.attachment.present? %>
		已上傳檔案<%= link_to ff.object.description, ff.object.attachment.url, :target => "_blank" %>
		<% end %>
	</div>
	<div class="form-group">
	<%= ff.label :description %>
	<%= ff.text_field :description, :class => "form-control" %>
	</div>
	<%= ff.remove_nested_fields_link "移除檔案", :class => "btn btn-danger" %>
	</fieldset>
	<% end %>
	<p class="text-right">
	<%= f.add_nested_fields_link :attachments, "新增檔案", :class => "btn btn-default" %></p>	

Controller @event 沒有 attachments 的話，new 出一個表單好進行編輯動作

	@event.attachments.build if @event.attachments.empty?

新增所用的參數將attachments_attributes加進event_params

	params.require(:event).permit(:attachments_attributes => [:id, :attachment, :description, :_destroy])

顯示圖片的View直接點選圖片就可以做連結動作了

	<ul>
	<% @event.attachments.each do |a| %>  
	<li><%= link_to image_tag(a.attachment.url(:small)), a.attachment.url%></li>
	<% end %>
	</ul>
