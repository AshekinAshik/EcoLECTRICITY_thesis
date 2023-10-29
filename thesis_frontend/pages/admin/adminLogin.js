import WebLayout from "../layout/layout";

const { default: dynamic } = require("next/dynamic");

const DynamicLoginAdminForm = dynamic(() => import('../component/adminComp/loginAdminForm'), { ssr: false });

const AdminLoginPage = () => {
    return (
        <>
            <WebLayout title="Admin - LOGIN">
                <div>
                    <DynamicLoginAdminForm />
                </div>
            </WebLayout>
        </>
    )
};

export default AdminLoginPage;