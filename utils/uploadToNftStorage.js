const { NFTStorage, File } = require("nft.storage")
const mime = require("mime")
const path = require("path")
const fs = require("fs")
require("dotenv").config()

const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY
const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })

/**
 * Reads an image file from `imagePath` and stores an NFT with the given name and description.
 * @param {string} imagePath the path to an image file
 * @param {string} name a name for the NFT
 * @param {string} description a text description for the NFT
 */

async function storeNFTs(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath) // will give full output of the path
    const files = fs.readdirSync(fullImagesPath)
    // console.log(files)
    let responses = []
    console.log("Uploading to NFT.Storage!")
    for (fileIndex in files) {
        console.log(`Working on ${fileIndex}...`)
        const imageFile = await fileFromPath(`${fullImagesPath}/${files[fileIndex]}`)
        const name = files[fileIndex].replace(".png", "")

        try {
            const response = await nftstorage.store({
                image: imageFile,
                name: name,
                description: `An adorable ${name}`,
                // Currently doesn't support attributes 😔
                // attributes: [{ trait_type: "cuteness", value: 100 }],
            }) // NFT.Storage stuff
            console.log("Response:", response.url)
            responses.push(response.url)
        } catch (error) {
            console.log(error)
        }
    }
    return responses
}

/**
 * A helper to read a file from a location on disk and return a File object.
 * Note that this reads the entire file into memory and should not be used for
 * very large files.
 * @param {string} filePath the path to a file to store
 * @returns {File} a File object containing the file content
 */

async function fileFromPath(filePath) {
    const content = await fs.promises.readFile(filePath)
    const type = mime.getType(filePath)
    return new File([content], path.basename(filePath), { type })
}

module.exports = { storeNFTs }
