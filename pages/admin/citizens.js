import WebLayout from "../layout/layout";

const { default: dynamic } = require("next/dynamic");

const DynamicGetCitizens = dynamic(() => import('../component/adminComp/getCitizens'), { ssr: false });

const CitizensPage = () => {
    return (
        <>
            <WebLayout title="Citizens List">
                <div>
                    <DynamicGetCitizens />
                </div>
            </WebLayout>
        </>
    )
};

export default CitizensPage;