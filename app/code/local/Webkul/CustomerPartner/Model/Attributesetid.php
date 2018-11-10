<?php 
    class Webkul_CustomerPartner_Model_Attributesetid    {

        public function toOptionArray()    {
            $entityTypeId = Mage::getModel("eav/entity")->setType("catalog_product")->getTypeId();
            $attributeSetCollection = Mage::getModel("eav/entity_attribute_set")->getCollection()->setEntityTypeFilter($entityTypeId);
            $data[] =  array("value"=>"", "label"=>"--Select--");
            foreach($attributeSetCollection as $_attributeSet)
                $data[] =  array("value"=>$_attributeSet->getData("attribute_set_id"), "label"=>$_attributeSet->getData("attribute_set_name"));
            return  $data;                
        }
    }