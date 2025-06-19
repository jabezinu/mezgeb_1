import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  firstVisit: { type: String, required: true },
  nextVisit: { type: String, required: true },
}, {
    timestamps: true,
});

const Client = mongoose.model('Client', clientSchema);

export default Client;
