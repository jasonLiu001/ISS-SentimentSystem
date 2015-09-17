USE `digital_marketing_dev`;

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

DROP TABLE IF EXISTS `core_user`;
CREATE TABLE `core_user` (
  `tenant` int(11) NOT NULL,
  `id` varchar(38) CHARACTER SET utf8 NOT NULL,
  `username` varchar(255) COLLATE gbk_bin NOT NULL,
  `email` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `workfromdate` datetime DEFAULT NULL,
  `terminateddate` datetime DEFAULT NULL,
  `phone` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `notes` varchar(512) CHARACTER SET utf8 DEFAULT NULL,
  `removed` int(11) NOT NULL DEFAULT '0',
  `create_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified` datetime NOT NULL,
  `create_by` varchar(50) COLLATE gbk_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `last_modified` (`last_modified`),
  KEY `username` (`tenant`,`username`),
  KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk COLLATE=gbk_bin;


alter table core_user add column create_by varchar(50);
-- add column to the tenants
alter table tenants_tenants add column customer_names varchar(255);
alter table tenants_tenants add column address varchar(255);


-- create b_emergency_plan table
DROP TABLE IF EXISTS `b_emergency_plan`;
CREATE TABLE `b_emergency_plan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `work_phone` varchar(32) NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `url` varchar(128) DEFAULT NULL,
  `contacts` varchar(32) DEFAULT NULL,
  `createDt` datetime DEFAULT NULL,
  `updateBy` varchar(32) DEFAULT NULL,
  `updateDt` datetime DEFAULT NULL,
  `is_deleted` tinyint(4) DEFAULT '0',
  `classify` int(11) NOT NULL DEFAULT '1',
  `polarity` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;
/*�������ű�*/
CREATE TABLE `b_news_evaluation` (
  `id` bigint(20) DEFAULT NULL COMMENT 'PK',
  `date_id` bigint(20) DEFAULT NULL COMMENT 'ʱ��ID',
  `report_date` datetime DEFAULT NULL COMMENT '����ʱ��',
  `customer_name` varchar(32) DEFAULT NULL COMMENT '�ͻ����',
  `field_name` varchar(32) DEFAULT NULL COMMENT '��ҵ�������',
  `brand_name` varchar(32) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT 'Ʒ��Ӣ����',
  `search_engine` varchar(32) DEFAULT NULL COMMENT '��������',
  `news_title` varchar(256) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '���ű���',
  `news_url` varchar(256) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '����url',
  `report_sites` varchar(128) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '�����˸����ŵ�����վ��',
  `summary` varchar(256) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '����ժҪ',
  `score` bigint(20) DEFAULT NULL COMMENT '�ۺ�ͳ��',
  `positive_count` bigint(20) DEFAULT NULL COMMENT '����ͳ��',
  `middle_count` bigint(20) DEFAULT NULL COMMENT '����ͳ��',
  `negative_count` bigint(20) DEFAULT NULL COMMENT '����ͳ��',
  `last_modified` datetime DEFAULT NULL COMMENT '����޸�ʱ��',
  `b_id` bigint(64) NOT NULL COMMENT 'ҵ�������',
  `status` smallint(4) DEFAULT '0' COMMENT '����״̬ 0��δ���� 1���Ѵ���',
  `is_sensitive` smallint(4) DEFAULT '0' COMMENT '�Ƿ����� 0�������� 1������',
  `updated_by` varchar(32) DEFAULT NULL COMMENT '�޸���',
  `updated_date` datetime DEFAULT NULL COMMENT '�޸�ʱ��',
  `handle_id` int(11) DEFAULT NULL COMMENT 'Emergency_Plan_ID',
  `handle_type` int(1) DEFAULT NULL COMMENT 'Ӧ����������1��Ӧ��Ԥ��2������3������',
  `handle_remark` varchar(255) DEFAULT NULL COMMENT '����',
  `handle_date` datetime DEFAULT NULL COMMENT '����ʱ��',
  `handle_user` varchar(32) DEFAULT NULL COMMENT '������',
  PRIMARY KEY (`b_id`),
  KEY `fk_handle_id_idx` (`handle_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
/*����Ӣ�����ű�*/
CREATE TABLE `b_news_evaluation_en` (
  `id` bigint(20) DEFAULT NULL COMMENT 'PK',
  `date_id` bigint(20) DEFAULT NULL COMMENT 'ʱ��ID',
  `report_date` datetime DEFAULT NULL COMMENT '����ʱ��',
  `customer_name` varchar(32) DEFAULT NULL COMMENT '�ͻ����',
  `field_name` varchar(32) DEFAULT NULL COMMENT '��ҵ�������',
  `brand_name` varchar(32) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT 'Ʒ��Ӣ����',
  `search_engine` varchar(32) DEFAULT NULL COMMENT '��������',
  `news_title` varchar(256) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '���ű���',
  `news_url` varchar(256) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '����url',
  `report_sites` varchar(128) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '�����˸����ŵ�����վ��',
  `summary` varchar(256) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '����ժҪ',
  `score` bigint(20) DEFAULT NULL COMMENT '�ۺ�ͳ��',
  `positive_count` bigint(20) DEFAULT NULL COMMENT '����ͳ��',
  `middle_count` bigint(20) DEFAULT NULL COMMENT '����ͳ��',
  `negative_count` bigint(20) DEFAULT NULL COMMENT '����ͳ��',
  `last_modified` datetime DEFAULT NULL COMMENT '����޸�ʱ��',
  `b_id` bigint(64) NOT NULL AUTO_INCREMENT COMMENT 'ҵ�������',
  `status` smallint(4) DEFAULT '0' COMMENT '����״̬ 0��δ���� 1���Ѵ���',
  `is_sensitive` smallint(4) DEFAULT '0' COMMENT '�Ƿ����� 0�������� 1������',
  `updated_by` varchar(32) DEFAULT NULL COMMENT '�޸���',
  `updated_date` datetime DEFAULT NULL COMMENT '�޸�ʱ��',
  `handle_id` int(11) DEFAULT NULL COMMENT 'Emergency_Plan_ID',
  `handle_type` int(1) DEFAULT NULL COMMENT 'Ӧ����������1��Ӧ��Ԥ��2������3������',
  `handle_remark` varchar(255) DEFAULT NULL COMMENT '����',
  `handle_date` datetime DEFAULT NULL COMMENT '����ʱ��',
  `handle_user` varchar(32) DEFAULT NULL COMMENT '������',
  PRIMARY KEY (`b_id`),
  KEY `fk_handle_id_idx` (`handle_id`)
) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=utf8

/*����΢����*/
CREATE TABLE `b_sina_weibo_evaluation` (
  `id` bigint(64) DEFAULT NULL COMMENT 'staging��ı� id',
  `date_id` bigint(20) DEFAULT NULL COMMENT 't_info_monitor_keywords.id_pk',
  `customer_name` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '�ͻ����',
  `field_name` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '��ҵ����',
  `brand_name` varchar(128) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Ʒ�����',
  `status_text` varchar(2096) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '΢����Ϣ����',
  `url` varchar(256) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '����URL',
  `source` varchar(64) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '΢����Դ',
  `user_name` varchar(64) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '΢�����ߵ��û�UID',
  `created_date` datetime DEFAULT NULL COMMENT '΢������ʱ��',
  `status_type` int(11) DEFAULT NULL COMMENT '΢������0��ԭ�� 1��ת��',
  `reposts_count` bigint(20) DEFAULT NULL COMMENT 'ת����',
  `comments_count` bigint(20) DEFAULT NULL COMMENT '������',
  `attitudes_count` bigint(20) DEFAULT NULL COMMENT '��̬��',
  `user_followers_count` bigint(20) DEFAULT NULL COMMENT '���߷�˿��',
  `user_friends_count` bigint(20) DEFAULT NULL COMMENT '���߹�ע��',
  `user_statuses_count` bigint(20) DEFAULT NULL COMMENT '����΢����',
  `user_favourites_count` bigint(20) DEFAULT NULL COMMENT '�����ղ���',
  `score` bigint(20) DEFAULT NULL COMMENT '����',
  `positive_count` bigint(20) DEFAULT NULL COMMENT '��������',
  `middle_count` bigint(20) DEFAULT NULL COMMENT '��������',
  `negative_count` bigint(20) DEFAULT NULL COMMENT '��������',
  `last_modified` datetime DEFAULT NULL COMMENT '����޸�ʱ��',
  `b_id` bigint(64) NOT NULL AUTO_INCREMENT COMMENT 'ҵ�������',
  `status` smallint(4) DEFAULT '0' COMMENT '΢��״̬ 0��δ���� 1���Ѵ���',
  `is_sensitive` int(11) DEFAULT '0' COMMENT '�Ƿ����� 0�������� 1������',
  `updated_by` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '�޸���',
  `updated_date` datetime DEFAULT NULL COMMENT '�޸�ʱ��',
  `weibo_title` varchar(128) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '΢������',
  `handle_id` int(11) DEFAULT NULL COMMENT 'Emergency_Plan_ID',
  `handle_type` int(1) DEFAULT NULL COMMENT 'Ӧ����������1��Ӧ��Ԥ��2������3������',
  `handle_remark` varchar(225) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '����',
  `handle_date` datetime DEFAULT NULL COMMENT '����ʱ��',
  `handle_user` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '������',
  PRIMARY KEY (`b_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2066 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='΢����\r\n'
/*�����ȴʱ�*/
DROP TABLE IF EXISTS `b_brand_hotword`;
CREATE TABLE `b_brand_hotword` (
  `id` bigint(20) DEFAULT NULL COMMENT 'staging PK',
  `date_id` bigint(20) DEFAULT NULL,
  `customer_name` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '�ͻ����',
  `field_name` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '��ҵ�������',
  `brand_name` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Ʒ�����',
  `url` varchar(256) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '����URL',
  `search_engine` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '��������',
  `word_name` varchar(64) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '�ȴ�',
  `word_count` bigint(20) DEFAULT NULL COMMENT '�ȴ��ȶ�',
  `word_value` bigint(20) DEFAULT NULL COMMENT '�ȴʵ÷�',
  `last_modified` datetime DEFAULT NULL COMMENT '������ʱ��',
  `b_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ҵ�������',
  PRIMARY KEY (`b_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1231 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

/*ָ��ƽ�ֱ�*/
DROP TABLE IF EXISTS `b_brand_evaluation`;
CREATE TABLE `b_brand_evaluation` (
  `id` bigint(20) NOT NULL COMMENT '����ID',
  `date_id` bigint(20) DEFAULT NULL COMMENT 'ʱ��ID',
  `customer_name` varchar(64) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '�ͻ����',
  `field_name` varchar(64) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '��ҵ�������',
  `brand_name` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Ʒ�����',
  `score` bigint(20) DEFAULT NULL COMMENT '����',
  `score_index` bigint(20) DEFAULT NULL COMMENT 'ָ������',
  `record_count` bigint(20) DEFAULT NULL COMMENT '��¼����',
  `positive_count` bigint(20) DEFAULT NULL COMMENT '����÷�',
  `middle_count` bigint(20) DEFAULT NULL COMMENT '���Ե÷�',
  `negative_count` bigint(20) DEFAULT NULL COMMENT '����÷�',
  `last_modified` datetime DEFAULT NULL COMMENT '����޸�ʱ��',
  `b_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ҵ�������ID',
  PRIMARY KEY (`b_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1907 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='��Baidu�����������ؼ�صĽ��';


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
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2422 DEFAULT CHARSET=utf8;
