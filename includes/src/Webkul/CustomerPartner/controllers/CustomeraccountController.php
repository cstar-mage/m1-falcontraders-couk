<?php

	require_once "Mage/Customer/controllers/AccountController.php";
	class Webkul_CustomerPartner_CustomeraccountController extends Mage_Customer_AccountController	{

	    public function indexAction()    {
			$this->loadLayout();
			$this->renderLayout();
	    }

		public function extraAction()	{
			$wholedata = $this->getRequest()->getParams();
			$customer = Mage::getModel("customer/customer")->load($wholedata["userid"]);
			$status = Mage::getStoreConfig("customerpartner/customerpartner_options/partner_approval",Mage::app()->getStore()->getId()) ? 2 : 1;
			$assinstatus = Mage::getStoreConfig("customerpartner/customerpartner_options/partner_approval",Mage::app()->getStore()->getId()) ? "Pending" : "Partner";
			$collection = Mage::getModel("customerpartner/user")->getCollection()->addFieldToFilter("mageuserid",$wholedata["userid"]);

			if($wholedata["wanttopartner"] == 1)  {
				if(count($collection) == 0){
					$model = Mage::getModel("customerpartner/user");
					$model->setPartnerstatus($assinstatus);
					$model->setMageuserid ($wholedata["userid"]);
					$model->setWantpartner($status);
					$model->setpaymentsource($wholedata["paymentsource"]);
					$model->save();
				}else{
					foreach ($collection as $value) {
						$value->setPartnerstatus($assinstatus);
						$value->setMageuserid ($wholedata["userid"]);
						$value->setWantpartner($status);
						$value->setpaymentsource($wholedata["paymentsource"]);
						$value->save();
					}
				}
				$emailTemp = Mage::getModel("core/email_template")->loadDefault("partnerrequest");
				$emailTempVariables = array();
				$adminEmail = Mage::getStoreConfig("customerpartner/customerpartner_options/adminemail");
				$adminUsername = "Administrator";
				$emailTempVariables["customername"] = $customer->getName();
				$emailTempVariables["adminurl"] = Mage::getUrl("customerpartner/adminhtml_partners/edit", array("id" => $customer->getId()));
				if($status == 2)
					$emailTempVariables["content"] = Mage::helper("customerpartner")->__("This is to inform you that I requested to subscribe as a partner. Please approve me as soon as posible ");
				else
					$emailTempVariables["content"] = Mage::helper("customerpartner")->__("This is to inform you that I subscribed as a partner at your store.");
				$processedTemplate = $emailTemp->getProcessedTemplate($emailTempVariables);
				$emailTemp->setSenderName($customer->getName());
				$emailTemp->setSenderEmail($customer->getEmail());
				$emailTemp->send($adminEmail,$adminUsername,$emailTempVariables);
			}
			else{
				foreach ($collection as $value) {
					$value->setpaymentsource($wholedata["paymentsource"]);
					$value->save();
				}
			}
			
			$this->_redirect("customer/account/edit/");
			$this->_getSession()->addSuccess(Mage::helper("customerpartner")->__("Your Details has been sucessfully saved"));
		}

		public function categorytreeAction(){
			$data = $this->getRequest()->getParams();
			$category_model = Mage::getModel("catalog/category");
			$category = $category_model->load($data["CID"]);
			$children = $category->getChildren();
			$all = explode(",",$children);
			$result_tree = "";
			$ml = $data["ML"]+20;
			$count = 1;
			$total = count($all);
			foreach($all as $each){
				$count++;
				$_category = $category_model->load($each);
				$result_tree .= "<div class='wk_removable wk_cat_container' style='display:none;margin-left:".$ml."px;'><span onClick='findsubcat(this)' class='";
				if(count($category_model->getResource()->getAllChildren($category_model->load($each)))-1 > 0){
					if($count < $total)
						$result_tree .= "wk_plus'></span><span class='wk_foldersign'></span>";
					else
						$result_tree .= "wk_plusend'></span><span class='wk_foldersign'></span>";
				}
				else
					$result_tree .= "wk_no'></span><span class='wk_foldersign'></span>";
				$result_tree .= "<span class='wk_elements wk_cat_name'>".$_category->getName()."</span>";
				$categories = explode(",",$data["CATS"]);
				if($data["CATS"] && in_array($_category["entity_id"],$categories))
					$result_tree .="<input onchange='catchanged();' class='wk_elements' type='checkbox' name='category[]' value='".$_category['entity_id']."' checked></div>";
				else
					$result_tree .= "<input onchange='catchanged();' class='wk_elements' type='checkbox' name='category[]' value='".$_category['entity_id']."'></div>";
			}
			echo $result_tree;
		}

		public function verifyskuAction(){
			$sku = $this->getRequest()->getParam("sku");
			$id = Mage::getModel("catalog/product")->getIdBySku($sku);
			if($id)
				$availability = 0;
			else
				$availability = 1;
			echo json_encode(array("availability" => $availability));
		}

		public function newproductAction() 	{
			if($this->getRequest()->isPost())	{
				list($data, $errors) = $this->validatePost();
				$wholedata = $this->getRequest()->getParams();
				if(empty($errors)){
					Mage::getModel("customerpartner/product")->SaveNewProduct($wholedata);
				}
				else{
					foreach($errors as $message)
						Mage::getSingleton("core/session")->addError($message);
					$_SESSION["new_products_errors"] = $data;
				}
				if(empty($errors))
					Mage::getSingleton("core/session")->addSuccess(Mage::helper("customerpartner")->__("Your product is saved successfully & waiting for approval"));
				$this->_redirect("customerpartner/customeraccount/productslist/");
			}
			else{
				$this->loadLayout(array("default","customerpartner_customeraccount_newproduct"));
				$this->getLayout()->getBlock("head")->setTitle(Mage::helper("customerpartner")->__("Add New Product"));
				$this->renderLayout();
			}
		}

		public function productslistAction(){
			$this->loadLayout(array("default","customerpartner_customeraccount_productlist"));
			$this->getLayout()->getBlock("head")->setTitle(Mage::helper("customerpartner")->__("Product List"));
	    	$this->renderLayout();
		}

		public function orderhistoryAction(){
			$this->loadLayout( array("default","customerpartner_customeraccount_orderhistory"));
			$this->getLayout()->getBlock("head")->setTitle(Mage::helper("customerpartner")->__("Order History"));
	    	$this->renderLayout();
		}

		public function editproductAction() {
			if($this->getRequest()->isPost()){
				$id = $this->getRequest()->getParam("productid");
				Mage::getModel("customerpartner/product")->EditProduct($id,$this->getRequest()->getParams());
				Mage::getSingleton("core/session")->addSuccess(Mage::helper("customerpartner")->__("Product has been Sucessfully Updated"));
				$this->_redirect("customerpartner/customeraccount/productslist/");
			}
			else{
				$this->loadLayout(array("default","customerpartner_customeraccount_editproduct"));
				$this->getLayout()->getBlock("head")->setTitle(Mage::helper("customerpartner")->__("Edit Product"));
				$this->renderLayout();
			}
		}

		public function deleteAction(){
			$id = $this->getRequest()->getParam("id");
			$record = Mage::getModel("customerpartner/product")->deleteProduct($id);
			Mage::getSingleton("core/session")->addSuccess(Mage::helper("customerpartner")->__("Your Product Has Been Sucessfully Deleted From Your Account"));
			$this->_redirect("customerpartner/customeraccount/productslist/");
		}

		public function dashboardAction(){
			$this->loadLayout(array("default","customerpartner_customeraccount_dashboard"));
			$this->getLayout()->getBlock("head")->setTitle(Mage::helper("customerpartner")->__("Dashboard"));
	    	$this->renderLayout();
		}

		public function deleteimageAction(){
			$data = $this->getRequest()->getParams();
			$gallery = Mage::getModel("catalog/product")->load($data["pid"])->getMediaGalleryImages();
			$main = explode("/",$data["file"]);
			foreach($gallery as $_image) {
				$arr = explode("/",$_image["path"]);
				if(array_pop($arr) != array_pop($main)){
					$newimage = $_image["file"];
					$id = $_image["value_id"];
					break;
				}
			}
			$mediaApi = Mage::getModel("catalog/product_attribute_media_api");
			$mediaApi->remove($data["pid"], $data["file"]);
			if($newimage){
				$product = Mage::getModel("catalog/product")->load($data["pid"]);
				$product->setSmallImage($newimage);
				$product->setImage($newimage);
				$product->setThumbnail($newimage);
				$product->save();
			}
		}

		public function fileuploadAction(){
			$customer_id = Mage::getSingleton("customer/session")->getId();
			$file = new Varien_Io_File();
			$image = "";
			$path = Mage::getBaseDir("media")."/customerpartner/customerproduct/".$customer_id."/image/";
			if(!is_dir($path))
				$file->mkdir($path);
			foreach($_FILES["images"]["tmp_name"] as $key => $value){
				$image_name = str_replace(" ","_",$_FILES["images"]["name"][$key]);
				$imagefilename = time()."-_-".$image_name;
				$image = $image.time()."-_-".$image_name.",";
				move_uploaded_file($value, $path.$imagefilename);
			}
			echo $image;
		}

		public function deleteimagedelegateAction(){
			$data = $this->getRequest()->getParam("file");
			$customer_id = Mage::getSingleton("customer/session")->getId();
			$path = Mage::getBaseDir("media")."/customerpartner/customerproduct/".$customer_id."/image/".$data;
			unlink($path);
		}

		private function validatePost(){
			$errors = array();$data = array();
			foreach($this->getRequest()->getParams() as $code => $value){
				switch ($code) :
					case "name":
						if(trim($value) == "")
							$errors[] = Mage::helper("customerpartner")->__("Name is required field");
						else
							$data[$code] = $value;
						break;
					case "description":
						if(trim($value) == "")
							$errors[] = Mage::helper("customerpartner")->__("Description is required field");
						else
							$data[$code] = $value;
						break;
					case "short_description":
						if(trim($value) == "")
							$errors[] = Mage::helper("customerpartner")->__("Short description is required field");
						else
							$data[$code] = $value;
						break;
					case "price":
						if(!preg_match("/^([0-9])+?[0-9.]*$/",$value))
							$errors[] = Mage::helper("customerpartner")->__("Price should contain only integer numbers");
						else
							$data[$code] = $value;
					case "weight":
						if(!preg_match("/^([0-9])+?[0-9.]*$/",$value))
							$errors[] = Mage::helper("customerpartner")->__("Weight should contain only integer numbers");
						else
							$data[$code] = $value;
						break;
					case "stock":
						if(!preg_match("/^([0-9])+$/",$value))
							$errors[] = Mage::helper("customerpartner")->__("Stock should contain only integer number");
						else
							$data[$code] = $value;
						break;
				endswitch;
			}
			return array($data, $errors);
		}

		public function askquestionAction(){
			$customer = Mage::getModel("customer/customer")->load($_POST["seller-id"]);
			$emailTemp = Mage::getModel("core/email_template")->loadDefault('askquestion');
			$emailTempVariables = array();
			$adminEmail = Mage::getStoreConfig("customerpartner/customerpartner_options/adminemail",Mage::app()->getStore()->getId());
			$adminUsername = "Administrator";
			$emailTempVariables["customername"] = $customer->getName();
			$emailTempVariables["query"] = $_POST["ask"];
			$emailTempVariables["subject"] = $_POST["subject"];
			$processedTemplate = $emailTemp->getProcessedTemplate($emailTempVariables);
			$emailTemp->setSenderName($customer->getName());
			$emailTemp->setSenderEmail($customer->getEmail());
			$emailTemp->send($adminEmail,$customer->getName(),$emailTempVariables);
		}

	}