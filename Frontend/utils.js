
export function gallery_layout(images,screenContainer,target_height) {
    let Container=0;
    let rows = [];
let aspect_ratio;
let scaleFactor;
let finalWidth;
let finalHeight;
let imageContainer=[];
const averageAspectRatio = 1.3;
const averageImageWidth = target_height * averageAspectRatio;
const idealImagesPerRow = Math.floor(screenContainer / averageImageWidth);
const minImagesPerRow = Math.max(3, idealImagesPerRow - 1);
const maxImagesPerRow = idealImagesPerRow + 1;

for(let image of images){
    aspect_ratio= image.width/image.height;
    image.temp_width= target_height*aspect_ratio;

    const willOverflow = Container + image.temp_width > screenContainer;
const enoughImages = imageContainer.length >= minImagesPerRow;
const tooManyImages = imageContainer.length >= maxImagesPerRow;

if ((willOverflow && enoughImages) || tooManyImages) {
        if (Container > 0) {
    scaleFactor = screenContainer / Container;
} 
        finalHeight=Math.ceil(target_height*scaleFactor);
        for(let image of imageContainer){
            image.finalHeight=finalHeight;
            image.finalWidth=image.temp_width*scaleFactor
            // console.log(imageContainer);
        }
        // console.log("conatiner emptied");
        rows.push([...imageContainer]);
        imageContainer=[];
        Container = 0;
        imageContainer.push(image);
        Container += image.temp_width;
    }else{
        imageContainer.push(image);
        Container += image.temp_width;
    }
    
}
if (imageContainer.length > 0) {

    for (let image of imageContainer) {

        image.finalHeight = target_height;
        image.finalWidth = image.temp_width; // already calculated at target_height

        // console.log(
        //     "Last Row ->",
        //     "Height =", image.finalHeight,
        //     "Width =", image.finalWidth
        // );
    }
    rows.push([...imageContainer]);
    
}
return rows;
}

// gallery(images,100,50);