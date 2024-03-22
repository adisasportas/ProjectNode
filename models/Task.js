const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['Pending', 'InProgress', 'Completed'],
  },
  dueDate: { type: Date, required: true }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;