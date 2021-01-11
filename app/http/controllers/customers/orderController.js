const Order = require('../../../models/order')
const moment = require('moment')

function orderController (){
return {
    
    store(req, res) {

        // Validate request
        const { phone, address} = req.body
        if(!phone || !address){
            req.flash('error', 'All fields are require')
            req.flash('phone', phone)
            req.flash('address', address)
            
            return res.redirect('/cart')
        }

        const order = new Order({
            customerId: req.user._id,
            items: req.session.cart.items,
            phone,
            address
        })

        order.save().then(result =>{
            req.flash('success', 'Order placed successfully')
            delete req.session.cart
            return res.redirect('/customer/orders')
        }).catch(err => {
            req.flash('error', 'Something went wrong')
            return res.redirect('/cart')
        })
    },
    async index(req, res){
        const orders = await Order.find({ customerId: req.user._id},
            null, 
            { sort: {'createdAt': -1}})
        res.render('customers/orders', { orders: orders, moment: moment})
        
    },
    async show(req, res) {
        const order = await Order.findById(req.params.id)
        if(req.user._id.toString === order.customerId.toString) {
            res.render('customers/singleOrder', {order})
        } else {
            res.redirect('/')
        }
    }
}  

}

module.exports = orderController    