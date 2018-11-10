<?php
	class Webkul_CustomerPartner_Block_Adminhtml_Order extends Mage_Adminhtml_Block_Widget_Grid_Container	{

		public function __construct(){
	        $this->_controller = "adminhtml_order";
	        $this->_headerText = Mage::helper("customerpartner")->__("Partners Order");
	        $this->_blockGroup = "customerpartner";
	        parent::__construct();
	        $this->_removeButton("add");
	    }
	}