import WebLayout from "../layout/layout";

const { default: dynamic } = require("next/dynamic");

const DynamicViewUsageData = dynamic(() => import('../component/adminComp/viewUsageData'), { ssr: false });

const AdminDashboardPage = () => {
    return (
        <>
            <WebLayout title="Dashboard - Usage Data">
                <div>
                    <DynamicViewUsageData />
                </div>
            </WebLayout>
        </>
    )
};

export default AdminDashboardPage;