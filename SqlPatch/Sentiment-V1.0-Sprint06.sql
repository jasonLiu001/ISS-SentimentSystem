CREATE  INDEX index_search_engine ON b_info_classification_customer (search_engine);
CREATE  INDEX index_search_result_id ON b_info_classification_customer (search_result_id);

CREATE  INDEX index_report_date ON b_news_evaluation (report_date);
CREATE  INDEX index_created_date ON b_weibo_evaluation (created_date);

CREATE  INDEX index_search_engine ON b_news_evaluation (search_engine);
CREATE  INDEX index_search_engine ON b_weibo_evaluation (search_engine);


CREATE  INDEX index_search_result_id ON b_news_evaluation (search_result_id);
CREATE  INDEX index_search_result_id ON b_weibo_evaluation (search_result_id);

CREATE  INDEX index_search_engine ON b_info_classification_field (search_engine);
CREATE  INDEX index_search_result_id ON b_info_classification_field (search_result_id);

CREATE  INDEX index_customer_name ON b_info_classification_customer (customer_name);


CREATE  INDEX index_search_result_id ON b_weixin_evaluation (search_result_id);
CREATE  INDEX index_created_date ON b_weixin_evaluation (post_date);
CREATE  INDEX index_search_engine ON b_weixin_evaluation (search_engine);

/*Alter talbe cfg_dictpolarity*/
DROP TABLE IF EXISTS `cfg_dictpolarity`;
CREATE TABLE `cfg_dictpolarity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `level1` varchar(45) CHARACTER SET utf8mb4 DEFAULT NULL,
  `level2` varchar(45) CHARACTER SET utf8mb4 DEFAULT NULL,
  `level3` varchar(45) CHARACTER SET utf8mb4 DEFAULT NULL,
  `prefix` varchar(45) CHARACTER SET utf8mb4 DEFAULT NULL,
  `name` varchar(45) CHARACTER SET utf8mb4 DEFAULT NULL,
  `polarityScore` int(11) DEFAULT NULL,
  `last_modified` datetime DEFAULT NULL,
  `is_deleted` tinyint(4) DEFAULT '0',
  `create_record_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '业务库记录创建时间，默认值为当前系统时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `b_news_evaluation_handle`   
  ADD PRIMARY KEY (`b_id`);


ALTER TABLE `b_weibo_evaluation_handle`   
  ADD PRIMARY KEY (`b_id`);


ALTER TABLE `b_weixin_evaluation_handle`   
  ADD PRIMARY KEY (`b_id`);

/*微信数据视图*/
DELIMITER $$

USE `digital_marketing_dev1.1`$$

DROP VIEW IF EXISTS `v_b_weixin_evaluation`$$

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `v_b_weixin_evaluation` AS (
SELECT
  `f`.`b_id`             AS `b_id`,
  `n`.`id`               AS `id`,
  `n`.`date_id`          AS `date_id`,
  `f`.`search_result_id` AS `search_result_id`,
  `c`.`customer_name`    AS `customer_name`,
  `f`.`search_engine`    AS `search_engine`,
  `f`.`field_name`       AS `field_name`,
  `f`.`category_name`    AS `brand_name`,
  `n`.`article_title`    AS `article_title`,
  `n`.`article_url`      AS `article_url`,
  `n`.`post_user`        AS `post_user`,
  `n`.`post_date`        AS `post_date`,
  `n`.`content`          AS `content`,
  `n`.`score`            AS `score`,
  `n`.`positive_count`   AS `positive_count`,
  `n`.`middle_count`     AS `middle_count`,
  `n`.`negative_count`   AS `negative_count`,
  `n`.`last_modified`    AS `last_modified`,
  '0'                    AS `status`,
  '0'                    AS `is_sensitive`,
  ''                     AS `updated_by`,
  ''                     AS `update_date`,
  ''                     AS `handle_id`,
  ''                     AS `handle_type`,
  ''                     AS `handle_remark`,
  ''                     AS `handle_date`,
  ''                     AS `handle_user`
FROM ((`b_info_classification_field` `f`
    LEFT JOIN `b_info_classification_customer` `c`
      ON (((`f`.`search_result_id` = `c`.`search_result_id`)
           AND (`f`.`search_engine` = `c`.`search_engine`))))
   LEFT JOIN `b_weixin_evaluation` `n`
     ON (((`f`.`search_result_id` = `n`.`search_result_id`)
          AND (`f`.`search_engine` = `n`.`search_engine`))))
WHERE (`f`.`info_type` = '微信'))$$

DELIMITER ;

/*新的统计视图(包含微信数据)*/
DELIMITER $$

USE `digital_marketing_dev1.1`$$

DROP VIEW IF EXISTS `v_cityinfo`$$

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `v_cityinfo` AS 
SELECT
	  COUNT(0)                                        AS `xcount`,
	  `v_b_weibo_evaluation_customer`.`customer_name` AS `customer_name`,
	  `v_b_weibo_evaluation_customer`.`score`         AS `xscore`
	FROM `v_b_weibo_evaluation_customer`
	WHERE (CAST(`v_b_weibo_evaluation_customer`.`created_date` AS DATE) = CURDATE())
	GROUP BY `v_b_weibo_evaluation_customer`.`score`,`v_b_weibo_evaluation_customer`.`customer_name` 
UNION ALL 
SELECT
	  COUNT(0)                                        AS `xcount`,
	  `v_b_weixin_evaluation_customer`.`customer_name` AS `customer_name`,
	  `v_b_weixin_evaluation_customer`.`score`         AS `xscore`
	FROM `v_b_weixin_evaluation_customer`
	WHERE (CAST(`v_b_weixin_evaluation_customer`.`post_date` AS DATE) = CURDATE())
	GROUP BY `v_b_weixin_evaluation_customer`.`score`,`v_b_weixin_evaluation_customer`.`customer_name` 
UNION ALL 
SELECT
COUNT(0)                                         AS `xcount`,
	`v_b_news_evaluation_customer`.`customer_name`   AS `customer_name`,
	`v_b_news_evaluation_customer`.`score`           AS `xscore`
	FROM `v_b_news_evaluation_customer`
	WHERE (CAST(`v_b_news_evaluation_customer`.`report_date` AS DATE) = CURDATE())
	GROUP BY `v_b_news_evaluation_customer`.`score`,`v_b_news_evaluation_customer`.`customer_name`$$

DELIMITER ;


ALTER TABLE `cfg_dictpolarity_new`
  ADD COLUMN `is_deleted` TINYINT(4) DEFAULT 0  NULL  COMMENT '是否已删除';
