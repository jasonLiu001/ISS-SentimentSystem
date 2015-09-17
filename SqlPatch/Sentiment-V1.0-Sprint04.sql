  ALTER TABLE `b_emergency_plan`   
  CHANGE `state` `is_deleted` TINYINT(4) DEFAULT 0  NULL  COMMENT '是否已删除';

  ALTER TABLE `b_brand_evaluation`   
  CHANGE `id_pk` `id` BIGINT(20) NOT NULL  COMMENT 'staging库的表Id';

  ALTER TABLE `b_sina_weibo_evaluation`   
  CHANGE `id_pk` `id` BIGINT(20) NOT NULL  COMMENT 'staging库的表Id'

  ALTER TABLE `b_news_evaluation`   
  CHANGE `updated_by` `updated_by` VARCHAR(38) CHARSET utf8 COLLATE utf8_general_ci NULL  COMMENT '修改人',
  CHANGE `handle_user` `handle_user` VARCHAR(38) CHARSET utf8 COLLATE utf8_general_ci NULL  COMMENT '处理人';

  ALTER TABLE `b_news_evaluation_en`   
  CHANGE `updated_by` `updated_by` VARCHAR(38) CHARSET utf8 COLLATE utf8_general_ci NULL  COMMENT '修改人',
  CHANGE `handle_user` `handle_user` VARCHAR(38) CHARSET utf8 COLLATE utf8_general_ci NULL  COMMENT '处理人';

  ALTER TABLE `b_sina_weibo_evaluation`   
  CHANGE `updated_by` `updated_by` VARCHAR(38) CHARSET utf8mb4 COLLATE utf8mb4_bin NULL  COMMENT '修改人',
  CHANGE `handle_user` `handle_user` VARCHAR(38) CHARSET utf8mb4 COLLATE utf8mb4_bin NULL  COMMENT '处理人';

  ALTER TABLE `b_emergency_plan`   
  ADD COLUMN `customer_name` VARCHAR(255) NULL  COMMENT '客户名称' AFTER `polarity`,
  ADD COLUMN `field_name` VARCHAR(32) NULL  COMMENT '行业领域名称' AFTER `customer_name`,
  ADD COLUMN `brand_name` VARCHAR(32) NULL  COMMENT '品牌名称' AFTER `field_name`;

