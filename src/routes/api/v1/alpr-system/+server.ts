import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import axios from 'axios';
import { browser } from '$lib/server/browser';

export const POST: RequestHandler = async ({ request }) => {

    const r = await request.json()
    const regNr: string = r.regNr

    const url = "https://biluppgifter.se/fordon/" + regNr
    const regNrRegexp = new RegExp(/^[A-Z0-9]+$/)

    // regNr checks
    if (regNr == null || regNr == undefined || regNr == "" || !regNrRegexp.test(regNr)) {
        throw error(400, "bad-reg-number")
    }

    if (!(regNr.length > 1 && regNr.length < 8)) {
        throw error(400, "bad-reg-number")
    }
    
    const options = {
        method: 'POST',
        url: 'https://dripcrawler.p.rapidapi.com/',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': '1a3d860ea8msh7b1cd6e925e9cd3p186cabjsndb6a85913bd3',
            'X-RapidAPI-Host': 'dripcrawler.p.rapidapi.com'
        },
        data: {
            url: url,
            javascript_rendering: 'False'
        }
    };

    try {
        const response = await axios.request(options);

        // Get data
        const html = response.data.extracted_html
        const page = await browser.newPage()
        await page.setContent(html, { timeout: 10000, waitUntil: 'networkidle0' })
        //await page.goto("file:///D:/Files/Programing/side-projects/alpr-system/test.html")

        const content = await page.evaluate(() => Array.from(document.querySelectorAll('li'), (e) => ({
            label: e.querySelector('.label')?.innerHTML,
            value: e.querySelector('.value')?.innerHTML
        })))

        for (let i = 0; i < content.length; i++) {
            content[i].label = content[i].label?.replaceAll("\n", "")
            content[i].value = content[i].value?.replaceAll("\n", "")
            content[i].label = content[i].label?.replaceAll("\\", "")
            content[i].value = content[i].value?.replaceAll("\\", "")
        }
        content[2].value = content[2].value?.replaceAll("<span id=\"data-vehicle-year\">", "")
        content[2].value = content[2].value?.replace("</span> / <span id=\"data-model-year\">", " / ")
        content[2].value = content[2].value?.replace("</span>", "")

        let isStolen
        if (content[5].value?.includes("Ej")) {
            isStolen = false
        } else {
            isStolen = true
        }


        let make

        let model

        let carYearModelYear

        let VIN

        let status: any = await page.evaluate(() => document.querySelector("#data-traffic-status")?.innerHTML) as string

        let enviromentClass

        let emissionClass

        let yearlyTax

        let creditPurchase

        let leased

        let color

        let carBody

        let lengthMm

        let widthMm

        let heightMm

        let totalWeight

        let serviceWeight

        let EUCarCategory

        let motorEffect

        let topSpeed

        let fuel

        let shiftBox

        let fourWheelDrive

        let imported

        for (let i = 0; i < content.length; i++) {
            if (content[i].label == "Fabrikat") {
                make = content[i].value
            } else if (content[i].label == "Modell") {
                model = content[i].value
            } else if (content[i].label == "Fordonsår / Modellår") {
                carYearModelYear = content[i].value
            } else if (content[i].label == "Chassinr / VIN") {
                VIN = content[i].value
            } else if (content[i].label == "Miljöklass") {
                enviromentClass = content[i].value
            } else if (content[i].label == "Utsläppsklass") {
                emissionClass = content[i].value
            } else if (content[i].label == "Årlig skatt") {
                yearlyTax = content[i].value
            } else if (content[i].label == "Kreditköp") {
                creditPurchase = content[i].value
            } else if (content[i].label == "Leasad") {
                leased = content[i].value
            } else if (content[i].label == "Färg") {
                color = content[i].value
            } else if (content[i].label == "Kaross") {
                carBody = content[i].value
            } else if (content[i].label == "Längd") {
                lengthMm = content[i].value
            } else if (content[i].label == "Bredd") {
                widthMm = content[i].value
            } else if (content[i].label == "Höjd") {
                heightMm = content[i].value
            } else if (content[i].label == "Totalvikt") {
                totalWeight = content[i].value
            } else if (content[i].label == "Tjänstevikt") {
                serviceWeight = content[i].value
            } else if (content[i].label == "Fordonskategori EU") {
                EUCarCategory = content[i].value
            } else if (content[i].label == "Motoreffekt") {
                motorEffect = content[i].value
            } else if (content[i].label == "Toppfart") {
                topSpeed = content[i].value
            } else if (content[i].label == "Drivmedel") {
                fuel = content[i].value
            } else if (content[i].label == "Växellåda") {
                shiftBox = content[i].value
            } else if (content[i].label == "Fyrhjulsdrift") {
                fourWheelDrive = content[i].value
            } else if (content[i].label == "Import / Införsel") {
                make = content[i].value
            }
        }

        await page.close()

        return json({
            regNr,
            isStolen, 
            make, 
            model, 
            carYearModelYear, 
            VIN, 
            status, 
            enviromentClass, 
            emissionClass,
            yearlyTax,
            creditPurchase,
            leased,
            color,
            carBody,
            lengthMm,
            widthMm,
            heightMm,
            totalWeight,
            serviceWeight,
            EUCarCategory,
            motorEffect,
            topSpeed,
            fuel,
            shiftBox,
            fourWheelDrive,
            imported
        })
    } catch (e) {
        throw error(500)
    }
};