const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review = require('./review')
const cschema=new Schema({
    title:String,
    images:[
{url:String,
filename:String}
    ],
    price:Number,
     geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description:String,
    location:String,
    author:{
        type: Schema.Types.ObjectId,
            ref:'User'
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
})
cschema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
module.exports=mongoose.model('campground',cschema);
