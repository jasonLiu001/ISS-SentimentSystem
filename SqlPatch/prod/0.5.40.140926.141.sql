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
  `create_record_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '业务库记录创建时间，默认值为当前系统时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/*新的统计视图(包含微信数据)*/
DELIMITER $$

USE `digital_marketing_sit`$$

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