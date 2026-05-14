import mongoose from "mongoose";
import slugify from "slugify";

import Property from "@/models/Property";

async function run(){

  await mongoose.connect(
    "mongodb://127.0.0.1:27017/realestate"
  );

  const properties =
    await Property.find();

  for(
    const p of properties
  ){

    if(!p.slug){

     p.slug =
  slugify(
    `${p.title}-${p.propertyId}`,
          {
            lower:true,
            strict:true
          }
        );

      await p.save();

      console.log(
        `Updated: ${p.title}`
      );

    }

  }

  console.log(
    "Slug updated successfully"
  );

  process.exit();

}

run();