// this controller is for some crud -

import Collection from "../models/collection.schema.js";
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/customError.js";

// creating collection
export const createCollection = asyncHandler(async (req, res) => {
  // getting name of collection
  const { name } = req.body;

  // checking name of collection is there or not
  if (!name) {
    throw new CustomError("Collection name is required", 401);
  }

  // if collection name is there we need to create a collection
  const collection = await Collection.create({
    name: name,
  });

  res.status(200).json({
    success: true,
    message: "Collection was created successfully",
    collection,
  });
});

// updating collection
export const updateCollection = asyncHandler(async (req, res) => {
  const { name } = req.body;
  // we also need id of the collection which user want to update
  // (we can grab via url - params) - we are updating name of id here - collcetionId
  const { id: collectionId } = req.params;

  if (!name) {
    throw new CustomError("Collection name is required", 401);
  }

  // updating collectio name here -
  const updatedCollection = await Collection.findOneAndUpdate(
    collectionId,
    { name: name },
    { new: true, runValidators: true }
  );
  // 3rd parameter - ( { new: true, runValidators: true }) -
  // `new: true` says - return collection only after updated
  // `runValidators: true` - says run all validators of Schema on updation time

  // checking collection is finded or not
  if (!updatedCollection) {
    throw new CustomError("Collection not found", 401);
  }

  res.status(200).json({
    success: true,
    message: "Collection was updated successfully",
    updatedCollection,
  });
});

// deleting collection
export const deleteCollection = asyncHandler(async (req, res) => {
  const { id: collectionId } = req.params;

  const collectionToDelete = await Collection.findById(collectionId);

  if (!collectionToDelete) {
    throw new CustomError("Collection not found", 401);
  }

  await collectionToDelete.remove();

  res.status(200).json({
    success: true,
    message: "Collection deleted successfully",
  });
});

// getting all collection
export const getAllCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.find();

  if (!collection) {
    throw new CustomError("No collection found", 400);
  }

  res.status(200).json({
    success: true,
    collection,
  });
});
