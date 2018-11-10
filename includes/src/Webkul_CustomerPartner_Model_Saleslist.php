<?php
	class Webkul_CustomerPartner_Model_Saleslist extends Mage_Core_Model_Abstract	{

	    public function _construct()	    {
	        parent::_construct();
	        $this->_init("customerpartner/saleslist");
	    }

		public function getProductSalesCalculation($order){
			$percent = Mage::getStoreConfig("customerpartner/customerpartner_options/commission_percent");
			$lastOrderId = $order->getId();
			foreach($order->getAllItems() as $item){
				$temp = $item->getProductOptions();
				$price = $item->getPrice();
				$seller_id = '';
				$collection_product = Mage::getModel("customerpartner/product")->getCollection()->addFieldToFilter("mageproductid",$item->getProductId());
				foreach($collection_product as $selid)
					$seller_id = $selid->getuserid();
				if($seller_id == "")
					$seller_id=0;
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
					$collectionsave = Mage::getModel("customerpartner/saleslist");
					$collectionsave->setmageproid($item->getProductId());
					$collectionsave->setmageorderid($lastOrderId);
					$collectionsave->setmagerealorderid($order->getIncrementId());
					$collectionsave->setmagequantity($item->getQtyToInvoice());
					$collectionsave->setmageproownerid($seller_id);
					$collectionsave->setcpprostatus(0);
					$collectionsave->setmagebuyerid(Mage::getSingleton("customer/session")->getCustomer()->getId());
					$collectionsave->setmageproprice($item->getPrice());
					$collectionsave->setmageproname($item->getName());
					if($totalamount!=0)
						$collectionsave->settotalamount($totalamount);
					else
						$collectionsave->settotalamount($price);
					$collectionsave->settotalcommision($commision);
					$collectionsave->setactualparterprocost($actparterprocost);
					$collectionsave->setcleared_at(date("Y-m-d H:i:s"));
					$collectionsave->save();
					$collectionverifyread = Mage::getModel("customerpartner/saleperpartner")->getCollection();
					$collectionverifyread->addFieldToFilter("mageuserid",array("eq" => $seller_id));
					if(count($collectionverifyread) >= 1){
						foreach($collectionverifyread as $verifyrow){
							$totalsale = $verifyrow->gettotalsale() + $price;
							$totalremain = $verifyrow->getamountremain() + $actparterprocost;
							$verifyrow->settotalsale($totalsale);
							$verifyrow->setamountremain($totalremain);
							$verifyrow->save();								
						}			
					}
					else{
						$collectionf = Mage::getModel("customerpartner/saleperpartner");
						$collectionf->setmageuserid($seller_id);
						$collectionf->settotalsale($totalamount);
						$collectionf->setamountremain($actparterprocost);
						$collectionf->save();	
					}
				}
			}
		}

		public function getSalesdetail($mageproid){
			$orders = Mage::getResourceModel('sales/order_collection')->addFieldToFilter('status', 'canceled');
		    $orderids = array();
		     $orderids[] = '00000';
		    foreach ($orders as $value) {
		    	$orderids[] = $value->getData('increment_id');
		    }
			$data = array();$sum = 0;$arr = array();
			$quantity = Mage::getModel("customerpartner/saleslist")->getCollection()->addFieldToFilter('magerealorderid',array('nin'=>$orderids))->addFieldToFilter("mageproid",$mageproid);
			$quantity->getSelect()->columns("SUM(magequantity) AS qty")->group("mageproid");
			foreach($quantity as $rec) {
				$status = $rec->getCpprostatus();
				$qty = $rec->getQty();
				if($status == 1){
					if($qty)
						$data["quantitysoldconfirmed"] = $qty;
					else
						$data["quantitysoldconfirmed"] = 0;
				}
				else if($status == 0){
					if($qty)
						$data["quantitysoldpending"] = $qty;
					else
						$data["quantitysoldpending"] = 0;
				}
			}			
			$amountearned = Mage::getModel("customerpartner/saleslist")->getCollection()->addFieldToFilter('magerealorderid',array('nin'=>$orderids));
			$amountearned->getSelect()->where("mageproid =".$mageproid);
			foreach($amountearned as $rec) {
				$sum = $sum + $rec->getactualparterprocost();
				$arr[] = $rec->getClearedAt();
			}
			$data["amountearned"] = $sum;$data["clearedat"] = $arr;			
			$quantitysold = Mage::getModel("customerpartner/saleslist")->getCollection()->addFieldToFilter("mageproid",$mageproid)->addFieldToFilter('magerealorderid',array('nin'=>$orderids));
			$quantitysold->getSelect()->columns("SUM(magequantity) AS qty")->group("mageproid");
			foreach($quantitysold as $rec) {
				$qty = $rec->getQty();	
				if($qty)
					$data["quantitysold"] = $qty;
				else
					$data["quantitysold"] = 0;
			}
			if($data["quantitysold"] == "")
				$data["quantitysold"] = 0;
			if($data["quantitysoldpending"] == "")
				$data["quantitysoldpending"] = 0;
			if($data["quantitysoldconfirmed"] == "")
				$data["quantitysoldconfirmed"] = 0;
			return $data;
		}

		public function createdAt($mageproid){
			$arr = array();
			$collection = Mage::getModel("catalog/product")->getCollection();
			$collection->addFieldToFilter("entity_id",$mageproid);
			foreach($collection as $rec)
				$arr[] = $rec->getCreatedAt();
			return $arr;
		}

		public function getDateDetail() 	{
			$orders = Mage::getResourceModel('sales/order_collection')->addFieldToFilter('status', 'canceled');
		    $orderids = array();
		     $orderids[] = '00000';
		    foreach ($orders as $value) {
		    	$orderids[] = $value->getData('increment_id');
		    }

			$cidvar = Mage::getSingleton("customer/session")->getId(); 
		    $collection1 = Mage::getModel("customerpartner/saleslist")->getCollection()->addFieldToFilter('magerealorderid',array('nin'=>$orderids))
										->addFieldToFilter("mageproownerid",$cidvar);
		    $collection2 = Mage::getModel("customerpartner/saleslist")->getCollection()->addFieldToFilter('magerealorderid',array('nin'=>$orderids))
										->addFieldToFilter("mageproownerid",$cidvar);
		    $collection3 = Mage::getModel("customerpartner/saleslist")->getCollection()->addFieldToFilter('magerealorderid',array('nin'=>$orderids))
										->addFieldToFilter("mageproownerid",$cidvar);
			$first_day_of_week = date("Y-m-d", strtotime("Last Monday", time()));
			$last_day_of_week = date("Y-m-d", strtotime("Next Sunday", time()));
		    $month = $collection1->addFieldToFilter("cleared_at", array("datetime" => true,"from" => date("Y-m")."-01 00:00:00","to" => date("Y-m")."-31 23:59:59"));
		    $week = $collection2->addFieldToFilter("cleared_at", array("datetime" => true,"from" => $first_day_of_week." 00:00:00","to" => $last_day_of_week." 23:59:59"));
		    $day = $collection3->addFieldToFilter("cleared_at", array("datetime" => true,"from" => date("Y-m-d")." 00:00:00","to" => date("Y-m-d")." 23:59:59"));
		    $sale1 = 0;
			foreach($collection as $record)			
				$sale1 = $sale1 + $record->gettotalamount();
			$data["year"] = $sale1;
			$sale1 = 0;
			foreach($day as $record1)
				$sale1 = $sale1 + $record1->gettotalamount();
			$data["day"] = $sale1;
			$sale2 = 0;
			foreach($month as $record2)
				$sale2 = $sale2 + $record2->gettotalamount();
			$data["month"] = $sale2;
			$sale3 = 0;
			foreach($week as $record3)
				$sale3 = $sale3 + $record3->gettotalamount();
			$data["week"] = $sale3;
			return $data;
		}

		public function getMonthlysale(){
			$orders = Mage::getResourceModel('sales/order_collection')->addFieldToFilter('status', 'canceled');
		    $orderids = array();
		     $orderids[] = '00000';
		    foreach ($orders as $value) {
		    	$orderids[] = $value->getData('increment_id');
		    }
			$customerid = Mage::getSingleton("customer/session")->getId();
			$data = array();	
			for($i = 1 ; $i <= 12 ; $i++){
				$date1 = date("Y")."-".$i."-01 00:00:00";
				$date2 = date("Y")."-".$i."-31 23:59:59";
				$collection = Mage::getModel("customerpartner/saleslist")->getCollection()->addFieldToFilter('magerealorderid',array('nin'=>$orderids));
				$collection = $collection->addFieldToFilter("mageproownerid",$customerid);
				$collection = $collection->addFieldToFilter("cleared_at", array("datetime" =>true,"from" =>  $date1,"to" =>  $date2));
				$sum = array();$temp = 0;
				foreach ($collection as $record)
					$temp = $temp + $record->getactualparterprocost();
				$data[$i] = $temp;
			}
			return json_encode($data);	
		}

		public function getOrderdetails(){

			$customerid = Mage::getSingleton("customer/session")->getId();
			$collection = Mage::getModel("customerpartner/saleslist")->getCollection();
			$collection->addFieldToFilter("mageproownerid",array("eq" => $customerid))->setOrder("autoid","DESC");
			$userorder = array();$gropoid = array();$groporderid = array();$productname = array();$i = 0;
			foreach ($collection as $record) {
				$i++;
				if($i <= 5){
					if($record->getmagerealorderid() == $gropoid[$i-1]){
						$i--;
						$productid = $productid.",".$record->getmageproid();
						$productname = $productname.",".$record->getmageproname()." X ".$record->getmagequantity();
						$pprice = $pprice + $record->getactualparterprocost();
						$userorder[$i] = array("mageproid"=>$productid,
												"mageorderid"=>$record->getmageorderid(),
												"magerealorderid"=>$record->getmagerealorderid(),
												"mageproname"=>$productname,
												"actualparterprocost"=>$pprice,
												"cleared_at"=>$record->getcleared_at()
												);			
					}
					else{
						$productname = $record->getmageproname()." X ".$record->getmagequantity();
						$productid = $record->getmageproid();
						$pprice = $record->getactualparterprocost();
						$groporderid[$i] = $record->getmageorderid();
						$gropoid[$i] = $record->getmagerealorderid();
						$userorder[$i] = array("mageproid"=>$record->getmageproid(),
											"mageorderid"=>$record->getmageorderid(),
											"magerealorderid"=>$record->getmagerealorderid(),
											"mageproname"=>$productname,
											"actualparterprocost"=>$pprice,
											"cleared_at"=>$record->getcleared_at()
											);
					}
				}
			}
			return $userorder;
		}

		public function getPaymentDetailById(){
			$customerid = Mage::getSingleton("customer/session")->getId();
			$collection = Mage::getModel("customerpartner/user")->getCollection();
			$collection->addFieldToFilter("mageuserid",$customerid);
			foreach($collection as $row)
				$paymentsource = $row->getPaymentsource();
			return $paymentsource;
		}
		
		public function getallOrderdetails(){
			$userid = Mage::getSingleton("customer/session")->getId();
			$collection = Mage::getModel("customerpartner/saleslist")->getCollection()->addFieldToFilter("mageproownerid",$userid);
			$userorder = array();$gropoid = array();$groporderid = array();$productname = array();$i = 0;
			foreach($collection as $record) {
				$i++;
				if($i<=10){				
					if($record->getmagerealorderid() == $gropoid[$i-1]){
						$i--;
						$productid = $productid.",".$record->getmageproid();
						$productname = $productname.",".$record->getmageproname()." X ".$record->getmagequantity();
						$pprice = $pprice + $record->getactualparterprocost();
						$userorder[$i] = array("mageproid"=>$productid,
												"mageorderid"=>$record->getmageorderid(),
												"magerealorderid"=>$record->getmagerealorderid(),
												"mageproname"=>$productname,
												"actualparterprocost"=>$pprice,
												"cleared_at"=>$record->getcleared_at()
												);			
					}
					else{
						$productname = $record->getmageproname()." X ".$record->getmagequantity();
						$productid = $record->getmageproid();
						$pprice = $record->getactualparterprocost();
						$groporderid[$i] = $record->getmageorderid();
						$gropoid[$i] = $record->getmagerealorderid();
						$userorder[$i] = array("mageproid" => $record->getmageproid(),
											"mageorderid" => $record->getmageorderid(),
											"magerealorderid" => $record->getmagerealorderid(),
											"mageproname" => $productname,
											"actualparterprocost" => $pprice,
											"cleared_at" => $record->getcleared_at()
											);
					}
				}
			}
			return $userorder;
		}
	}