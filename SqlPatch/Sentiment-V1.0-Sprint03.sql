/*创建热词表*/
DROP TABLE IF EXISTS `b_brand_hotword`;
CREATE TABLE `b_brand_hotword` (
  `id` bigint(20) DEFAULT NULL COMMENT 'staging PK',
  `date_id` bigint(20) DEFAULT NULL,
  `customer_name` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '客户名称',
  `field_name` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '行业领域名称',
  `brand_name` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '品牌名称',
  `url` varchar(256) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '搜索URL',
  `search_engine` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '搜索引擎',
  `word_name` varchar(64) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '热词',
  `word_count` bigint(20) DEFAULT NULL COMMENT '热词热度',
  `word_value` bigint(20) DEFAULT NULL COMMENT '热词得分',
  `last_modified` datetime DEFAULT NULL COMMENT '最后更新时间',
  `b_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '业务库主键',
  PRIMARY KEY (`b_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1231 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

/*指数平分表*/
DROP TABLE IF EXISTS `b_brand_evaluation`;
CREATE TABLE `b_brand_evaluation` (
  `id` bigint(20) NOT NULL COMMENT '主键ID',
  `date_id` bigint(20) DEFAULT NULL COMMENT '时间ID',
  `customer_name` varchar(64) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '客户名称',
  `field_name` varchar(64) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '行业领域名称',
  `brand_name` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '品牌名称',
  `score` bigint(20) DEFAULT NULL COMMENT '评分',
  `score_index` bigint(20) DEFAULT NULL COMMENT '指数评分',
  `record_count` bigint(20) DEFAULT NULL COMMENT '几录条数',
  `positive_count` bigint(20) DEFAULT NULL COMMENT '正面得分',
  `middle_count` bigint(20) DEFAULT NULL COMMENT '中性得分',
  `negative_count` bigint(20) DEFAULT NULL COMMENT '负面得分',
  `last_modified` datetime DEFAULT NULL COMMENT '最后修改时间',
  `b_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '业务库主键ID',
  PRIMARY KEY (`b_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1907 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='在Baidu新闻中搜索关键返回的结果';

/*--oauth_client Maintain OAuth client app information*/
DROP TABLE IF EXISTS `oauth_client`;
CREATE TABLE `oauth_client` (
  `clientId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'client primary key',
  `clientScret` varchar(40) NOT NULL COMMENT 'client primary key',
  `userId` varchar(38) NOT NULL COMMENT 'user id',
  `accessToken` varchar(40) DEFAULT NULL COMMENT 'access token',
  `accessTokenExpires` datetime DEFAULT NULL COMMENT 'access token expires time',
  `refreshToken` varchar(40) DEFAULT NULL COMMENT 'refrensh token',
  `refreshTokenExpires` datetime DEFAULT NULL COMMENT 'refrensh token expires time',
  `grantType` varchar(100) DEFAULT NULL COMMENT 'authorization type,eg:accesstoken',
  `redirectUri` varchar(500) DEFAULT NULL COMMENT 'redirect address',
  PRIMARY KEY (`clientId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*--Verifite the token*/
DROP TABLE IF EXISTS `core_authorization`;
CREATE TABLE `core_authorization` (
  `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'rows id and primary key',
  `currentToken` varchar(40) NOT NULL COMMENT 'current token',
  `tokenExpires` datetime DEFAULT NULL COMMENT 'token expire date',
  `userId` varchar(38) NOT NULL COMMENT 'user id',
  `tenant` int(11) NOT NULL COMMENT 'tenant id',
  `ipAddress` varchar(15) DEFAULT NULL COMMENT 'ip address',
  `ipsProxy` varchar(100) DEFAULT NULL COMMENT 'net proxy',
  `userAgent` varchar(300) DEFAULT NULL COMMENT 'user internet brower agent',
  `lastToken` varchar(40) DEFAULT NULL COMMENT 'last time token',
  `createTime` datetime DEFAULT NULL COMMENT 'create date',
  `updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'timestamp for update',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8;
/*--the job for remove the expired token rows*/
create event e_UpdateTable_oauth_client
on schedule
	EVERY 1 DAY STARTS '2014-08-20 01:00:00'
do
	SET SQL_SAFE_UPDATES=0;
	delete from core_authorization
	where tokenExpires <now()
;
/*--produce for delay the token*/
DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `DelayToken`(in token varchar(40),in expires varchar(19))
begin
SET SQL_SAFE_UPDATES=0; 
UPDATE `core_authorization`
set tokenExpires=expires
WHERE currentToken = token ;
    END$$
DELIMITER ;

DROP TABLE IF EXISTS `core_user_group`;
CREATE TABLE `core_user_group` (
  `userid` varchar(45) NOT NULL,
  `groupid` varchar(45) NOT NULL,
  `removed` int(11) NOT NULL,
  `last_modified` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `core_model`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `core_model` (
  `id` varchar(45) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `uri` varchar(45) DEFAULT NULL,
  `value` int(11) DEFAULT NULL,
  `parentid` varchar(45) DEFAULT NULL,
  `notes` varchar(45) DEFAULT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `last_modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `core_group`;
CREATE TABLE `core_group` (
  `tenant` int(11) NOT NULL,
  `id` varchar(38) NOT NULL,
  `name` varchar(128) NOT NULL,
  `categoryid` varchar(38) DEFAULT NULL,
  `parentid` varchar(38) DEFAULT NULL,
  `removed` int(11) NOT NULL DEFAULT '0',
  `last_modified` datetime NOT NULL,
  `create_by` varchar(45) DEFAULT NULL,
  `create_on` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `parentid` (`tenant`,`parentid`),
  KEY `last_modified` (`last_modified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `core_api`;
CREATE TABLE `core_api` (
  `id` varchar(50) NOT NULL,
  `router` varchar(300) NOT NULL,
  `value` int(11) NOT NULL,
  `notes` varchar(500) NOT NULL,
  `create_by` varchar(50) DEFAULT NULL,
  `last_modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `core_api_subscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `core_api_subscription` (
  `tenant` int(11) NOT NULL DEFAULT -1,
  `id` varchar(50) DEFAULT NULL,
  `api` varchar(50) DEFAULT NULL,
  `type` int(11) DEFAULT '0',
  `last_modified` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `core_model_subscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `core_model_subscription` (
  `tenant` int(11) NOT NULL DEFAULT -1,
  `id` varchar(50) NOT NULL,
  `model` varchar(50) NOT NULL,
  `type` int(11) NOT NULL DEFAULT '0',
  `last_modified` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `core_subscription`;
DROP TABLE IF EXISTS `core_subscriptionmethod`;
DROP TABLE IF EXISTS `core_group_subscription`;
DROP TABLE IF EXISTS `core_acl`;
DROP TABLE IF EXISTS `core_usergroup`;