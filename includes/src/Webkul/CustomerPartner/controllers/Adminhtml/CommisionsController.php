<?php
	class Webkul_CustomerPartner_Adminhtml_CommisionsController extends Mage_Adminhtml_Controller_Action	{

		protected function _initAction() {
			$this->loadLayout()->_setActiveMenu("customerpartner");
			$this->getLayout()->getBlock("head")->setTitle(Mage::helper("customerpartner")->__("Manage Commission"));
			return $this;
		}

		public function indexAction() {
			$this->_initAction()->renderLayout();
		}

		public function payamountAction(){
		    $data = $this->getRequest();
			Mage::getModel("customerpartner/saleperpartner")->salePayment($data);			
			$this->_redirectReferer();	
		}

		public function masspayamountAction(){
		    $data = $this->getRequest();
			Mage::getModel("customerpartner/saleperpartner")->masssalePayment($data);			
			$this->_redirectReferer();	
		}

		public function gridAction()    {
            $this->loadLayout();
            $this->getResponse()->setBody($this->getLayout()->createBlock("customerpartner/adminhtml_commisions_grid")->toHtml()); 
        }

	}