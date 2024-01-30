import WebLayout from "../layout/layout";
import WebLayout_V1 from "../layout/layout_v1";

const { default: dynamic } = require("next/dynamic");

const DynamicLiveSupport = dynamic(() => import('../component/adminComp/liveSupport'), { ssr: false });

const SupportPage = () => {
    return (
        <>
                <div>
                    <DynamicLiveSupport />
                </div>
            
            {/* <WebLayout title="Citizens List">
                <div>
                    <DynamicGetCitizens />
                </div>
            </WebLayout> */}
        </>
    )
};

export default SupportPage;