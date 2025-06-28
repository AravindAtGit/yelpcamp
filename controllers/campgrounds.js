const campground=require('../models/campground.js');
const { cloudinary } = require("../cloudinary");

const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index=async (req,res)=>{
    const cg=await campground.find({})
    res.render('campgrounds/index',{cg})
}
module.exports.renderNewForm=(req,res)=>{
    res.render('campgrounds/newcg')
}
module.exports.createCampground=async (req,res,next)=>{
     const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });

    const cg=new campground(req.body.campground);
    cg.geometry = geoData.features[0].geometry;
     cg.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    cg.author=req.user._id;
    await cg.save();
    console.log(cg);
    req.flash('success','successfully made a campground')
    res.redirect(`/campgrounds/${cg._id}`);
}
module.exports.showCampground=async (req,res)=>{
    const id=req.params.id;
    // const cg=await campground.findById(id).populate('reviews').populate('author');
     const cg= await campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
     if (!cg) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{cg})
};
module.exports.renderEditForm=async (req,res)=>{
    const id=req.params.id;
    const cg=await campground.findById(id);
     if (!cg) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{cg})
}
module.exports.deleteCampground=async (req,res)=>{
    const id=req.params.id;
    await campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds')
}
module.exports.updateCampground=async(req,res)=>{
     const {id}=req.params;
    const cg= await campground.findByIdAndUpdate(id,{...req.body.campground});
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    campground.geometry = geoData.features[0].geometry;
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    cg.images.push(...imgs);
    await cg.save();
     if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await cg.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
     req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${cg._id}`);
}