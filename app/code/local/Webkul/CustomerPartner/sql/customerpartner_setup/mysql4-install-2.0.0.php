<?php
$installer = $this;
$installer->startSetup();
$installer->run("

CREATE TABLE {$this->getTable('customerpartner_product')} (
  `index_id` int(11) unsigned NOT NULL auto_increment,
  `mageproductid` int(11) NOT NULL default '0',
  `userid` int(11) NOT NULL default '0',
  `wstoreids` int(11) NOT NULL default '0',
  `status` int(11) NOT NULL default '0',
  PRIMARY KEY (`index_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE {$this->getTable('customerpartner_saleperpartner')} (
  `autoid` int(11) unsigned NOT NULL auto_increment,
  `mageuserid` int(11) NOT NULL default '0',
  `totalsale` int(11) NOT NULL default '0',
  `amountrecived` int(11) NOT NULL default '0',
  `amountpaid` int(11) NOT NULL default '0',
  `amountremain` int(11) NOT NULL default '0',
  `commision` decimal(10,0) NOT NULL,
  PRIMARY KEY (`autoid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE {$this->getTable('customerpartner_saleslist')} (
  `autoid` int(11) NOT NULL AUTO_INCREMENT,
  `mageproid` varchar(255) NOT NULL,
  `mageorderid` varchar(255) NOT NULL,
  `magerealorderid` varchar(255) NOT NULL,
  `magequantity` varchar(255) NOT NULL,
  `mageproownerid` varchar(255) NOT NULL,
  `cpprostatus` int(2) NOT NULL,
  `magebuyerid` varchar(255) NOT NULL,
  `mageproprice` varchar(255) NOT NULL,
  `mageproname` varchar(255) NOT NULL,
  `totalamount` varchar(255) NOT NULL,
  `totalcommision` varchar(255) NOT NULL,
  `actualparterprocost` varchar(255) NOT NULL,
  `cleared_at` datetime NOT NULL,
  PRIMARY KEY (`autoid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE {$this->getTable('customerpartner_userdata')} (
  `autoid` smallint(6) NOT NULL AUTO_INCREMENT,
  `wantpartner` smallint(6) NOT NULL,
  `paymentsource` varchar(255) NOT NULL default '',
  `partnerstatus` varchar(255) NOT NULL DEFAULT 'Deafult User',
  `mageuserid` int(11) NOT NULL,
  `profileurl` varchar(255) NOT NULL,
  PRIMARY KEY (`autoid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    ");

$installer->endSetup(); 