import WebLayout from "../layout/layout";

const { default: dynamic } = require("next/dynamic");

const DynamicViewRealTimeUsageData = dynamic(() => import('../component/citizenComp/viewRealTimeUsageData'), { ssr: false });

const CitizenRealTimeUsageDashboardPage = () => {
    return (
        <>
            <div>
                <DynamicViewRealTimeUsageData />
            </div>

            {/* <WebLayout title="Dashboard - Usage Data">
                <div>
                    <DynamicViewUsageData />
                </div>
            </WebLayout> */}
        </>
    )
};

export default CitizenRealTimeUsageDashboardPage;