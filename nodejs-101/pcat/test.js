const mongoose = require('mongoose');
const schema = mongoose.Schema;

// connect DB
mongoose.connect('mongodb://localhost/pcat-test-db');

// create schema
const PhotoSchema = new schema({
  title: String,
  description: String,
});

// create model
const Photo = mongoose.model('Photo', PhotoSchema);

// create a new photo
/* Photo.create({
  title: 'Test Photo 2',
  description: 'This is a test photo 2',
}); */

// read a photo
/* Photo.find().then((data) => {
  console.log(data);
});
 */

// update a photo
/* const id = '6ac79f6a8772cc97c9e61994';

Photo.findByIdAndUpdate(
  id,
  {
    title: 'Updated Photo Title new',
    description: 'Updated Photo Description new',
  },
  { returnDocument: 'after' }
).then((data) => {
  console.log(data);
}); */

// delete a photo
/* const id = '6ac79f6a8772cc97c9e61994';

Photo.findByIdAndDelete(id).then((data) => {
  console.log('Photo deleted:', data);
});
 */