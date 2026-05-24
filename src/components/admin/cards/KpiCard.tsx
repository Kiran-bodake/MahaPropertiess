"use client";

import {

  TrendingUp,

  TrendingDown

} from "lucide-react";



interface KpiCardProps {

  title:string;

  value:string | number;

  icon:React.ReactNode;

  change?:string;

  trend?:"up" | "down";

  subtitle?:string;

}



export function KpiCard({

  title,

  value,

  icon,

  change,

  trend = "up",

  subtitle

}:KpiCardProps){

  return(

    <div
      className="group
      relative
      overflow-hidden
      rounded-3xl
      border
      border-slate-200
      bg-white
      p-6
      shadow-sm
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-xl"
    >

      {/* TOP */}
      <div
        className="flex
        items-start
        justify-between"
      >

        {/* TEXT */}
        <div>

          <p
            className="text-sm
            font-medium
            text-slate-500"
          >

            {title}

          </p>



          <h2
            className="mt-3
            text-4xl
            font-extrabold
            tracking-tight
            text-slate-900"
          >

            {value}

          </h2>

        </div>



        {/* ICON */}
        <div
          className="flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-gradient-to-br
          from-blue-500
          to-indigo-600
          text-white
          shadow-lg"
        >

          {icon}

        </div>

      </div>




      {/* BOTTOM */}
      <div
        className="mt-6
        flex
        items-center
        justify-between"
      >

        {/* TREND */}
        {

          change && (

            <div
              className={`inline-flex
              items-center
              gap-1
              rounded-full
              px-3
              py-1
              text-xs
              font-bold

              ${

                trend === "up"

                ?

                "bg-emerald-100 text-emerald-700"

                :

                "bg-red-100 text-red-700"

              }`}
            >

              {

                trend === "up"

                ?

                <TrendingUp size={14}/>

                :

                <TrendingDown size={14}/>

              }

              {change}

            </div>

          )

        }



        {/* SUBTITLE */}
        {

          subtitle && (

            <span
              className="text-xs
              text-slate-400"
            >

              {subtitle}

            </span>

          )

        }

      </div>




      {/* BACKGROUND GLOW */}
      <div
        className="absolute
        -right-10
        -top-10
        h-32
        w-32
        rounded-full
        bg-blue-100/40
        blur-3xl"
      />

    </div>

  );

}