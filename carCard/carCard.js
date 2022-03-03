import { LightningElement,api,wire } from 'lwc';

//car schema
import NAME_FIELD from '@salesforce/schema/Car__c.Name';
import PICTUR_URL_FIELD from '@salesforce/schema/Car__c.Picture_URL__c';
import FUEL_TYPE_FIELD from '@salesforce/schema/Car__c.Fuel_Type__c';
import CATEGORY_FIELD from '@salesforce/schema/Car__c.Category__c';
import CONTROL_FIELD from '@salesforce/schema/Car__c.Control__c';
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c';
import SEAT_FIELD from '@salesforce/schema/Car__c.Seats__c';
import PRICE_FIELD from '@salesforce/schema/Car__c.MSRP__c';
import { getFieldValue } from 'lightning/uiRecordApi';

//lightning message service and message channel
import {subscribe, MessageContext ,unsubscribe} from 'lightning/messageService';
import CAR_SELECTED_MESSAGE from '@salesforce/messageChannel/carSelected__c';

//navigation to record page 
import { NavigationMixin } from 'lightning/navigation';
import CAR_OBJECT from '@salesforce/schema/Car__c';
export default class CarCard extends NavigationMixin(LightningElement) {

    categoryField = CATEGORY_FIELD
    makeField = MAKE_FIELD
    seatField = SEAT_FIELD
    priceField = PRICE_FIELD
    controlField = CONTROL_FIELD
    fuelType =  FUEL_TYPE_FIELD

    recordId
    //display car property with specific field
    carName
    carPicture 

    //remove the subscription when car is not selected 
    carSubcripation

    /* load context for LMS*/
    @wire(MessageContext)
    messageContext

    handleRecordLoad(event){
        const {records} = event.detail
        const recordData = records[this.recordId]
        this.carName = getFieldValue(recordData,NAME_FIELD)
        this.carPicture = getFieldValue(recordData,PICTUR_URL_FIELD)

        
    }

    connectedCallback(){
        this.subscribeHandler()
    }
    
    subscribeHandler(){
        this.carSubcripation = subscribe(this.messageContext,CAR_SELECTED_MESSAGE,(message)=>this.handleSelectChnage(message))
    }

    handleSelectChnage(message){
        this.recordId = message.carSelect
        console.log('recordId in car card ',this.recordId)
    }

    //best practice to disconnect subscription 
    disconnectedCallback(){
        unsubscribe(this.carSubcripation)
        this.carSubcripation = null
    }

    handleNavigationItem(event){
        console.log('recordId in Navigation ',this.recordId)
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: CAR_OBJECT.objectApiName,
                actionName: 'view'
            }
        });
    }
}