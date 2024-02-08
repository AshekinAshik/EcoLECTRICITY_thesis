import WebLayout from "../layout/layout";

const { default: dynamic } = require("next/dynamic");

const DynamicRegCitizenForm = dynamic(() => import('../component/citizenComp/regCitizenForm'), { ssr: false });

const CitizenRegistrationPage = () => {
    return (
        <>
            <div>
                <DynamicRegCitizenForm />
            </div>
        </>
    )
};

export default CitizenRegistrationPage;