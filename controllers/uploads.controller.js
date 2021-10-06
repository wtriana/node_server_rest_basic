const { response } = require("express");
const { uploadFile } = require('../helpers');

const uploadFileNew = async( req, res = response ) => {

    
    try {
        if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
            return res.status(400).json({msg:'No files were uploaded.'});
        }

        const nameFile = await uploadFile(req.files);
        return res.status(200).json({ nameFile });

    } catch (error) {
        return res.status(400).json({ error });
    }
    

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
   

}

module.exports = {
    uploadFileNew,
}