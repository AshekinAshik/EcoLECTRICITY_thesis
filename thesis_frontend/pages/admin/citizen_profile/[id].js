import { useRouter } from "next/router"
import WebLayout_V1 from "../../layout/layout_v1"
import MenuDrawer_Admin from "../../layout/admin_menudrawer"
import { useEffect, useState } from "react"
import axios from "axios"
import WebFooter from "../../layout/footer"
import WebHeader_V1 from "../../layout/header_v1"

const CitizeProfile = () => {
    const router = useRouter()

    const c_id = router.query.id;
    console.log(c_id)

    const [citizenData, setCitizenData] = useState(null)
    const [activeDiv, setActiveDiv] = useState('')

    const [mailData, setMailData] = useState({
        receiver: "",
        subject: "",
        message: "",
    })

    const handleMailData = (e) => {
        setMailData({ ...mailData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        console.log("calling from useEffect")
        getCitizenData();
    }, []);

    const getCitizenData = async () => {
        try {
            const response_citizenData = await axios.get(process.env.NEXT_PUBLIC_API_ADMIN_BASE_URL + 'citizen_profile/' + c_id, {
                withCredentials: true
            });

            setCitizenData(response_citizenData.data)
            console.log(response_citizenData)
        } catch (error) {
            console.error("Erron fetching data in Citizen Profile: " + error);
        }
    }

    const handleCitizenDelete = async () => {
        try {
            const response_deleteCitizen = await axios.delete(process.env.NEXT_PUBLIC_API_ADMIN_BASE_URL + 'delete/citizen/' + c_id);
            console.log(response_deleteCitizen.data);
            alert("Citizen Delete Successful!");
        } catch (error) {
            console.error(error);
            alert("Citizen Delete Failed!");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log({ receiver, message, subject })
        try {
            const response_sendmail = await axios.post(process.env.NEXT_PUBLIC_API_ADMIN_BASE_URL + 'sendmail', mailData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                })

            console.log("Response Send Mail: " + response_sendmail)
            alert("Mail Sent to " + citizenData.name)
        } catch (error) {
            alert("Mail Was not Sent to Citizen")
            console.log("Error in Sending Mail: " + error)
        }
    };

    const handleActiveButton = (active_DivId) => {
        setActiveDiv(active_DivId);
    };

    if (citizenData != null) {
        return (
            <>
                {/* <SessionCheck /> */}

                <body className="bg-full-screen">
                    <WebHeader_V1 title={"Citizen Profile"} />
                    <MenuDrawer_Admin />

                    <div className="body-topnbottom">
                        <center>
                            <h4 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-white md:text-2xl lg:text-4xl dark:text-white"> Citizen Profile </h4>
                            <br></br>

                            <div className="profile_container">
                                <div class="flex justify-end px-4 pt-4">
                                    <a href="../citizens">
                                        <svg class="w-8 h-9" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" /><path fill="#000000" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" /></svg>
                                    </a>
                                </div>
                                <div class="flex flex-col items-center pb-10">
                                    <img class="w-24 h-24 mb-3 rounded-full shadow-lg" src="/profile_2.png" alt="Bonnie image" />
                                    <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white"> <mark class="px-2 text-white bg-green-500 rounded dark:bg-blue-500">{citizenData.name}</mark> </h5>

                                    <br></br>
                                    <div class="text-left">
                                        <span class="text-sm text-black content-start">ID: {citizenData.id}</span> <br></br>
                                        <span class="text-sm text-black">Email: {citizenData.email}</span> <br></br>
                                        <span class="text-sm text-black">Contact: {citizenData.contact}</span> <br></br>
                                        <span class="text-sm text-black">Location: {citizenData.location}</span> <br></br>
                                    </div>

                                    <br></br>
                                    <div class="flex mt-4 md:mt-6">
                                        <button type="button" class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-green-400 rounded-lg hover:bg-green-800">Update</button>
                                        <button type="button" onClick={handleCitizenDelete} class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-800 ms-3">Delete</button>
                                        <button type="button" onClick={() => handleActiveButton('mailbox')} class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-900 ms-3">E-mail</button>
                                    </div>
                                </div>
                            </div>

                            <div id="mailbox" style={{ display: activeDiv === 'mailbox' ? 'block' : 'none' }}>
                                <div className="mailbox_container">
                                    <div className="mailbox_content">
                                        <form class="max-w-sm mx-auto" onSubmit={handleSubmit}>
                                            <div class="mb-5">
                                                <label for="receiver" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Recipient</label>
                                                <input list="citizen_email" type="email" id="receiver" name="receiver" onChange={handleMailData} placeholder="citizen's email address" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" autoComplete="off" required />
                                                <datalist id="citizen_email">
                                                    <option value={citizenData.email}>{citizenData.email}</option>
                                                </datalist>
                                            </div>
                                            <div class="mb-5">
                                                <label for="subject" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Subject</label>
                                                <input type="text" id="subject" name="subject" onChange={handleMailData} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
                                            </div>
                                            <div class="mb-5">
                                                <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Message</label>
                                                <textarea type="text" id="message" name="message" onChange={handleMailData} rows="5" cols="80" class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500" />
                                            </div>

                                            <button type="button" onClick={() => handleActiveButton('close')} class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-800 ms-3">Close</button>
                                            <button type="submit" class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-800 ms-3">Send Mail</button>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <br></br>
                        </center>
                    </div>

                </body>
                <WebFooter />
            </>
        )
    } else {
        <>
            <body className="bg-full-screen">
                <WebLayout_V1 title={"Citizen Profile"}>
                    <MenuDrawer_Admin />

                </WebLayout_V1>
            </body>
        </>
    }
}

export default CitizeProfile;