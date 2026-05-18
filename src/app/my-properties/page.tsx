"use client";

import {
  useEffect,
  useState
} from "react";

type Property = {

  _id: string;

  title: string;

  price?: string;

  approvalStatus?: string;

  createdAt?: string;

};

export default function MyPropertiesPage(){

  const [
    properties,

    setProperties

  ] = useState<Property[]>([]);

  const [
    loading,

    setLoading

  ] = useState(true);

  useEffect(() => {

    const fetchProperties =
      async () => {

        try{

          const user =

            JSON.parse(

              localStorage.getItem(
                "user"
              ) || "{}"

            );

          const res =

            await fetch(

              "/api/user/my-properties",

              {

                method:"POST",

                headers:{

                  "Content-Type":
                    "application/json"

                },

                body: JSON.stringify({

                  userId:
                    user._id

                })

              }

            );

          const data =
            await res.json();

          setProperties(

            data.properties || []

          );

        }

        catch(error){

          console.error(
            error
          );

        }

        finally{

          setLoading(
            false
          );

        }

      };

    fetchProperties();

  }, []);

  const getStatusColor =
    (
      status?: string
    ) => {

      if(
        status ===
        "approved"
      ){

        return "#16a34a";

      }

      if(
        status ===
        "rejected"
      ){

        return "#dc2626";

      }

      return "#f59e0b";

    };

  return (

    <section
      style={{

        minHeight:"100vh",

        background:"#f8fafc",

        padding:"30px"

      }}
    >

      <h1
        style={{

          fontSize:"32px",

          fontWeight:800,

          marginBottom:"30px"

        }}
      >

        My Property Status

      </h1>


      {loading ? (

        <p>
          Loading...
        </p>

      ) : (

        <div
          style={{

            display:"grid",

            gap:"20px"

          }}
        >

        {properties.map(

  (
    property,
    index
  ) => (

              <div

               key={
  property._id ||

  `${property.title}-${index}`
}

                style={{

                  background:"#fff",

                  borderRadius:"18px",

                  padding:"22px",

                  border:
                    "1px solid #e2e8f0"

                }}

              >

                <h2>
                  {
                    property.title
                  }
                </h2>

                <p>
                  {
                    property.price ||
                    "₹ --"
                  }
                </p>

                <p
                  style={{

                    color:

                      getStatusColor(

                        property.approvalStatus

                      ),

                    fontWeight:700

                  }}
                >

                  Status:

                  {

                    property.approvalStatus ||

                    "pending"

                  }

                </p>

              </div>

            )

          )}

        </div>

      )}

    </section>

  );

}