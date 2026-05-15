import {
  useState,
  useCallback,
  useRef,
  useEffect
} from "react";

/* MongoDB API Response Type */
interface SuggestionItem {

  id?: string;

  name?: string;

  title?: string;

  locality?: string;

  city?: string;

  category?: string;

}

interface UseAutocompleteOptions {

  category?:
    | "all"
    | "locality"
    | "property"
    | "keyword";

  minChars?: number;

  debounceMs?: number;

}

export function useAutocomplete(
  options:
    UseAutocompleteOptions = {}
){

  const {

    category = "all",

    minChars = 1,

    debounceMs = 300

  } = options;

  const [query, setQuery] =
    useState("");

  const [suggestions, setSuggestions] =
    useState<SuggestionItem[]>([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [showSuggestions, setShowSuggestions] =
    useState(false);

  const debounceTimerRef =
    useRef<
      NodeJS.Timeout | undefined
    >(undefined);

  /* FETCH SUGGESTIONS */
  const fetchSuggestions =
    useCallback(

      async (
        searchQuery: string
      ) => {

        if(
          searchQuery.length <
          minChars
        ){

          setSuggestions([]);

          setShowSuggestions(
            false
          );

          return;

        }

        setIsLoading(
          true
        );

        try{

          const params =
            new URLSearchParams({

              q:
                searchQuery,

              category

            });

          const response =
            await fetch(

              `/api/search/autocomplete?${params}`

            );

          const data =
            await response.json();

          if(
            data.success
          ){

            setSuggestions(

              data.suggestions || []

            );

            setShowSuggestions(
              true
            );

          }

          else{

            setSuggestions([]);

          }

        }

        catch(
          error
        ){

          console.error(

            "Autocomplete fetch error:",

            error

          );

          setSuggestions([]);

        }

        finally{

          setIsLoading(
            false
          );

        }

      },

      [
        category,
        minChars
      ]

    );

  /* INPUT CHANGE */
  const handleInputChange =
    useCallback(

      (
        value: string
      ) => {

        setQuery(
          value
        );

        if(
          debounceTimerRef.current
        ){

          clearTimeout(

            debounceTimerRef.current

          );

        }

        debounceTimerRef.current =

          setTimeout(

            () => {

              fetchSuggestions(
                value
              );

            },

            debounceMs

          );

      },

      [
        fetchSuggestions,
        debounceMs
      ]

    );

  /* CLICK SUGGESTION */
  const handleSelectSuggestion =
    useCallback(

      (
        item:
          SuggestionItem
      ) => {

        const selectedText =

          item.title ||

          item.name ||

          item.locality ||

          item.city ||

          item.category ||

          "";

        setQuery(
          selectedText
        );

        setShowSuggestions(
          false
        );

        setSuggestions(
          []
        );

      },

      []

    );

  /* CLEAR */
  const handleClear =
    useCallback(

      () => {

        setQuery("");

        setSuggestions([]);

        setShowSuggestions(
          false
        );

      },

      []

    );

  /* CLOSE */
  const handleCloseSuggestions =
    useCallback(

      () => {

        setShowSuggestions(
          false
        );

      },

      []

    );

  /* CLEANUP */
  useEffect(

    () => {

      return () => {

        if(
          debounceTimerRef.current
        ){

          clearTimeout(

            debounceTimerRef.current

          );

        }

      };

    },

    []

  );

  return {

    query,

    suggestions,

    isLoading,

    showSuggestions,

    handleInputChange,

    handleSelectSuggestion,

    handleClear,

    handleCloseSuggestions,

    setQuery,

    setShowSuggestions

  };

}