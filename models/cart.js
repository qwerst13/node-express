const fs = require('fs');
const path = require('path');

class Cart {
    static async add(course) {
        const cart = await Cart.getCart();
        const index = cart.courses.findIndex((item) => item.id === course.id);
        const candidate = cart.courses[index];

        if (candidate) {
            candidate.count++;
            cart.courses[index] = candidate;
        } else {
            course.count = 1;
            cart.courses.push(course);
        }

        cart.totalPrice += +course.price;

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'cart.json'),
                JSON.stringify(cart),
                (err) => {
                    if (err) reject (err);

                    else resolve();
                }
            );
        });
    };

    static getCart() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'cart.json'),
                'utf-8',
                (err, data) => {
                    if (err) reject(err);

                    else resolve(JSON.parse(data));
                }
            );
        })
    };
}

module.exports = Cart;