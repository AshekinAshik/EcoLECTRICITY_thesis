import WebLayout from "../layout/layout";

const { default: dynamic } = require("next/dynamic");

const DynamicEkpayPayment = dynamic(() => import('../component/citizenComp/ekpayPayment'), { ssr: false });

const EkpayPaymentPage = () => {
    return (
        <>
            <div>
                <DynamicEkpayPayment />
            </div>

            {/* <WebLayout title="Citizen - LOGIN">
                <div>
                    <DynamicLoginCitizenForm />
                </div>
            </WebLayout> */}
        </>
    )
};

export default EkpayPaymentPage;