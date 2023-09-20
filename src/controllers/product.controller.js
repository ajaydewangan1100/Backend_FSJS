//
import formidable from "formidable";
import Product from "../models/product.schema.js";
import { s3FileUpload, s3DeleteFile } from "../service/imageUpload.js";
import mongoose from "mongoose";
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/customError.js";
import config from "../config/index.js";
import fs from "fs";

// method for addig product - alongwith upload media files also
export const addProduct = asyncHandler(async (req, res) => {
  const form = formidable({ multiples: true, keepExtensions: true });

  form.parse(req, async function (err, fields, files) {
    // handle if err
    if (err) {
      throw new CustomError(
        err.message || "Something went wrong on upload",
        500
      );
    }

    let productId = new mongoose.Types.ObjectId().toHexString();

    // just for check what things looks like under - fields and files
    console.log(fields, files);

    // checking requierd fields - based on product Schema
    if (
      !fields.name ||
      !fields.price ||
      !fields.description ||
      !fields.collectionId
    ) {
      throw new CustomError("Please fill all the fields", 500);
    }

    // this method will give image array responce
    let imgArrayResponce = Promise.all(
      Object.keys(files).map(async (file, index) => {
        const element = file[filekey];
        console.log(element);

        const data = fs.readFileSync(element.filepath);

        const upload = await s3FileUpload({
          bucketName: config.S3_BUCKET_NAME,
          key: `products/${productId}/photo_${index + 1}.png`,
          body: data,
          contentType: element.mimetype,
        });

        // files will be like this
        // productId = 123abc456
        // 1 : product/123abc456/photo_1.png
        // 2 : product/123abc456/photo_2.png

        console.log(upload);

        return {
          secure_url: upload.Location,
        };
      })
    );

    // at any point this will give imgArray
    const imgArray = await imgArrayResponce;

    // now creating Product and storing on DB (we have uploaded files and get links of uploaded files)
    const product = await Product.create({
      _id: productId,
      photos: imgArray,
      ...fields,
    });

    // checking product
    if (!product) {
      throw new CustomError("Product failed to be created", 500);
    }

    res.status(200).json({
      success: true,
      product: product,
    });
  });
});

// getting all products
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});

  if (!products) {
    throw new CustomError("No products found", 404);
  }

  res.status(200).json({
    success: true,
    products,
  });
});

// getting single products
export const getProducts = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findById(productId);

  if (!product) {
    throw new CustomError("No product found", 404);
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// get products based on collectionID
export const getProductsByCollectionId = asyncHandler(async (req, res) => {
  const { id: collectionId } = req.params;

  const products = await Product.find({ collectionId });

  if (!products) {
    throw new CustomError("No products found", 404);
  }

  res.status(200).json({
    success: true,
    products,
  });
});

// delete product
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.find(productId);

  if (!product) {
    throw new CustomError("No product found", 404);
  }

  // before deleting product we also need to delete associated photos with product
  // for that our steps -
  // 1 - resolve Promise
  // 2 - loop through photos array
  // 3 - delete each photos

  const deletePhotos = Promise.all(
    Product.photos.map(async (req, res) => {
      await s3DeleteFile({
        bucketName: config.S3_BUCKET_NAME,
        key: `products/${product._id.toString()}/photo_${index + 1}.png`,
      });
    })
  );

  await deletePhotos

  await Product.remove()

  res.status(200).json({
    success: true,
    message: "Product has been deleted successfully"
  })
});

// update Products
// update product alongwith photo -(if atleast single photo uploaded at update time we need to delete all old photos)
export const updateProduct = asyncHandler(async (req, res) => {});

