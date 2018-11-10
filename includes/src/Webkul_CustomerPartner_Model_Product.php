<?php

	class Webkul_CustomerPartner_Model_Product extends Mage_Core_Model_Abstract		{

	    public function _construct()    {
	        parent::_construct();
	        $this->_init("customerpartner/product");
	    }

		public function SaveNewProduct($wholedata)	{
			$entity_type_id = Mage::getModel("eav/entity")->setType("catalog_product")->getTypeId();
			$status = Mage::getStoreConfig("customerpartner/customerpartner_options/product_approval",Mage::app()->getStore()->getId()) ? 2 : 1;
			$file = new Varien_Io_File();
			$attribute_set_id = Mage::getStoreConfig("customerpartner/customerpartner_options/attributeset_id",Mage::app()->getStore()->getId());
			$customer_id = Mage::getSingleton("customer/session")->getId();
			if($attribute_set_id == ""){
				$attribute_set_collection = Mage::getModel("eav/entity_attribute_set")->getCollection()->setEntityTypeFilter($entity_type_id);
				foreach($attribute_set_collection as $attribute_set){
					if($attribute_set->getData("attribute_set_name") == "Default")
						$attribute_set_id = $attribute_set->getData("attribute_set_id");
				}
			}
			$product = Mage::getModel("catalog/product");
			$product->setData($wholedata);
			$product->setPrice($wholedata["price"]);
			$product->setWeight($wholedata["weight"]);
			$product->setWebsiteIds(array($wholedata["website_id"]));
			$product->setCategoryIds($wholedata["category"]);
			$product->setAttributeSetId($attribute_set_id);
			$product->setStatus($status);
			$product->setTaxClassId(0);
			$lastId = $product->save()->getId();
			$this->SaveStock($lastId,$wholedata["stock"]);
			$cp_product = Mage::getModel("customerpartner/product");
			$cp_product->setmageproductid($lastId);
			$cp_product->setuserid($customer_id);
			$cp_product->setstatus($status);
			$cp_product->setwstoreids($wholedata["store_id"]);
			$cp_product->save();
			$this->AddImages($lastId,$wholedata);					/* setimages of product 	*/
			$wholedata["lastid"] = $lastId;							/* dispatchevent for addons */
		/*	Mage::dispatchEvent("cp_save_addon_data",$wholedata);*/	/* dispatchevent for addons */

			/*mail to admin*/
			$catname = array();
			foreach ($wholedata["category"] as $catid) 
				array_push($catname, Mage::getModel("catalog/category")->load($catid)->getName());
			$categoryname = implode(",", $catname);
			$toadminname = "Administrator";
	        $toadminmail = Mage::getStoreConfig("customerpartner/customerpartner_options/adminemail",Mage::app()->getStore()->getId());
			$seller = Mage::getModel("customer/customer")->load($customer_id);
			$emailTemp = Mage::getModel("core/email_template")->loadDefault("productaddmail");
			$emailTempVariables = array();
			$emailTempVariables["productname"] = $wholedata["name"];
			$emailTempVariables["productid"] = $lastId;
			$emailTempVariables["productprice"] = Mage::app()->getStore()->formatPrice($wholedata["price"]);
			$emailTempVariables["productcategories"] = $categoryname;
			$emailTempVariables["toname"] = $toadminname;
			if($status == 2)
				$emailTempVariables["displaymsg"] = Mage::helper("customerpartner")->__("I would like to inform you that I have added a product in your store please approve it as soon as posible. Product details are given below.");
			else
				$emailTempVariables["displaymsg"] = Mage::helper("customerpartner")->__("I would like to inform you that I have added a product in your store. Product details are given below.");
			$processedTemplate = $emailTemp->getProcessedTemplate($emailTempVariables);
			$emailTemp->setSenderName($seller->getname());
			$emailTemp->setSenderEmail($seller->getemail());
			$emailTemp->send($toadminmail,$toadminname,$emailTempVariables);
		}

		private function SaveStock($lastId,$stock){
			$stockItem = Mage::getModel("cataloginventory/stock_item");
			$stockItem->loadByProduct($lastId);
			if(!$stockItem->getId())
				$stockItem->setProductId($lastId)->setStockId(1);
			$stockItem->setData("is_in_stock", 1);
			$savedStock = $stockItem->save();
			$stockItem->load($savedStock->getId())->setQty($stock)->save();
		}

		private function AddImages($id,$wholedata)	{
			$customer_id = Mage::getSingleton("customer/session")->getId();
			$product = Mage::getModel("catalog/product")->load($id);
			if($wholedata["image_upload"] != ""){
				$file = Mage::getBaseDir()."/media/customerpartner/customerproduct/".$customer_id."/image/";

				foreach($wholedata["image_upload"] as $value){
					$product->addImageToMediaGallery($file.$value, array ('image','small_image','thumbnail'), true, false);
				}
			    Mage::app()->setCurrentStore(Mage_Core_Model_App::ADMIN_STORE_ID);
			}
			$gallery = $product->getMediaGalleryImages();
			if($gallery) {
				foreach($gallery as $_image) {
					$signal = 0;
					if(strpos($_image->getFile(),$wholedata["baseimage"]) !== false){
						$product->setImage($_image->getFile());
						$signal = 1;
					}
					if(strpos($_image->getFile(),$wholedata["smallimage"]) !== false){
						$product->setSmallImage($_image->getFile());
						$signal = 1;
					}
					if(strpos($_image->getFile(),$wholedata["thumbnailimage"]) !== false){
						$product->setThumbnail($_image->getFile());
						$signal = 1;
					}
					// if($signal == 0)

				}
			}
			$product->save();
		}

		public function EditProduct($id,$wholedata)	{
			$file = new Varien_Io_File();
			$wholedata["product_id"] = $id;					 						/* dispatchevent for addons 	*/
			Mage::dispatchEvent("cp_update_delete_tierprice_data",$wholedata);		/* dispatchevent for addons 	*/
			$product = Mage::getModel("catalog/product")->load($id);
			foreach($wholedata as $key => $val)
				$product->setData($key,$val);
			$product->setName($wholedata["name"]);
			$product->setDescription($wholedata["description"]);
			$product->setShortDescription($wholedata["short_description"]);
			$product->setPrice($wholedata["price"]);
			$product->setWeight($wholedata["weight"]);
			if($wholedata["category_edited"] == 1)
				$product->setCategoryIds($wholedata["category"]);
			$product->save();
			$Stock = Mage::getModel("cataloginventory/stock_item")->loadByProduct($id);			
			$Stock->setProductId($id)->setStockId(1);
			$Stock->setData("is_in_stock", 1); 
			$savedStock = $Stock->save();
			$Stock->load($savedStock->getId())->setQty($wholedata["stock"])->save();
			$this->AddImages($id,$wholedata);									/* updating images 				*/			
			Mage::dispatchEvent("cp_update_addon_data",$wholedata);				/* dispatchevent for addons 	*/
			Mage::dispatchEvent("cp_update_set_tierprice_data",$wholedata);		/* dispatchevent for addons 	*/
			/*mail to admin*/
			$catname = array();
			foreach ($wholedata["category"] as $catid)
				array_push($catname, Mage::getModel("catalog/category")->load($catid)->getName());
			$categoryname = implode(",", $catname);
			$userid = Mage::getSingleton("customer/session")->getCustomerId();			

			$toadminname = "Administrator";
	        $toadminmail = Mage::getStoreConfig("customerpartner/customerpartner_options/adminemail",Mage::app()->getStore()->getId());
			$seller = Mage::getModel("customer/customer")->load($userid);
			$emailTemp = Mage::getModel("core/email_template")->loadDefault("producteditmail");
			$emailTempVariables = array();
			$emailTempVariables["productname"] = $wholedata["name"];
			$emailTempVariables["productid"] = $id;
			$emailTempVariables["productprice"] = Mage::app()->getStore()->formatPrice($wholedata["price"]);
			$emailTempVariables["productcategories"] = $categoryname;
			$emailTempVariables["toname"] = $toadminname;
			$processedTemplate = $emailTemp->getProcessedTemplate($emailTempVariables);
			$emailTemp->setSenderName($seller->getname());
			$emailTemp->setSenderEmail($seller->getemail());
			$emailTemp->send($toadminmail,$toadminname,$emailTempVariables);
		}

		public function deleteProduct($id){
			Mage::register("isSecureArea", 1);
	    	Mage::app("default")->setCurrentStore(Mage_Core_Model_App::ADMIN_STORE_ID);
			$mage_product = Mage::getModel("catalog/product")->load($id);
			$proname = $mage_product->getName();
			$proprice = $mage_product->getPrice();
			$category = $mage_product->getCategoryIds();
			$mage_product->delete();
			$collection = Mage::getModel("customerpartner/product")->getCollection()
						->addFieldToFilter("mageproductid",array("eq" => $id));
			foreach($collection as $row){
				$userid = $row["userid"];
				$row->delete();
			}
			$catname = array();
			foreach ($category as $catid)
				array_push($catname, Mage::getModel("catalog/category")->load($catid)->getName());
			$categoryname = implode(",", $catname);
			$toname = "Administrator";
	        $tomail = Mage::getStoreConfig("customerpartner/customerpartner_options/adminemail",Mage::app()->getStore()->getId());
			$seller = Mage::getModel("customer/customer")->load($userid);
			$emailTemp = Mage::getModel("core/email_template")->loadDefault("productdeletemail");
			$emailTempVariables = array();
			$emailTempVariables["productname"] = $proname;
			$emailTempVariables["productid"] = $id;
			$emailTempVariables["productprice"] = Mage::app()->getStore()->formatPrice($proprice);
			$emailTempVariables["productcategories"] = $categoryname;
			$emailTempVariables["toname"] = $toname;
			$processedTemplate = $emailTemp->getProcessedTemplate($emailTempVariables);
			$emailTemp->setSenderName($seller->getname());
			$emailTemp->setSenderEmail($seller->getemail());
			$emailTemp->send($tomail,$toname,$emailTempVariables);
			return 0;
		}

		public function ApproveProduct($id){
			$mage_product = Mage::getModel("catalog/product")->load($id);
			$users = Mage::getModel("customerpartner/product")->getCollection()->addFieldToFilter("mageproductid",$id);
			foreach ($users as $value)
				$user = $value;
			$allStores = Mage::app()->getStores();
			foreach($allStores as $_eachStoreId => $val)
				Mage::getModel("catalog/product_status")->updateProductStatus($id,Mage::app()->getStore($_eachStoreId)->getId(), Mage_Catalog_Model_Product_Status::STATUS_ENABLED);
			$mage_product->setStatus(1);
			$saved = $mage_product->save();
			$category = $mage_product->getCategoryIds();
			$catname = array();
			foreach ($category as $catid)
				array_push($catname, Mage::getModel("catalog/category")->load($catid)->getName());
			$categoryname = implode(",", $catname);

			$lastId = $saved->getId();
			$cp_product = Mage::getModel("customerpartner/product")->load($user->getIndexId());
			$cp_product->setStatus(1);
			$cp_product->save();
			$fromname = "Administrator";
	        $frommail = Mage::getStoreConfig("customerpartner/customerpartner_options/adminemail",Mage::app()->getStore()->getId());
			$seller = Mage::getModel("customer/customer")->load($user->getUserid());
			$emailTemp = Mage::getModel("core/email_template")->loadDefault("whenproductapproved");
			$emailTempVariables = array();
			$emailTempVariables["productname"] = $mage_product->getName();
			$emailTempVariables["productid"] = $id;
			$emailTempVariables["productprice"] = Mage::app()->getStore()->formatPrice($mage_product->getPrice());
			$emailTempVariables["productcategories"] = $categoryname;
			$emailTempVariables["toname"] = $seller->getname();
			$processedTemplate = $emailTemp->getProcessedTemplate($emailTempVariables);
			$emailTemp->setSenderName($fromname);
			$emailTemp->setSenderEmail($frommail);
			$emailTemp->send($seller->getemail(),$seller->getname(),$emailTempVariables);
			return $lastId;
		}

		public function isCustomerProduct($magentoProductId){
			$collection = Mage::getModel("customerpartner/product")->getCollection();
			$collection->addFieldToFilter("mageproductid",array($magentoProductId));
			foreach($collection as $record)
				$userid = $record->getuserid();
			$collection1 = Mage::getModel("customerpartner/userprofile")
							->getCollection()->addFieldToFilter("mageuserid",array("eq" => $userid));
			foreach($collection1 as $record1)
				$status = $record1->getWantpartner();
			if($status != 1)
				$userid = "";
			return array("productid"=>$magentoProductId,"userid" => $userid);
		}

	}
