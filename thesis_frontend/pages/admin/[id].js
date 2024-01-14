import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../layout/layout";
import ReactApexChart from "react-apexcharts";
import WebLayout_V1 from "../layout/layout_v1";
import WebFooter from "../layout/footer";
import WebHeader_V1 from "../layout/header_v1";
import dynamic from "next/dynamic";
import MenuDrawer from "../layout/admin_menudrawer";
import Image from "next/image";
// import SessionCheck from "../utils/sessionCheck";

const CitizenUsages = () => {
  const router = useRouter();

  // const [category, setCategory] = useState([])
  // const [data, setData] = useState([])

  const [usageData, setUsageData] = useState([]);
  const [powerData, setPowerData] = useState([])
  const [currentData, setCurrentData] = useState([])
  const [voltageData, setVoltageData] = useState([])
  const [timeData, setTimeData] = useState([])

  const c_id = router.query.id;

  const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

  useEffect(() => {
    getUsageData();
  }, []);

  const getUsageData = async () => {
    const currents = []
    const powers = []
    const times = []
    const voltages = []

    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_API_ADMIN_BASE_URL + 'usages/' + c_id,
        {
          withCredentials: true
        })

      setUsageData(response.data);
      console.log("response: ", response);

      response.data.map(item => {
        console.log("item: ", item)
        currents.push(item.current)
        powers.push(item.power)
        times.push(item.time)
        voltages.push(item.voltage)
      })
      setPowerData(powers)
      setCurrentData(currents)
      setTimeData(times)
      setVoltageData(voltages)
    } catch (error) {
      console.error(error);
    }
  };

  const OptionsChartLine = {
    chart: {
      height: 550,
      type: 'area'
    },
    xaxis: {
      type: '',
      categories: timeData,
      tickAmount: 10,
    },
    yaxis: {
      tickAmount: 5,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    tooltip: {
      x: {
        format: 'dd/MM'
      },
    }
  }

  const SeriesChartLine = [
    {
      name: 'Current (amp)',
      data: currentData
    },
    {
      name: 'Voltage (volt)',
      data: voltageData
    }
  ]

  const showData = () => {
    // setInterval(getUsageData, 5000)
    console.log(usageData)
    if (usageData != 0) {
      return (
        <>
          {/* <SessionCheck /> */}

          <body className="bg-light">
            <WebHeader_V1 title={"Citizen Usage Data"} />
            <MenuDrawer />

            <div className="body-topnbottom">
              <center>
                <h4 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-white md:text-2xl lg:text-4xl dark:text-white"> All Available <mark class="px-2 text-white bg-green-400 rounded dark:bg-blue-500">Usage</mark> Data </h4>
                <br></br>

                {/* <ReactApexChart options={state.options} series={state.series} type="area" height={350} width={1000} /> */}

                <div className="graph-container">
                  <div className="graph-content">
                    <Chart options={OptionsChartLine} series={SeriesChartLine} height={500} width={1400} />
                  </div>
                </div>

                <br></br>


              </center>
            </div>
            <WebFooter />
          </body>
        </>
      )
    } else {
      return (
        <>
          <body className="bg-full-screen">
            <WebLayout_V1 title="Citizen Usage Data">

              <div id="marketing-banner" tabindex="-1" class="center fixed z-50 flex flex-col md:flex-row justify-between w-[calc(100%-2rem)] p-4 -translate-x-1/2 bg-white border border-gray-100 rounded-lg shadow-sm lg:max-w-7xl left-1/2 top-6 dark:bg-gray-700 dark:border-gray-600">
                <div class="flex flex-col items-start mb-3 me-4 md:items-center md:flex-row md:mb-0">
                  <svg xmlns="http://www.w3.org/2000/svg" id="no_usage_alert" data-name="no usage" viewBox="0 0 24 24" width="30" height="23"><path d="M12,4a8.009,8.009,0,0,0-8,8c.376,10.588,15.626,10.585,16,0A8.009,8.009,0,0,0,12,4Zm0,14C4.071,17.748,4.072,6.251,12,6,19.929,6.252,19.928,17.749,12,18Zm1-9v3a1,1,0,0,1-2,0V9A1,1,0,0,1,13,9Zm11,3a12.026,12.026,0,0,1-2.743,7.637,1,1,0,0,1-1.543-1.274,10.052,10.052,0,0,0,0-12.726,1,1,0,0,1,1.543-1.274A12.026,12.026,0,0,1,24,12ZM4.286,18.363a1,1,0,0,1-1.542,1.274,12.065,12.065,0,0,1,0-15.274A1,1,0,0,1,4.286,5.637,10.052,10.052,0,0,0,4.286,18.363ZM13,15a1,1,0,0,1-2,0A1,1,0,0,1,13,15Z" /></svg>

                  <p class="text-center text-sm font-semibold text-red-700 dark:text-gray-400">No Usage Data to Show</p>
                </div>
                <div class="flex items-center flex-shrink-0">
                  <button data-dismiss-target="#marketing-banner" type="button" onClick={() => router.push('citizens')} class="flex-shrink-0 inline-flex justify-center w-7 h-7 items-center text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span class="sr-only">Close banner</span>
                  </button>
                </div>
              </div>
              {/* <p class="text-center text-red-700"> No Usage Data to Show </p> */}
            </WebLayout_V1>
          </body>
        </>
      )
    }
  };

  return (
    <>
      <div>
        {showData()}
      </div>
    </>
  )
};

export default CitizenUsages;