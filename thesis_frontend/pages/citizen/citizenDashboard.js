import WebLayout from "../layout/layout";

const { default: dynamic } = require("next/dynamic");

const DynamicViewUsageData = dynamic(() => import('../component/citizenComp/viewUsageDashbaord'), { ssr: false });

const CitizenDashboardPage = () => {
    return (
        <>
            <div>
                <DynamicViewUsageData />
            </div>

            {/* <WebLayout title="Dashboard - Usage Data">
                <div>
                    <DynamicViewUsageData />
                </div>
            </WebLayout> */}
        </>
    )
};

export default CitizenDashboardPage;