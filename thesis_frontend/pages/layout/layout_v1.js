import Head from "next/head";
import WebHeader_V1 from "./header_v1";
import WebFooter_V1 from "./footer_v1";
import WebFooter from "./footer";

export default function WebLayout_V1({ children, title }) {
    return (
        <>
            {/* <Head>
                <title> {title} </title>
            </Head> */}

            <WebHeader_V1 title={title}/>

            {children}

            <WebFooter_V1 />

            {/* <WebFooter /> */}
        </>
    )
}