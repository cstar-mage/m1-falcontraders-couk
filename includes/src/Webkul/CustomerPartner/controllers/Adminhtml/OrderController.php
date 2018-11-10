<?php
	class Webkul_CustomerPartner_Adminhtml_OrderController extends Mage_Adminhtml_Controller_Action		{

		protected function _initAction() {
			$this->loadLayout()->_setActiveMenu("customerpartner");
			$this->getLayout()->getBlock("head")->setTitle(Mage::helper("customerpartner")->__("Partner's product orders"));
			return $this;
		}   

		public function indexAction() {
			$this->_initAction()->renderLayout();
		}

	}