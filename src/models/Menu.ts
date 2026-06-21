import { Schema, model, models } from "mongoose";

const MenuSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    href: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      enum: ["header", "footer"],
      required: true,
    },

    groupName: {
      type: String,
      default: "",
    },

    cssClass: {
      type: String,
      default: "",
    },

    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Menu",
      default: null,
    },

    order: {
      type: Number,
      default: 0,
    },

    level: {
      type: Number,
      default: 1,
    },

    type: {
      type: String,
      enum: ["custom", "category", "city", "locality", "blog", "tool"],
      default: "custom",
    },

    icon: String,
    image: String,
    description: String,

    openInNewTab: {
      type: Boolean,
      default: false,
    },

    megaMenu: {
      type: Boolean,
      default: false,
    },

    target: {
      type: String,
      default: "_self",
    },

    active: {
      type: Boolean,
      default: true,
    },

    showOnDesktop: {
      type: Boolean,
      default: true,
    },

    showOnMobile: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Menu = models.Menu || model("Menu", MenuSchema);

export default Menu;
