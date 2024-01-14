import WebLayout from "../layout/layout";

const { default: dynamic } = require("next/dynamic");

const DynamicTestingBkash = dynamic(() => import('../component/citizenComp/bkash_v2'), { ssr: false });

const TestingBkash = () => {
    return (
        <>
            <div>
                <DynamicTestingBkash />
            </div>

            {/* <WebLayout title="Citizen - LOGIN">
                <div>
                    <DynamicLoginCitizenForm />
                </div>
            </WebLayout> */}
        </>
    )
};

export default TestingBkash;