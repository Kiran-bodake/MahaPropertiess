import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import Property from "@/models/Property";
import PropertyLocation from "@/models/PropertyLocation";


export async function GET(req:NextRequest){

    try{

        await connectDB();


        const {searchParams}=new URL(req.url);

        const q = searchParams.get("q")?.trim();


        if(!q){

            return NextResponse.json({
                suggestions:[]
            });

        }


        const regex = new RegExp(q,"i");


        const properties = await Property.find({

            $or:[
                {
                    title:regex
                },
                {
                    category:regex
                }
            ]

        })
        .limit(5)
        .select(
            "title slug category"
        );



        const locations = await PropertyLocation.find({

            $or:[
                {
                    city:regex
                },
                {
                    locality:regex
                }
            ]

        })
        .limit(5)
        .select(
            "city locality"
        );



        const suggestions=[


            ...properties.map((p)=>({

                type:"property",

                label:p.title,

                slug:p.slug,

                category:p.category

            })),


            ...locations.map((l)=>({

                type:"location",

                label:
                `${l.locality}, ${l.city}`

            }))

        ];



        return NextResponse.json({

            suggestions

        });


    }
    catch(error){

        console.log(error);


        return NextResponse.json(
            {
                error:"search failed"
            },
            {
                status:500
            }
        )

    }

}