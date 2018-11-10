<?php
	class Webkul_CustomerPartner_Block_Adminhtml_Partners extends Mage_Adminhtml_Block_Widget_Grid_Container	{

	  	public function __construct()	  {
			$this->_controller = "adminhtml_partners";
			$this->_headerText = Mage::helper("customerpartner")->__("Manage Partners");
			$this->_blockGroup = "customerpartner";
			parent::__construct();
			$this->_removeButton("add");
		}

	}