import { LightningElement,wire } from 'lwc';
import { getObjectInfo,getPicklistValues } from 'lightning/uiObjectInfoApi';
import CAR_OBJECT from '@salesforce/schema/Car__c';
import CATEGORY_FIELD from '@salesforce/schema/Car__c.Category__c';
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c';

//lightning message service and message channel
import { publish, MessageContext } from 'lightning/messageService';
import CAR_FILTERED_MESSAGE from '@salesforce/messageChannel/carFiltered__c';

//constants
const CATEGORY_ERROR = 'Error While loading Category..!';
const MAKE_ERROR = 'Error While loading Make Value..!'

export default class CarFilter extends LightningElement {

    filters={
        searchKey:'',
        maxPrice:999999
    } 

    categoryError = CATEGORY_ERROR
    makeError = MAKE_ERROR
    timer

    /* load context for LMS*/
    @wire(MessageContext)
    messageContext

    /*fetching category picklist*/
    @wire(getObjectInfo,{objectApiName:CAR_OBJECT})
    carObjectInfo

    @wire(getPicklistValues,{
        recordTypeId:'$carObjectInfo.data.defaultRecordTypeId',
        fieldApiName:CATEGORY_FIELD 
    })categories

    /*fetching make picklist*/
     @wire(getPicklistValues,{
        recordTypeId:'$carObjectInfo.data.defaultRecordTypeId',
        fieldApiName:MAKE_FIELD
    })makePicklistValue


    handleSearchKey(event){
        console.log(event.target.value)
        this.filters = {...this.filters,"searchKey":event.target.value} //update object value  
        this.sendDataToCarList()
    }

    handleSliderChange(event){
        console.log(event.target.value)
        this.filters = {...this.filters,"maxPrice":event.target.value} //update object value 
        this.sendDataToCarList() 
    }

    handleCheckBox(event){
        /*Pushing categories value and makeType in Filter object */
        if(!this.filters.categories){
           const categories = this.categories.data.values.map(item=>item.value)
           console.log('categories >>' ,categories)

           const makeType = this.makePicklistValue.data.values.map(item=>item.value)
           console.log('makeType >>' ,makeType)

           this.filters = {...this.filters, categories, makeType} //update object value 
        }

        const {name,value} = event.target.dataset

        // console.log("Name : " ,name)
        // console.log("Value : " ,value)

        /* checking if filter object contains name and its value if not then adding name and value */
        if(event.target.checked){
            if(!this.filters[name].includes(value)){
                this.filters[name] = [...this.filters[name], value]
            }
        }else{
            //removing name and value if its not match
            this.filters[name] = this.filters[name].filter(item=>item !==value)
        }
        this.sendDataToCarList()
    }

    sendDataToCarList(){
        window.clearTimeout(this.timer)
        this.timer = window.setTimeout(()=>{
            publish(this.messageContext,CAR_FILTERED_MESSAGE,{
                carFilters : this.filters
            });
        },400)
    }
}