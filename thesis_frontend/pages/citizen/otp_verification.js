import WebLayout from "../layout/layout";

const { default: dynamic } = require("next/dynamic");

const DynamicOTPVerification = dynamic(() => import('../component/citizenComp/otpVerification'), { ssr: false });

const OTPVerificationPage = () => {
    return (
        <>
            <div>
                <DynamicOTPVerification />
            </div>

            {/* <WebLayout title="Citizen - LOGIN">
                <div>
                    <DynamicLoginCitizenForm />
                </div>
            </WebLayout> */}
        </>
    )
};

export default OTPVerificationPage;