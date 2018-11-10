<?php 
    class Webkul_CustomerPartner_Model_Productstatus    {

        public function toOptionArray()    {
            $data = array(array("value"=>"1", "label"=>"No Change"), array("value"=>"2", "label"=>"Disable"), array("value"=>"3", "label"=>"Delete"));
            return  $data;                
        }
    }