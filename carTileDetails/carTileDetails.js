import { LightningElement,wire } from 'lwc';
import getCarList from '@salesforce/apex/carController.getCarList'

//lightning message service and message channel
import {publish, subscribe, MessageContext ,unsubscribe } from 'lightning/messageService';
import CAR_FILTERED_MESSAGE from '@salesforce/messageChannel/carFiltered__c';
import CAR_SELECTED_MESSAGE from '@salesforce/messageChannel/carSelected__c';

export default class CarTileDetails extends LightningElement {

    carDetails = []
    error
    filters = {};
    carFilterSubScription  //its best practice that unsubcribe LMS when component not called 

    @wire(getCarList,{filters:'$filters'})
    getCarDetails({data,error}){
        if(data){
            console.log(data)
            this.carDetails = data
        }
        if(error){
            console.error(error)
            this.error = error
        }
    }

    /* load context for LMS*/
    @wire(MessageContext)
    messageContext

    connectedCallback(){
        this.subscribeHandler()
    }


    subscribeHandler(){
        this.carFilterSubScription = subscribe(this.messageContext,CAR_FILTERED_MESSAGE,(message)=>this.handleFilterChnage(message))
    }

    handleFilterChnage(message){
        console.log('handleFilterChnage>>',message.carFilters)
        this.filters = {...message.carFilters}
    }

    handleSelectedCar(event){
        console.log('Selected Car Id ',event.detail)
        publish(this.messageContext,CAR_SELECTED_MESSAGE,{
            carSelect:event.detail
        })
    }

    //best practice to disconnect subscription 
    disconnectedCallback(){
        unsubscribe(this.carFilterSubScription)
        this.carFilterSubScription = null
    }

}