import WebLayout from "../layout/layout";
import WebLayout_V1 from "../layout/layout_v1";

const { default: dynamic } = require("next/dynamic");

const DynamicLoginAdminForm = dynamic(() => import('../component/adminComp/loginAdminForm'), { ssr: false });

const AdminLoginPage = () => {
    return (
        <>
            {/* <WebLayout_V1> */}
                <div>
                    <DynamicLoginAdminForm />
                </div>
            {/* </WebLayout_V1> */}

            {/* <WebLayout title="Admin - LOGIN">
                <div>
                    <DynamicLoginAdminForm />
                </div>
            </WebLayout> */}
        </>
    )
};

export default AdminLoginPage;