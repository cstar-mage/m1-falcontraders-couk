<?php
	class Webkul_CustomerPartner_Adminhtml_ProductsController extends Mage_Adminhtml_Controller_Action		{

		protected function _initAction() {
			$this->loadLayout()->_setActiveMenu("customerpartner");
			$this->getLayout()->getBlock("head")->setTitle(Mage::helper("customerpartner")->__("Manage Products"));
			return $this;
		}

		public function indexAction() {
			$this->_initAction()->renderLayout();
		}

		public function approveAction(){
			$id = (int)$this->getRequest()->getParam("id");
			if(!$id)
				$this->_redirectReferer();
			$lastId = Mage::getModel("customerpartner/product")->ApproveProduct($id);
			Mage::getSingleton("adminhtml/session")
				->addSuccess(Mage::helper("customerpartner")->__("Product Successfully Approved"));
			$this->_redirect("adminhtml/catalog_product/edit", array("id" => $lastId,"_current"=>true));
		}

		public function gridAction()    {
            $this->loadLayout();
            $this->getResponse()->setBody($this->getLayout()->createBlock("customerpartner/adminhtml_products_grid")->toHtml()); 
        }

        public function previewAction()    {
			$id = $this->getRequest()->getParam("id");
			$products = Mage::getModel("catalog/product")->load($id)->toArray();
			$products["url"] = Mage::getModel("catalog/product")->load($id)->getImageUrl();
			$products["downlink"] = array();
			$links = Mage::getModel("downloadable/link")->getCollection()->addFieldTofilter("product_id",array("eq"=>$id));
			foreach($links as $link){
				$url=Mage::helper("adminhtml")->getUrl("adminhtml/downloadable_product_edit/link")."id/".$link->getId();
				$key="63176c0d831ce5655c620e0e0e1fa1be";
				 $key = Mage::getSingleton("adminhtml/url")
	             ->getSecretKey("downloadable_product_edit","link");
				$url=Mage::getBaseUrl()."admin/downloadable_product_edit/link/id/".$link->getId()."/key/".$key;
				$products["downlink"][]=$url;
			}
	        echo json_encode($products);
	    }
	}