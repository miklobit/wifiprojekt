-- Initial

create database wifiprojekt;
use wifiprojekt;

grant select on wifiprojekt.* to wifiselect@localhost identified by 'xxxxxxxx';

--
-- Table structure for table `punkty`
--

DROP TABLE IF EXISTS `punkty`;
CREATE TABLE IF NOT EXISTS `punkty` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `bssid` varchar(60) CHARACTER SET utf8 NOT NULL,
  `lat` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `lot` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `ssid` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `crypt` varchar(60) CHARACTER SET utf8 DEFAULT NULL,
  `kodowanie` varchar(60) CHARACTER SET utf8 DEFAULT NULL,
  `mode` varchar(60) CHARACTER SET utf8 DEFAULT NULL,
  `kanal` tinyint(3) unsigned DEFAULT NULL,
  `rxl` varchar(10) COLLATE utf8_bin DEFAULT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `id_user` int(10) NOT NULL DEFAULT '0',
  `data_utw` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `id_edit` int(10) NOT NULL DEFAULT '0',
  `data_edit` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `geocode` tinyint(1) NOT NULL DEFAULT '0',
  `results` tinyint(2) NOT NULL DEFAULT '-1',
  `geotag` tinyint(1) NOT NULL DEFAULT '0',
  `geotag_data` date NOT NULL DEFAULT '2013-08-00',
  `mac` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `mac` (`bssid`),
  KEY `lat_lot` (`lat`,`lot`),
  KEY `crypt` (`crypt`),
  KEY `ssid` (`ssid`),
  KEY `date` (`date`,`time`),
  KEY `kanal` (`kanal`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=370127 ;



 
