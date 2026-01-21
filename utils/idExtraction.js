// It will help us extract the public_id from the cloudinary

module.exports =  function extractPublicId(imageUrl){

    if(!imageUrl || typeof imageUrl !== "string") return null;

    // remove at the query params
    const cleanUrl = imageUrl.split("?")[0];


    // Clean url is to be split at '/'

    const parts = cleanUrl.split('/');

    // now the index where we need the id 

    const uploadIndex = parts.indexOf('upload');

    if(uploadIndex === -1){
        return null;
    }

    // we need to move 2 steps and leave the upload and version

    let pathParts = parts.slice(uploadIndex + 1);

    // lets handle the transformation too

    if(pathParts[0]?.includes(",")) pathParts.shift();


    // for the version if exist in here 

    if(pathParts[0].match(/^v\d+$/)) pathParts.shift();

    // now the id without any other thing 

    const publicId = pathParts.join('/').replace(/\.[^/.]+$/, '');

    return publicId;

}