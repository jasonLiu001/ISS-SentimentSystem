ALTER TABLE `b_brand_evaluation`   
  CHANGE `record_count` `record_count` BIGINT(20) NULL  COMMENT '记录条数';
  ALTER TABLE `cfg_dictpolarity`  
COMMENT='极性词典配置表';
ALTER TABLE `b_brand_evaluation`  
COMMENT='舆情指数表';
ALTER TABLE `b_brand_hotword`  
COMMENT='热词表';
ALTER TABLE `b_emergency_plan`  
COMMENT='应急预案表';
ALTER TABLE `b_info_classification_customer`  
COMMENT='舆情与客户的关系映射表';
ALTER TABLE `b_info_classification_field`   
  CHANGE `search_engine` `search_engine` VARCHAR(32) CHARSET utf8mb4 COLLATE utf8mb4_bin NULL  COMMENT '搜索引擎',
COMMENT='舆情与行业领域类型的关系映射表';
ALTER TABLE `b_news_evaluation`  
COMMENT='新闻舆情表';
ALTER TABLE `b_news_evaluation_handle`  
COMMENT='新闻舆情处理表';
ALTER TABLE `b_weibo_evaluation`  
COMMENT='微博舆情表';
ALTER TABLE `b_weibo_evaluation_handle`  
COMMENT='微博舆情处理表';
ALTER TABLE `b_weixin_evaluation`  
COMMENT='微信舆情表';
ALTER TABLE `b_weixin_evaluation_handle`  
COMMENT='微信舆情处理表';



ALTER TABLE `b_info_classification_field`   
  ADD COLUMN `tag_count` BIGINT(20) NULL  COMMENT '标签数量',
  ADD COLUMN `matching_degree` DECIMAL(8,3) NULL  COMMENT '相似度';

  ALTER TABLE `b_news_evaluation_handle`   
  ADD COLUMN `tenant_id` INT(11) NULL  COMMENT '租户ID';

  ALTER TABLE `b_weibo_evaluation_handle`   
  ADD COLUMN `tenant_id` INT(11) NULL  COMMENT '租户ID';

    ALTER TABLE `b_weixin_evaluation_handle`   
  ADD COLUMN `tenant_id` INT(11) NULL  COMMENT '租户ID';


  CREATE TABLE `cfg_search_keywords` (
  `id` bigint(64) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `customer_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '客户名称',
  `field_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '行业领域名称',
  `brand_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '品牌名称',
  `dict_category` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '客户所属的行业',
  `keyword` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '监控的关键字 baidu(+),sinaweibo(空格)',
  `search_engine` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '监控的范围（eg：sina weibo ， Baidu等）',
  `is_search` smallint(4) DEFAULT '1' COMMENT '是否有效 0:无效；1：有效',
  `manner` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT 'manual' COMMENT '执行方式 manual auto',
  `language` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT 'zh' COMMENT '搜索内容语言 zh：中文 en：英文',
  `last_modified` datetime NOT NULL COMMENT '最后更新时间',
  `create_record_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建记录的时间',
  `is_deleted` tinyint(4) DEFAULT '0' COMMENT '是否已删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='搜索关键字表'

CREATE TABLE `cfg_sys_information_tag` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `classification_name` varchar(64) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '分类名称',
  `field_name` varchar(32) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '3大分类',
  `category_name` varchar(32) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '16小类',
  `keyword` varchar(32) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '关键字',
  `keywords_weight` bigint(20) DEFAULT '1' COMMENT '关键字权重',
  `last_modified` datetime NOT NULL COMMENT '最后一次修改日期',
  `create_record_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建记录的时间',
  `is_deleted` tinyint(4) DEFAULT '0' COMMENT '是否已删除',
  `customer_name` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '客户名称',
  `is_default_value` tinyint(4) DEFAULT '1' COMMENT '是否是默认初始化值',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='分类标签配置表'