import fetch from '../config/fetch'
import {getStore} from './config/mUtils'

export const cityGuess = () => fetch('/v1/cities',{
    tyep:'guess'
});

export const shopList = (latitude, logitude, offset, resturant_catgory) => {
    let supporter = '';
    let data = {

    }
    return fetch('/shoping/',data)
}