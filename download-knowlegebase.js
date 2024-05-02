import 'dotenv/config'
import * as cheerio from 'cheerio'
import * as fs from 'fs'
import axios from 'axios'

const links = []

// GET INDEX PAGES
for(let i=0; i<Number(process.env.PAGES); i++) {
    const pageUrl = `${process.env.BASE_URL}/${i*100}`
    console.log(pageUrl)
    links.push(pageUrl)

    const page = await axios.get(pageUrl)
    const html = page.data
    const $ = await cheerio.load(html)
    const pageLinks = $('body').find('.r-link')
    for(let p of pageLinks) {
        if(p.attribs.href) links.push(`https://www.restack.io${p.attribs.href}`)
    }
}

const generateImageUrl = async (url) => {
    const { data } = await axios({
        method: 'POST',
        url: 'https://api.urlbox.io/v1/render/sync',
        headers: { Authorization: `Bearer ${process.env.URLBOX_SECRET_KEY}` },
        data: {
            url,
            full_page: true,
            block_urls: ['*.optimizely.com', 'everesttech.net', 'userzoom.com', 'doubleclick.net', 'googleadservices.com', 'adservice.google.com/*'],
            css: '.sm\\:max-w-xl.inline-block.p-4.text-left.bg-gray-800.border.border-gray-700.rounded-lg.shadow-2xl.transform.transition-all.align-middle.sm\\:my-8.w-full {display: none;}'
        }
    })
    return data.renderUrl
}

const downloadImage = async (url, filepath) => {
    const response = await axios({ url, method: 'GET', responseType: 'stream' })
    return new Promise((resolve, reject) => {
        response.data.pipe(fs.createWriteStream(filepath, { flags: 'w' }))
            .on('error', reject)
            .once('close', () => resolve(filepath))
    })
}

for(const link of links) {
    const urlPaths = link.split("/").filter(path => path !== "")
    const lastPath = urlPaths[urlPaths.length - 1]
    const imageUrl = await generateImageUrl(link)
    await downloadImage(imageUrl, `./images/${lastPath}.png`)
    console.log('Grabbed ' + link)
}
