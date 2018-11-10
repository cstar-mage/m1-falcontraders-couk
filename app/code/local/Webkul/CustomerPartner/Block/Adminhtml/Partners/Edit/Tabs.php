<?php

class Webkul_CustomerPartner_Block_Adminhtml_Partners_Edit_Tabs extends Mage_Adminhtml_Block_Widget_Tabs {

    public function __construct() {
        parent::__construct();
        $this->setId("partners_tabs");
        $this->setDestElementId("edit_form");
        $this->setTitle(Mage::helper("customerpartner")->__("Partner"));
    }

    protected function _beforeToHtml() {
        
        $data = Mage::registry("partner_data");
        Mage::register("current_customer", $this->getRequest()->getParam("indexid"));
        if($data["wantpartner"]==1){
            $this->addTab("removepatner_section", array(
                "label" => Mage::helper("customerpartner")->__("Subscribe/Unsubscribe"),
                "alt" => Mage::helper("customerpartner")->__("Subscribe/Unsubscribe"),
                "content" => $this->removepartner()
            ));
            $this->addTab("payment_section", array(
                "label"     => Mage::helper("customerpartner")->__("Payment Mode"),
                "alt"       => Mage::helper("customerpartner")->__("Payment Mode"),
                "content"   => $this->paymentmode()
            ));   
             $this->addTab("commission_section", array(
                "label"     => Mage::helper("customerpartner")->__("Partner's Commision"),
                "alt"       => Mage::helper("customerpartner")->__("Partner's Commision"),
                "content"   => $this->sellercommision()
            ));   
              $this->addTab("addproduct_section", array(
                "label"     => Mage::helper("customerpartner")->__("Assign Product"),
                "alt"       => Mage::helper("customerpartner")->__("Assign Product"),
                "content"   => $this->addproduct()
            ));
        }else{
            $this->addTab("wantpatner_section", array(
                "label"     => Mage::helper("customer")->__("Subscribe/Unsubscribe"),
                "alt" => Mage::helper("customerpartner")->__("Subscribe/Unsubscribe"),
                "content"   => $this->wantpartner()
            ));
        }
        return parent::_beforeToHtml();
    }
    protected function paymentmode(){   
            $row = Mage::getModel("customerpartner/user")->getpaymentmode();
            if($row != ""){ 
                return "<div class='entry-edit'>
                            <div class='entry-edit-head'>
                                <h4 class='icon-head head-customer-view'>".Mage::helper('customerpartner')->__('Payment Details')."</h4>
                            </div>
                            <fieldset>
                                <address>
                                    <strong>".$row."</strong><br>
                                </address>
                            </fieldset>
                        </div>";
            }
            else{
                return "<div class='entry-edit'>
                            <div class='entry-edit-head'>
                                <h4 class='icon-head head-customer-view'>".Mage::helper('customerpartner')->__('Payment Details')."</h4>
                            </div>
                            <fieldset>
                                <address>
                                    <strong>".Mage::helper('customerpartner')->__('Not Mentioned Yet')."</strong><br>
                                </address>
                            </fieldset>
                        </div>";
            }

        }

        protected function sellercommision(){
            $orders = Mage::getResourceModel('sales/order_collection')->addFieldToFilter('status', 'canceled');
            $orderids = array();
            foreach ($orders as $value) {
                $orderids[] = $value->getData('increment_id');
            }
            $id = Mage::registry("current_customer");  
            $collection = Mage::getModel("customerpartner/saleperpartner")->getCollection()->addFieldToFilter("mageuserid",$id);
            foreach ($collection as $value)
                $rowcom = $value->getCommision();
            $tact = $tcomm = $tsale = 0;
            $collection1 = Mage::getModel("customerpartner/saleslist")->getCollection()->addFieldToFilter("mageproownerid",array($id))->addFieldToFilter('magerealorderid',array('nin'=>$orderids)); 
            foreach ($collection1 as $key) {
                $tsale += $key->gettotalamount();
                $tcomm += $key->gettotalcommision();
                $tact += $key->getactualparterprocost();
            }      
            if($rowcom > 0)
                $comm = $rowcom;
            else
            if(Mage::getStoreConfig("customerpartner/customerpartner_options/commission_percent") >= 0)
                $comm = Mage::getStoreConfig("customerpartner/customerpartner_options/commission_percent");
            else
                $comm = 0;
            return "<div class='entry-edit'>
                        <div class='entry-edit-head'>
                            <h4 class='icon-head head-customer-view'>".Mage::helper('customerpartner')->__('Commision Details')."</h4>
                        </div>
                        <fieldset>".Mage::helper('customerpartner')->__('Set Commision In Percentage For This Particular Partner')." : <input name='commision' type='text' classs='input-text no-changes' value='".$rowcom."'/>&nbsp;&nbsp;<span style='color:red;'>".Mage::helper('customerpartner')->__('Enter number greater than 0.')."</span>
                            <table class='grid table' id='customer_cart_grid1_table'>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td>".Mage::helper('customerpartner')->__('Total Sale')."</td>
                                    <td>".Mage::app()->getLocale()->currency(Mage::app()->getStore()->getCurrentCurrencyCode())->getSymbol()." ".$tsale."</td>
                                </tr>
                                <tr>
                                    <td>".Mage::helper('customerpartner')->__('Total Partner Sale')."</td>
                                    <td>".Mage::app()->getLocale()->currency(Mage::app()->getStore()->getCurrentCurrencyCode())->getSymbol()." ".$tact."</td>
                                </tr>
                                <tr>
                                    <td>".Mage::helper('customerpartner')->__('Total Admin Sale')."</td>
                                    <td>".Mage::app()->getLocale()->currency(Mage::app()->getStore()->getCurrentCurrencyCode())->getSymbol()." ".$tcomm."</td>
                                </tr>
                                <tr>
                                    <td>".Mage::helper('customerpartner')->__('Current Commision')." %</td>
                                    <td>".$comm."%</td>
                                </tr>
                            </table>
                        </fieldset>                         
                    </div>";
        }

        protected function addproduct(){        
            return "<div class='entry-edit'>
                        <div class='entry-edit-head'>
                            <h4 class='icon-head head-customer-view'>".Mage::helper('customerpartner')->__('Assign Product To Seller')."</h4>
                        </div>
                        <fieldset>".Mage::helper('customerpartner')->__('Enter Product ID')." : <input name='sellerassignproid' type='text' classs='input-text no-changes'/> &nbsp;&nbsp;&nbsp;&nbsp;<b>".Mage::helper('customerpartner')->__('Notice: Enter Only Integer value')."</b>    
                        </fieldset>
                    </div>";
        }
        
        protected function wantpartner(){       
            return "<div class='entry-edit'>
                        <div class='entry-edit-head'>
                            <h4 class='icon-head head-customer-view'>".Mage::helper('customerpartner')->__('Subscribe as Partner')."</h4>
                        </div>
                        <fieldset>
                            <input type='checkbox' name='partnertype' value='1'>&nbsp;".Mage::helper('customerpartner')->__('Subscribe as Partner')."
                        </fieldset>
                    </div>";
        }
        
        protected function removepartner(){     
            return "<div class='entry-edit'>
                        <div class='entry-edit-head'>
                            <h4 class='icon-head head-customer-view'>".Mage::helper('customerpartner')->__('Unsubscribe from Partner')."</h4>
                        </div>
                        <fieldset>
                            <input type='checkbox' name='partnertype' value='0'>&nbsp;".Mage::helper('customerpartner')->__('Unsubscribe from Partner')."
                        </fieldset>
                    </div>";
        }

}