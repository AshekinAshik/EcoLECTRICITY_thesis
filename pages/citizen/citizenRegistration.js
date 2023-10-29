import WebLayout from "../layout/layout";

const { default: dynamic } = require("next/dynamic");

const DynamicRegCitizenForm = dynamic(() => import('../component/citizenComp/regCitizenForm'), { ssr: false });

const CitizenRegistrationPage = () => {
    return (
        <>
            <WebLayout title="Citizen - REGISTRATION">
                <div>
                    <DynamicRegCitizenForm />
                </div>
            </WebLayout>
        </>
    )
};

export default CitizenRegistrationPage;