<?php
	class Webkul_CustomerPartner_Block_Customerpartner extends Mage_Customer_Block_Account_Dashboard	{

		public function __construct(){		
			parent::__construct();	
	    	$userId = Mage::getSingleton("customer/session")->getCustomer()->getId();
			$collection = Mage::getModel("customerpartner/product")->getCollection()->addFieldToFilter("userid",$userId);
			$products = array();
			foreach($collection as $data)
				array_push($products,$data->getMageproductid());
			$collection = Mage::getModel("catalog/product")->getCollection()->addAttributeToSelect("*")->addFieldToFilter("entity_id",array("in"=>$products));
			if($this->getRequest()->getParam('search')!=''){
				$collection->addFieldToFilter("name",array('like' => '%'.$this->getRequest()->getParam('search').'%'));
			}
			$this->setCollection($collection);
		}

		protected function _prepareLayout() {
	        parent::_prepareLayout(); 
	        $pager = $this->getLayout()->createBlock("page/html_pager", "custom.pager");
	        $pager->setAvailableLimit(array(15=>15,30=>30,45=>45,"all"=>"all"));
	        $pager->setCollection($this->getCollection());
	        $this->setChild("pager", $pager);
	        $this->getCollection()->load();
	        return $this;
	    } 

	    public function getPagerHtml() {
	        return $this->getChildHtml("pager");
	    }

		public function getProduct() {
			$id = $this->getRequest()->getParam("id");
			$products = Mage::getModel("catalog/product")->load($id);
			return $products;
		}

	}