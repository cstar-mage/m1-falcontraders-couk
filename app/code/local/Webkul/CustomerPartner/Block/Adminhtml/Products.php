<?php
    class Webkul_CustomerPartner_Block_Adminhtml_Products extends Mage_Adminhtml_Block_Widget_Grid_Container  {

        public function __construct()    {	
    	    $this->_controller = "adminhtml_products";
            $this->_headerText = Mage::helper("customerpartner")->__("Partner's Products");
            $this->_blockGroup = "customerpartner";
            parent::__construct();
            $this->_removeButton("add");
            $this->setTemplate("catalog/product.phtml");
        }
         public function isSingleStoreMode()    {
            if (!Mage::app()->isSingleStoreMode()) {
                return false;
            }
            return true;
        }
    }