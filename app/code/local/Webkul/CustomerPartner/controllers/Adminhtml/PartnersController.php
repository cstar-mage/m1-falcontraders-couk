<?php
	class Webkul_CustomerPartner_Adminhtml_PartnersController extends Mage_Adminhtml_Controller_Action		{

		protected function _initAction() {
			$this->loadLayout()->_setActiveMenu("customerpartner");
			$this->getLayout()->getBlock("head")->setTitle(Mage::helper("customerpartner")->__("Manage Partners"));	
			return $this;
		}   

		public function indexAction() {
			$this->_initAction()->renderLayout();
		}

		public function massispartnerAction(){
			$count = count($this->getRequest()->getParam("customer"));
			Mage::getModel("customerpartner/user")->massispartner($this->getRequest()->getParams());
			$this->_getSession()->addSuccess($count.Mage::helper("customerpartner")->__(" customer(s) have been successfully assigned as partner"));
			$this->_redirect("customerpartner/adminhtml_partners/");
		}

		public function massnotpartnerAction(){
			$count = count($this->getRequest()->getParam("customer"));
			Mage::getModel("customerpartner/user")->massisnotpartner($this->getRequest()->getParams());
			$this->_getSession()->addSuccess($count.Mage::helper("customerpartner")->__(" customer(s) have been successfully unassigned as partner"));
			$this->_redirect("customerpartner/adminhtml_partners/");
		}

		public function gridAction()    {
            $this->loadLayout();
            $this->getResponse()->setBody($this->getLayout()->createBlock("customerpartner/adminhtml_partners_grid")->toHtml()); 
        }

        public function editAction(){
			$id = $this->getRequest()->getParam('indexid');
			$model = Mage::getModel("customerpartner/user")->getCollection()->addFieldToFilter("mageuserid",$id)->getData();
			Mage::register('partner_data', $model[0]);
			$this->loadLayout()->_setActiveMenu('customerpartner')->_addBreadcrumb(Mage::helper('customerpartner')->__('Partner'), Mage::helper('customerpartner')->__('customerpartner'));	
			$this->_addContent($this->getLayout()->createBlock('customerpartner/adminhtml_partners_edit'))
	                        ->_addLeft($this->getLayout()->createBlock('customerpartner/adminhtml_partners_edit_tabs'));
			$this->getLayout()->getBlock('head')->setTitle(Mage::helper('customerpartner')->__('Partner'));		
			$this->renderLayout();
		}	
		public function saveAction(){
			$data = $this->getRequest()->getParams();
			Mage::getModel("customerpartner/user")->savepartner($data);
			$this->_getSession()->addSuccess(Mage::helper("customerpartner")->__("Customer have been successfully Saved"));
			$this->_redirect('customerpartner/adminhtml_partners/edit', array('indexid' => $this->getRequest()->getParam('indexid')));
		}	

	}