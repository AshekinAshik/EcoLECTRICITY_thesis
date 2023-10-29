

const WebFooter = () => {
    return (
        <>
            <footer class="bg-green-200 bottom-0 rounded-lg shadow m-4 dark:bg-gray-800">
                <div class="w-full mx-auto max-w-screen- p-4 md:flex md:items-center md:justify-between">
                    <span class="text-sm text-slate-900 sm:text-center dark:text-gray-400">© 2023 <a href="#" class="hover:underline">EcoLECTRICITY</a>. All Rights Reserved.
                    </span>
                    <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                        <li>
                            <a href="#" class="mr-4 hover:underline md:mr-6 ">About</a>
                        </li>
                        <li>
                            <a href="#" class="mr-4 hover:underline md:mr-6">Privacy Policy</a>
                        </li>
                        <li>
                            <a href="#" class="mr-4 hover:underline md:mr-6">Licensing</a>
                        </li>
                        <li>
                            <a href="#" class="hover:underline">Contact</a>
                        </li>
                    </ul>
                </div>
            </footer>
        </>
    )
};

export default WebFooter;