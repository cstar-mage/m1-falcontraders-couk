<?php
	class Webkul_CustomerPartner_Block_Orders extends Mage_Core_Block_Template	{

	    public function __construct(){		
			parent::__construct();	
	    	$userid = Mage::getSingleton("customer/session")->getId();
			$collection = Mage::getModel("customerpartner/saleslist")->getCollection()->addFieldToFilter("mageproownerid",$userid);
			$this->setCollection($collection);
		}

		protected function _prepareLayout() {
	        parent::_prepareLayout(); 
	        $pager = $this->getLayout()->createBlock("page/html_pager", "custom.pager");
	        $pager->setAvailableLimit(array(5=>5,10=>10,20=>20,"all"=>"all"));
	        $pager->setCollection($this->getCollection());
	        $this->setChild("pager", $pager);
	        $this->getCollection()->load();
	        return $this;
	    } 

	    public function getPagerHtml() {
	        return $this->getChildHtml("pager");
	    }

	}