import WebLayout from "../layout/layout";

const { default: dynamic } = require("next/dynamic");

const DynamicViewUsageHistoryData = dynamic(() => import('../component/citizenComp/viewUsageHistory'), { ssr: false });

const CitizenUsageHistoryPage = () => {
    return (
        <>
            <div>
                <DynamicViewUsageHistoryData />
            </div>

            {/* <WebLayout title="Dashboard - Usage Data">
                <div>
                    <DynamicViewUsageData />
                </div>
            </WebLayout> */}
        </>
    )
};

export default CitizenUsageHistoryPage;