## 运行

```cmd
$ yarn
$ yarn start
```

This is a starter template for [Learn Next.js](https://nextjs.org/learn).

## 静态文件服务

```js
// 添加了一张图片到 public/me.png 路径，则以下代码就能访问到此图片：
import Image from 'next/image'
function Avatar() {
  return <Image src="/me.png" alt="me" width="64" height="64" />
}
export default Avatar
```

## mysql 全文搜索

查看分词长度：

```cmd
- SHOW VARIABLES LIKE 'ft_min_word_len';
- SHOW VARIABLES LIKE 'ngram_token_size';
```

查看 mysql 配置在哪：

```cmd
mysql --help | grep 'Default options' -A 1
```

如果没有配置文件则新建：/etc/my.cnf，从 mysql 的安装路径下复制并改名一份 .cnf 后缀的文件：

```cmd
# 添加并重启服务
ft_min_word_len = 2
ngram_token_size = 2
```

全文检索 sql：

```cmd

# 检索：包含 “内容”，或 “测试”
select title,content, MATCH (content) AGAINST ('测试 内容') as score from art_page where MATCH (content) AGAINST ('测试 内容' IN BOOLEAN MODE);

# 检索：包含 “内容”，及 “测试”
select title,content, MATCH (content) AGAINST ('+测试 +内容') as score from art_page where MATCH (content) AGAINST ('+测试 +内容' IN BOOLEAN MODE);

# 检索：包含 “内容”，但不包含 “测试”
select title,content, MATCH (content) AGAINST ('-测试 +内容') as score from art_page where MATCH (content) AGAINST ('-测试 +内容' IN BOOLEAN MODE);
```

## TODO

- [ ] winston global.logger
- [ ] cookie/session
- [ ] es 检索翻页 + tags 合并检索
- [ ] ts
- [ ] 配置
