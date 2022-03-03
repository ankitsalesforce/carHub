import { LightningElement,api } from 'lwc';
import PLACEHOLDER_LOGO from '@salesforce/resourceUrl/carHubPlaceHolder';

export default class PlaceHolder extends LightningElement {
    @api message

    placeHolderImage = PLACEHOLDER_LOGO;
}