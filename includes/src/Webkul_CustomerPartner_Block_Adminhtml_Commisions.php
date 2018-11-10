<?php
	class Webkul_CustomerPartner_Block_Adminhtml_Commisions extends Mage_Adminhtml_Block_Widget_Grid_Container	{

		public function __construct(){
	        $this->_controller = "adminhtml_commisions";
	        $this->_headerText = Mage::helper("customerpartner")->__("Manage Commissions");
	        $this->_blockGroup = "customerpartner";
	        parent::__construct();
	        $this->_removeButton("add");
	    }

	}