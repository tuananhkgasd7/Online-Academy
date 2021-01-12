module.exports = {
    getNumberOfItems(cart) {
        let n = 0;
        for (const item of cart) {
          n += item.quantity;
        }
    
        return n;
    },

    add(cart, item) {
        for (i = cart.length - 1; i >= 0; i--) {
            if (item.id === cart[i].id) return;
        }
        cart.push(item);
        //console.log(cart);
    },

    remove(cart, id) {
        for (i = cart.length - 1; i >= 0; i--) {
            if (id === cart[i].id) {
            cart.splice(i, 1);
            return;
            }
        }
    }   
}