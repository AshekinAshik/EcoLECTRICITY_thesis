import WebLayout from "../layout/layout";

const { default: dynamic } = require("next/dynamic");

const DynamicViewDailyUsageData = dynamic(() => import('../component/citizenComp/viewDailyUsageData'), { ssr: false });

const CitizenDailyUsageDashboardPage = () => {
    return (
        <>
            <div>
                <DynamicViewDailyUsageData />
            </div>

            {/* <WebLayout title="Dashboard - Usage Data">
                <div>
                    <DynamicViewUsageData />
                </div>
            </WebLayout> */}
        </>
    )
};

export default CitizenDailyUsageDashboardPage;