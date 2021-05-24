const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

class Course {
    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                'utf-8',
                (err, data) => {
                    if (err) reject(err);

                    else resolve(JSON.parse(data));
                }
            );
        })
    }

    constructor(title, price, img) {
        this.title = title;
        this.price = price;
        this.img = img;
        this.id = uuidv4();
    }

    makeObj() {
        return {
            title: this.title,
            price: this.price,
            img: this.img,
            id: this.id
        }
    }

    async save() {
        const courses = await Course.getAll();
        courses.push(this.makeObj());

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                JSON.stringify(courses),
                (err) => {
                    if (err) reject (err);

                    else resolve();
                }
            );
        })
    }
}

module.exports = Course;