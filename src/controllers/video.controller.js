import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
// import jwt from "jsonwebtoken";
// import mongoose, { mongo } from "mongoose";


const publishVideo = asyncHandler(async(req, res)=>{
 const {title , description, duration} = req.body
 if(
    [title, description, duration].some((field)=>field?.trim === "")
 ){
    throw new Error("fields are required")
 }

const videoLocalPath = req.files?.videoFile[0]?.path
if(!videoLocalPath){
    throw new Error("video field is required")
}

const thumbnailLocalPath = req.files?.thumbnail[0]?.path

const videoFile = await uploadOnCloudinary(videoLocalPath)
const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

const video = await Video.create({
title,
description,
duration,
videoFile: videoFile.url,
thumbnail: thumbnail?.url || ""
})

const createdVideo = await Video.findById(video._id).select()

if(!createdVideo){
    throw new Error(" the video is not created")
}
 return res
 .status(201)
 .json({createdVideo})
})

const getVideo = asyncHandler(async(req , res)=>{
    const {videoId} = req.params
     const video = await Video.findById(videoId).select()
     if(!video){
        throw new Error("cant get the video")
     }


     return res
     .status(201)
     .json({video})
        

})

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const getVideo = await Video.findById(videoId);

  const videoLocalPath = req.file?.path;
  if (!videoLocalPath) {
    throw new Error("No video file uploaded"); 
  }

  const uploadVideo = await uploadOnCloudinary(videoLocalPath);
  const uploadedUrl = uploadVideo?.url || uploadVideo?.secure_url;
  if (!uploadedUrl) {
    throw new Error("Cloudinary upload failed or URL missing");
  }

  const videoupdate = await Video.findByIdAndUpdate(
    videoId,
    { $set: { videoFile: uploadedUrl } },
    { new: true }
  );

  return res.status(201).json({ videoupdate });
});

const deleteVideo = asyncHandler(async(req, res)=>{
const { videoId } = req.params
const deleteVideo = Video.findByIdAndDelete(videoId)

return res.json({message:"video deleted"})
})

export {publishVideo, getVideo, updateVideo, deleteVideo }

