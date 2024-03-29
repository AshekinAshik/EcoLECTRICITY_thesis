import WebLayout from "../layout/layout";

const { default: dynamic } = require("next/dynamic");

const DynamicLoginCitizenForm = dynamic(() => import('../component/citizenComp/loginCitizenForm'), { ssr: false });

const CitizenLoginPage = () => {
    return (
        <>
            <div>
                <DynamicLoginCitizenForm />
            </div>

            {/* <WebLayout title="Citizen - LOGIN">
                <div>
                    <DynamicLoginCitizenForm />
                </div>
            </WebLayout> */}
        </>
    )
};

export default CitizenLoginPage;