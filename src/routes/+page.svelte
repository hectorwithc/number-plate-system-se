<script lang="ts">
    import axios from 'axios'

    const regex2 = new RegExp(/^[a-z]$/)

    let data: any;
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
        <h1 class="font-bold text-2xl mb-2">Number Plate Reader (SE)</h1>

        <input type="text" on:input={(e) => { onInput(e) }} bind:value={regNr} class="text-lg p-2 rounded-lg mr-2 outline-none border-gray-400 border-2 bg-gray-100" placeholder="ABC123">

        {#if loading}
            <button class="py-2 px-2 btn font-semibold text-lg cursor-wait opacity-75">
                <div class="flex items-center space-x-2">
                    <svg class="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.2" fill-rule="evenodd" clip-rule="evenodd" d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" /><path d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z" fill="currentColor" /></svg>
                    <p>Send</p>
                </div>
            </button>
        {:else}
            <button class="py-2 px-4 btn font-semibold text-lg" on:click={sendData}>Send</button>
        {/if}
    </div>

    <div class="bg-gray-200 rounded-lg p-4">
        {#if loading}
            <div class="flex items-center space-x-2">
                <p class="text-xl">Loading...</p>
                <svg class="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.2" fill-rule="evenodd" clip-rule="evenodd" d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" /><path d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z" fill="currentColor" /></svg>
            </div>
        {/if}
        {#if error}
            <p class="font-semibold text-xl mb-2">Error found</p>
        {/if}
        {#if error?.message == "bad-reg-number"}
            <p class="bg-red-700 rounded-lg p-2 w-fit text-white">Not a valid registration number</p>
        {/if}
        {#if error?.message == "no-car"}
            <p class="bg-red-700 rounded-lg p-2 w-fit text-white">No match</p>
        {/if}
        {#if error?.message == "slow-down"}
            <p class="bg-yellow-500 rounded-lg p-2 w-fit text-white">Slow down your searches</p>
        {/if}
        {#if error?.message == "try-again"}
            <p class="bg-yellow-500 rounded-lg p-2 w-fit text-white">Try again</p>
        {/if}
        {#if data}
            <div>
                <p>{JSON.stringify(data)}</p>
                <a class="text-blue-500" href={`https://biluppgifter.se/fordon/${data.regNr}`}>Mer information</a>
            </div>
        {/if}
    </div>
</div>