import Property from "@/models/Property";
import PropertyLocation from "@/models/PropertyLocation";
import PropertyImage from "@/models/PropertyImage";
import PropertyUser from "@/models/PropertyUser";
import PropertyPricing from "@/models/PropertyPricing";
import PropertyArea from "@/models/PropertyArea";
import PropertyFlags from "@/models/PropertyFlags";
import PropertyAmenity from "@/models/PropertyAmenity";
import PropertyHighlight from "@/models/PropertyHighlight";
import slugify from "slugify";

export const createProperty = async (
  body: any
) => {

  const propertyId =
    body.propertyId;

  if (!propertyId) {
    throw new Error(
      "propertyId is required"
    );
  }

  const existingProperty =
    await Property.findOne({
      propertyId,
    });

  if (existingProperty) {
    throw new Error(
      `Property already exists with ID: ${propertyId}`
    );
  }


  const slug =

  slugify(

    body.title,

    {

      lower: true,

      strict: true

    }

  );
  /* MAIN PROPERTY */
  const property =
    await Property.create({

      propertyId,

      slug,

      title:
        body.title,

      description:
        body.description || "",

      category:
        body.category,

      categoryLabel:
        body.categoryLabel || "",

      status:
        body.status || "available",

      constructionStatus:
        body.constructionStatus || "ready",

      postedBy:
        body.postedBy,

      agentName:
        body.agentName,

      agentPhone:
        body.agentPhone

    });

  /* RELATED COLLECTIONS */
  await Promise.all([

    /* USER */
    PropertyUser.create({

      propertyId,

      postedBy:
        body.postedBy,

      name:
        body.agentName,

      phone:
        body.agentPhone

    }),

    /* LOCATION */
    PropertyLocation.create({

      propertyId,

      state:
        body.state || "",

      city:
        body.city || "",

      locality:
        body.locality || "",

      pincode:
        body.pincode || "",

      houseNo:
        body.houseNo || "",

      street:
        body.street || "",

      landmark:
        body.landmark || "",

      address:
        body.address || "",

      latitude:
        body.latitude || "",

      longitude:
        body.longitude || ""

    }),

    /* PRICING */
    PropertyPricing.create({

      propertyId,

      price:
        Number(body.price) || 0,

      pricePerUnit:
        Number(body.pricePerUnit) || 0,

      priceNegotiable:
        body.priceNegotiable || false

    }),

    /* AREA */
    PropertyArea.create({

      propertyId,

      area:
        Number(body.area) || 0,

      areaUnit:
        body.areaUnit || "sqft",

      convertedSqft:
        Number(body.convertedSqft) || 0

    }),

    /* FLAGS */
    PropertyFlags.create({

      propertyId,

      isRERA:
        body.isRERA || false,

      reraNumber:
        body.reraNumber || "",

      isZeroBrokerage:
        body.isZeroBrokerage || false,

      isFeatured:
        body.isFeatured || false,

      isVerified:
        false,

      isActive:
        true

    })

  ]);

  /* AMENITIES */
  if (body.amenities?.length) {

    await PropertyAmenity.create({

      propertyId,

      amenities:
        body.amenities

    });

  }

  /* HIGHLIGHTS */
  if (body.highlights?.length) {

    await PropertyHighlight.create({

      propertyId,

      highlights:
        body.highlights

    });

  }

  /* IMAGES */
  if (body.images?.length) {

    await PropertyImage.create({

      propertyId,

      images:
        body.images.map(
          (
            url: string,
            index: number
          ) => ({
            url,
            isPrimary:
              index === 0,
            displayOrder:
              index
          })
        )

    });

  }

  return property;

};