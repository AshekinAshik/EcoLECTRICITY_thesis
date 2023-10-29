import WebLayout from "../layout/layout";

const { default: dynamic } = require("next/dynamic");

const DynamicRegAdminForm = dynamic(() => import('../component/adminComp/regAdminForm'), { ssr: false });

const AdminRegistrationPage = () => {
    return (
        <>
            <WebLayout title="Admin - REGISTRATION">
                <div>
                    <DynamicRegAdminForm />
                </div>
            </WebLayout>
        </>
    )
};

export default AdminRegistrationPage;