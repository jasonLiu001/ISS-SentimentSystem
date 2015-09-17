-- 运维报告配置表
CREATE TABLE `report_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `db_ip` varchar(50) DEFAULT NULL COMMENT '数据库ip地址',
  `db_port` varchar(10) DEFAULT NULL COMMENT '数据库端口',
  `db_passwd` varchar(100) DEFAULT NULL COMMENT '数据库连接密码',
  `db_dbname` varchar(45) DEFAULT NULL COMMENT '数据库名称',
  `db_username` varchar(100) DEFAULT NULL COMMENT '数据库用户名',
  `report_querysql` longtext COMMENT '产生报表内容的查询sql',
  `report_title` varchar(100) DEFAULT NULL COMMENT '单个检查点报告的标题',
  `report_tablenames` varchar(200) DEFAULT NULL COMMENT '报告中显示的各检查点的中文及英文表名',
  `report_entireTitle` varchar(100) DEFAULT '数字营销舆情系统运维报告' COMMENT '整个报告的标题',
  `report_templatepath` varchar(200) DEFAULT '/manage/reportTemplate.html' COMMENT '默认报告模板路径',
  `email_sender` varchar(100) DEFAULT NULL COMMENT '报告发件人',
  `email_reciever` text COMMENT '报告收件人',
  `email_cc` text COMMENT '抄送人员列表',
  `email_smtp_server` varchar(45) DEFAULT NULL COMMENT '发送邮件的SMTP服务器',
  `email_port` int(11) DEFAULT NULL COMMENT 'smtp服务器端口',
  `email_passwd` varchar(100) DEFAULT NULL COMMENT '邮箱密码',
  `email_sendTimes` varchar(100) DEFAULT NULL COMMENT '报告自动发送时间',
  `job_status` tinyint(4) DEFAULT '0' COMMENT '任务运行状态',
  `report_version` varchar(100) DEFAULT '1' COMMENT '运维报告的版本：1：代表1.0，2:代表2.0，以此类推 ',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='报表工具系统配置表';