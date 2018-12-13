const puppeteer = require('puppeteer')

function stepPage(page) {
  let step = 0
  page.captureStep = (fullPage = false) => {
    return page.screenshot({path: `ss/step-${++step}.jpg`, fullPage})
  }

  let border
  page.setBorder = (selector) => {
    return page.evaluate((selector) => {
      border = $(selector).css("border")
      $(selector).css("border", "3px solid red")
      return true
    }, selector)
  }
  page.resetBorder = (selector) => {
    return page.evaluate((selector) => {
      if (border) {
        $(selector).css("border", border)
      }
      return true
    }, selector)
  }

  return page
}

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      // slowMo: 50,
      defaultViewport: {
        width: 1200,
        height: 800
      }
    })
    const page = stepPage(await browser.newPage())

    //
    // login
    //
    console.log('-----login-----')
    await page.goto('http://localhost:8080/wp-login.php')
        
    await page.type('#login > #loginform > p > label > #user_login', 'admin')
    await page.type('#login > #loginform > p > label > #user_pass', 'password')
    
    await page.waitForSelector('.login > #login > #loginform > .submit > #wp-submit')
    await page.click('.login > #login > #loginform > .submit > #wp-submit')

    //
    // new post
    //
    console.log('-----new post-----')
    const postmenu = '#adminmenuwrap > #adminmenu > #menu-posts > .wp-has-submenu > .wp-menu-name'
    await page.waitForSelector(postmenu)
    await page.goto('http://localhost:8080/wp-admin/post-new.php')

    //
    // insert media
    //
    console.log('-----close popup-----')
    const popup = '#editor > div > div > div > div:nth-child(6) > div > div > div > div > button'
    await page.waitForSelector(popup)
    await page.click(popup)

    // open media library
    console.log('-----open media library step1-----')
    const mediaButton = '.editor-inserter-with-shortcuts > .components-button:nth-child(1) > .editor-block-icon > svg'
    await page.waitForSelector(mediaButton)
    await page.setBorder(mediaButton)
    await page.captureStep()
    await page.resetBorder(mediaButton)
    await page.click(mediaButton)
    
    console.log('-----open media library step2-----')
    const mediaButton2 = '.editor-block-list__block-edit > div > .components-placeholder > .components-placeholder__fieldset > .components-button'
    await page.waitForSelector(mediaButton2)
    await page.setBorder(mediaButton2)
    await page.captureStep()
    await page.resetBorder(mediaButton2)
    await page.click(mediaButton2)

    // select image
    console.log('-----select image-----')
    const image = '.attachments-browser > .attachments > .attachment:nth-child(1) > .attachment-preview > .thumbnail'
    await page.waitForSelector(image)
    await page.setBorder(image)
    await page.captureStep()
    await page.resetBorder(image)
    await page.click(image)

    // type caption
    console.log('-----type caption-----')
    const caption = '.attachments-browser > .media-sidebar > .attachment-details > .setting:nth-child(5) > textarea'
    await page.waitForSelector(caption)
    await page.type(caption, 'キャプション')
    await page.setBorder(caption)
    await page.captureStep()
    await page.resetBorder(caption)

    // type alt
    console.log('-----type alt-----')
    const alt = '.attachments-browser > .media-sidebar > .attachment-details > .setting:nth-child(6) > input'
    await page.waitForSelector(alt)
    await page.type(alt, '代替テキスト')
    await page.setBorder(alt)
    await page.captureStep()
    await page.resetBorder(alt)

    // type description
    console.log('-----type description-----')
    const description = '.attachments-browser > .media-sidebar > .attachment-details > .setting:nth-child(7) > textarea'
    await page.waitForSelector(description)
    await page.type(description, '説明')
    await page.setBorder(description)
    await page.captureStep()
    await page.resetBorder(description)

    // insert
    console.log('-----insert-----')
    const insert = '#\__wp-uploader-id-0 > .media-frame-toolbar > .media-toolbar > .media-toolbar-primary > .button'
    await page.waitForSelector(insert)
    await page.setBorder(insert)
    await page.captureStep()
    await page.resetBorder(insert)
    await page.click(insert)

    // result
    console.log('-----result-----')
    await page.captureStep()

    console.log('-----finish-----')
    await browser.close()
  } catch (error) {
    console.log(error)
    await browser.close()
  }
})()