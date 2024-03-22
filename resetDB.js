const db = require('./db');
const User = require('./models/User');
const Task = require('./models/Task');
const Category = require('./models/Category');

const sampleUsers = [
    { username: 'user1', password: 'pass1', email: 'user1@example.com' },
    { username: 'user2', password: 'pass2', email: 'user2@example.com' },
    { username: 'user3', password: 'pass3', email: 'user3@example.com' },
    { username: 'user4', password: 'pass4', email: 'user4@example.com' },
    { username: 'user5', password: 'pass5', email: 'user5@example.com' }
];

const sampleTasks = [
    { title: 'Task 1', description: 'Do something important', status: 'Pending', dueDate: new Date(2024, 3, 22) },
    { title: 'Task 2', description: 'Do another thing', status: 'InProgress', dueDate: new Date(2024, 3, 23) },
    { title: 'Task 3', description: 'Do a third thing', status: 'Completed', dueDate: new Date(2024, 3, 24) },
    { title: 'Task 4', description: 'Do something else', status: 'Pending', dueDate: new Date(2024, 3, 25) },
    { title: 'Task 5', description: 'Last task', status: 'Completed', dueDate: new Date(2024, 3, 26) }
];

const sampleCategories = [
    { name: 'Electronics', description: 'Gadgets and gizmos aplenty.' },
    { name: 'Books', description: 'All kinds of books.' },
    { name: 'Clothing', description: 'Men\'s, women\'s, and children\'s clothing.' },
    { name: 'Home & Garden', description: 'Everything for your home and garden.' },
    { name: 'Toys', description: 'Toys for kids of all ages.' }
];

async function main() {
    await db.connect();

    console.log('Deleting all users...');
    await User.deleteMany();
    console.log('Complete!');

    console.log('Inserting users...');
    await User.insertMany(sampleUsers);
    console.log('Complete!');

    console.log('Deleting all tasks...');
    await Task.deleteMany();
    console.log('Complete!');

    console.log('Inserting tasks...');
    await Task.insertMany(sampleTasks);
    console.log('Complete!');

    console.log('Deleting all categories...');
    await Category.deleteMany();
    console.log('Complete!');

    console.log('Inserting categories...');
    await Category.insertMany(sampleCategories);
    console.log('Complete!');

    await db.disconnect();
}

main();