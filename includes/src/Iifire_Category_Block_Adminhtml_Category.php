<?php
class Iifire_Category_Block_Adminhtml_Category extends Mage_Adminhtml_Block_Template
{
    public function __construct()
    {
        parent::__construct();
    }


    protected function _prepareLayout()
    {
        return parent::_prepareLayout();
        
    }

    public function getHeaderText()
    {
        return Mage::helper('iifire_show')->__('Iifire Category Management');
    }
}
