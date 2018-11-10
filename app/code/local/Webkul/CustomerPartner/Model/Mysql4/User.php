<?php
	class Webkul_CustomerPartner_Model_Mysql4_User extends Mage_Core_Model_Mysql4_Abstract	{
	    
	    public function _construct()    {    
	        $this->_init("customerpartner/user","autoid");
	    }

	}