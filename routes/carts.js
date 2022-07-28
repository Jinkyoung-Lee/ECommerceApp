const express = require('express');

const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemp = require('../views/carts/show');

const router = express.Router();

// receive a post request to add an item to a cart
router.post('/cart/products', async (req, res) => {
    // figure oiut the cart
    let cart;
    if (!req.session.cartId) {
        // We don't ahve a cart, we need to create one,
        // and store that cart id on the req.session.cartId
        // property
        cart = await cartsRepo.create({ items: [] });
        req.session.cartId = cart.id;
    } else {
        // we have a cart! let's get it from the repository
        cart = await cartsRepo.getOne(req.session.cartId);
    }

    // either increment quantity for existing product
    // OR add new product to items array
    const existingItem = cart.items.find((item) => {
        return item.id === req.body.productId
    });
    if (existingItem) {
        // increment quantity and save cart
        existingItem.quantity++;
    } else {
        // add new product id to items array
        cart.items.push({ id: req.body.productId, quantity: 1 });
    }

    await cartsRepo.update(cart.id, {
        items: cart.items
    });

    res.redirect('/cart');
});

// receive a GET request to show all items in cart
router.get('/cart', async (req, res) => {
    if (!req.session.cartId) {
        return res.redirect('/');
    }

    const cart = await cartsRepo.getOne(req.session.cartId);

    for (let item of cart.items) {
        // item === { id: , quantity: }
        const product = await productsRepo.getOne(item.id);
        item.product = product;
    }
    res.send(cartShowTemp({ items: cart.items }));
});

// receive a post request to delete an item from a cart
router.post('/cart/products/delete', async (req, res) => {
    const { itemId } = req.body;
    const cart = await cartsRepo.getOne(req.session.cartId);

    const items = cart.items.filter((item) => {
        return item.id !== itemId
    });

    await cartsRepo.update(req.session.cartId, { items });

    res.redirect('/cart');
});

module.exports = router;