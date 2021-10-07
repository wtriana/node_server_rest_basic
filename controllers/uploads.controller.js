const { response } = require("express");
const { uploadFile } = require('../helpers');

const uploadFileNew = async( req, res = response ) => {

    
    try {
        if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
            return res.status(400).json({msg:'No files were uploaded.'});
        }

        //const nameFile = await uploadFile(req.files,['txt','md'], 'file-text');
        const nameFile = await uploadFile(req.files,undefined , undefined);
        return res.status(200).json({ nameFile });

    } catch (error) {
        return res.status(400).json({ error });
    }

}

module.exports = {
    uploadFileNew,
}