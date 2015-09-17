
CREATE TABLE `b_info_classification_field_news` (
  `b_id` bigint(64) NOT NULL COMMENT '业务库主键ID',
  `id` bigint(64) NOT NULL COMMENT '主键ID',
  `search_result_id` bigint(32) DEFAULT NULL COMMENT '搜索ID',
  `search_engine` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '搜索引擎',
  `info_type` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '分类',
  `classification_name` varchar(64) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '分类标签库名称',
  `field_name` varchar(64) COLLATE utf8mb4_bin NOT NULL COMMENT '领域',
  `category_name` varchar(64) COLLATE utf8mb4_bin NOT NULL COMMENT '品牌',
  `last_modified` datetime DEFAULT NULL COMMENT '记录更新时间，默认值为当前系统时间',
  `create_record_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '业务库记录创建时间，默认值为当前系统时间',
  `tag_count` bigint(20) DEFAULT NULL COMMENT '标签数量',
  `matching_degree` decimal(8,3) DEFAULT NULL COMMENT '相似度',
  PRIMARY KEY (`b_id`),
  KEY `index_search_engine` (`search_engine`),
  KEY `index_search_result_id` (`search_result_id`),
  KEY `index_result_id_engine` (`search_result_id`,`search_engine`),
  KEY `index_classification_name` (`classification_name`),
  KEY `index_category_name` (`category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='舆情与行业领域类型的关系映射表'


CREATE TABLE `b_info_classification_field_weibo` (
  `b_id` bigint(64) NOT NULL COMMENT '业务库主键ID',
  `id` bigint(64) NOT NULL COMMENT '主键ID',
  `search_result_id` bigint(32) DEFAULT NULL COMMENT '搜索ID',
  `search_engine` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '搜索引擎',
  `info_type` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '分类',
  `classification_name` varchar(64) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '分类标签库名称',
  `field_name` varchar(64) COLLATE utf8mb4_bin NOT NULL COMMENT '领域',
  `category_name` varchar(64) COLLATE utf8mb4_bin NOT NULL COMMENT '品牌',
  `last_modified` datetime DEFAULT NULL COMMENT '记录更新时间，默认值为当前系统时间',
  `create_record_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '业务库记录创建时间，默认值为当前系统时间',
  `tag_count` bigint(20) DEFAULT NULL COMMENT '标签数量',
  `matching_degree` decimal(8,3) DEFAULT NULL COMMENT '相似度',
  PRIMARY KEY (`b_id`),
  KEY `index_search_engine` (`search_engine`),
  KEY `index_search_result_id` (`search_result_id`),
  KEY `index_result_id_engine` (`search_result_id`,`search_engine`),
  KEY `index_classification_name` (`classification_name`),
  KEY `index_category_name` (`category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='舆情与行业领域类型的关系映射表'

CREATE TABLE `b_info_classification_field_weixin` (
  `b_id` bigint(64) NOT NULL COMMENT '业务库主键ID',
  `id` bigint(64) NOT NULL COMMENT '主键ID',
  `search_result_id` bigint(32) DEFAULT NULL COMMENT '搜索ID',
  `search_engine` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '搜索引擎',
  `info_type` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '分类',
  `classification_name` varchar(64) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '分类标签库名称',
  `field_name` varchar(64) COLLATE utf8mb4_bin NOT NULL COMMENT '领域',
  `category_name` varchar(64) COLLATE utf8mb4_bin NOT NULL COMMENT '品牌',
  `last_modified` datetime DEFAULT NULL COMMENT '记录更新时间，默认值为当前系统时间',
  `create_record_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '业务库记录创建时间，默认值为当前系统时间',
  `tag_count` bigint(20) DEFAULT NULL COMMENT '标签数量',
  `matching_degree` decimal(8,3) DEFAULT NULL COMMENT '相似度',
  PRIMARY KEY (`b_id`),
  KEY `index_search_engine` (`search_engine`),
  KEY `index_search_result_id` (`search_result_id`),
  KEY `index_result_id_engine` (`search_result_id`,`search_engine`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='舆情与行业领域类型的关系映射表'



CREATE TABLE `b_info_classification_customer_news` (
  `b_id` BIGINT(64) NOT NULL COMMENT '业务库主键ID',
  `id` BIGINT(64) NOT NULL COMMENT '主键ID',
  `search_result_id` BIGINT(32) DEFAULT NULL COMMENT '搜索ID',
  `search_engine` VARCHAR(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '搜索引擎',
  `info_type` VARCHAR(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '分类',
  `customer_name` VARCHAR(64) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '客户名称',
  `matching_degree` INT(11) DEFAULT NULL COMMENT '客户匹配度',
  `last_modified` DATETIME DEFAULT NULL COMMENT '记录更新时间，默认值为当前系统时间',
  `create_record_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '业务库记录创建时间，默认值为当前系统时间',
  PRIMARY KEY (`b_id`),
  KEY `index_search_engine` (`search_engine`),
  KEY `index_search_result_id` (`search_result_id`),
  KEY `index_customer_name` (`customer_name`),
  KEY `index_result_id_engine` (`search_result_id`,`search_engine`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='舆情与客户的关系映射表'

CREATE TABLE `b_info_classification_customer_weibo` (
  `b_id` BIGINT(64) NOT NULL COMMENT '业务库主键ID',
  `id` BIGINT(64) NOT NULL COMMENT '主键ID',
  `search_result_id` BIGINT(32) DEFAULT NULL COMMENT '搜索ID',
  `search_engine` VARCHAR(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '搜索引擎',
  `info_type` VARCHAR(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '分类',
  `customer_name` VARCHAR(64) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '客户名称',
  `matching_degree` INT(11) DEFAULT NULL COMMENT '客户匹配度',
  `last_modified` DATETIME DEFAULT NULL COMMENT '记录更新时间，默认值为当前系统时间',
  `create_record_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '业务库记录创建时间，默认值为当前系统时间',
  PRIMARY KEY (`b_id`),
  KEY `index_search_engine` (`search_engine`),
  KEY `index_search_result_id` (`search_result_id`),
  KEY `index_customer_name` (`customer_name`),
  KEY `index_result_id_engine` (`search_result_id`,`search_engine`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='舆情与客户的关系映射表'


CREATE TABLE `b_info_classification_customer_weixin` (
  `b_id` BIGINT(64) NOT NULL COMMENT '业务库主键ID',
  `id` BIGINT(64) NOT NULL COMMENT '主键ID',
  `search_result_id` BIGINT(32) DEFAULT NULL COMMENT '搜索ID',
  `search_engine` VARCHAR(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '搜索引擎',
  `info_type` VARCHAR(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '分类',
  `customer_name` VARCHAR(64) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '客户名称',
  `matching_degree` INT(11) DEFAULT NULL COMMENT '客户匹配度',
  `last_modified` DATETIME DEFAULT NULL COMMENT '记录更新时间，默认值为当前系统时间',
  `create_record_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '业务库记录创建时间，默认值为当前系统时间',
  PRIMARY KEY (`b_id`),
  KEY `index_search_engine` (`search_engine`),
  KEY `index_search_result_id` (`search_result_id`),
  KEY `index_customer_name` (`customer_name`),
  KEY `index_result_id_engine` (`search_result_id`,`search_engine`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='舆情与客户的关系映射表'





DELIMITER $$

CREATE
    TRIGGER `auto_classify` AFTER INSERT ON `b_info_classification_field` 
    FOR EACH ROW BEGIN
  CASE  new.info_type
  WHEN '新闻' THEN
  INSERT INTO `b_info_classification_field_news`
          (`b_id`,
           `id`,
           `search_result_id`,
           `search_engine`,
           `info_type`,
           `classification_name`,
           `field_name`,
           `category_name`,
           `last_modified`,
           `tag_count`,
           `matching_degree`)
    VALUES (new.b_id,
      new.id,
      new.search_result_id,
      new.search_engine,
      new.info_type,
      new.classification_name,
      new.field_name,
      new.category_name,
      new.last_modified,
      new.tag_count,
      new.matching_degree);
  WHEN '微博' THEN
  INSERT INTO `b_info_classification_field_weibo`
          (`b_id`,
           `id`,
           `search_result_id`,
           `search_engine`,
           `info_type`,
           `classification_name`,
           `field_name`,
           `category_name`,
           `last_modified`,
           `tag_count`,
           `matching_degree`)
    VALUES (new.b_id,
      new.id,
      new.search_result_id,
      new.search_engine,
      new.info_type,
      new.classification_name,
      new.field_name,
      new.category_name,
      new.last_modified,
      new.tag_count,
      new.matching_degree);
  WHEN '微信' THEN
  INSERT INTO `b_info_classification_field_weixin`
          (`b_id`,
           `id`,
           `search_result_id`,
           `search_engine`,
           `info_type`,
           `classification_name`,
           `field_name`,
           `category_name`,
           `last_modified`,
           `tag_count`,
           `matching_degree`)
    VALUES (new.b_id,
      new.id,
      new.search_result_id,
      new.search_engine,
      new.info_type,
      new.classification_name,
      new.field_name,
      new.category_name,
      new.last_modified,
      new.tag_count,
      new.matching_degree);
  END CASE;
      
    END;
$$

DELIMITER ;

DELIMITER $$

DROP TRIGGER /*!50032 IF EXISTS */ `auto_classify_customer`$$

CREATE
    /*!50017 DEFINER = 'root'@'%' */
    TRIGGER `auto_classify_customer` AFTER INSERT ON `b_info_classification_customer` 
    FOR EACH ROW BEGIN
  CASE  new.info_type
  WHEN '新闻' THEN
  INSERT INTO `b_info_classification_customer_news`
            (`b_id`,
             `id`,
             `search_result_id`,
             `search_engine`,
             `info_type`,
             `customer_name`,
             `matching_degree`,
             `last_modified`,
             `create_record_time`)
VALUES (new.b_id,
        new.id,
        new.search_result_id,
        new.search_engine,
        new.info_type,
        new.customer_name,
        new.matching_degree,
        new.last_modified,
        new.create_record_time);
  WHEN '微博' THEN
    INSERT INTO `b_info_classification_customer_weibo`
            (`b_id`,
             `id`,
             `search_result_id`,
             `search_engine`,
             `info_type`,
             `customer_name`,
             `matching_degree`,
             `last_modified`,
             `create_record_time`)
VALUES (new.b_id,
        new.id,
        new.search_result_id,
        new.search_engine,
        new.info_type,
        new.customer_name,
        new.matching_degree,
        new.last_modified,
        new.create_record_time);
  WHEN '微信' THEN
    INSERT INTO `b_info_classification_customer_weixin`
            (`b_id`,
             `id`,
             `search_result_id`,
             `search_engine`,
             `info_type`,
             `customer_name`,
             `matching_degree`,
             `last_modified`,
             `create_record_time`)
VALUES (new.b_id,
        new.id,
        new.search_result_id,
        new.search_engine,
        new.info_type,
        new.customer_name,
        new.matching_degree,
        new.last_modified,
        new.create_record_time);
  END CASE;
      
    END;
$$

DELIMITER ;

INSERT INTO `b_info_classification_field_news`
            (`b_id`,
             `id`,
             `search_result_id`,
             `search_engine`,
             `info_type`,
             `classification_name`,
             `field_name`,
             `category_name`,
             `last_modified`,
             `create_record_time`,
             `tag_count`,
             `matching_degree`)
SELECT * FROM b_info_classification_field WHERE info_type='新闻';

INSERT INTO `b_info_classification_field_weibo`
            (`b_id`,
             `id`,
             `search_result_id`,
             `search_engine`,
             `info_type`,
             `classification_name`,
             `field_name`,
             `category_name`,
             `last_modified`,
             `create_record_time`,
             `tag_count`,
             `matching_degree`)
SELECT * FROM b_info_classification_field WHERE info_type='微博';

INSERT INTO `b_info_classification_field_weixin`
            (`b_id`,
             `id`,
             `search_result_id`,
             `search_engine`,
             `info_type`,
             `classification_name`,
             `field_name`,
             `category_name`,
             `last_modified`,
             `create_record_time`,
             `tag_count`,
             `matching_degree`)
SELECT * FROM b_info_classification_field WHERE info_type='微信';


INSERT INTO `b_info_classification_customer_news`
            (`b_id`,
             `id`,
             `search_result_id`,
             `search_engine`,
             `info_type`,
             `customer_name`,
             `matching_degree`,
             `last_modified`,
             `create_record_time`)
SELECT * FROM b_info_classification_customer WHERE info_type='新闻';

INSERT INTO `b_info_classification_customer_weibo`
            (`b_id`,
             `id`,
             `search_result_id`,
             `search_engine`,
             `info_type`,
             `customer_name`,
             `matching_degree`,
             `last_modified`,
             `create_record_time`)
SELECT * FROM b_info_classification_customer WHERE info_type='微博';

INSERT INTO `b_info_classification_customer_weixin`
            (`b_id`,
             `id`,
             `search_result_id`,
             `search_engine`,
             `info_type`,
             `customer_name`,
             `matching_degree`,
             `last_modified`,
             `create_record_time`)
SELECT * FROM b_info_classification_customer WHERE info_type='微信';


ALTER TABLE `b_info_classification_customer` ADD INDEX index_result_id_engine (search_result_id,search_engine);
ALTER TABLE `b_info_classification_field` ADD INDEX index_result_id_engine (search_result_id,search_engine);
ALTER TABLE `b_news_evaluation` ADD INDEX index_result_id_engine (search_result_id,search_engine);
ALTER TABLE `b_weibo_evaluation` ADD INDEX index_result_id_engine (search_result_id,search_engine);
ALTER TABLE `b_weixin_evaluation` ADD INDEX index_result_id_engine (search_result_id,search_engine);
