<?php
	class Webkul_CustomerPartner_Model_Mysql4_Saleperpartner_Collection extends Mage_Core_Model_Mysql4_Collection_Abstract	{

	    public function _construct()    {
	        parent::_construct();
	        $this->_init("customerpartner/saleperpartner");
	    }

	}