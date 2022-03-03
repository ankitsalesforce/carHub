import { LightningElement,api,wire } from 'lwc';
import getSimilarCar from '@salesforce/apex/carController.getSimilarCar';


export default class SimilarCar extends LightningElement {
    @api recordId
    similarCars
    buttonClicked = false

    @wire(getSimilarCar,{recordId : '$recordId'})
    getSimilarCarRecord({data,error}){
        if(data){
            console.log(data)
            this.similarCars = data
        }if(error){
            console.error(error)
        }
    }
    
    handleSimilarCarSearch(){
        this.buttonClicked = true
    }
    
}