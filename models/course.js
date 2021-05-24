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

    static async getById(id) {
        const courses = await Course.getAll();

        return courses.find((item) => item.id === id);
    }

    static async edit(course) {
        const courses = await Course.getAll();

        const coursesEdited = courses.map((item) => {
            return item.id === course.id ? course : item;
        });

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                JSON.stringify(coursesEdited),
                (err) => {
                    if (err) reject (err);

                    else resolve();
                }
            );
        });
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
        });
    }


}

module.exports = Course;
