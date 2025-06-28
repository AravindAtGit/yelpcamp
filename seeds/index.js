
const mongoose=require('mongoose');
const cities=require('./cities');
const {descriptors,places}=require('./names')
const campground=require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelpcamp') 

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("db connected")
});
const sample=array=>array[Math.floor(Math.random()*array.length)];
const seedDB=async()=>{
    await campground.deleteMany({});
    for(let i=0;i<50;i++)
    {
      const random1000=Math.floor(Math.random()*1000);
      const price=Math.floor(Math.random()*100)+10;
      const camp=new campground({
        title:`${sample(descriptors)} ${sample(places)}`,
         geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
       images: [
    {
      url: 'https://res.cloudinary.com/dcxs21ahv/image/upload/v1750952331/YelpCamp/rf4zj70rx8ultzefbbpk.png',
      filename: 'YelpCamp/rf4zj70rx8ultzefbbpk',
    }
  ],
        price:price,
        desciption:'This is the end ',
        location:`${cities[random1000].city}, ${cities[random1000].state}` ,
        author:'68598a100a85ba58c7e4df9b',
      })
      await camp.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close();
}
);