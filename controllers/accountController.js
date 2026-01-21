const userModel = require('../models/user-model'); 
const cloudinary = require('../config/cloudinary-config');
const imageId = require('../utils/idExtraction');

// Now first of all we will get the account page 

module.exports.getAccountPage = async (req, res) => {

    try{

    const user = await userModel.findOne({email : req.user.email}); 

    if(!user){
        req.flash('error', 'User not found');
        return res.redirect('/');
    }

    // user found

    res.render('account', { // Show the account where we will send the user , success , error
        user, 
        success: req.flash("success"),
        error: req.flash("error")
    });
    } catch(error){

       req.flash('error', 'Something went wrong');
       res.redirect('/');

    }

};

// Now the updated information 

module.exports.updateAccount = async(req, res) => {
    
    try{

    const { fullname, contact, street, city, state, country } = req.body; // data we will get 

    // validate the fields

    if(!fullname){

        req.flash('error', 'Full name is required')
        return res.redirect('/account');

    }

    const updatedUser = await userModel.findOneAndUpdate( // updating the required fields by the data we got
        {
            email : req.user.email
        }, 
        {
         fullname, 
         contact,
         address: {
            street,
            city,
            state,
            country
         }

        },
        {
            new: true
        }        
    )

    if(!updatedUser){
        req.flash('error', 'User not found');
        return res.redirect('/account');
    }

    req.flash('success', 'Account updated successfully!');
    res.redirect('/account');

    } catch (error){
        
        req.flash('error', 'Failed to update account');
        res.redirect('/account');

    }

}

// uploading the picture 

module.exports.uploadProfilePicture = async (req, res) => {

    try{

    

    const user = await userModel.findOne({email: req.user.email });

    if(!req.file){

        req.flash('error', 'Please select an image to upload');
        return res.redirect('/account');

    }

    const b64 = Buffer.from(req.file.buffer).toString('base64'); // here the data we are recieving is in the memory in the form of buffer and is converted to the string 
    const dataURI = `data:${req.file.mimetype};base64,${b64}`; // now we have converted it to a complete dataURI and the buffer can take it as it....


    if(user.picture && user.picture.includes('cloudinary.com')){ // It is if we have to update a new picture in place of the already present one 

        // extract the pucblic id
        const publicId = user.picture.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId);

     }


    // upload to the cloudinary

    const result = await cloudinary.uploader.upload(dataURI, {

        folder: 'Profile-Picture',
        resource_type: 'auto',
        transformation: [
            
            { width: 500, height: 500, crop: 'limit'},
            { quality: 'auto' }
            // { radius: 'max'}
        ]

    });

    // updating the database with url 
    const updatedUser = await userModel.findOneAndUpdate(

        {email: req.user.email},

        {
            picture :  result.secure_url
        },

        {new : true}

    )

    req.user.picture = updatedUser.picture;

    if(!updatedUser){

        req.flash('error', 'User not found');
        return res.redirect('/account');

    }

    req.flash('success', 'Profile picture updated successfully');
    res.redirect('/account');
    
    }catch(error){

        req.flash('error', 'Failed uploading profile picture:', error);
        res.redirect('/account');

    }    

}