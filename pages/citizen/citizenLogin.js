import WebLayout from "../layout/layout";

const { default: dynamic } = require("next/dynamic");

const DynamicLoginCitizenForm = dynamic(() => import('../component/citizenComp/loginCitizenForm'), { ssr: false });

const CitizenLoginPage = () => {
    return (
        <>
            <WebLayout title="Citizen - LOGIN">
                <div>
                    <DynamicLoginCitizenForm />
                </div>
            </WebLayout>
        </>
    )
};

export default CitizenLoginPage;