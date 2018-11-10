<?php
class Webkul_CustomerPartner_Block_Adminhtml_Partners_Edit extends Mage_Adminhtml_Block_Widget_Form_Container {

    public function __construct() {

        parent::__construct();        
        $this->_objectId = 'indexid';
        $this->_blockGroup = 'customerpartner';
        $this->_controller = 'adminhtml_partners';
        $this->_updateButton('save', 'label', Mage::helper('customerpartner')->__('Save Partner'));
        $this->removeButton('reset');
    }

    public function getHeaderText() {
        return Mage::helper('customerpartner')->__('Partner Manager');
    }

}