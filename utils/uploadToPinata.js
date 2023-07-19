const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")
require("dotenv").config()

const pinataAPIKey = process.env.PINATA_API_KEY
const pinataAPISecret = process.env.PINATA_API_SECRET
const pinata = new pinataSDK(pinataAPIKey, pinataAPISecret)

async function storeImages(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath) // will give full output of the path
    const files = fs.readdirSync(fullImagesPath)
    // console.log(files)
    let responses = []
    console.log("Uploading to Pinata!")
    for (fileIndex in files) {
        console.log(`Working on ${fileIndex}...`)
        const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`) // creates bytes from image
        const options = {
            pinataMetadata: {
                name: files[fileIndex],
            },
        }
        try {
            const response = await pinata.pinFileToIPFS(readableStreamForFile, options) // pinata stuff
            responses.push(response)
        } catch (error) {
            console.log(error)
        }
    }
    return { responses, files }
}

async function storeTokenUriMetadata(metadata) {
    const options = {
        pinataMetadata: {
            name: metadata.name,
        },
    }
    try {
        const response = await pinata.pinJSONToIPFS(metadata, options)
        return response
    } catch (error) {
        console.log(error)
    }
    return null
}

module.exports = { storeImages, storeTokenUriMetadata }
