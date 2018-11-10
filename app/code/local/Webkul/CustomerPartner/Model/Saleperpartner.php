<?php
	class Webkul_CustomerPartner_Model_Saleperpartner extends Mage_Core_Model_Abstract	{

	    public function _construct()	    {
	        parent::_construct();
	        $this->_init("customerpartner/saleperpartner");
	    }

		public function salePayment($data)		{
			$wholedata = $data->getParams("");
			$collection = Mage::getModel("customerpartner/saleperpartner")->getCollection()->addFieldToFilter("mageuserid",$wholedata["id"]);
			foreach ($collection as $verifyrow) {
				if($verifyrow->getamountremain() > 0){
					$lastpayment = $verifyrow->getamountremain();
				    $amountreceived = $verifyrow->getamountrecived();
					$totalrecived=$verifyrow->getamountpaid()+$lastpayment;
					$model = Mage::getModel("customerpartner/saleperpartner")->load($verifyrow->getautoid());
					$model->setamountpaid($totalrecived);
					$model->setamountrecived($lastpayment);
					$model->setamountremain(0);
					$model->save();
					return 0;
				}
			}	
		}

		public function masssalePayment($data)		{
			$wholedata = $data->getParams();
			foreach($wholedata["partner"] as $id) {
				$collection = Mage::getModel("customerpartner/saleperpartner")->getCollection()->addFieldToFilter("mageuserid",$id);
				foreach($collection as $verifyrow) {
					if($verifyrow->getamountremain() > 0){
						$amountremain = $verifyrow->getamountremain();
						$amountpaid = $verifyrow->getamountpaid();
						$totalrecived = $amountremain + $amountpaid;
						$verifyrow->setamountpaid($totalrecived);
						$verifyrow->setamountrecived($amountremain);
						$verifyrow->setamountremain(0);
						$verifyrow->save();
					}
				}
			}
			return 0;	
		}
	}