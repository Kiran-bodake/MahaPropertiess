import React from "react";

import {
  Search,
  Loader2,
  MapPin,
  Home,
  Tag
} from "lucide-react";

/* MongoDB Suggestion Type */
interface SuggestionItem {

  id?: string;

  name?: string;

  title?: string;

  locality?: string;

  city?: string;

  category?: string;

  icon?: string;

  price?: string;

  area?: string;

}

interface AutocompleteDropdownProps {

  suggestions:
    SuggestionItem[];

  isLoading:
    boolean;

  isOpen:
    boolean;

  query:
    string;

  onSelect:
    (
      item:
        SuggestionItem
    ) => void;

  onClose:
    () => void;

  maxHeight?:
    string;

  className?:
    string;

}

export const
AutocompleteDropdown =
React.forwardRef<

  HTMLDivElement,

  AutocompleteDropdownProps

>(

  (
    {

      suggestions,

      isLoading,

      isOpen,

      query,

      onSelect,

      onClose,

      maxHeight =
        "400px",

      className =
        ""

    },

    ref

  ) => {

    if(
      !isOpen
    )
      return null;

    /* ICON LOGIC */
    const getIcon =
      (
        item:
          SuggestionItem
      ) => {

        if(
          item.locality ||

          item.city
        ){

          return (

            <MapPin
              size={16}
              className="text-green-600"
            />

          );

        }

        if(
          item.title
        ){

          return (

            <Home
              size={16}
              className="text-blue-600"
            />

          );

        }

        return (

          <Tag
            size={16}
            className="text-orange-600"
          />

        );

      };

    /* LABEL LOGIC */
    const getBadge =
      (
        item:
          SuggestionItem
      ) => {

        if(
          item.locality ||

          item.city
        )
          return {

            bg:
              "bg-green-50",

            text:
              "text-green-700",

            label:
              "Location"

          };

        if(
          item.title
        )
          return {

            bg:
              "bg-blue-50",

            text:
              "text-blue-700",

            label:
              "Property"

          };

        return {

          bg:
            "bg-orange-50",

          text:
            "text-orange-700",

          label:
            "Type"

        };

      };

    return (

      <div

        ref={
          ref
        }

        style={{

          background:
            "white",

          borderRadius:
            "12px",

          boxShadow:
            "0 12px 30px rgba(0,0,0,.12)",

          border:
            "1px solid #e5e7eb",

          maxHeight,

          overflow:
            "auto"

        }}

        className={
          className
        }

      >

        {/* LOADING */}
        {isLoading && (

          <div
            className="
              flex
              items-center
              justify-center
              gap-2
              p-4
              text-gray-600
            "
          >

            <Loader2
              size={16}
              className="
                animate-spin
              "
            />

            <span>
              Searching...
            </span>

          </div>

        )}

        {/* EMPTY */}
        {!isLoading &&

          suggestions.length === 0 &&

          query.length > 0 && (

          <div
            className="
              p-4
              text-center
              text-gray-500
            "
          >

            <Search
              size={20}
              className="
                mx-auto
                mb-2
                opacity-50
              "
            />

            <p>
              No results for
              "{query}"
            </p>

          </div>

        )}

        {/* RESULTS */}
        {!isLoading &&

          suggestions.length > 0 && (

          <div
            className="
              py-1
            "
          >

            {suggestions.map(

              (
                item,
                idx
              ) => {

                const badge =

                  getBadge(
                    item
                  );

                const displayText =

                  item.title ||

                  item.name ||

                  item.locality ||

                  item.city ||

                  item.category ||

                  "";

                const subText =

                  item.locality &&

                  item.city

                    ? `${item.locality}, ${item.city}`

                    : item.city ||

                      item.category ||

                      "";

                return (

                  <div

                    key={
                      `${item.id}-${idx}`
                    }

                    className="
                      border-b
                      border-gray-100
                      last:border-b-0
                    "

                  >

                    <button

                      onClick={() => {

                        onSelect(
                          item
                        );

                        onClose();

                      }}

                      className="
                        w-full
                        px-4
                        py-3
                        hover:bg-gray-50
                        transition-colors
                        text-left
                        flex
                        items-start
                        justify-between
                        gap-3
                        group
                      "

                    >

                      <div
                        className="
                          flex
                          items-start
                          gap-3
                          flex-1
                          min-w-0
                        "
                      >

                        <div
                          className="
                            mt-0.5
                            flex-shrink-0
                          "
                        >

                          {getIcon(
                            item
                          )}

                        </div>

                        <div
                          className="
                            flex-1
                            min-w-0
                          "
                        >

                          <div
                            className="
                              font-medium
                              text-gray-900
                              truncate
                              text-sm
                            "
                          >

                            {
                              displayText
                            }

                          </div>

                          {subText && (

                            <div
                              className="
                                text-xs
                                text-gray-500
                                mt-1
                              "
                            >

                              {
                                subText
                              }

                            </div>

                          )}

                        </div>

                      </div>

                      <span

                        className={

                          `text-xs px-2 py-1 rounded-md ${badge.bg} ${badge.text}`

                        }

                      >

                        {
                          badge.label
                        }

                      </span>

                    </button>

                  </div>

                );

              }

            )}

          </div>

        )}

      </div>

    );

  }

);

AutocompleteDropdown.displayName =
  "AutocompleteDropdown";