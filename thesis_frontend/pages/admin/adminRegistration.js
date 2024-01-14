import WebLayout from "../layout/layout";
import WebLayout_V1 from "../layout/layout_v1";

const { default: dynamic } = require("next/dynamic");

const DynamicRegAdminForm = dynamic(() => import('../component/adminComp/regAdminForm'), { ssr: false });

const AdminRegistrationPage = () => {
    return (
        <>
            {/* <WebLayout_V1 title="Admin - REGISTRATION"> */}
                <div>
                    <DynamicRegAdminForm />
                </div>
            {/* </WebLayout_V1> */}

            {/* <WebLayout title="Admin - REGISTRATION">
                <div>
                    <DynamicRegAdminForm />
                </div>
            </WebLayout> */}
        </>
    )
};

export default AdminRegistrationPage;