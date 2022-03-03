import { LightningElement,api } from 'lwc';

export default class CarTiles extends LightningElement {

    @api eachcardetails={}

    handleImageClick(event){
        this.dispatchEvent(new CustomEvent('selected',{
            detail:this.eachcardetails.Id
        }))
    }

}