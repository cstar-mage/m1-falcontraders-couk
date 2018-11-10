<?php
	Class Webkul_CustomerPartner_Model_Event_Observer {

		public function CustomerRegister($observer)		{
			$data = Mage::getSingleton("core/app")->getRequest();
			if($data->getParam("wanttopartner") == 1)	{
				$customer = $observer->getCustomer();
				Mage::getModel("customerpartner/user")->getRegisterDetail($customer);
				$emailTemp = Mage::getModel('core/email_template')->loadDefault('partnerrequest');
				$emailTempVariables = array();				
				$toadminEmail = Mage::getStoreConfig('customerpartner/customerpartner_options/adminemail',Mage::app()->getStore()->getId());
				$toadminUsername = 'Administrator';
				$status = Mage::getStoreConfig('customerpartner/customerpartner_options/partner_approval',Mage::app()->getStore()->getId()) ? 2 : 1;
				if($status==2)
					$emailTempVariables['content'] = Mage::helper("customerpartner")->__('This is to inform you that I requested to subscribe as a partner. Please approve me as soon as posible ');
				else
					$emailTempVariables['content'] = Mage::helper("customerpartner")->__('This is to inform you that I subscribed as a partner at your store.');				
				$processedTemplate = $emailTemp->getProcessedTemplate($emailTempVariables);
				$emailTemp->setSenderName($customer->getName());
				$emailTemp->setSenderEmail($customer->getEmail());
				$emailTemp->send($toadminEmail,$toadminUsername,$emailTempVariables);
			}
		}

		public function DeleteProduct($observer) {
			Mage::getSingleton('core/session', array('name' => 'adminhtml')); 
			if(Mage::getSingleton('admin/session')->isLoggedIn()){
				$proid = $observer->getProduct()->getId();
				$collection = Mage::getModel("customerpartner/product")->getCollection()->addFieldToFilter("mageproductid",$proid);
				foreach($collection as $data){
					$userid = $data["userid"];
					Mage::getModel("customerpartner/product")->load($data["index_id"])->delete();
				}

				$mage_product =$observer->getProduct();
				$category=$mage_product->getCategoryIds();
				$catname = array();
				foreach ($category as $catid) {
					array_push($catname, Mage::getModel("catalog/category")->load($catid)->getName());
				}
				$categoryname = implode(',', $catname);

				$fromname = "Administrator";
		        $frommail = Mage::getStoreConfig('customerpartner/customerpartner_options/adminemail',Mage::app()->getStore()->getId());
				$seller = Mage::getModel("customer/customer")->load($userid);
				$emailTemp = Mage::getModel("core/email_template")->loadDefault("productdeletemail");
				$emailTempVariables = array();
				$emailTempVariables["productname"] = $mage_product->getName();
				$emailTempVariables["productid"] = $proid;
				$emailTempVariables["productprice"] = Mage::app()->getStore()->formatPrice($mage_product->getPrice());
				$emailTempVariables["productcategories"] = $categoryname;
				$emailTempVariables["toname"] = $seller->getname();
				$processedTemplate = $emailTemp->getProcessedTemplate($emailTempVariables);
				$emailTemp->setSenderName($fromname);
				$emailTemp->setSenderEmail($frommail);
				$emailTemp->send($seller->getemail(),$seller->getname(),$emailTempVariables);
			}
		}

		public function afterPlaceOrder($observer) { 
			$lastOrderId = $observer->getOrderIds();
			$order = Mage::getModel("sales/order")->load($lastOrderId);
			Mage::getModel("customerpartner/saleslist")->getProductSalesCalculation($order);	
		}
		
		public function afterSaveCustomer($observer){
			$customer = $observer->getCustomer();
			$customerid = $customer->getId();
			$collection = Mage::getModel("customerpartner/user")->getCollection()->addFieldToFilter("mageuserid",$customerid)->getData();
			if($collection[0]['wantpartner'] == 1){
				$data = $observer->getRequest();
				$sid = $data->getParam("sellerassignproid");
				$partner_type = $data->getParam("partnertype");
				if($partner_type == 0)	{
					$collectionselectdelete = Mage::getModel("customerpartner/user")->getCollection();
					$collectionselectdelete->addFieldToFilter("mageuserid",array($customerid));
					foreach($collectionselectdelete as $delete)
						$autoid = $delete->getautoid();
					$collectiondelete = Mage::getModel("customerpartner/user")->load($autoid);
					$collectiondelete->delete();
					$customer = Mage::getModel('customer/customer')->load($customerid);	
					$emailTemp = Mage::getModel('core/email_template')->loadDefault('partnerdisapprove');
					$emailTempVariables = array();				
					$frommail=Mage::getStoreConfig('customerpartner/customerpartner_options/adminemail',Mage::app()->getStore()->getId());
					$fromname = 'Administrator';
					$emailTempVariables['customername'] = $customer->getName();
					$emailTempVariables['loginurl'] = Mage::helper('customer')->getLoginUrl();
					$processedTemplate = $emailTemp->getProcessedTemplate($emailTempVariables);
					$emailTemp->setSenderName($fromname);
					$emailTemp->setSenderEmail($frommail);
					$emailTemp->send($customer->getEmail(),$Username,$emailTempVariables);			
				}
				if($sid > 0)
					Mage::getModel("customerpartner/user")->assignProduct($customer,$sid);
				$wholedata = $data->getParams();
				$collectionselect = Mage::getModel("customerpartner/saleperpartner")->getCollection();
				$collectionselect->getSelect()->where("mageuserid =".$customer->getId());
				if(count($collectionselect) == 1){
				    foreach($collectionselect as $verifyrow)
						$autoid = $verifyrow->getautoid();					
					$collectionupdate = Mage::getModel("customerpartner/saleperpartner")->load($autoid);
					$collectionupdate->setcommision($wholedata["commision"]);
					$collectionupdate->save();
				}
				else{
					$collectioninsert = Mage::getModel("customerpartner/saleperpartner");
					$collectioninsert->setmageuserid($customer->getId());
					$collectioninsert->setcommision($wholedata["commision"]);
					$collectioninsert->save();
				}
			}
	        else{
				$data=$observer->getRequest();
				$partner_type = $data->getParam("partnertype");
				$wholedata = $data->getParams();
				if($partner_type == 1)	{
					$collectionselect = Mage::getModel("customerpartner/user")->getCollection();
					$collectionselect->addFieldToFilter("mageuserid",array($customer->getId()));
					if(count($collectionselect) >= 1){
						foreach($collectionselect as $coll){
							$coll->setWantpartner("1");
							$coll->setpartnerstatus("Partner");
							$coll->save();
						}
					}	
					else{
						$collection = Mage::getModel("customerpartner/user");
						$collection->setfirstname($customer->getFirstname());
						$collection->setlastname($customer->getLastname());
						$collection->setwantpartner(1);
						$collection->setpartnerstatus("Partner");
						$collection->setemail($customer->getEmail());
						$collection->setmageuserid($customer->getId());
						$collection->save();
					}
					$customer = Mage::getModel('customer/customer')->load($customerid);
					$emailTemp = Mage::getModel('core/email_template')->loadDefault('partnerapprove');
					$emailTempVariables = array();				
					$fromemail=Mage::getStoreConfig('customerpartner/customerpartner_options/adminemail',Mage::app()->getStore()->getId());
					$fromname = 'Administrator';
					$emailTempVariables['customername'] = $customer->getName();
					$emailTempVariables['loginurl'] = Mage::helper('customer')->getLoginUrl();
					$processedTemplate = $emailTemp->getProcessedTemplate($emailTempVariables);
					$emailTemp->setSenderName($fromname);
					$emailTemp->setSenderEmail($fromemail);
					$emailTemp->send($customer->getEmail(),$Username,$emailTempVariables);
				}
			}
		}
		
		public function checkInvoiceSubmit($observer) {
			$event = $observer->getEvent()->getInvoice();
			$orderinfo = "<table cellspacing='0' cellpadding='0' border='0' width='650'>
							<thead>
								<tr>
									<th align='left' width='162' bgcolor='#EAEAEA' style='font-size:13px;line-height:1em;'>".Mage::helper("customerpartner")->__('Item')."</th>
									<th align='left' width='162' bgcolor='#EAEAEA' style='font-size:13px;line-height:1em;'>".Mage::helper("customerpartner")->__('Sku')."</th>
									<th align='left' width='162' bgcolor='#EAEAEA' style='font-size:13px;line-height:1em;'>".Mage::helper("customerpartner")->__('Qty')."</th>
									<th align='left' width='162' bgcolor='#EAEAEA' style='font-size:13px;line-height:1em;'>".Mage::helper("customerpartner")->__('Subtotal')."</th>
								</tr>
							</thead>
						<tbody>";
			$usercollections = Mage::getModel("customerpartner/saleslist")->getCollection()
			                ->addFieldToFilter("mageorderid",$event->getOrderId())
			                ->addFieldToSelect('mageproownerid')
							->distinct(true);
			foreach($usercollections as $usercollection){				
				$_collection = Mage::getModel("customerpartner/saleslist")->getCollection()
			                ->addFieldToFilter("mageorderid",$event->getOrderId())
			                ->addFieldToFilter("mageproownerid",$usercollection->getMageproownerid());
			    foreach($_collection as $collection){
					$data = array("cpprostatus"=>1);
					$model = Mage::getModel("customerpartner/saleslist")->load($collection->getId())->addData($data);
					$model->setId($collection->getId())->save();
					$fetchsale = Mage::getModel("customerpartner/saleslist")->getCollection();
					$fetchsale->addFieldToFilter("mageorderid",$event->getOrderId());	
					$fetchsale->addFieldToFilter("mageproownerid",$collection->getMageproownerid());
					$totalprice = "";			
					$orderinfo = "<table cellspacing='0' cellpadding='0' style='border:1px solid #eaeaea;' width='650'>
									<thead>
										<tr>
											<th align='left' bgcolor='#EAEAEA' style='font-size:13px;padding:3px 9px'>".Mage::helper("customerpartner")->__('Item')."</th>
											<th align='left' bgcolor='#EAEAEA' style='font-size:13px;padding:3px 9px'>".Mage::helper("customerpartner")->__('Sku')."</th>
											<th align='left' bgcolor='#EAEAEA' style='font-size:13px;padding:3px 9px'>".Mage::helper("customerpartner")->__('Qty')."</th>
											<th align='left' bgcolor='#EAEAEA' style='font-size:13px;padding:3px 9px'>".Mage::helper("customerpartner")->__('Subtotal')."</th>
										</tr>
									</thead>
								<tbody bgcolor='#F6F6F6'>";							
					foreach($fetchsale as $res){
						$orderinfo = $orderinfo."<tr>
											<td valign='top' align='left' style='font-size:11px;padding:3px 9px;border-bottom:1px dotted #cccccc' >".$res['mageproname']."</td>
											<td valign='top' align='left' style='font-size:11px;padding:3px 9px;border-bottom:1px dotted #cccccc' >".Mage::getModel('catalog/product')->load($res['mageproid'])->getSku()."</td>
											<td valign='top' align='left' style='font-size:11px;padding:3px 9px;border-bottom:1px dotted #cccccc'>".$res['magequantity']."</td>
											<td valign='top' align='left' style='font-size:11px;padding:3px 9px;border-bottom:1px dotted #cccccc'>".Mage::app()->getStore()->formatPrice($res['mageproprice'])."</td>
											</tr>";	
						$totalprice = $totalprice+$res["mageproprice"];
						$magerealorderid = $res["magerealorderid"];
						$cleared_at = $res["cleared_at"];
						$userdata = Mage::getModel("customer/customer")->load($res["mageproownerid"]);				
						$Username = $userdata["firstname"];
						$useremail = $userdata["email"];		
					}
					$order = Mage::getModel("sales/order")->load($event->getOrderId());
					$shipcharge = $order->getShippingAmount();
					$orderinfo = $orderinfo."</tbody>
												<tbody>
													<tr>
														<td align='right' style='padding:3px 9px' colspan='3'>".Mage::helper("customerpartner")->__('Grandtotal')."</td>
														<td align='right' style='padding:3px 9px' colspan='3'><span>".Mage::app()->getStore()->formatPrice($totalprice)."</span></td>
													</tr>
												</tbody>
											</table>";						
					$billingId = $order->getBillingAddress()->getId();
					$billaddress = Mage::getModel("sales/order_address")->load($billingId);
					$billinginfo = $billaddress["firstname"]."<br>".$billaddress["street"]."<br>".$billaddress["city"]." ".$billaddress["region"]." ".$billaddress["postcode"]."<br>".Mage::getModel("directory/country")->load($billaddress["country_id"])->getName()."<br>T:".$billaddress["telephone"];				
					$payment = $order->getPayment()->getMethodInstance()->getTitle();
					if($order->getShippingAddress())	{
						$shippingId = $order->getShippingAddress()->getId();
						$address = Mage::getModel("sales/order_address")->load($shippingId);				
						$shippinginfo = $address["firstname"]."<br>".$address["street"]."<br>".$address["city"]." ".$address["region"]." ".$address["postcode"]."<br>".Mage::getModel("directory/country")->load($address["country_id"])->getName()."<br>T:".$address["telephone"];	
						$shipping = $order->getShippingDescription();	
						$shippinfo = 	"<table cellspacing='0' cellpadding='0' border='0' width='650'>
											<thead>
												<tr>
													<th align='left' width='325' bgcolor='#EAEAEA' style='font-size:13px;padding:5px 9px 6px 9px;line-height:1em;'>".Mage::helper("customerpartner")->__('Shipping Information').":</th>
													<th width='10'></th>
													<th align='left' width='325' bgcolor='#EAEAEA' style='font-size:13px;padding:5px 9px 6px 9px;line-height:1em;'>".Mage::helper("customerpartner")->__('Shipping Method').":</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td valign='top' style='font-size:12px;padding:7px 9px 9px 9px;border-left:1px solid #EAEAEA;border-bottom:1px solid #EAEAEA;border-right:1px solid #EAEAEA;'>
														".$shippinginfo."&nbsp;</td>
													<td>&nbsp;</td>
													<td valign='top' style='font-size:12px;padding:7px 9px 9px 9px;border-left:1px solid #EAEAEA;border-bottom:1px solid #EAEAEA;border-right:1px solid #EAEAEA;'>
														".$shipping."&nbsp;</td>
												</tr>
											</tbody>
										</table>";		
					}
				}		
				$emailTemp = Mage::getModel("core/email_template")->loadDefault("orderinvoice");				
				$emailTempVariables = array();
				$adminEmail = Mage::getStoreConfig('customerpartner/customerpartner_options/adminemail',Mage::app()->getStore()->getId());
				$adminUsername = "Administrator";				

				$emailTempVariables["orderrealid"] = $magerealorderid;
				$emailTempVariables["orderdate"] = $cleared_at;
				$emailTempVariables["billinginfo"] = $billinginfo;
				$emailTempVariables["payment"] = $payment;
				$emailTempVariables["skippinginfo"] = $shippinfo;
				$emailTempVariables["oderinfo"] = $orderinfo;
				$emailTempVariables["toname"] = $Username;				
				$processedTemplate = $emailTemp->getProcessedTemplate($emailTempVariables);				
				$emailTemp->setSenderName($adminUsername);
				$emailTemp->setSenderEmail($adminEmail);
				$emailTemp->send($useremail,$Username,$emailTempVariables);
			}	
		}

		public function cancelorder($observer){
			// echo "<pre>";
			$percent = Mage::getStoreConfig("customerpartner/customerpartner_options/commission_percent");
			$order = $observer->getOrder();
			// print_r($order->getData());
			foreach($order->getAllItems() as $item){
				$price = $item->getPrice();
				// $seller_id = '';
				$collection_product = Mage::getModel("customerpartner/product")->getCollection()->addFieldToFilter("mageproductid",$item->getProductId());
				foreach($collection_product as $selid)
					$seller_id = $selid->getuserid();

				$collection1 = Mage::getModel("customerpartner/saleperpartner")->getCollection();
				$collection1->addFieldToFilter("mageuserid",array("eq" => $seller_id));
				$totalamount=$item->getQtyToInvoice()*$item->getPrice();
				if(count($collection1) != 0){
					foreach($collection1 as $rowdatasale) {
						if($rowdatasale->getcommision()>0)
							$commision=($totalamount*$rowdatasale->getcommision())/100;
						else
						if($percent>=0)
							$commision=($totalamount*$percent)/100;
					}
				}
				else
					$commision = ($totalamount*$percent)/100;
				if($seller_id){		
					$actparterprocost = $totalamount-$commision;
				}
				$collection_list = Mage::getModel("customerpartner/saleslist")->getCollection()->addFieldToFilter("mageproid",$item->getProductId())->addFieldToFilter("magerealorderid",$order->getData('increment_id'));
				$collection_list=$collection_list->getData();
				foreach($collection1 as $rowdatasale) {
					$rowdatasale->settotalsale($rowdatasale->gettotalsale()-floor($collection_list[0]['totalamount']));
					$rowdatasale->setamountremain($rowdatasale->getamountremain()-floor($collection_list[0]['actualparterprocost']))->save();
				}
			}
		}			
	}