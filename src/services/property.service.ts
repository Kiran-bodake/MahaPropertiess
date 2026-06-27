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

import NotificationModel from "@/models/Notification";

export const createProperty = async (body: any) => {
  try {
    /* PROPERTY ID */
    const propertyId = body.propertyId;

    if (!propertyId) {
      throw new Error("propertyId is required");
    }

    /* CHECK EXISTING */
    const existingProperty = await Property.findOne({
      propertyId,
    });

    if (existingProperty) {
      throw new Error(`Property already exists with ID: ${propertyId}`);
    }

    /* SLUG */
    const slug = `${slugify(body.title || "property", {
      lower: true,

      strict: true,
    })}-${propertyId.toLowerCase()}`;

    
    /* CREATE MAIN PROPERTY */
    const property = await Property.create({
      propertyId,

      slug,

      title: body.title || "",

      description: body.description || "",

      category: body.category || "",

      approvalStatus: "pending",

      categoryLabel: body.categoryLabel || "",

       city: body.city || "",

  state: body.state || "",

  locality: body.locality || "",

      status: body.status || "available",

      constructionStatus: body.constructionStatus || "ready",
postedBy:
  body.postedBy
    ? body.postedBy.charAt(0).toUpperCase() + body.postedBy.slice(1).toLowerCase()
    : "Owner",

      agentName: body.agentName || "",

      agentPhone: body.agentPhone || "",

      // Residential
      carpetArea: body.carpetArea || "",

      builtUpArea: body.builtUpArea || "",

      bedrooms: body.bedrooms || "",

      bathrooms: body.bathrooms || "",

      furnishedStatus: body.furnishedStatus || "",

      // Commercial
      shopType: body.shopType || "",

      mainRoadFacing: body.mainRoadFacing || false,

      // Agriculture
      borewellAvailable: body.borewellAvailable || false,

      roadWidth: body.roadWidth || "",

      waterSource: body.waterSource || "",

      documentationStatus: body.documentationStatus || "",

      // Warehouse
      powerLoad: body.powerLoad || "",

      truckAccess: body.truckAccess || false,

      industrialApproved: body.industrialApproved || false,
    });

    /* NOTIFICATION */
   /* NOTIFICATION */

try {
  await NotificationModel.create({

    userId: body.userId || property._id.toString(),

    type: "system",

    title: "New Property Submitted",

    message: `${property.title} is waiting for approval`,

    referenceId: property._id,

    isRead: false,

  });

} catch (notificationError) {

  console.error(
    "Notification Creation Error:",
    notificationError
  );

}
   /* USER */

const propertyUserPostedBy =
  body.postedBy?.toLowerCase() === "builder"
    ? "builder"
    : body.postedBy?.toLowerCase() === "dealer"
    ? "dealer"
    : "owner";


await PropertyUser.create({
  propertyId,

  postedBy: propertyUserPostedBy,

  name: body.agentName || "",

  phone: body.agentPhone || "",
});
    /* LOCATION */
    await PropertyLocation.create({
      propertyId,

      state: body.state || "",

      city: body.city || "",

      locality: body.locality || "",

      pincode: body.pincode || "",

      houseNo: body.houseNo || "",

      street: body.street || "",

      landmark: body.landmark || "",

      address: body.address || "",

      latitude: body.latitude || "",

      longitude: body.longitude || "",
    });

    /* PRICING */
    await PropertyPricing.create({
      propertyId,

      price: Number(body.price) || 0,

      pricePerUnit: Number(body.pricePerUnit) || 0,

      priceNegotiable: body.priceNegotiable || false,
    });

    /* AREA */
    await PropertyArea.create({
      propertyId,

      area: Number(body.area) || 0,

      areaUnit: body.areaUnit || "sqft",

      convertedSqft: Number(body.convertedSqft) || 0,
    });

    /* FLAGS */
    await PropertyFlags.create({
      propertyId,

      isRERA: body.isRERA || false,

      reraNumber: body.reraNumber || "",

      isZeroBrokerage: body.isZeroBrokerage || false,

      isFeatured: body.isFeatured || false,

      isVerified: false,

      isActive: true,
    });

    /* AMENITIES */
    if (body.amenities?.length) {
      await PropertyAmenity.create({
        propertyId,

        amenities: body.amenities,
      });
    }

    /* HIGHLIGHTS */
    if (body.highlights?.length) {
      await PropertyHighlight.create({
        propertyId,

        highlights: body.highlights,
      });
    }

    /* IMAGES */
    if (body.images?.length) {
      await PropertyImage.create({
        propertyId,

        images: body.images.map(
          (
            url: string,

            index: number,
          ) => ({
            url,

            isPrimary: index === 0,

            displayOrder: index,
          }),
        ),
      });
    }

    return property;
  } catch (error) {
    console.error(
      "CREATE_PROPERTY_ERROR",

      error,
    );

    throw error;
  }
};
