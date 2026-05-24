interface DashboardCardProps {

  title?:string;

  subtitle?:string;

  children:React.ReactNode;

}



export function DashboardCard({

  title,

  subtitle,

  children

}:DashboardCardProps){

  return(

    <div
      className="
      rounded-3xl
      border
      border-slate-200
      bg-white
      shadow-sm"
    >

      {

        title && (

          <div
            className="
            border-b
            border-slate-100
            px-6
            py-5"
          >

            <h2
              className="
              text-lg
              font-bold
              text-slate-900"
            >

              {title}

            </h2>

            {

              subtitle && (

                <p
                  className="
                  mt-1
                  text-sm
                  text-slate-500"
                >

                  {subtitle}

                </p>

              )

            }

          </div>

        )

      }



      <div
        className="p-6"
      >

        {children}

      </div>

    </div>

  );

}