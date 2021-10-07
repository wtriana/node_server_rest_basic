
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = ( files, extentionValid = ['png', 'jpg', 'jpeg', 'gif'], dirFiles = 'img') => {

    return new Promise((resolve, reject) => {

        const { file: uploadedFile } = files;
        const nameCut = uploadedFile.name.split('.');
        const extention = nameCut[nameCut.length - 1];

        //validar extención
        
        if (!extentionValid.includes(extention)) {
            return reject(`extention .${extention} no valid - [${extentionValid}] `)
        }

        const nameNew = `${uuidv4()}.${extention}`
        const uploadPath = path.join(__dirname, '../uploads/', dirFiles, nameNew);
        //console.log(uploadPath);

        //Use the mv() method to place the file somewhere on your server
        uploadedFile.mv(uploadPath, (err) => {
            if (err) {
                return reject(err); 
            }

            resolve( nameNew );   
        })

    });



}


module.exports = {
    uploadFile,

}