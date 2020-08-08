export const initialUsers = [
  {
    email: 'bob@example.com',
    password: '0q7#Wy#WHyKX',
    name: 'Bob Smith',
    avatar: true,
    info: 'Work on electronics to maintain their electrical component. Enjoy testing the durability of items.',
    address: 'PXC2+MJ Jersey City, New Jersey, United States'
  },
  {
    email: 'alice@example.com',
    password: '8I&o9FSv%VrU',
    name: 'Alice',
    avatar: true,
    info: 'Wife... & Mother of 3. Love Shopping ( mainly on Amazon!) and Crafting. Addicted to my Cricut, Home Renovation shows and my kiddos.',
    address: 'M3P2+MG Brooklyn, New York, United States'
  },
  {
    email: 'john@example.com',
    password: 'VgJ48q&8%^Dm',
    name: 'Jools',
    address: '531-577 Bryant St, Rahway, NJ 07065, USA'
  },
  {
    email: 'mary@example.com',
    password: 'p2&MR5w$Z7pF',
    name: 'Marette',
    avatar: true,
    info: 'I run a home-based business. I don\'t have time to go to the store all the time so I shop on amazon. We donate a lot to our local animal shelter and help with fundraisers, so we are always in need of giveaways. Amazon is always our go-to for all our home, office needs, donation needs. Please do not contact me for doing reviews. I do reviews on what I purchase already.',
    address: '2QXW+7W Los Angeles, California, United States'
  }
]

export const initialProducts = {
  Desktops: {
    Acer: [
      [
        {
          title: 'Acer Aspire Z24-890-UA91 AIO Desktop, 23.8 inches Full HD, 9th Gen Intel Core i5-9400T, 12GB DDR4, 512GB SSD, 802.11ac Wifi, USB 3.1 Type C, Wireless Keyboard and Mouse, Windows 10 Home, Silver',
          listPrice: 799.99,
          price: 686.15,
          bullets: '9th Generation Intel Core i5 9400T Processor (Up to 3.4GHz)\n23.8 inches Full HD (1920 x 1080) widescreen Edge to Edge LED Back lit Display\n12GB DDR4 Memory, 512GB SSD & 8x DVD Writer Double Layer Drive (DVD RW)\n802.11ac Wi Fi, Gigabit Ethernet LAN & Bluetooth 4.2LE\n2 Built in 2W Stereo Speakers| Built in 2.0MP Full HD (1080P) Webcam, Wireless Keyboard and Mouse, Windows 10 Home',
          description: 'Instant Pot Duo Mini is the ideal companion to the Duo 6 Quart, 7-in-1 programmable multi-cooker replaces 7 kitchen appliances, combines the functions of a Rice Cooker, Pressure Cooker, Slow Cooker, Steamer, Sauté, Yogurt Maker, and Warmer. 11 smart built-in programs – Rice, Soup/Broth, Meat/Stew, Bean/Chili, Sauté, Steam, Porridge, Yogurt, Slow Cook, and Keep Warm, your favorite dishes are as easy as pressing a button. The Instant Pot Duo Mini Rice Cooker Function cooks up to 6 cups of uncooked rice (12 cups cooked rice), the rice cooker function can cook all types of rice including white rice, brown rice, wild rice, sushi rice, risotto rice and more.',
          stock: 21,
          media: 7,
          isAvailable: true,
          groupVariations: [
            { name: 'Style', value: 'No Touch Screen' },
            { name: 'Size', value: '12GB / 512GB SSD' }
          ],
          productParameters: [
            { name: 'Screen Size', value: '23.8' },
            { name: 'Processor', value: '3.4 GHz Intel Core i5' },
            { name: 'RAM', value: '12 GB DDR4' },
            { name: 'Hard Drive', value: '512 GB Flash Memory Solid State' },
            { name: 'Card Bullets', value: 'Integrated' },
            { name: 'Graphics Card Ram Size', value: '0.1' },
            { name: 'Wireless Type', value: '802.11ab' },
            { name: 'Number of USB 2.0 Ports', value: '1' },
            { name: 'Number of USB 3.0 Ports', value: '4' },
            { name: 'Brand Name', value: 'Acer' },
            { name: 'Series', value: 'Z24-890-UA91' },
            { name: 'Product model number', value: 'Z24-890-UA91' },
            { name: 'Opereview System', value: 'Windows 10 Home' },
            { name: 'Product Weight', value: '17.4 pounds' },
            { name: 'Product Dimensions', value: '21.3 x 1.4 x 17.3 inches' },
            { name: 'Product Dimensions L x W x H', value: '21.29 x 1.45 x 17.3 inches' },
            { name: 'Color', value: 'Silver' },
            { name: 'Processor Brand', value: 'Intel' },
            { name: 'Computer Memory Type', value: 'DDR4 SDRAM' },
            { name: 'Flash Memory Size', value: '512 MB' },
            { name: 'Hard Drive Interface', value: 'Solid State' },
            { name: 'Hard Drive Rotational Speed', value: '0.1 RPM' },
            { name: 'Optical Drive Type', value: 'DVD-RW' }
          ],
          reviews: [
            {
              author: 0,
              stars: 1,
              variation: {
                Style: 'No Touch Screen',
                Size: '12GB / 512GB SSD'
              },
              title: 'Brand New ACER AIO has dead pixel.',
              content: 'PC is ok, less than thrilled that this brand new machine has a dead pixel and it is required that it have 2 dead pixels to be covered under warranty. Acer customer service was not helpful. They suggested troubleshooting solutions that I completed but were pointless. Their customer service staff also clearly did not communicate well with one another. On a subsequent call it appeared that the notes provided by the previous CSR were inadequate to communicate the steps we already took. They are unwilling to provide a positive outcome.. Will never buy another Acer product. Very unhappy.',
              comments: [
                {
                  author: 1,
                  content: 'This product is worthless.',
                  media: 1,
                  mediaFiles: [ 0 ]
                }
              ]
            },
            {
              author: 2,
              stars: 5,
              variation: {
                Style: 'Touch Screen',
                Size: '8GB / 1TB HDD'
              },
              title: 'We Would Give More Stars If We Could',
              content: `Wow. This is a great computer. Any complaints made about the C24-865 have been resoundingly addressed here.

              Notable features:
              -The keyboard USB dongle is in the bottom edge of the monitor. This is a great improvement, as often they plug into the back causing bad/choppy keyboard response.
              -The mouse is already plugged in and ready to go.
              -The SD reader, audio jack, and keyboard dongle are all on the bottom edge. Easy access!
              -You can easily add a second/dual monitor.
              -This monitor is nice and bright with a great, wide viewing angle.
              -It does have a disc drive, which is becoming rare these days.
              -Because it has a solid state drive, it reboots ridiculously fast.
              -It has a dual mic, and the sound quality of the speakers is fantastic.
              -Alexa works very well with it.
              -The webcan quality is better.
              -We did plug our Firestick into the HDMI port (oh yeah, it has one) and it works. You can use this like a TV if you wanted to.
              -It’s convenient. Plug in the power cord and you’re ready to go.
              
              My husband is in IT and works with this stuff every day. He loves this computer. We have installed it in a public area and created accounts for everyone. The whole family uses it, and the kids are getting a jump on back to school assignments using this. It’s amazing!`,
              media: 2,
              mediaFiles: [ 0, 1 ]
            }
          ],
          questions: [
            {
              author: 1,
              content: 'What is the height of the unit as it sits on the desk?',
              answers: [
                {
                  author: 0,
                  content: 'From the top of the table to the top of the web cam is 17 3/8 inches by my measurement.'
                },
                { author: 3, content: '17 inch' },
                {
                  author: 2,
                  content: '17.5"',
                  comments: [
                    { author: 1, content: 'Will check it out, thanks.' }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Acer Aspire Z24-890-UR13 AIO Desktop, 23.8" Full HD Touch Display, 9th Gen Intel Core i5-9400T, 8GB DDR4, 1TB HDD, 802.11ac WiFi, USB 3.1 Type C, Wireless Keyboard and Mouse, Windows 10 Home',
          listPrice: 849.99,
          price: 716.15,
          bullets: '9th Generation Intel Core i5-9400T Processor (Up to 3 4GHz)\n23 8" Full HD (1920 x 1080) Widescreen Edge-to-Edge LED Back-lit Touch Display\n8GB DDR4 Memory 1TB HDD & 8X DVD-Writer Double-Layer Drive (DVD-RW)\n802 11ac Wi-Fi Gigabit Ethernet LAN & Bluetooth 4 2LE\nTwo Built-in 2W Stereo Speakers| Built-in 2 0MP Full HD (1080P) Webcam | Wireless \nKeyboard and Mouse | Windows 10 Home',
          description: 'Instant Pot Duo Mini is the ideal companion to the Duo 6 Quart, 7-in-1 programmable multi-cooker replaces 7 kitchen appliances, combines the functions of a Rice Cooker, Pressure Cooker, Slow Cooker, Steamer, Sauté, Yogurt Maker, and Warmer. 11 smart built-in programs – Rice, Soup/Broth, Meat/Stew, Bean/Chili, Sauté, Steam, Porridge, Yogurt, Slow Cook, and Keep Warm, your favorite dishes are as easy as pressing a button. The Instant Pot Duo Mini Rice Cooker Function cooks up to 6 cups of uncooked rice (12 cups cooked rice), the rice cooker function can cook all types of rice including white rice, brown rice, wild rice, sushi rice, risotto rice and more.',
          stock: 2,
          media: 7,
          isAvailable: true,
          groupVariations: [
            { name: 'Style', value: 'Touch Screen' },
            { name: 'Size', value: '8GB / 1TB HDD' }
          ],
          productParameters: [
            { name: 'Screen Size', value: '23.8' },
            { name: 'Processor', value: '3.4 8032' },
            { name: 'RAM', value: '8 GB DDR4_SDRAM' },
            { name: 'Hard Drive', value: 'mechanical_hard_drive' },
            { name: 'Graphics Coprocessor', value: 'Intel UHD Graphics 630' },
            { name: 'Card Bullets', value: 'Integrated' },
            { name: 'Wireless Type', value: '802.11ab' },
            { name: 'Brand Name', value: 'Acer' },
            { name: 'Series', value: 'Z24-890-UR13' },
            { name: 'Product model number', value: 'Z24-890-UR13' },
            { name: 'Opereview System', value: 'Windows 10 Home' },
            { name: 'Product Weight', value: '17.9 pounds' },
            { name: 'Product Dimensions', value: '21.3 x 1.4 x 17.3 inches' },
            { name: 'Product Dimensions L x W x H', value: '21.29 x 1.45 x 17.3 inches' },
            { name: 'Processor Brand', value: 'Intel' },
            { name: 'Processor Count', value: '1' },
            { name: 'Flash Memory Size', value: '1' }
          ]
        },
        {
          title: 'Acer Aspire Z24-890-UR18 AIO Desktop, 23.8" Full HD Display, 9th Gen Intel Core i5-9400T, 8GB DDR4, 512GB SSD, 802.11ac WiFi, USB 3.1 Type C, Wireless Keyboard and Mouse, Windows 10 Home',
          listPrice: 759.99,
          price: 636.15,
          bullets: '9th Generation Intel Core i5-9400T Processor (Up to 3 4GHz)\n23 8" Full HD (1920 x 1080) Widescreen Edge-to-Edge LED Back-lit Display\n8GB DDR4 Memory 512GB SSD & 8X DVD-Writer Double-Layer Drive (DVD-RW)\n802 11ac Wi-Fi Gigabit Ethernet LAN & Bluetooth 5 0\nTwo Built-in 2W Stereo Speakers| Built-in 2 0MP Full HD (1080P) Webcam | Wireless\nKeyboard and Mouse | Windows 10 Home',
          description: 'Instant Pot Duo Mini is the ideal companion to the Duo 6 Quart, 7-in-1 programmable multi-cooker replaces 7 kitchen appliances, combines the functions of a Rice Cooker, Pressure Cooker, Slow Cooker, Steamer, Sauté, Yogurt Maker, and Warmer. 11 smart built-in programs – Rice, Soup/Broth, Meat/Stew, Bean/Chili, Sauté, Steam, Porridge, Yogurt, Slow Cook, and Keep Warm, your favorite dishes are as easy as pressing a button. The Instant Pot Duo Mini Rice Cooker Function cooks up to 6 cups of uncooked rice (12 cups cooked rice), the rice cooker function can cook all types of rice including white rice, brown rice, wild rice, sushi rice, risotto rice and more.',
          stock: 5,
          media: 7,
          isAvailable: true,
          groupVariations: [
            { name: 'Style', value: 'No Touch Screen' },
            { name: 'Size', value: '8GB / 512GB SSD' }
          ],
          productParameters: [
            { name: 'Screen Size', value: '23.8' },
            { name: 'Processor', value: '3.4 GHz Intel Core i5' },
            { name: 'RAM', value: '8 GB DDR4' },
            { name: 'Card Bullets', value: 'Integrated' },
            { name: 'Graphics Card Ram Size', value: '0.1' },
            { name: 'Wireless Type', value: '802.11ab' },
            { name: 'Number of USB 2.0 Ports', value: '1' },
            { name: 'Number of USB 3.0 Ports', value: '3' },
            { name: 'Brand Name', value: 'Acer' },
            { name: 'Series', value: 'Z24-890-UR18' },
            { name: 'Product model number', value: 'Z24-890-UR18' },
            { name: 'Opereview System', value: 'Windows 10 Home' },
            { name: 'Product Weight', value: '17.4 pounds' },
            { name: 'Product Dimensions', value: '21.3 x 1.4 x 17.3 inches' },
            { name: 'Product Dimensions L x W x H', value: '21.29 x 1.45 x 17.3 inches' },
            { name: 'Processor Brand', value: 'Intel' },
            { name: 'Computer Memory Type', value: 'DDR4 SDRAM' },
            { name: 'Flash Memory Size', value: '512' },
            { name: 'Hard Drive Interface', value: 'Solid State' },
            { name: 'Hard Drive Rotational Speed', value: '0.1' },
            { name: 'Optical Drive Type', value: 'DVD-RW' }
          ]
        }
      ]
    ]
  }
}
