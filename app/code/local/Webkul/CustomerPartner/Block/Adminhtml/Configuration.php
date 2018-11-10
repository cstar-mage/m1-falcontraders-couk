<?php
	class Webkul_CustomerPartner_Block_Adminhtml_Configuration extends Mage_Adminhtml_Block_Widget_Grid_Container	{

		public function __construct(){
	        $this->_controller = "adminhtml_configuration";
	        $this->_headerText = Mage::helper("customerpartner")->__("Configuration");
	        $this->_blockGroup = "customerpartner";
	        parent::__construct();	        
	    }
	}