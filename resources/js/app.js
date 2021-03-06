const { update } = require("../../app/models/menu");

import axios from 'axios';
import initAdmin from './admin'

const addToCart = document.querySelectorAll('.add-to-cart')
const cartCounter = document.querySelector('.cartCounter')

function updateCart(pizza) {
    axios.post('/update-cart', pizza).then (res =>{
     console.log(res);  
     cartCounter.innerText = res.data.totalQty;  
    })
}

addToCart.forEach(btn => {
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza);
    })
})

// Remove alert message after X seconds
const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}

initAdmin()
// change order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput') 
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)

function updateStatus(order) {
    let stepCompleted =  true;
    statuses.forEach((status) => {
        let dataProp = status.dataset.status
        if(stepCompleted) {
            status.classList.add('step-completed')
        }
        if (dataProp === order.status) {
            stepCompleted = false
            if(status.nextElementSibling){
            status.nextElementSibling.classList.add('current')  
            } 
        }
    })
    

}
updateStatus(order);