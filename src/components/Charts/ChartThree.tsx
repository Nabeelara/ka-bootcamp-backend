import { Category, Product } from "@prisma/client";
import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";

interface ChartThreeState {
  series: number[];
}

type ChartThreeProps = {
  categories: (Category & {
    products: Product[];
  })[];
};



const ChartThree = ({categories}:ChartThreeProps) => {
  const options: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
    },
    colors: categories.map(
      () =>
        `#${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")}`,
    ),
    labels: categories.map((category) => category.name),
    legend: {
      show: false,
      position: "bottom",
    },
  
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          background: "transparent",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 380,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  const series = categories.map((category) => category.products.length);
  console.log("seri",series);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-6">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Categories Analytics
          </h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart options={options} series={series} type="pie" />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        {categories.map((category, index) =>
        category.products.length > 0 && (
        <div key={category.id} className="w-full px-8 sm:w-1/2">
          <div className="flex w-full items-center">
            <span 
            className="mr-2 block h-3 w-full max-w-3 rounded-full bg-primary"
            style={{
              backgroundColor: options!.colors![index],
            }}
            ></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> {category.name} </span>
              <span> {category.products.length}% </span>
            </p>
          </div>
        </div>
        ))}
        
      </div>
    </div>
  );
};

export default ChartThree;
