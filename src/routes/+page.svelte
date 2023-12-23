<script lang="ts">
    import axios from 'axios'

    const regex2 = new RegExp(/^[a-z]$/)

    let data: any
    let error: any;
    let loading: boolean = false;
    let regNr: string = "";

    async function onInput(e: any) {
        const char: string = e.data

        if (await regex2.test(char)) {
            regNr += char.toUpperCase()
        }
    }

    async function sendData() {
        loading = true
        data = null
        error = null

        axios.post("/api/v1/alpr-system", { regNr: regNr })
        .then(function (response) {
            loading = false
            data = response.data
        })
        .catch(function (e) {
            loading = false
            error = e.response.data
        })
    }
</script>

<div class="flex m-4 flex-col space-y-2">
    <div class="bg-gray-200 rounded-lg p-4">
        <h1 class="font-bold text-2xl mb-2">Number Plate System (SE)</h1>

        <form on:submit|preventDefault>
            <input type="text" on:input={(e) => { onInput(e) }} bind:value={regNr} class="text-lg p-2 mr-2 outline-none border-gray-400 border-2 bg-gray-100" placeholder="ABC123">

            {#if loading}
                <button class="py-2 px-2 btn font-semibold text-lg cursor-wait opacity-75">
                    <div class="flex items-center space-x-2">
                        <svg class="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.2" fill-rule="evenodd" clip-rule="evenodd" d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" /><path d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z" fill="currentColor" /></svg>
                        <p>Sök</p>
                    </div>
                </button>
            {:else}
                <button class="py-2 px-4 btn font-semibold text-lg" type="submit" on:click={sendData}>Sök</button>
            {/if}
        </form>
    </div>

    <div class="bg-gray-200 rounded-lg p-4">
        {#if loading}
            <div class="flex items-center space-x-2">
                <p class="text-xl">Laddar...</p>
                <svg class="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.2" fill-rule="evenodd" clip-rule="evenodd" d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" /><path d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z" fill="currentColor" /></svg>
            </div>
        {/if}
        {#if error}
            <p class="font-semibold text-xl mb-2">Error found</p>
        {/if}
        {#if error?.message == "bad-reg-number"}
            <p class="alert-red">Not a valid registration number</p>
        {/if}
        {#if error?.message == "no-car"}
            <p class="alert-red">No match</p>
        {/if}
        {#if error?.message == "slow-down"}
            <p class="alert-yellow">Slow down your searches</p>
        {/if}
        {#if error?.message == "try-again"}
            <p class="alert-yellow">Try again</p>
        {/if}
        {#if data}
            <div>
                <div class="bg-gray-300 p-4 my-2 rounded-lg">
                    <p class="font-semibold text-xl bg-white px-2 py-1 font-mono border-gray-500 border-2 w-fit">{data.regNr}</p>
                    <div class="flex flex-col justify-center space-y-1">
                        <div class="flex items-center space-x-2">
                            <div>
                                <p class="">Stöldstatus Sverige: </p>
                            </div>
                            <div>
                                {#if !data.isStolen}
                                    <p class="alert-green">Ej rapporterad stulen</p>
                                {:else}
                                    <p class="alert-red">Rapporterad stulen</p>
                                {/if}
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div>
                                <p class="">Status: </p>
                            </div>
                            <div>
                                {#if data.status == "I trafik"}
                                    <p class="alert-green">I trafik</p>
                                {:else}
                                    <p class="alert-red">{data.status}</p>
                                {/if}
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div>
                                <p class="">Chassinr / VIN: </p>
                            </div>
                            <div>
                                <pre class="bg-gray-400 p-1 font-mono border-gray-700 border-2">{data.VIN}</pre>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-300 p-4 my-2 rounded-lg">
                    <p class="font-semibold text-xl mb-2">Fordonsdata</p>
                    <div class="flex flex-col justify-center space-y-1">
                        <div class="flex items-center space-x-2">
                            <div>
                                <p class="">Fabrikat: </p>
                            </div>
                            <div>
                                <p>{data.make}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div>
                                <p class="">Modell: </p>
                            </div>
                            <div>
                                <p>{data.model}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div>
                                <p class="">Färg: </p>
                            </div>
                            <div>
                                <p>{data.color}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div>
                                <p class="">Fordonsår / Modellår: </p>
                            </div>
                            <div>
                                <p>{data.carYearModelYear}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div>
                                <p class="">Miljöklass: </p>
                            </div>
                            <div>
                                <p>{data.enviromentClass}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div>
                                <p class="">Utsläppsklass: </p>
                            </div>
                            <div>
                                <p>{data.emissionClass}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div>
                                <p class="">Importerad: </p>
                            </div>
                            <div>
                                {#if data.imported.includes("Nej")}
                                    <p>Nej</p>
                                {:else}
                                    <p>Ja</p>
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-300 p-4 my-2 rounded-lg">
                    <p class="font-semibold text-xl mb-2">Kostnader</p>
                    <div class="flex flex-col justify-center space-y-1">
                        <div class="flex items-center space-x-2">
                            <div>
                                <p class="">Årlig skatt: </p>
                            </div>
                            <div>
                                <p>{data.yearlyTax}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div>
                                <p class="">Kreditköp: </p>
                            </div>
                            <div>
                                <p>{data.creditPurchase}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div>
                                <p class="">Leasad: </p>
                            </div>
                            <div>
                                <p>{data.leased}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-300 p-4 my-2 rounded-lg">
                    <p class="font-semibold text-xl mb-2">Teknisk data</p>
                    <div class="flex flex-col justify-center space-y-1">
                        <div class="flex items-center space-x-2">
                            <div>
                                <p class="">Motoreffekt: </p>
                            </div>
                            <div>
                                <p>{data.motorEffect}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div>
                                <p class="">Drivmedel: </p>
                            </div>
                            <div>
                                <p>{data.fuel}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div>
                                <p class="">Toppfart: </p>
                            </div>
                            <div>
                                <p>{data.topSpeed}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div>
                                <p class="">Växellåda: </p>
                            </div>
                            <div>
                                <p>{data.shiftBox}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div>
                                <p class="">Fyrhjulsdrift: </p>
                            </div>
                            <div>
                                <p>{data.fourWheelDrive}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div>
                                <p class="">Kaross: </p>
                            </div>
                            <div>
                                <p>{data.carBody}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div>
                                <p class="">Längd: </p>
                            </div>
                            <div>
                                <p>{data.lengthMm}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div>
                                <p class="">Bredd: </p>
                            </div>
                            <div>
                                <p>{data.widthMm}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div>
                                <p class="">Höjd: </p>
                            </div>
                            <div>
                                <p>{data.heightMm}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div>
                                <p class="">Tjänstevikt: </p>
                            </div>
                            <div>
                                <p>{data.serviceWeight}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div>
                                <p class="">Totalvikt: </p>
                            </div>
                            <div>
                                <p>{data.totalWeight}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div>
                                <p class="">Fordonskategori (EU): </p>
                            </div>
                            <div>
                                <p>{data.EUCarCategory}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-400 p-1 font-mono border-gray-700 border-2">
                    <pre class="overflow-clip">{JSON.stringify(data)}</pre>
                </div>

                <div class="mt-4">
                    <a class="text-blue-600 font-semibold" href={`https://biluppgifter.se/fordon/${data.regNr}`}>
                        <div class="flex items-center space-x-1">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
                                    <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
                                </svg>
                            </div>
                            <div>
                                <p>Mer information</p>
                            </div>
                        </div>
                        
                    </a>
                </div>
            </div>
        {:else if !data && !loading}
            <p class="text-gray-800">Sök på en nummer plåt...</p>
        {/if}
    </div>
</div>