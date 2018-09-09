---
layout: post
title: 'Ruby Array & Hash '
date: 2018-02-01 03:13
comments: true
categories:
---
For posterity, below is the answer for versions of ruby < 2.1.0:
```rb
a = ["item 1", "item 2", "item 3", "item 4"]
h = a.to_h # => { "item 1" => "item 2", "item 3" => "item 4" }
#OR
a = ["item 1", "item 2", "item 3", "item 4"]
h = Hash[*a] # => { "item 1" => "item 2", "item 3" => "item 4" }
```
> *被稱為 splat 操作符意思，使用這一行會很耗效能，所以如果要將整個array轉成hash請使用以下方式會比較好
`h = Hash[a.each_slice(2).to_a]`。<br>
來源: [Array to Hash Ruby](https://stackoverflow.com/questions/4028329/array-to-hash-ruby)
將 Array資料塞進 hash裡面並且記錄出現幾次。

```rb
h = Hash.new
arr = ["A", "B", "C", "B", "A"]
arr.each do |i|
  h["#{i}"] = arr.count(i)
end
# => {"A"=>2, "B"=>2, "C"=>1}
```
也可以使用以下方式
```rb
arr.uniq{|x| h["#{x}"] = arr.count(x)}
# => {"A"=>2, "B"=>2, "C"=>1}
```
使用`array.uniq`即可 <br>
使用 hash array去做排序動作
```rb
arr = [
  { "name" => "Peter", "age" => 30 },
  { "name" => "John", "age" => 15 },
  { "name" => "David", "age" => 45 },
  { "name" => "Steven", "age" => 22 },
  { "name" => "Vincent", "age" => 6 }
]
```
提供參考解法:
```rb
result = arr.sort_by! { |hsh| hsh["age"]}
```
參考: [how-to-sort-an-array-of-hashes-in-ruby](https://stackoverflow.com/questions/5483889/how-to-sort-an-array-of-hashes-in-ruby)