ALTER TABLE `b_info_classification_field`   
  ADD COLUMN `classification_name` VARCHAR(64) NULL  COMMENT '分类标签库名称' AFTER `info_type`;
DELIMITER $$

USE `digital_marketing_dev1.1`$$

DROP VIEW IF EXISTS `v_b_news_evaluation`$$

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `v_b_news_evaluation` AS (
SELECT
  `f`.`b_id`                AS `b_id`,
  `n`.`id`                  AS `id`,
  `n`.`date_id`             AS `date_id`,
  `n`.`report_date`         AS `report_date`,
  `c`.`customer_name`       AS `customer_name`,
  `c`.`search_result_id`    AS `search_result_id`,
  `f`.`classification_name` AS `classification_name`,
  `f`.`field_name`          AS `field_name`,
  `f`.`category_name`       AS `brand_name`,
  `n`.`search_engine`       AS `search_engine`,
  `n`.`news_title`          AS `news_title`,
  `n`.`news_url`            AS `news_url`,
  `n`.`report_sites`        AS `report_sites`,
  `n`.`summary`             AS `summary`,
  `n`.`score`               AS `score`,
  `n`.`positive_count`      AS `positive_count`,
  `n`.`middle_count`        AS `middle_count`,
  `n`.`negative_count`      AS `negative_count`,
  `n`.`last_modified`       AS `last_modified`,
  `n`.`is_deleted`          AS `is_deleted`,
  '0'                       AS `status`,
  '0'                       AS `is_sensitive`,
  ''                        AS `updated_by`,
  ''                        AS `update_date`,
  ''                        AS `handle_id`,
  ''                        AS `handle_type`,
  ''                        AS `handle_remark`,
  ''                        AS `handle_date`,
  ''                        AS `handle_user`
FROM ((`b_info_classification_field` `f`
    LEFT JOIN `b_info_classification_customer` `c`
      ON (((`f`.`search_result_id` = `c`.`search_result_id`)
           AND (`f`.`search_engine` = `c`.`search_engine`))))
   LEFT JOIN `b_news_evaluation` `n`
     ON (((`f`.`search_result_id` = `n`.`search_result_id`)
          AND (`f`.`search_engine` = `n`.`search_engine`))))
WHERE ((`f`.`info_type` = '新闻')
       AND (`n`.`is_deleted` = 0)))$$

DELIMITER ;


DELIMITER $$

USE `digital_marketing_dev1.1`$$

DROP VIEW IF EXISTS `v_b_weibo_evaluation`$$

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `v_b_weibo_evaluation` AS (
SELECT
  `f`.`b_id`                  AS `b_id`,
  `n`.`id`                    AS `id`,
  `n`.`date_id`               AS `date_id`,
  `f`.`search_result_id`      AS `search_result_id`,
  `f`.`search_engine`         AS `search_engine`,
  `c`.`customer_name`         AS `customer_name`,
  `f`.`classification_name`   AS `classification_name`,
  `f`.`field_name`            AS `field_name`,
  `f`.`category_name`         AS `brand_name`,
  `n`.`status_text`           AS `status_text`,
  `n`.`url`                   AS `url`,
  `n`.`source`                AS `source`,
  `n`.`user_name`             AS `user_name`,
  `n`.`created_date`          AS `created_date`,
  `n`.`status_type`           AS `status_type`,
  `n`.`reposts_count`         AS `reposts_count`,
  `n`.`comments_count`        AS `comments_count`,
  `n`.`user_followers_count`  AS `user_followers_count`,
  `n`.`user_friends_count`    AS `user_friends_count`,
  `n`.`user_statuses_count`   AS `user_statuses_count`,
  `n`.`user_favourites_count` AS `user_favourites_count`,
  `n`.`score`                 AS `score`,
  `n`.`positive_count`        AS `positive_count`,
  `n`.`middle_count`          AS `middle_count`,
  `n`.`negative_count`        AS `negative_count`,
  `n`.`last_modified`         AS `last_modified`,
  `n`.`is_deleted`            AS `is_deleted`,
  '0'                         AS `status`,
  '0'                         AS `is_sensitive`,
  ''                          AS `updated_by`,
  ''                          AS `update_date`,
  ''                          AS `handle_id`,
  ''                          AS `handle_type`,
  ''                          AS `handle_remark`,
  ''                          AS `handle_date`,
  ''                          AS `handle_user`
FROM ((`b_info_classification_field` `f`
    LEFT JOIN `b_info_classification_customer` `c`
      ON (((`f`.`search_result_id` = `c`.`search_result_id`)
           AND (`f`.`search_engine` = `c`.`search_engine`))))
   LEFT JOIN `b_weibo_evaluation` `n`
     ON (((`f`.`search_result_id` = `n`.`search_result_id`)
          AND (`f`.`search_engine` = `n`.`search_engine`))))
WHERE ((`f`.`info_type` = '微博')
       AND (`n`.`is_deleted` = 0)))$$

DELIMITER ;

DELIMITER $$

USE `digital_marketing_dev1.1`$$

DROP VIEW IF EXISTS `v_b_weixin_evaluation`$$

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `v_b_weixin_evaluation` AS (
SELECT
  `f`.`b_id`                AS `b_id`,
  `n`.`id`                  AS `id`,
  `n`.`date_id`             AS `date_id`,
  `f`.`search_result_id`    AS `search_result_id`,
  `c`.`customer_name`       AS `customer_name`,
  `f`.`classification_name` AS `classification_name`,
  `f`.`search_engine`       AS `search_engine`,
  `f`.`field_name`          AS `field_name`,
  `f`.`category_name`       AS `brand_name`,
  `n`.`article_title`       AS `article_title`,
  `n`.`article_url`         AS `article_url`,
  `n`.`post_user`           AS `post_user`,
  `n`.`post_date`           AS `post_date`,
  `n`.`content`             AS `content`,
  `n`.`score`               AS `score`,
  `n`.`positive_count`      AS `positive_count`,
  `n`.`middle_count`        AS `middle_count`,
  `n`.`negative_count`      AS `negative_count`,
  `n`.`last_modified`       AS `last_modified`,
  `n`.`is_deleted`          AS `is_deleted`,
  '0'                       AS `status`,
  '0'                       AS `is_sensitive`,
  ''                        AS `updated_by`,
  ''                        AS `update_date`,
  ''                        AS `handle_id`,
  ''                        AS `handle_type`,
  ''                        AS `handle_remark`,
  ''                        AS `handle_date`,
  ''                        AS `handle_user`
FROM ((`b_info_classification_field` `f`
    LEFT JOIN `b_info_classification_customer` `c`
      ON (((`f`.`search_result_id` = `c`.`search_result_id`)
           AND (`f`.`search_engine` = `c`.`search_engine`))))
   LEFT JOIN `b_weixin_evaluation` `n`
     ON (((`f`.`search_result_id` = `n`.`search_result_id`)
          AND (`f`.`search_engine` = `n`.`search_engine`))))
WHERE ((`f`.`info_type` = '微信')
       AND (`n`.`is_deleted` = 0)))$$

DELIMITER ;