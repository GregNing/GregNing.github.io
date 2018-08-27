---
layout: post
title: 'RSPEC測試執行以及Mock介紹'
description: '介紹RSPEC使用'
date: 2018-06-04 15:30
comments: true
categories:
---
Mock和stub都屬於Test double，模擬測試前者是模擬特定對象測試行為後者為方法。
可以使用gem安裝[gem rspec-mocks](https://github.com/rspec/rspec-mocks)
### 首先介紹 [Test Double](https://relishapp.com/rspec/rspec-mocks/v/3-6/docs/basics/test-doubles) 為假物件的統稱，Dummy、Fake、Stub、Mock 與 Spy 都算 Test Double。
```
RSpec.describe "A test double" do
  it "returns canned responses from the methods named in the provided hash" do
    dbl = double("Some Collaborator", :foo => 3, :bar => 4) # 建立一個dbl對象且有屬性
    expect(dbl.foo).to eq(3)
    expect(dbl.bar).to eq(4)
  end
end
```
### 我們可以使⽤ double 產⽣假物件 `@user = double("user", :name => "Greg")`
### [Method stubs](https://relishapp.com/rspec/rspec-mocks/v/2-4/docs/method-stubs) 假對象（test double）的方法，也可以模擬真實對象（real object）
```
describe "a simple stub with a return value" do
  context "specified in a block" do
    it "returns the specified value" do
      receiver = double("receiver")
      receiver.stub(:message) { :return_value }
      receiver.message.should eq(:return_value)
      # 第一個參數（receiver）是對象，第二個參數是方法， 第三個參數是方法的返回值
      allow(receiver).to receive(:message) { "receiver message" }
    end
  end

  context "specified in the double declaration" do
    it "returns the specified value" do
      receiver = double("receiver", :message => :return_value)
      receiver.message.should eq(:return_value)
    end
  end

  context "specified with and_return" do
    it "returns the specified value" do
      receiver = double("receiver")
      receiver.stub(:message).and_return(:return_value)
      receiver.message.should eq(:return_value)
    end
  end
end
```
### Mock
``` rspec
@gateway = double("ezcat")
# 預期等會 @gateway 必須被呼叫到 deliver ⽅法
expect(@gateway).to receive(:deliver).with(@user).and_return(true)

describe "#ship!" do

 before do
  @user = double("user").as_null_object
  @gateway = double("ezcat")
  @order = Order.new( :user => @user, :gateway => @gateway )
 end

 context "with paid" do
  it "should call ezship API" do
    expect(@gateway).to receive(:deliver).with(@user).and_return(true)
    @order.ship!
  end
end

allow_any_instance_of 用於包裝一個類存用該方法
# 用意是讓 User 這個 model 執行 save 時都一律回傳 false, 以便測試到失敗的例子
allow_any_instance_of(User).to receive(:save).and_return(false)
```
`before(:each)` 每段it之前執行，預設寫 before 就是 before(:each)。
`before(:all)` 整段describe前只執行一次
`after(:each)` 每段it之後執行
`after(:all)` 整段describe後只執行一次
### 建議使用`after`or`before`

### 請使用let 和 let!宣告變數做使用
`let`會在使用到此程式碼才會執行(適用於不需初始化)
```c let! 做使用 一開始就會創建使用者
let!(:user) do
  create(
   :user,
   name: 'Greg',
   email: 'XXXXX@gmail.com',
   )
end
```

### RSPEC 配置返回方式使用
`and_return` 返回值
`and_raise` 超出異常
`and_throw` 拋出symbol
`and_yield` 接受區參數
`and_call_original` 調用原先的方法

使用以下指令執行測試使用
`rspec filename.rb` 預設不產⽣⽂件
`rspec filename.rb -fd` 輸出 specdoc ⽂件
`rspec filename.rb -fh` 輸出 html ⽂件

[Rspec Class](https://relishapp.com/rspec/rspec-mocks/docs/verifying-doubles/using-a-class-double)
[RSPEC參考](https://mgleon08.github.io/blog/2016/01/29/rspec-plus-factory-girl/)
[Mock](https://ihower.tw/rails/files/ihower-rspec-mock.pdf)
[ihower 文件](https://ihower.tw/rails/files/ihower-rspec.pdf)
[ihower rspec講解](https://ihower.tw/rails/testing.html)