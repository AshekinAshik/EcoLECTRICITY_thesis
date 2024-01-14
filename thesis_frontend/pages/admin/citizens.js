import WebLayout from "../layout/layout";
import WebLayout_V1 from "../layout/layout_v1";

const { default: dynamic } = require("next/dynamic");

const DynamicGetCitizens = dynamic(() => import('../component/adminComp/getCitizens'), { ssr: false });

const CitizensPage = () => {
    return (
        <>
                <div>
                    <DynamicGetCitizens />
                </div>
            
            {/* <WebLayout title="Citizens List">
                <div>
                    <DynamicGetCitizens />
                </div>
            </WebLayout> */}
        </>
    )
};

export default CitizensPage;