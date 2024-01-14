import Head from "next/head";
import WebHeader from "./header";
import WebFooter from "./footer";

export default function WebLayout({ children, title }) {
    return (
        <>
            <Head>
                <title> {title} </title>
            </Head>

            {/* <WebHeader /> */}

            {children}

            <WebFooter />
        </>
    )
}