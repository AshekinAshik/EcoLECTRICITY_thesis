import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import WebLayout_V1 from "../../layout/layout_v1";
import WebFooter from "../../layout/footer";
import WebHeader_V1 from "../../layout/header_v1";
import dynamic from "next/dynamic";
import MenuDrawer_Admin from "../../layout/admin_menudrawer";
// import SessionCheck from "../utils/sessionCheck";

const CitizenUsages = () => {
  const router = useRouter();

  //for Real Time Usage
  const [realtimeUsageData, setRealTimeUsageData] = useState([]);
  const [powerData, setPowerData] = useState([])
  const [currentData, setCurrentData] = useState([])
  const [voltageData, setVoltageData] = useState([])
  const [timeData, setTimeData] = useState([])

  //for Real Time Energy Cost
  const [realtimeEnergyCostData, setRealTimeEnergyCostData] = useState([])
  const [energyData, setEnergyData] = useState([])
  const [costData, setCostData] = useState([])
  const [energycostTimeData, setEnergyCostTimeData] = useState([])

  //for Daily Total Energy Cost
  const [dailyEnergyCostData, setDailyEnergyCostData] = useState([])
  const [totalDailyEnergyData, setTotalDailyEnergyData] = useState([])
  const [totalDailyCostData, setTotalDailyCostData] = useState([])
  const [dailyEnergyCostTimeData, setDailyEnergyCostTimeData] = useState([])

  //for Usage History
  const [date, setDate] = useState()
  const [usageByDate, setUsageByDate] = useState([])
  const [energycostByDate, setEnergycostByDate] = useState([])
  const [activeDiv, setActiveDiv] = useState('')

  const [activeHistory, setActiveHistory] = useState('')

  //for activate and deactivate useEffect in Real Time data fetching
  const [fetchRealTimeData, setFetchRealTimeData] = useState(false)
  const [isDataFetching, setIsDataFetching] = useState(false)

  const c_id = router.query.id;
  console.log(c_id)

  const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

  const convertDate = (time) => {
    const date = new Date(time)
    const convertedTime = date.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    return convertedTime
  }

  useEffect(() => {
    if (fetchRealTimeData && !isDataFetching) {
      console.log("calling from useEffect")

      setActiveDiv('realtime_usage')

      const getRealTimeData = async () => {
        setIsDataFetching(true)
        const powers = []
        const currents = []
        const usage_times = []
        // const voltages = []

        const energies = []
        const costs = []
        const en_cost_times = []

        try {
          const response_realtime_usage = await axios.get(process.env.NEXT_PUBLIC_API_ADMIN_BASE_URL + 'usages/' + c_id,
            {
              withCredentials: true
            })
          setRealTimeUsageData(response_realtime_usage.data);
          console.log("Response Realtime Usage: ", response_realtime_usage);

          const response_realtime_energycost = await axios.get(process.env.NEXT_PUBLIC_API_CITIZEN_BASE_URL + 'realtime_energy_cost',
            {
              withCredentials: true
            })
          setRealTimeEnergyCostData(response_realtime_energycost.data)
          console.log("Response Realtime Energy_Cost: ", response_realtime_energycost)

          response_realtime_usage.data.map(item_realtime_usage => {
            console.log("Item Realtime Usage: ", item_realtime_usage)
            powers.push(item_realtime_usage.power)
            currents.push(item_realtime_usage.current)
            usage_times.push(item_realtime_usage.time)
            // voltages.push(item_realtime_usage.voltage)
          })
          setPowerData(powers)
          setCurrentData(currents)
          setTimeData(usage_times)
          // setVoltageData(voltages)

          response_realtime_energycost.data.map(item_energycost => {
            console.log("Item Realtime Energy Cost: ", item_energycost)

            energies.push(item_energycost.energy)
            costs.push(item_energycost.cost)
            en_cost_times.push(item_energycost.time)
          })

          setEnergyData(energies)
          setCostData(costs)
          setEnergyCostTimeData(en_cost_times)
        } catch (error) {
          console.error(error);
        } finally {
          setIsDataFetching(false)
        }
      }

      getRealTimeData();
      // const interval = setInterval(getRealTimeData, 15000)
      // return () => clearInterval(interval)
    }
  }, [fetchRealTimeData, isDataFetching]);

  // const getUsageData = async () => {
  //   const currents = []
  //   const powers = []
  //   const times = []
  //   const voltages = []

  //   try {
  //     const response = await axios.get(process.env.NEXT_PUBLIC_API_ADMIN_BASE_URL + 'usages/' + c_id,
  //       {
  //         withCredentials: true
  //       })

  //     setUsageData(response.data);
  //     console.log("response: ", response);

  //     response.data.map(item => {
  //       console.log("item: ", item)
  //       currents.push(item.current)
  //       powers.push(item.power)
  //       times.push(item.time)
  //       voltages.push(item.voltage)
  //     })
  //     setPowerData(powers)
  //     setCurrentData(currents)
  //     setTimeData(times)
  //     setVoltageData(voltages)
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const getDailyUsageOfCustomer = async (e) => {
    e.preventDefault()

    setActiveDiv('daily_usage');

    setFetchRealTimeData(false);
    setIsDataFetching(false);


    const totalEnergies = []
    const totalCosts = []
    const daily_en_cost_times = []

    try {
      console.log("here")
      const response_daily_energy_cost = await axios.get(process.env.NEXT_PUBLIC_API_CITIZEN_BASE_URL + 'daily_energy_cost',
        {
          withCredentials: true
        })
      setDailyEnergyCostData(response_daily_energy_cost.data)
      console.log("Response Daily Energy-Cost: ", response_daily_energy_cost)

      response_daily_energy_cost.data.map(item => {
        console.log("Item Daily Energy-Cost: ", item)

        totalEnergies.push(item.energy)
        totalCosts.push(item.cost)
        daily_en_cost_times.push(convertDate(item.time))
      })
      setTotalDailyEnergyData(totalEnergies)
      setTotalDailyCostData(totalCosts)
      setDailyEnergyCostTimeData(daily_en_cost_times)
    } catch (error) {
      console.error(error);
    }
  }

  const getUsageHistory = () => {
    setFetchRealTimeData(false);
    setIsDataFetching(false);

    setActiveDiv('usage_history');
  }

  const handleDatePicker = (e) => {
    setDate(e.target.value);
  }

  const getUsageByDate = async (e) => {
    e.preventDefault()

    const response_usage_bydate = await axios.get(process.env.NEXT_PUBLIC_API_CITIZEN_BASE_URL + 'usage/' + date, {
      withCredentials: true
    });
    setUsageByDate(response_usage_bydate.data)
    console.log("Response Usage by Date: ", response_usage_bydate)
  }

  const getEnergyCostByDate = async (e) => {
    e.preventDefault()

    const response_energycost_bydate = await axios.get(process.env.NEXT_PUBLIC_API_CITIZEN_BASE_URL + 'energy_cost/' + date, {
      withCredentials: true
    });
    setEnergycostByDate(response_energycost_bydate.data)
    console.log("Response Energy_Cost by Date: ", response_energycost_bydate)
  }

  const handleActiveHistory = (activeHistory) => {
    setActiveHistory(activeHistory);
  };

  const handleFetchRealTimeData = () => {
    if (!isDataFetching) {
      setFetchRealTimeData(true)
    }
  }

  const OptionsChartLine = {
    chart: {
      id: 'apexchart-example',
      height: 550,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
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

  const SeriesChartLine_Current_vs_Power = [
    {
      name: 'Current (amp)',
      data: currentData
    },
    {
      name: 'Power (kW)',
      data: powerData
    }
  ]

  const SeriesChartLine_Energy_vs_Cost = [
    {
      name: 'Energy (kWh)',
      data: energyData
    },
    {
      name: 'Cost (BDT)',
      data: costData
    }
  ]

  // if (realtimeUsageData != 0) {
  return (
    <>
      {/* <SessionCheck /> */}

      <body className="bg-light">
        <WebHeader_V1 title={"Citizen Dashboard - ID: " + c_id} />
        <MenuDrawer_Admin />

        <div className="body-topnbottom">
          <center>
            <h4 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-white md:text-2xl lg:text-4xl dark:text-white"> All Available <mark class="px-2 text-white bg-green-400 rounded dark:bg-blue-500">Usage</mark> Data </h4>
            <br></br>
            <button type="button" onClick={handleFetchRealTimeData} disabled={isDataFetching} class="text-gray-900 bg-white border border-green-300 focus:outline-none hover:bg-green-200 focus:ring-4 focus:ring-green-400 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Real-Time Usage</button>
            <button type="button" onClick={getDailyUsageOfCustomer} class="text-gray-900 bg-white border border-green-300 focus:outline-none hover:bg-green-200 focus:ring-4 focus:ring-green-400 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Daily Usage</button>
            <button type="button" onClick={getUsageHistory} class="text-gray-900 bg-white border border-green-300 focus:outline-none hover:bg-green-200 focus:ring-4 focus:ring-green-400 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Usage History</button>
            <br></br> <br></br>

            <div id="realtime_usage" style={{ display: activeDiv === 'realtime_usage' ? 'block' : 'none' }}>
              {/* <div className="power_current_container">
                  <div className="graph-content">
                    <Chart options={OptionsChartLine} series={SeriesChartLine} height={400} width={1100} />
                  </div>
                </div> */}

              <div className="power_current_container">
                <span class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Current vs Power</span>
                <div className="graph-content">
                  <Chart options={OptionsChartLine} series={SeriesChartLine_Current_vs_Power} type="area" height={400} width={900} />
                </div>
              </div>

              <div className="energy_cost_container">
                <span class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Energy vs Cost</span>
                <div className="graph-content">
                  <Chart options={OptionsChartLine} series={SeriesChartLine_Energy_vs_Cost} type="area" height={400} width={900} />
                </div>
              </div>
            </div>

            <div id="daily_usage" style={{ display: activeDiv === 'daily_usage' ? 'block' : 'none' }}>
              <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-center text-gray-800 dark:text-gray-400">
                  <thead class="text-extrabold text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" class="px-6 py-5">
                        Energy (kWh)
                      </th>
                      <th scope="col" class="px-6 py-5">
                        Cost (BDT)
                      </th>
                      <th scope="col" class="px-6 py-5">
                        Time
                      </th>
                      <th scope="col" class="px-6 py-5">
                        Citizen ID
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {dailyEnergyCostData.map((item, index) => {
                      const count = index + 1; // Increment the count for each iteration starting from 1
                      return (
                        <tr key={index} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                          <td class="px-6 py-2">{item.energy}</td>
                          <td class="px-6 py-2">{item.cost}</td>
                          <td class="px-6 py-2">{convertDate(item.time)}</td>
                          <td class="px-6 py-2">{item.c_id}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div id="usage_history" style={{ display: activeDiv === 'usage_history' ? 'block' : 'none' }}>

              <br></br>
              <button type="button" onClick={() => handleActiveHistory('current_power_voltage')} class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-blue-200">CPV - History</button>
              <button type="button" onClick={() => handleActiveHistory('energy_cost')} class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-blue-200">EC - History</button>
              <br></br>

              <div id="current_power_voltage" style={{ display: activeHistory === 'current_power_voltage' ? 'block' : 'none' }}>
                <input type="date" onChange={handleDatePicker} />
                <button type="button" onClick={getUsageByDate} class="text-white bg-green-300 hover:bg-green-500 font-medium rounded-lg text-sm px-2 py-3.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                  </svg>
                </button>
                <br></br>

                <div class="relative overflow-x-auto">
                  <table class="w-5/6 text-sm text-center text-gray-800 dark:text-gray-400 shadow-md" style={{ borderRadius: '5px' }}>
                    <thead class="text-extrabold text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" class="px-6 py-5">
                          Current (amp)
                        </th>
                        <th scope="col" class="px-6 py-5">
                          Power (kW)
                        </th>
                        <th scope="col" class="px-6 py-5">
                          Voltage (v)
                        </th>
                        <th scope="col" class="px-6 py-5">
                          Time (date-time)
                        </th>
                        <th scope="col" class="px-6 py-5">
                          Citizen ID
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {Array.isArray(usageByDate) && usageByDate.length > 0 ? (
                        usageByDate.map((item) => (
                          <tr key={item.c_id} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                            <td class="px-6 py-2">{item.current}</td>
                            <td class="px-6 py-2">{item.power / 1000}</td>
                            <td class="px-6 py-2">{item.voltage}</td>
                            <td class="px-6 py-2">{convertDate(item.time)}</td>
                            <td class="px-6 py-2">{item.c_id}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-white text-2xl text-center py-4">No data for this date</td>
                        </tr>
                      )}
                    </tbody>

                  </table>
                </div>
              </div>

              <div id="energy_cost" style={{ display: activeHistory === 'energy_cost' ? 'block' : 'none' }}>
                <input type="date" onChange={handleDatePicker} />
                <button type="button" onClick={getEnergyCostByDate} class="text-white bg-green-300 hover:bg-green-500 font-medium rounded-lg text-sm px-2 py-3.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                  </svg>
                </button>
                <br></br>

                <div class="relative overflow-x-auto">
                  <table class="w-5/6 text-sm text-center text-gray-800 dark:text-gray-400 shadow-md" style={{ borderRadius: '5px' }}>
                    <thead class="text-extrabold text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" class="px-6 py-5">
                          Energy (kWh)
                        </th>
                        <th scope="col" class="px-6 py-5">
                          Cost (BDT)
                        </th>
                        <th scope="col" class="px-6 py-5">
                          Time (date-time)
                        </th>
                        <th scope="col" class="px-6 py-5">
                          Citizen ID
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {Array.isArray(energycostByDate) && energycostByDate.length > 0 ? (
                        energycostByDate.map((item) => (
                          <tr key={item.c_id} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                            <td class="px-6 py-2">{item.energy}</td>
                            <td class="px-6 py-2">{item.cost / 1000}</td>
                            <td class="px-6 py-2">{convertDate(item.time)}</td>
                            <td class="px-6 py-2">{item.c_id}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-white text-2xl text-center py-4">No data for this date</td>
                        </tr>
                      )}
                    </tbody>

                  </table>
                </div>
              </div>

            </div>
          </center>
        </div>
      </body>
      <WebFooter />
    </>
  )
  // } else {
  //   return (
  //     <>
  //       {/* <SessionCheck /> */}

  //       <body className="bg-full-screen">
  //         <WebLayout_V1 title="Citizen Usage Data">
  //           <MenuDrawer_Admin />

  //           <div id="marketing-banner" tabindex="-1" class="center fixed z-50 flex flex-col md:flex-row justify-between w-[calc(100%-2rem)] p-4 -translate-x-1/2 bg-white border border-gray-100 rounded-lg shadow-sm lg:max-w-7xl left-1/2 top-6 dark:bg-gray-700 dark:border-gray-600">
  //             <div class="flex flex-col items-start mb-3 me-4 md:items-center md:flex-row md:mb-0">
  //               <svg xmlns="http://www.w3.org/2000/svg" id="no_usage_alert" data-name="no usage" viewBox="0 0 24 24" width="30" height="23"><path d="M12,4a8.009,8.009,0,0,0-8,8c.376,10.588,15.626,10.585,16,0A8.009,8.009,0,0,0,12,4Zm0,14C4.071,17.748,4.072,6.251,12,6,19.929,6.252,19.928,17.749,12,18Zm1-9v3a1,1,0,0,1-2,0V9A1,1,0,0,1,13,9Zm11,3a12.026,12.026,0,0,1-2.743,7.637,1,1,0,0,1-1.543-1.274,10.052,10.052,0,0,0,0-12.726,1,1,0,0,1,1.543-1.274A12.026,12.026,0,0,1,24,12ZM4.286,18.363a1,1,0,0,1-1.542,1.274,12.065,12.065,0,0,1,0-15.274A1,1,0,0,1,4.286,5.637,10.052,10.052,0,0,0,4.286,18.363ZM13,15a1,1,0,0,1-2,0A1,1,0,0,1,13,15Z" /></svg>

  //               <p class="text-center text-sm font-semibold text-red-700 dark:text-gray-400">No Usage Data to Show</p>
  //             </div>
  //             <div class="flex items-center flex-shrink-0">
  //               <button data-dismiss-target="#marketing-banner" type="button" onClick={() => router.push('citizens')} class="flex-shrink-0 inline-flex justify-center w-7 h-7 items-center text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 dark:hover:bg-gray-600 dark:hover:text-white">
  //                 <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
  //                   <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
  //                 </svg>
  //                 <span class="sr-only">Close banner</span>
  //               </button>
  //             </div>
  //           </div>
  //           {/* <p class="text-center text-red-700"> No Usage Data to Show </p> */}
  //         </WebLayout_V1>
  //       </body>
  //     </>
  //   )
  // }
};

export default CitizenUsages;