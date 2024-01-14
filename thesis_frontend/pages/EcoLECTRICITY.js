import WebLayout from "./layout/layout";
import WebLayout_V1 from "./layout/layout_v1";

const { default: dynamic } = require("next/dynamic");

const DynamicHome = dynamic(() => import('./component/homeComp'), { ssr: false });

const EcoLECTRICITYPage = () => {
    return (
        <>
            {/* <WebLayout_V1 title={"EcoLECTRICITY"}> */}
                <div>
                    <DynamicHome />
                </div>
            {/* </WebLayout_V1> */}
        </>
    )
};

export default EcoLECTRICITYPage;