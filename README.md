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

## getInitialProps

[getInitialProps](https://www.nextjs.cn/docs/api-reference/data-fetching/getInitialProps)

## 全文搜索

mysql 修改分词长度：

- SHOW VARIABLES LIKE 'ft_min_word_len';
- SHOW VARIABLES LIKE 'ngram_token_size';

```cmd
# /etc/mysql/mysql.conf.d/mysqld.cnf

ft_min_word_len = 2
ngram_token_size = 2


# 如果没有则新增配置
echo 'ft_min_word_len = 2
ngram_token_size = 2' >> mysqld.cnf

# 重启服务
/etc/init.d/mysql restart
```

## TODO

- [ ] winston global.logger
- [ ] cookie/session
