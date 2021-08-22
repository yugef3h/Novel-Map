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

## 建表

```sql
CREATE TABLE `art_page` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '自增 id',
  `title` varchar(255) NOT NULL DEFAULT '' COMMENT '标题',
  `desc` varchar(512) NOT NULL DEFAULT '' COMMENT '描述',
  `cover` varchar(255) NOT NULL DEFAULT '' COMMENT '图片地址',
  `tags` varchar(255) NOT NULL DEFAULT '' COMMENT '标签',
  `pid` bigint unsigned NOT NULL DEFAULT '0' COMMENT '父节点 id',
  `content` mediumtext NOT NULL COMMENT '内容',
  `ctime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mtime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `state` tinyint NOT NULL DEFAULT '1' COMMENT '-1 删除，1 已发布，2 草稿',
  `level` tinyint NOT NULL DEFAULT '0',
  `extra` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '额外字段，不对前端暴露',
  PRIMARY KEY (`id`),
  KEY `idx_mtime` (`mtime`),
  KEY `idx_title` (`title`),
  KEY `idx_pid` (`pid`) USING BTREE,
  KEY `idx_level` (`level`) USING BTREE,
  KEY `idx_tags` (`tags`) USING BTREE,
  FULLTEXT KEY `idx_content` (`content`) /*!50100 WITH PARSER `ngram` */ ,
  FULLTEXT KEY `ix_title_content` (`content`,`title`) /*!50100 WITH PARSER `ngram` */
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3 COMMENT='小说脑图列表';
```

## TODO

- [ ] winston global.logger
- [ ] cookie/session
- [ ] ts 类型检查
- [ ] 配置
- [ ] 路由的合理利用
