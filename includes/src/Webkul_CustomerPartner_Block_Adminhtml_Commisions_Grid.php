<?php
    class Webkul_CustomerPartner_Block_Adminhtml_Commisions_Grid extends Mage_Adminhtml_Block_Widget_Grid    {

        public function __construct()    {
            parent::__construct();
            $this->setId("customerpartnerGrid");
            $this->setUseAjax(true);
            $this->setSaveParametersInSession(true);
        }

        public function getMainButtonsHtml()    {
            return "";
        }

        protected function _prepareCollection()     {
            $global_comm_percent = Mage::getStoreConfig("customerpartner/customerpartner_options/commission_percent");
            $prefix = Mage::getConfig()->getTablePrefix();
            $fnameid = Mage::getModel("eav/entity_attribute")->loadByCode("1", "firstname")->getAttributeId();
            $lnameid = Mage::getModel("eav/entity_attribute")->loadByCode("1", "lastname")->getAttributeId();
    		$collection = Mage::getModel("customerpartner/saleperpartner")->getCollection();
            $collection->getSelect()
            ->join(array("ce1" => $prefix."customer_entity_varchar"),"ce1.entity_id = main_table.mageuserid",array("fname" => "value"))->where("ce1.attribute_id = ".$fnameid)
            ->join(array("ce2" => $prefix."customer_entity_varchar"),"ce2.entity_id = main_table.mageuserid",array("lname" => "value"))->where("ce2.attribute_id = ".$lnameid)
            ->columns(new Zend_Db_Expr("CONCAT(`ce1`.`value`, ' ',`ce2`.`value`) AS fullname"));
            $collection->addFilterToMap("fullname","`ce1`.`value`");
            $collection->getSelect()
            ->join(array("em" => $prefix."customer_entity"),"em.entity_id = main_table.mageuserid",array("email" => "email","created_at" => "created_at"));
            $collection->getSelect()->join(array("cpu" => $prefix."customerpartner_userdata"),"cpu.mageuserid = main_table.mageuserid",array("partnerstatus"=>"partnerstatus","paymentsource"=>"paymentsource"));
    		$this->setCollection($collection);
			foreach ($collection as $item) {
    			$comm = $item->getCommision();
    			if($comm == 0)
    				$item->setCommision($global_comm_percent);
    			else
    				$item->setCommision($comm);
    		}
            return parent::_prepareCollection();   		
        }

        protected function _prepareColumns(){

            $this->addColumn("mageuserid", array(
                "header"    => Mage::helper("customerpartner")->__("Partner ID"),
                "width"     => "50px",
                "index"     => "mageuserid",
                "type"      => "number",
    			"filter"    => false,
                "sortable"  => false
            ));

            $this->addColumn("name", array(
                "header"    => Mage::helper("customerpartner")->__("Name"),
                "index"     => "fullname"
            ));

            $this->addColumn("email", array(
                "header"    => Mage::helper("customerpartner")->__("Email"),
                "width"     => "150",
                "index"     => "email"
            ));

            $this->addColumn("partnerstatus", array(
                "header"    => Mage::helper("customerpartner")->__("Partner Status"),
                "index"     => "partnerstatus"
            ));

    		$this->addColumn("commision", array(
                "header"    => Mage::helper("customerpartner")->__("Commision %"),
                "index"     => "commision",
    			"filter"    => false,
                "sortable"  => false
            ));

    		$this->addColumn("paymentsource", array(
                "header"    => Mage::helper("customerpartner")->__("Mode Of Payment"),
                "index"     => "paymentsource"
            ));

    		$this->addColumn("totalsale", array(
                "header"    => Mage::helper("customerpartner")->__("Total sales"),
                "index"     => "totalsale",
                "type"      => "currency",
                "currency"  => "base_currency_code"
            ));

    		$this->addColumn("amountpaid", array(
                "header"    => Mage::helper("customerpartner")->__("Amount Recieved"),
                "index"     => "amountpaid",
    			"type"      => "currency",
                "currency"  => "base_currency_code"
            ));

    		$this->addColumn("amountremain", array(
                "header"    => Mage::helper("customerpartner")->__("Amount Remain"),
                "index"     => "amountremain",
    			"type"      => "currency",
                "currency"  => "base_currency_code"
            ));

    		$this->addColumn("amountrecived", array( 
                "header"    => Mage::helper("customerpartner")->__("Last Pay Amount"),
                "index"     => "amountrecived",
    			"type"      => "currency",
                "currency"  => "base_currency_code"
            ));

    		$this->addColumn("Pay", array(
                "header"    =>  Mage::helper("customerpartner")->__("Action"),
                "width"     => "100",
                "type"      => "action",
                "getter"    => "getMageuserid",
                "actions"   => array(array(
										"caption"   => Mage::helper("customerpartner")->__("Pay"),
										"url"       => array("base"   => "*/*/payamount"),
										"field"     => "id")),
                "filter"    => false,
                "sortable"  => false,
                "index"     => "stores",
                "is_system" => true,
            ));

            $this->addColumn("customer_since", array(
                "header"    => Mage::helper("customerpartner")->__("Customer Since"),
                "type"      => "datetime",
                "align"     => "center",
                "index"     => "created_at"
            ));
    		
            if(!Mage::app()->isSingleStoreMode()) {
                $this->addColumn("website_id", array(
                    "header"    => Mage::helper("customerpartner")->__("Website"),
                    "align"     => "center",
                    "width"     => "80px",
                    "type"      => "options",
                    "options"   => Mage::getSingleton("adminhtml/system_store")->getWebsiteOptionHash(true),
                    "index"     => "website_id",
                ));
            }
            return parent::_prepareColumns();
        }

        protected function _prepareMassaction(){
            $this->setMassactionIdField("mageuserid");
            $this->getMassactionBlock()->setFormFieldName("partner");
    		$this->getMassactionBlock()->addItem("payamount", array(
                "label"    => Mage::helper("customerpartner")->__("Pay Amount"),
                "url"      => $this->getUrl("*/*/masspayamount")
            ));
            return $this;
        }

        public function getGridUrl()    {
            return $this->getUrl("*/*/grid",array("_current"=>true));
        }
        
    }