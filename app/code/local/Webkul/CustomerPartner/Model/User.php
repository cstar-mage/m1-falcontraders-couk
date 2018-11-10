<?php
	class Webkul_CustomerPartner_Model_User extends Mage_Core_Model_Abstract	{

	    public function _construct()    {
	        parent::_construct();
	        $this->_init("customerpartner/user");
	    }

		public function getRegisterDetail($customer)	{
	        $data = Mage::getSingleton("core/app")->getRequest();
			$wholedata = $data->getParams();
			if($wholedata["wanttopartner"] == 1) {
				$status = Mage::getStoreConfig('customerpartner/customerpartner_options/partner_approval',Mage::app()->getStore()->getId()) ? 2 : 1;
				$assinstatus = Mage::getStoreConfig('customerpartner/customerpartner_options/partner_approval',Mage::app()->getStore()->getId()) ? "Pending" : "Partner";
				$customerid = $customer->getId();
				$collection = Mage::getModel("customerpartner/user");
				$collection->setwantpartner($status);
				$collection->setpartnerstatus($assinstatus);
				$collection->setmageuserid($customerid);
				$collection->save();
			}
		}

		public function savepartner($wholedata)	{
			$productstatus = Mage::getStoreConfig("customerpartner/customerpartner_options/productstatus",Mage::app()->getStore()->getId());
			$customer = Mage::getModel('customer/customer')->load($wholedata['indexid']);
			$collection = Mage::getModel("customerpartner/user")->getCollection()->addFieldToFilter("mageuserid",$wholedata['indexid'])->getData();
			$isPartner= $collection[0]['wantpartner'];
			$partner_type = $wholedata['partnertype'];
			$collectionpartner = Mage::getResourceModel('customerpartner/user_collection');
			$collectionpartner->getSelect()->where('mageuserid ='.$wholedata['indexid']);
			foreach($collectionpartner as $partner)
				$autoid=$partner->getautoid();
			if($isPartner==1){
				$sid = $wholedata['sellerassignproid'];
				if(isset($partner_type) && $partner_type==0){
					$collectionunassign = Mage::getModel('customerpartner/user')->load($autoid);
					$collectionunassign->setwantpartner($partner_type);
					$collectionunassign->setpartnerstatus('Default User');
					$collectionunassign->save();
					if($productstatus == 3){
						$productcollection = Mage::getModel("customerpartner/product")->getCollection()
				   								->addFieldToFilter("userid",$wholedata['indexid']);
						foreach ($productcollection as $product) {
							$proid = $product->getMageproductid();
							$mage_product = Mage::getModel("catalog/product")->load($proid);
							$mage_product->delete();
							Mage::getModel("customerpartner/product")->load($product["index_id"])->delete();
						}
					}
					if($productstatus == 2){
						$productcollection = Mage::getModel("customerpartner/product")->getCollection()
				   								->addFieldToFilter("userid",$wholedata['indexid']);
						foreach ($productcollection as $product) {
							$proid = $product->getMageproductid();
							$mage_product = Mage::getModel("catalog/product")->load($proid);
							$mage_product->setStatus(2);
							$mage_product->save();
						}
					}
					$emailTemp = Mage::getModel('core/email_template')->loadDefault('partnerdisapprove');				
					$emailTempVariables = array();				
					$toadminEmail = Mage::getStoreConfig('customerpartner/customerpartner_options/adminemail',Mage::app()->getStore()->getId());
					$toadminUsername = 'Administrator';
					$emailTempVariables['customername'] = $customer->getName();
					$emailTempVariables['loginurl'] = Mage::helper('customer')->getLoginUrl();					
					$processedTemplate = $emailTemp->getProcessedTemplate($emailTempVariables);					
					$emailTemp->setSenderName($toadminUsername);
					$emailTemp->setSenderEmail($toadminEmail);
					$emailTemp->send($customer->getEmail(),$Username,$emailTempVariables);		
				}
				if($sid > 0)
					Mage::getModel('customerpartner/user')->assignProduct($customer,$sid);
				$collectionselect = Mage::getResourceModel('customerpartner/saleperpartner_collection');
				$collectionselect->getSelect()->where('mageuserid ='.$wholedata['indexid']);
				if(count($collectionselect)==1){
				    foreach($collectionselect as $verifyrow)
						$autoid=$verifyrow->getautoid();
					$collectionupdate = Mage::getModel('customerpartner/saleperpartner')->load($autoid);
					$collectionupdate->setcommision($wholedata['commision']);
					$collectionupdate->save();
				}
				else{
					$collectioninsert=Mage::getModel('customerpartner/saleperpartner');
					$collectioninsert->setmageuserid($customer->getId());
					$collectioninsert->setcommision($wholedata['commision']);
					$collectioninsert->save();
				}
			}else{
				if($partner_type==1){
					$collectionassign = Mage::getModel('customerpartner/user')->load($autoid);
					$collectionassign->setwantpartner(1);
					$collectionassign->setpartnerstatus('Partner');
					$collectionassign->save();
					$productcollection = Mage::getModel("customerpartner/product")->getCollection()
				   								->addFieldToFilter("userid",$wholedata['indexid'])
				   								->addFieldToFilter("status",1);
					foreach ($productcollection as $product) {
						$proid = $product->getMageproductid();
						$mage_product = Mage::getModel("catalog/product")->load($proid);
						$mage_product->setStatus(1);
						$mage_product->save();
					}
					$emailTemp = Mage::getModel('core/email_template')->loadDefault('partnerapprove');
					$emailTempVariables = array();				
					$adminEmail = Mage::getStoreConfig('customerpartner/customerpartner_options/adminemail',Mage::app()->getStore()->getId());
					$adminUsername = 'Administrator';
					$emailTempVariables['customername'] = $customer->getName();
					$emailTempVariables['loginurl'] = Mage::helper('customer')->getLoginUrl();
					$processedTemplate = $emailTemp->getProcessedTemplate($emailTempVariables);
					$emailTemp->setSenderName($adminUsername);
					$emailTemp->setSenderEmail($adminEmail);
					$emailTemp->send($customer->getEmail(),$Username,$emailTempVariables);
				}
			}
		}

		public function massispartner($wholedata){
			$productstatus = Mage::getStoreConfig("customerpartner/customerpartner_options/productstatus",Mage::app()->getStore()->getId());
			foreach($wholedata["customer"] as $key){
				$user_model = Mage::getModel("customerpartner/user");
				$collection = $user_model->getCollection()->addFieldToFilter("mageuserid",$key)->getData();
				$model = $user_model->load($collection[0]["autoid"]);
				$model->setwantpartner(1);
				$model->setpartnerstatus("Partner");
				$model->save();
				$productcollection = Mage::getModel("customerpartner/product")->getCollection()
				   								->addFieldToFilter("userid",$key)
				   								->addFieldToFilter("status",1);
				foreach ($productcollection as $product) {
					$proid = $product->getMageproductid();
					$mage_product = Mage::getModel("catalog/product")->load($proid);
					$mage_product->setStatus(1);
					$mage_product->save();
				}
				$customer = Mage::getModel('customer/customer')->load($key);	
				$emailTemp = Mage::getModel('core/email_template')->loadDefault('partnerapprove');
				$emailTempVariables = array();				
				$adminEmail = Mage::getStoreConfig('customerpartner/customerpartner_options/adminemail',Mage::app()->getStore()->getId());
				$adminUsername = 'Administrator';
				$emailTempVariables['customername'] = $customer->getName();
				$emailTempVariables['loginurl'] = Mage::helper('customer')->getLoginUrl();
				$processedTemplate = $emailTemp->getProcessedTemplate($emailTempVariables);
				$emailTemp->setSenderName($adminUsername);
				$emailTemp->setSenderEmail($adminEmail);
				$emailTemp->send($customer->getEmail(),$Username,$emailTempVariables);		
			}		
		}

		public function massisnotpartner($wholedata){
			$productstatus = Mage::getStoreConfig("customerpartner/customerpartner_options/productstatus",Mage::app()->getStore()->getId()); 
			foreach($wholedata["customer"] as $key){
				$user_model = Mage::getModel("customerpartner/user");
				$collection = $user_model->getCollection()->addFieldToFilter("mageuserid",$key)->getData();
				$model = $user_model->load($collection[0]["autoid"]);
				$model->setwantpartner(0);
				$model->setpartnerstatus('Default User');
				$model->save();
				if($productstatus == 3){
					$productcollection = Mage::getModel("customerpartner/product")->getCollection()
			   								->addFieldToFilter("userid",$key);
					foreach ($productcollection as $product) {
						$proid = $product->getMageproductid();
						$mage_product = Mage::getModel("catalog/product")->load($proid);
						$mage_product->delete();
						Mage::getModel("customerpartner/product")->load($product["index_id"])->delete();
					}
				}
				if($productstatus == 2){
					$productcollection = Mage::getModel("customerpartner/product")->getCollection()
			   								->addFieldToFilter("userid",$key);
					foreach ($productcollection as $product) {
						$proid = $product->getMageproductid();
						$mage_product = Mage::getModel("catalog/product")->load($proid);
						$mage_product->setStatus(2);
						$mage_product->save();
					}
				}
				$customer = Mage::getModel('customer/customer')->load($key);	
				$emailTemp = Mage::getModel('core/email_template')->loadDefault('partnerdisapprove');
				$emailTempVariables = array();				
				$adminEmail = Mage::getStoreConfig('customerpartner/customerpartner_options/adminemail',Mage::app()->getStore()->getId());
				$adminUsername = 'Administrator';
				$emailTempVariables['customername'] = $customer->getName();
				$emailTempVariables['loginurl'] = Mage::helper('customer')->getLoginUrl();
				$processedTemplate = $emailTemp->getProcessedTemplate($emailTempVariables);
				$emailTemp->setSenderName($adminUsername);
				$emailTemp->setSenderEmail($adminEmail);
				$emailTemp->send($customer->getEmail(),$Username,$emailTempVariables);
			}		
		}	

		public function isPartner(){
			$partnerId = Mage::getSingleton("customer/session")->getCustomerId();
			$collection = Mage::getModel("customerpartner/user")->getCollection()->addFieldToFilter("mageuserid",$partnerId)->getData();
			return $collection[0];
		}

		public function isRightPartner($productid)	{
			$customerid = Mage::getSingleton("customer/session")->getCustomerId();
			$data = 0;
			$product = Mage::getModel("customerpartner/product")->getCollection()->addFieldToFilter("userid",$customerid)
						->addFieldToFilter("mageproductid",$productid);
			foreach($product as $record)
				$data = 1;
			return $data;
		}

		public function getpaymentmode(){
			$partnerId = Mage::registry("current_customer");
			$collection = Mage::getModel("customerpartner/user")->getCollection();
	        $collection->addFieldToFilter("mageuserid",$partnerId);
			foreach($collection as $record)
				$data = $record->getPaymentsource();
			return $data;
		}

		public function assignProduct($customer,$sid){
			$product = Mage::getModel("catalog/product")->load($sid);
			if($product->getname())	{   
				$collection = Mage::getModel("customerpartner/product")->getCollection()->addFieldToFilter("mageproductid",array("eq" => $sid));
				foreach($collection as $coll)
				   $userid = $coll["userid"];
				if($userid)
					Mage::getSingleton("adminhtml/session")->addError(Mage::helper("customerpartner")->__("The Product Is Already Assign To Other Partner"));
				else 	{
					$collection1 = Mage::getModel("customerpartner/product");
					$collection1->setMageproductid($sid);
					$collection1->setUserid($customer->getId());
					$collection1->setStatus($product->getStatus());
					$collection1->setWebsiteIds(array(Mage::app()->getStore()->getStoreId()));
					$collection1->save();
					Mage::getSingleton("adminhtml/session")->addSuccess(Mage::helper("customerpartner")->__("The Product Is Been Assigned To Partner"));
				}
			} else
				Mage::getSingleton("adminhtml/session")->addNotice(Mage::helper("customerpartner")->__("The Product Doesn't Exist"));
		}

	}