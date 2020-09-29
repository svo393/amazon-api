export const initialUsers = [
  {
    email: 'alice@example.com',
    password: '8I&o9FSv%VrU',
    name: 'Alice',
    avatar: true,
    info: 'Wife... & Mother of 3. Love Shopping ( mainly on Amazon!) and Crafting. Addicted to my Cricut, Home Renovation shows and my kiddos.',
    address: {
      country: 'United States',
      fullName: 'Alice Dokubo',
      streetAddressLine1: '507, Crown Dale',
      city: 'Alabama',
      region: 'Alabama',
      postalCode: 5613,
      phoneNumber: '56137755568'
    }
  },
  {
    email: 'bob@example.com',
    password: '0q7#Wy#WHyKX',
    name: 'Bob Smith',
    avatar: true,
    cover: true,
    info: 'Work on electronics to maintain their electrical component. Enjoy testing the durability of items.',
    address: {
      country: 'United States',
      fullName: 'Bob Smith',
      streetAddressLine1: 'PXC2+MJ',
      city: 'Jersey City',
      region: 'New Jersey',
      postalCode: 512124,
      phoneNumber: '01487755568'
    }
  },
  {
    email: 'mary@example.com',
    password: 'p2&MR5w$Z7pF',
    name: 'Marette',
    avatar: true,
    info: 'I run a home-based business. I don\'t have time to go to the store all the time so I shop on amazon. We donate a lot to our local animal shelter and help with fundraisers, so we are always in need of giveaways. Amazon is always our go-to for all our home, office needs, donation needs. Please do not contact me for doing reviews. I do reviews on what I purchase already.',
    address: {
      country: 'Cyprus',
      fullName: 'Marrette Jordan',
      streetAddressLine1: '12XC2+MJ',
      city: 'Piwn',
      region: 'Aargau',
      postalCode: 6342,
      phoneNumber: '08987765468'
    }
  },
  {
    email: 'john@example.com',
    password: 'VgJ48q&8%^Dm',
    name: 'Jools',
    address: {
      country: 'Benin',
      fullName: 'Jools Willow',
      streetAddressLine1: '12XC2+MJ',
      city: 'Piwn',
      region: 'Verde',
      postalCode: 84984,
      phoneNumber: '08987765468'
    }
  },
  {
    email: 'mckenna60@example.com',
    password: 'oO}8R>"Lak',
    name: 'Mckenna60',
    avatar: true,
    cover: true,
    info: '"Go the Extra Mile,It\'s Never Crowded"Partner-Mother-Sister-Hugger-Bestie-EQUALITY4ALL',
    address: {
      country: 'Austria',
      fullName: 'Darcy Win',
      streetAddressLine1: '471 Vienna International Centre',
      city: 'Salzburg',
      region: 'Salzburg',
      postalCode: 1080,
      phoneNumber: '972004010'
    }
  },
  {
    email: 'osenger@example.com',
    password: 'OI~lrGbu~R#g1A',
    name: 'osenger',
    avatar: true,
    cover: true,
    info: 'I am professor emeritus at Western New England University in Springfield, MA where I have taught for 40 years. My thanks go to all those thoughtful people who write helpful reviews.',
    address: {
      country: 'United States',
      fullName: 'Anadar Puerto',
      streetAddressLine1: '504 St. Anne\'s Villas',
      city: 'Alabama',
      region: 'Alabama',
      postalCode: 3591,
      phoneNumber: '69993974611'
    }
  },
  {
    email: 'fbalistreri@example.com',
    password: '&cRJ&D46aw~=',
    name: 'Fbalistreri',
    avatar: true,
    cover: true,
    address: {
      country: 'United States',
      fullName: 'Genivee Bird',
      streetAddressLine1: '187 Beresford Street',
      city: 'New York',
      region: 'New York',
      postalCode: 5399,
      phoneNumber: '268907297'
    }
  },
  {
    email: 'mason42@example.com',
    password: 'A15iC)XjPSRgGQ%UR',
    name: 'Mason42',
    avatar: true,
    cover: true,
    info: 'As an Amazon Influencer, I do Amazon Live Streaming and Youtube reviews (electronics and tools)',
    address: {
      country: 'Bangladesh',
      fullName: 'Claennis Hagman',
      streetAddressLine1: '482 Maijdi-Chandraganj Road',
      city: 'Chittagong Division',
      region: 'Chittagong Division',
      postalCode: 2330,
      phoneNumber: '862989586'
    }
  },
  {
    email: 'cruickshankkhalil@example.com',
    password: 'LxgM^O?ic>0s',
    name: 'Cruickshankkhalil',
    avatar: true,
    cover: true,
    info: 'I\'m a shopaholic. I love to browse amazon product on my free time. I love food, beauty, fashion, and home décor. I\'m the type of person that read numerous reviews before making a purchase. So, I like to write review for the product I buy as well to help others.',
    address: {
      country: 'Afghanistan',
      fullName: 'Cottus Cariaga',
      streetAddressLine1: '154 Qara Bagh',
      city: 'Samangan',
      region: 'Samangan',
      postalCode: 111111,
      phoneNumber: '1052'
    }
  },
  {
    email: 'cade76@example.com',
    password: '_4&XAA3',
    name: 'cade76',
    avatar: true,
    cover: true,
    info: 'gamesmaster at heart most of the time, I do all types of reviews.',
    address: {
      country: 'Andorra',
      fullName: 'Fabio Srivastava',
      streetAddressLine1: '407 Place Charles de Gaulle',
      city: 'Andorra la Vella',
      region: 'Andorra la Vella',
      postalCode: 75019,
      phoneNumber: '194687903'
    }
  }
]

export const initialProducts = {
  'All-in-Ones Computers': {
    Acer: [
      {
        questions: [
          {
            author: 1,
            content: 'What is the height of the unit as it sits on the desk?',
            answers: [
              {
                author: 0,
                content: 'From the top of the table to the top of the web cam is 17 3/8 inches by my measurement.'
              },
              {
                author: 3,
                content: '17 inch'
              },
              {
                author: 2,
                content: '17.5"'
              }
            ]
          },
          {
            author: 3,
            content: 'Is this a good computer for working with Photoshop and Manga Studio?',
            answers: [
              {
                author: 5,
                content: 'I haven\'t used Manga Studio, but I use it with Photoshop CS and it works well. I\'m guessing, if it works with PS it should work with MS.'
              }
            ]
          },
          {
            author: 7,
            content: 'Does the mouse comes with the receiver cant get it to work?',
            answers: [
              {
                author: 5,
                content: 'The dongle for the wireless mouse is located inside the battery compartment. If you still cannot locate the dongle, please contact Acer support at 866-695-2237.'
              },
              {
                author: 1,
                content: 'The mouse\'s receiver is actually inserted for you in the back. Just put in the batteries, turn the power bar over and you are good to go. There is a slot inside the mouse\'s cover to insert the receiver should you change mouses.'
              },
              {
                author: 9,
                content: 'The above English sentence makes no sense'
              },
              {
                author: 4,
                content: 'Do you actually expect someone to answer that question?? Correct English might get an answer.'
              }
            ]
          },
          {
            author: 5,
            content: 'Would this be good for light gaming? like if i just wanted to play world of warcraft?',
            answers: [
              {
                author: 6,
                content: 'I play many games with ease. The colors are fabulous.'
              },
              {
                author: 3,
                content: 'It is very fast if you get the version with the electronic hard drive and screen is big and very bright'
              }
            ]
          },
          {
            author: 4,
            content: 'Can more memory be added?',
            answers: [
              {
                author: 7,
                content: 'I\'ve read it\'s possible but it\'s a total pain as you have to pull the screen off.'
              }
            ]
          }
        ],
        products: [
          {
            title: 'Acer Aspire Z24-890-UA91 AIO Desktop, 23.8 inches Full HD, 9th Gen Intel Core i5-9400T, 12GB DDR4, 512GB SSD, 802.11ac Wifi, USB 3.1 Type C, Wireless Keyboard and Mouse, Windows 10 Home, Silver',
            listPrice: 799.99,
            price: 686.15,
            bullets: '9th Generation Intel Core i5 9400T Processor (Up to 3.4GHz)\n23.8 inches Full HD (1920 x 1080) widescreen Edge to Edge LED Back lit Display\n12GB DDR4 Memory, 512GB SSD & 8x DVD Writer Double Layer Drive (DVD RW)\n802.11ac Wi Fi, Gigabit Ethernet LAN & Bluetooth 4.2LE\n2 Built in 2W Stereo Speakers| Built in 2.0MP Full HD (1080P) Webcam, Wireless Keyboard and Mouse, Windows 10 Home',
            description: 'Acer Aspire Z24 890 UA91 All in One desktop PC comes with these specs: 9th Generation Intel Core i5 9400T processor 1.8GHz with Turbo Boost Technology up to 3.4GHz, Windows 10 Home, 23.8" Full HD Widescreen Edge to Edge LED Back lit Display, 12GB DDR4 Memory, Intel UHD Graphics 630, 512GB SSD, Built in 2.0MP Full HD (1080P) Webcam and Dual Built in Digital Microphones, 10/100/1000 Gigabit Ethernet, 802.11ac Wi Fi, Bluetooth 4.2 LE, Optimized Dolby Audio Premium Sound Enhancement, Acer TrueHarmony Technology, Two Built in 2W Stereo Speakers, 1 USB 3.1 (Type C) port (Gen 2 up to 10 Gbps), 2 USB 3.1 (Type A) Gen 2 ports, 1 USB 3.1 (Type A) Gen 1 port, 1 USB 2.0 port (bottom, used for RF dongle), 1 HDMI in port (Rear), 1 HDMI out port (Rear), 1 Ethernet RJ 45 Port (Rear), Wireless Keyboard and Mouse, 15.43 lbs. | 6.99 kg (system unit only), 1 Year Parts and Labor Limited Warranty with Toll Free Tech Support (DQ.BEDAA.001), ddr4_sdram, All in One, Easy to use. Maximum Power Supply Wattage :65 W',
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
                isVerified: false,
                title: 'Brand New ACER AIO has dead pixel.',
                content: 'PC is ok, less than thrilled that this brand new machine has a dead pixel and it is required that it have 2 dead pixels to be covered under warranty. Acer customer service was not helpful. They suggested troubleshooting solutions that I completed but were pointless. Their customer service staff also clearly did not communicate well with one another. On a subsequent call it appeared that the notes provided by the previous CSR were inadequate to communicate the steps we already took. They are unwilling to provide a positive outcome.. Will never buy another Acer product. Very unhappy.',
                media: 0,
                comments: [
                  {
                    author: 1,
                    content: 'This product is worthless.'
                  }
                ]
              },
              {
                author: 2,
                stars: 5,
                isVerified: true,
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
                comments: [
                  {
                    author: 1,
                    content: 'Does the HDMI-In works, if Z24 is turned off? I don\'t want to turn it on every time I want to use Fire stick! My old Acer Z3 615 can be used as monitor in offline mode. '
                  }
                ]
              },
              {
                author: 5,
                stars: 4,
                isVerified: true,
                title: 'Large view, small footprint, great connectivity.',
                content: 'Only real negative is needing to get Windows OFF the system before use. Sufficient USB ports to run all peripherals and offline storage. The USB-3 ports are very fast. Wireless keyboard and mouse are handy, but require keeping spare batteries about. A keyboard with a trackpad would be preferred for desk space optimization. I had some problems initially with Linux Mint 20 and hardware, but version 19 runs very well on the system.',
                media: 1
              }
            ]
          },
          {
            title: 'Acer Aspire Z24-890-UR13 AIO Desktop, 23.8" Full HD Touch Display, 9th Gen Intel Core i5-9400T, 8GB DDR4, 1TB HDD, 802.11ac WiFi, USB 3.1 Type C, Wireless Keyboard and Mouse, Windows 10 Home',
            listPrice: 849.99,
            price: 716.15,
            bullets: '9th Generation Intel Core i5-9400T Processor (Up to 3 4GHz)\n23 8" Full HD (1920 x 1080) Widescreen Edge-to-Edge LED Back-lit Touch Display\n8GB DDR4 Memory 1TB HDD & 8X DVD-Writer Double-Layer Drive (DVD-RW)\n802 11ac Wi-Fi Gigabit Ethernet LAN & Bluetooth 4 2LE\nTwo Built-in 2W Stereo Speakers| Built-in 2 0MP Full HD (1080P) Webcam | Wireless \nKeyboard and Mouse | Windows 10 Home',
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
            ],
            reviews: [
              {
                author: 9,
                stars: 1,
                isVerified: true,
                title: 'A genuine review.',
                content: `My deeply personal understanding tells me that this is how it works: Acer sells limited amount of new AIOs aspire z for $690, "electronics" company workers buy those out and sells them to their company (always a different one). AIOs become used and later are sold for $969. My only problem with that is that the ratings and five stars, and all the positive comments tag along the item since when Acer releases it. Happy customers from Acer leave excellent grades and positive comments, unhappy customers of Something Electronics leave different comments. First category of customers outnumbers the second one, tricking people like myself into thinking that the reseller is legit.
              So this is my review of my purchase. On top of overpaying $300 for it, mine turned out to be damaged as well.
              In two words: Don't buy from this "storefront," wait until Acer is the seller again.

              I hope this helps.
              P.S. When Acer sells it, Amazon is the distributor and if you are a prime member your 2-day delivery is free. When reseller sells it, if you don't want to wait a month while it arrives through the cheapest option the reseller chooses, the 2-day delivery option is another $100+`,
                media: 2
              },
              {
                author: 7,
                stars: 3,
                isVerified: true,
                title: 'Terrible keyboard',
                content: 'The. Keyboard guy came with this computer is for a five-year-old child. Your size of the keys makes it difficult To hit only one key at a time. Worst keyboard I’ve ever seen I will now have to go out and get a new keyboard to use. I hope the rest of the computer doesn’t have any other surprises',
                media: 0,
                comments: [
                  {
                    author: 2,
                    content: 'how do you like the computer though?'
                  },
                  {
                    author: 5,
                    content: 'It came with a keyboard guy?'
                  },
                  {
                    author: 3,
                    content: 'I can\'t tell until I get a new keyboard. The keyboard is total junk & near impossible to use with the keys so close together.',
                    replyTo: 0
                  }
                ]
              }
            ]
          },
          {
            title: 'Acer Aspire Z24-890-UR18 AIO Desktop, 23.8" Full HD Display, 9th Gen Intel Core i5-9400T, 8GB DDR4, 512GB SSD, 802.11ac WiFi, USB 3.1 Type C, Wireless Keyboard and Mouse, Windows 10 Home',
            listPrice: 759.99,
            price: 636.15,
            bullets: '9th Generation Intel Core i5-9400T Processor (Up to 3 4GHz)\n23 8" Full HD (1920 x 1080) Widescreen Edge-to-Edge LED Back-lit Display\n8GB DDR4 Memory 512GB SSD & 8X DVD-Writer Double-Layer Drive (DVD-RW)\n802 11ac Wi-Fi Gigabit Ethernet LAN & Bluetooth 5 0\nTwo Built-in 2W Stereo Speakers| Built-in 2 0MP Full HD (1080P) Webcam | Wireless\nKeyboard and Mouse | Windows 10 Home',
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
            ],
            reviews: [
              {
                author: 3,
                stars: 3,
                isVerified: false,
                title: 'Feeling Misled',
                content: `I trade options so I should have gotten a multi-core processor anyways but the specs are showing 1.8GHz on my computer and it is advertised at 3.4GHz. I'm having slow processing issues that I probably wouldn't be experiencing with a 3.4GHz processor.

              Overall I still like the computer. Do yourself a favor and make sure you get an ssd hard drive. That's a must for an all in one computer like this.`,
                media: 0,
                comments: [
                  {
                    author: 1,
                    content: 'does this tilt the screen? '
                  },
                  {
                    author: 9,
                    content: 'The screen tilts, but cannot swivel.',
                    replyTo: 0
                  }
                ]
              },
              {
                author: 1,
                stars: 5,
                isVerified: true,
                title: 'Incredibly Easy to Multi-task, Visually Appealing, and Great Form Factor',
                content: `Overall:
              The screen is phenomenal and easily used as a small TV or high-quality office computer. What is cool about this all-in-one computer is that the monitor actually feels about the same weight and size as a flat-screen monitor from about 5-7 years ago. Yet it is a full computer, which is just amazing. The quality display really makes this a nice product from a graphics perspective. That said, while it has an excellent screen for watching streaming shows, it’s really not a gaming computer as it has an integrated video card and would not be appropriate for high-end gaming. It is awesome if you have wanted to multi-task and stream shows, videos, etc all while performing basic office tasks for work which this computer is really well suited for. Checking emails on this screen is unbelievably convenient because of the large screen and easy viewing of a large number of emails.

              The Setup: There is some setup with the display screen. You will need to assemble the stand which is just a matter of screwing together a few parts and it’s fairly easy. Be sure to uncork the plastic from the base and actually screw the screen in. Otherwise, it will literally tilt off of the base and fall. I have provided a picture of how easy it is once it is understood. The keyboard and mouse work without setup and are fully wireless. They are battery-powered though and that isn’t the best.

              Specs: The performance for most basic applications except those needing a high-end graphics card is fantastic. I primarily use for Microsoft Office, Adobe, Internet browsing, and streaming. I’ve had no issues and it can simultaneously run a number of programs with 12 GB memory with ease. Other nice features include inbuilt wifi (no Ethernet cord needed) and connections (HDMI) for either a second monitor or output to a larger TV. (note that there is one HDMI in and one HDMI out).
              The 512 GB SSD is great for basic storage especially of almost any set of software (which is really nice to have an SSD for faster run speeds), but an external hard drive would be needed for more expansive storage as this does not have add-on ports since there is no tower. The computer itself runs quiet and has not overheated even under heavy use. Video and sound quality have been qualitatively fantastic in my tests so far and I have no complaints.
              I am really impressed! This computer multi-tasks well and is very user-friendly. Cortana can guide your way through windows with this visually appealing and easy to use computer. Cortana may also be used with Alexa. I think this is an excellent choice and that you will be pleased.`,
                media: 4
              }
            ]
          }
        ]
      },
      {
        questions: [
          {
            author: 6,
            content: 'cd/dvd? Sd card?',
            answers: [
              {
                author: 1,
                content: 'no'
              }
            ]
          },
          {
            author: 3,
            content: 'does it have a camera?',
            answers: [
              {
                author: 9,
                content: 'Yes, it has a camera.'
              }
            ]
          },
          {
            author: 4,
            content: 'can you add speakers if you want better sound ',
            answers: [
              {
                author: 5,
                content: 'Yes, i have a sound bar hooked up'
              }
            ]
          },
          {
            author: 8,
            content: 'Does this have a glossy or matte screen? ',
            answers: [
              {
                author: 7,
                content: 'NO TOUCH SCREEN... I had to send back.. I felt like it was opened as well, it had Firefox loaded, which is NOT from Microsoft or Acer... I think it was Matte'
              },
              {
                author: 5,
                content: 'Matte screen.'
              }
            ]
          },
          {
            author: 6,
            content: 'Does this have speakers?',
            answers: [
              {
                author: 5,
                content: 'You can hear sound but it’s minimal.'
              }
            ]
          },
          {
            author: 9,
            content: 'Is this a touch screen?',
            answers: [
              {
                author: 3,
                content: ' No'
              }
            ]
          }
        ],
        products: [
          {
            title: '2019 Acer Aspire All-in-One 23.8" FHD Desktop | Intel Quad Core i5-8250U (Beat i7-7500U) | 16GB DDR4 Memory | 512GB SSD Boot + 1TB HDD | 802.11ac | USB 3.1 | Wireless Keyboard & Mouse | Windows 10',
            price: 999.99,
            bullets: `23.8" Full HD (1920 x 1080) Widescreen Edge-to-Edge LED Back-lit Display, Intel UHD Graphics 620
            8th Gen Intel Core i5-8250U (Quad-Core 1.6 GHz up to 3.4 GHz 6MB Cache), 16GB DDR4 Memory, 512GB SSD Boot + 1TB HDD
            2 x USB 2.0, 2 x USB 3.1 Gen 1, 1 x HDMI, 1 x Headphone Out/Microphone in Combo Jack, 1 x RJ-45
            10/100/1000 Gigabit Ethernet, 802.11ac, Bluetooth 4.2, Included: Wireless Keyboard & Mouse
            Windows 10 Home 64-Bit, Color: White, 6.9Lbs`,
            description: 'Keep things simple in your office with this Acer Aspire all-in-one computer. The 23.8-inch Full HD monitor lets you view digital files or fun videos, and the Intel Core i5 processor ensures applications run smoothly. Optimize storage of large programs with the 1TB hard drive and 512GB solid-state drive of this Acer all-in-one desktop .',
            stock: 2,
            media: 7,
            isAvailable: true,
            productParameters: [
              { name: 'Standing screen display size', value: '23.8 Inches' },
              { name: 'Graphics Coprocessor', value: 'Graphics 620' },
              { name: 'Wireless Type', value: '802.11ab' },
              { name: 'Brand', value: 'Acer' },
              { name: 'Series', value: 'Aspire' },
              { name: 'Hardware Platform', value: 'PC' },
              { name: 'Operating System', value: 'Windows 10' },
              { name: 'Item Weight', value: '14.27 pounds' },
              { name: 'Product Dimensions', value: '12.6 x 21.3 x 0.5 inches' },
              { name: 'Item Dimensions LxWxH', value: '12.6 x 21.3 x 0.5 inches' },
              { name: 'Color', value: 'White' },
              { name: 'Processor Brand', value: 'Intel' },
              { name: 'Processor Count', value: '4' },
              { name: 'Computer Memory Type', value: 'SDRAM' },
              { name: 'Flash Memory Size', value: '512 GB' },
              { name: 'Hard Drive Interface', value: 'Serial ATA ' }
            ],
            reviews: [
              {
                author: 1,
                stars: 5,
                isVerified: false,
                title: 'Excellent Fast All-in-One computer',
                content: 'WOW - this is fast, it’s All in One, so no “box” on the floor or where ever you stick yours. Looks nice on the desk top. Excellent image clarity - easy control screen options. Good sound - but if you like great sound to go with great picture you may want to add some USB connected speakers.',
                media: 0,
                comments: [
                  {
                    author: 3,
                    content: 'does this tilt the screen?'
                  }
                ]
              },
              {
                author: 5,
                stars: 5,
                isVerified: true,
                title: 'A good windows computer',
                content: 'This computer has everything you May look for in a windows computer. Set up was smooth . I am happy with this purchase.',
                media: 0
              }
            ]
          }
        ]
      }
    ],
    HP: [
      {
        products: [
          {
            title: '2019 New HP 22 All-in-One PC Full HD 21.5" Intel Celerion G4900T Intel UHD Graphics 610 1TB HDD 4GB SDRAM DVD Privacy Webcam Serenity Mint',
            price: 569.99,
            bullets: 'Brand New in box. The product ships with all relevant accessories',
            description: 'All the space and performance you need: With an Intel processor and enough storage for you and your family, seamlessly go from sending work emails to uploading vacation photos with ease.A centerpiece for the home: Bring home a modern look and feel. This All-in-One PC displays more with an ultra-thin bezel and has an adjustable tilt stand allowing you to work from multiple perspectives. Designed to brighten any room.Peace of mind you deserve: This PC makes it easy to stay connected to family and friends. Includes an HD camera—equipped with a slide switch for privacy—plus, built-in speakers and easy Wi-Fi connectivity. Now, you can stay in touch while maintaining peace of mind',
            stock: 1,
            media: 3,
            isAvailable: true,
            productParameters: [
              { name: 'Standing screen display size', value: '21.5 Inches' },
              { name: 'Memory Speed', value: '2400 MHz' },
              { name: 'Card Description', value: 'Integrated' },
              { name: 'Wireless Type', value: '802.11n, 802.11b, 802.11g' },
              { name: 'Number of USB 2.0 Ports', value: '2' },
              { name: 'Brand', value: 'HP' },
              { name: 'Series', value: '22-c0073w' },
              { name: 'Item model number', value: '3LB92AA' },
              { name: 'Hardware Platform', value: 'PC' },
              { name: 'Operating System', value: 'Windows 10' },
              { name: 'Item Weight', value: '11.88 pounds' },
              { name: 'Product Dimensions', value: '19.3 x 0.56 x 15.38 inches' },
              { name: 'Item Dimensions LxWxH', value: '19.3 x 0.56 x 15.38 inches' },
              { name: 'Color', value: 'White' },
              { name: 'Processor Brand', value: 'Intel' },
              { name: 'Processor Count', value: '2' },
              { name: 'Computer Memory Type', value: 'DDR SDRAM' },
              { name: 'Hard Drive Interface', value: 'Serial ATA' },
              { name: 'Batteries', value: '1 Lithium Polymer batteries required. ' }
            ],
            reviews: [
              {
                author: 9,
                stars: 5,
                isVerified: true,
                title: 'Nice color and design, decent performance, current CPU and plenty fast.',
                content: 'These are solid AIO PCs with near-current Intel CPUs (8th-Gen) from 2018 and plenty of HD space and adequate RAM (8GB would be better, but it\'s a cheap upgrade later). The image is misleading - these are the current model 22-c0073w with the slim bezel and different stand made of metal). The serenity mint color is a pleasing break from gray and black and not as stark as white. I like it. Bought two of these for my small office in a strip mall and they work perfectly for the slim size and overall performance (it will take more than half a day to get to the current Windows 10 release 1903, though with all the updates). Can\'t believe these were being sold for $199 as "like new" because they look brand new and the plastic was still on both keyboards and mice (and this exact model sells at Wal-Mart for $399!). These literally look brand new. For $400 I have outfitted my office with all the PC power needed with a terabyte of disk space and access to OneDrive that syncs with my iPhone. Bargain city and fast shipping by the seller! ',
                media: 1
              },
              {
                author: 7,
                stars: 1,
                isVerified: true,
                title: 'Sent wrong color',
                content: 'The only reason I’m leaving one star is because when ordering it said the color was mint. I really wanted that color. When computer arrived it was white. I couldn’t send back because I needed the computer. So far it’s been good just really wanted mint green. It was the main reason I ordered this computer.',
                media: 0
              },
              {
                author: 5,
                stars: 2,
                isVerified: true,
                title: 'Happy Customer for two months',
                content: 'The computer is different from what is listed but it came like new even though it is, "used-very good" it was so much better than that. I am upgrading the memory and making it faster but its great for this Grad school student who works full time and needed a station in the house.Until it was time to work from home completely, just stopped working',
                media: 0
              },
              {
                author: 3,
                stars: 1,
                isVerified: true,
                title: 'Customer service, and they sucked this time.',
                content: 'I loved the computer I was disappointed with Amazon who would not exchange a damaged product they have always replaced products but I guess they didn\'t want to match the special price they rather disappoint a loyal customer instead. Very very disappointed customer.',
                media: 0
              },
              {
                author: 6,
                stars: 5,
                isVerified: true,
                title: 'Great looking and gets the job done!',
                content: 'Had to upgrade from windows 7 to windows 10. This computer was a good choice.',
                media: 0
              },
              {
                author: 4,
                stars: 4,
                isVerified: true,
                title: 'Wrong Color/picture on amazon',
                content: 'I love the computer itself, it is just when I ordered it the main reason I ordered it was because it was mint green. I also believe that the picture that it shows is the wrong picture for this device, it looks nothing like what I got. All together, a great computer, well worth the money!!!!',
                media: 0
              },
              {
                author: 8,
                stars: 5,
                isVerified: true,
                title: 'Very nice',
                content: 'Just great p.c.',
                media: 0
              },
              {
                author: 0,
                stars: 5,
                isVerified: true,
                title: 'Great Buy',
                content: 'No real directions but I figured it out. It\'s a great product for a great value. Came in the white color, the screen is perfect. It is a great addition to my room.',
                media: 0
              },
              {
                author: 1,
                stars: 3,
                isVerified: true,
                title: 'Screen',
                content: 'I do not like the fact that when I walk away from the screen for a few minutes, my page leaves; and I have log on again with my password.',
                media: 0
              },
              {
                author: 2,
                stars: 1,
                isVerified: false,
                title: 'Slower than molasses!',
                content: 'Worst computer ever made! Save your money!! Takes FOREVER to load anything- it’s like there’s a damn hamster wheel controlling the thing. Molasses is fast than this all-In-one! Nice concept but seriously, buy something else!!',
                media: 0
              }
            ]
          }
        ]
      },
      {
        questions: [
          {
            author: 2,
            content: 'Does this have a dvd player in it?',
            answers: [
              {
                author: 1,
                content: 'Yes'
              }
            ]
          },
          {
            author: 3,
            content: 'Is this pc strong enough to run Quickbooks?',
            answers: [
              {
                author: 5,
                content: 'Yes it is like many computers the more you add the slower it will get unless you add more RAM or buy a computer with faster processing. One user on quick books is fine 2 users you’ll need at least 2.5 Ghz.'
              }
            ]
          },
          {
            author: 7,
            content: 'Can any printer be hooked up to this?',
            answers: [
              {
                author: 9,
                content: 'I believe any printer can be hooked up to any all in one, When you go to hook it up and search for your printer if it doesn’t come up you just type it in'
              }
            ]
          },
          {
            author: 9,
            content: 'Does it have a built in webcam?',
            answers: [
              {
                author: 5,
                content: 'Yes. Worth to buy!'
              },
              {
                author: 6,
                content: 'Yes, it does'
              },
              {
                author: 7,
                content: 'Yes'
              }
            ]
          },
          {
            author: 5,
            content: 'Does it need a computer tower?',
            answers: [
              {
                author: 1,
                content: 'No, everything is built into the monitor, including a disk drive.'
              },
              {
                author: 5,
                content: 'NO it is all in one'
              }
            ]
          }
        ],
        products: [
          {
            title: '2020 HP 22 All-in-One Desktop Computer : 21.5" Widescreen FHD/Intel Celeron G4900T 2.9 GHz/ 4GB DDR4 RAM/ 1TB HDD/DVD-Writer/AC WiFi/HDMI/Bluetooth/White/Windows 10 Home',
            price: 554.52,
            bullets: `▶ Powered by latest Intel Celeron G4900T processor 2.9Ghz;CPU cores: 2;CPU Cache: 2 MB; Integrated graphics: Intel UHD Graphics 610
          ▶ Beautiful 21.5 in diagonal widescreen full high-definition ZBD IPS anti-glare WLED-backlit three-sided borderless display (1920 x 1080)
          ▶ 4GB DDR4 RAM for full-power multitasking; 1TB HDD Hard Drive offer enough storage for your files; DVD Writer
          ▶ Connectivity: Intel Wireless-AC WLAN and Bluetooth 4.2 M.2; HDMI Out/ 2x USB 2.0/ 2x USB 3.1/ 3-in-1 Memory card reader
          ▶ Operate System: Windows 10 Home 64bit English; USB white wired keyboard with volume control and USB white wired optical mouse`,
            stock: 9,
            media: 4,
            isAvailable: true,
            productParameters: [
              { name: 'Standing screen display size', value: '21.5 Inches' },
              { name: 'Screen Resolution', value: '1920 x 1080' },
              { name: 'Max Screen Resolution', value: '1920x1080' },
              { name: 'Graphics Coprocessor', value: 'Intel UHD Graphics 610' },
              { name: 'Card Description', value: 'Integrated' },
              { name: 'Wireless Type', value: '802.11ab' },
              { name: 'Brand', value: 'HP' },
              { name: 'Series', value: '22-c00' },
              { name: 'Item model number', value: '22-c00' },
              { name: 'Hardware Platform', value: 'PC' },
              { name: 'Operating System', value: 'Windows 10' },
              { name: 'Item Weight', value: '18.21 pounds' },
              { name: 'Product Dimensions', value: '16.52 x 21.3 x 0.64 inches' },
              { name: 'Item Dimensions LxWxH', value: '16.52 x 21.3 x 0.64 inches' },
              { name: 'Processor Brand', value: 'Intel' },
              { name: 'Processor Count', value: '2' },
              { name: 'Computer Memory Type', value: 'DDR SDRAM' },
              { name: 'Hard Drive Interface', value: 'Serial ATA ' }
            ],
            reviews: [
              {
                author: 1,
                stars: 5,
                isVerified: true,
                title: 'Cool',
                content: 'The screen has damage in the top left corner. I\'ve only had my computer for three days. Right now no problems other than the damage to the screen.',
                media: 1
              },
              {
                author: 3,
                stars: 5,
                isVerified: true,
                title: 'Happy customer',
                content: 'Luv this pc.....it does so much.....great purchase...',
                media: 4
              },
              {
                author: 5,
                stars: 3,
                isVerified: true,
                title: 'Decent, but not great.',
                content: 'The computer is very slow and doesn\'t have a touch screen. My son has been using it for school and games and is constantly frustrated with it. It looks beautiful and is mostly functional. I should have saved up more to buy a better computer.',
                media: 0
              }
            ]
          }
        ]
      },
      {
        questions: [
          {
            author: 9,
            content: 'Can i install google play games on this pc? buying for my father and trying to see if golf master 3d can be put on it for him.',
            answers: [
              {
                author: 7,
                content: 'You cannot install games from the Google Play Store on this computer. This computer has Windows 10 Home. You may want to look at an HP Chromebook. The most current HP Chromebooks do have the Google Play Store installed.'
              },
              {
                author: 3,
                content: `I think any video game will play as long as the video card is powerful enough.
                this computer is not a gaming computer but a simple and cheap web surfing and office software computer.`
              },
              {
                author: 5,
                content: 'On the bottom of the screen left side. Is a spot where you can write questions in. I asked and the answers come up with instructions. How do I install it ..........'
              }
            ]
          },
          {
            author: 5,
            content: 'Has anyone used this pc for streaming movies & tv show’s ?.',
            answers: [
              {
                author: 3,
                content: 'I’ve watched Netflix on it and my son watches YouTube videos on it all the time. Works great. Never had any issues.'
              },
              {
                author: 2,
                content: 'no'
              }
            ]
          },
          {
            author: 5,
            content: 'im looking for a computer to use for work as i am currently looking for work at home jobs. Does this support most softwares?',
            answers: [
              {
                author: 9,
                content: 'This is a basic computer which can handle basic duties like surfing the internet. A computer with the Intel i5 or Ryzen 5 processor or better with 8 gigabytes of RAM can handle more programs.'
              },
              {
                author: 7,
                content: `Yes this computer is more than I expected
                It's a lot easier to get used to an its faster, than my other computer`
              }
            ]
          },
          {
            author: 6,
            content: 'Does it come with adobe flash?',
            answers: [
              {
                author: 5,
                content: 'Adobe Flash can be downloaded for free.'
              },
              {
                author: 4,
                content: 'No'
              }
            ]
          },
          {
            author: 3,
            content: 'Is it touchscrean',
            answers: [
              {
                author: 7,
                content: 'It is not.'
              },
              {
                author: 8,
                content: 'Unfortunately, it is not.'
              }
            ]
          },
          {
            author: 6,
            content: 'I’m not seeing an option for a warranty. Is there one available?',
            answers: [
              {
                author: 1,
                content: 'not sure'
              }
            ]
          },
          {
            author: 8,
            content: 'How wide or big is the stand?',
            answers: [
              {
                author: 4,
                content: 'The stand is actually just two thick, bent, wires so the footprint is not much thicker than the computer itself.'
              }
            ]
          },
          {
            author: 7,
            content: 'looking for a power cord',
            answers: [
              {
                author: 9,
                content: 'If you need a replacement AC adapter, here is the part number: L56998-800 and for the power cord: 213349-009. You should have gotten one in the box.'
              },
              {
                author: 6,
                content: 'The power cord was in the box'
              }
            ]
          }
        ],
        products: [
          {
            title: 'HP 21.5-Inch All-in-One Computer, AMD A4-9125, 4GB RAM, 1TB Hard Drive, Windows 10 (22-c0010, White)',
            price: 400.15,
            bullets: `The essential home computer: With an AMD processor and 4 GB of RAM, your family can seamlessly go from sending work emails to uploading vacation photos with ease
            A centerpiece for the home: This all-in-one PC displays more with an ultra-thin bezel and has an adjustable tilt stand allowing you to work from multiple perspectives and is designed to brighten any room
            Integrated FHD monitor and audio: 21.5 Inches diagonal widescreen FHD (1920 x 1080) IPS WLED-backlit micro edge monitor and front-facing speakers
            AMD A4 processor: 7th generation AMD A4-9125 processor, dual-core, 2.30 GHz
            Hard drive, memory, optical drive: 1 TB 7200RPM SATA hard drive, 4 GB DDR4-2133 SDRAM (upgradable to 16 GB), DVD-Writer
            HP HD privacy camera: This innovative webcam has a switch designed to cover the camera and disable video when not in use, keeping you safe online
            Keyboard and mouse: HP white wired keyboard with volume control and white wired optical mouse

            Operating system: Windows 10 Home. Audio features: Dual 2 W speakers.
            Ports: Headphone/Microphone Combo, 2 USB 3.1 Gen 1, 2 USB 2.0 (rear), HDMI Out (rear), 10/100/1000 Base-T Network, and an HP 3-in-1 Media Card Reader
            Warranty: One-year limited warranty with 24-hour, 7 days a week web support when shipped from and sold by Amazon.com and not a third party seller`,
            description: 'With an AMD processor and 4 GB of RAM, seamlessly go from sending work emails to uploading vacation photos. This all-in-one PC displays more with an ultra-thin bezel and has an adjustable tilt stand, allowing you to work from multiple perspectives. This PC includes an HD camera with a slide switch for privacy, Plus built-in speakers and easy Wi-Fi connectivity. Now, you can stay in touch with family and friends while maintaining Peace of mind. Audio features: Dual 2 W speakers.',
            stock: 3,
            media: 7,
            isAvailable: true,
            groupVariations: [
              { name: 'Style', value: '22-c0010' }
            ],
            productParameters: [
              { name: 'Standing screen display size', value: '21.5 Inches' },
              { name: 'Screen Resolution', value: '1920 x 1080' },
              { name: 'Max Screen Resolution', value: '1920 x 1080 Pixels' },
              { name: 'Graphics Coprocessor', value: 'AMD Radeon R3' },
              { name: 'Chipset Brand', value: 'AMD' },
              { name: 'Card Description', value: 'Integrated' },
              { name: 'Number of USB 2.0 Ports', value: '2' },
              { name: 'Brand', value: 'HP' },
              { name: 'Series', value: '5QB04AA#ABA' },
              { name: 'Item model number', value: '22-c0010' },
              { name: 'Hardware Platform', value: 'PC' },
              { name: 'Operating System', value: 'Windows 10 Home' },
              { name: 'Item Weight', value: '11.9 pounds' },
              { name: 'Product Dimensions', value: '23.55 x 9.77 x 19.02 inches' },
              { name: 'Item Dimensions LxWxH', value: '23.55 x 9.77 x 19.02 inches' },
              { name: 'Processor Brand', value: 'AMD' },
              { name: 'Processor Count', value: '2' },
              { name: 'Computer Memory Type', value: 'DDR4 SDRAM' },
              { name: 'Flash Memory Size', value: '1' },
              { name: 'Hard Drive Interface', value: 'Serial ATA' },
              { name: 'Hard Drive Rotational Speed', value: '7200 RPM' },
              { name: 'Optical Drive Type', value: 'DVD-RW ' }
            ],
            reviews: [
              {
                author: 4,
                stars: 5,
                isVerified: true,
                title: 'Better than Expected.........',
                content: `I got this computer on May 11, 2020, after ordering on May 3, 2020. I hesitated because of all of the reviews about the speed and the noise, slow processor, and the click sound from the keyboard. Right out the box, I did one thing that I believe will help everyone. Connect directly to the WiFi via ethernet cable. There is speed you just have to connect properly. My husband bought this for me as a birthday present. I have always used a Surface and did not want to pay a whopping $1300 for a Surface Desktop. Let me admit I am getting older and the small screen of the Surface is not good but also who needs a $1300 computer? Not me. Yes, the fan is loud but so is my daily life since COVID-19. I just went into the Microsoft store and downloaded all of my apps and decided which ones were necessary and which were not. I don't mind the clicking of the keyboard keys. It's better than PlayStation all day. As always I will keep the boxes for 30 days to make sure I have them if I have to send it back. But so far out the box, it is a good buy. I even went back to Amazon to see how much it would cost to get another one for my sister but she likes the HP laptop and the price of this one has almost tripled. Which brings me to the cost issue with Amazon. They are letting other sellers sell it for triple the price. That is just crazy. I will update my review with pictures and with any issues in 30 days. It is not a touch screen, it comes with enough memory and I have a 1 Tb external drive, it comes with the keyboard, it comes with Office for Home I just downloaded my Office 365 that I got from school. But for now, this is just what I needed to work from home and organize daily life.
                Update 1 week WOW!!!!!!
                I have had no issues with this computer, No fan noise, Not slow, No multiple tab issues with the internet. As you can see from the picture. I set it up on my desk, using the keyboard drawer. I am recovering from major rotator cuff surgery in the middle of this Covid-19. Working from home could not use my surface comfortably. Thank you Honey, this is just what this old girl needed to work from home and be comfortable. No more squinting, no more resting my bad arm uncomfortably. It connected wirelessly to my printer. It is connected directly to my high speed internet via cable and BAM!!!!!!! Lighting fast. I will continue use and update but I really don't understand the complaints.
                Update 5/28/2020.....I have added pictures of my set up as well as the back of the computer with connections. I have it connected directly to the internet via ethernet cable and it is fast. I also hooked up my speakers with my microphone it plays my music much louder(Amazon Music) and my Microsoft teams meeting are better as well. I have nothing bad to say yet and I will continue to update till I have had it 60 days.
                Update June 6,2020. WOW STILL!!
                Had my first team meeting with work and everyone had computer issues except me. They kept dropping the meeting and stayed on through the whole meeting. I am working for a large Healthcare system and this is just what I needed the screen is perfect size and I still don't mind the keyboard sound and the fan noise is not there at all. I have one wish..... that you could add an additional monitor (that is how I work in the office). Otherwise this is my final review up date. Feel free to contact me and ask questions I will be happy to respond.
                Sept 4, 2020...WOW!!! Still without question the desktop of my dreams. I have been working from home since March 15, 2020 and this computer is a workhorse. Thank you Honey. It is the best computer and Birthday gift ever. Still connected via ethernet cable it is just AMAZING!!!!!!!! `,
                media: 4,
                comments: [
                  {
                    author: 1,
                    content: 'So just hooking it up to ethernet made things better? I\'m on the hunt for a new computer and use multiple tabs constantly so this might be worth a try since I did notice slightly faster speeds hooking ethernet up to my laptop '
                  },
                  {
                    author: 2,
                    content: 'Have you tried it without being hooked up directly to the ethernet? I have high speed wireless, and I\'m a little hesitant to get this if I\'m not going to hook it up directly. I\'d love to hear your thoughts. '
                  },
                  {
                    author: 3,
                    content: 'Thanks for the detailed review! Loved the picture from Belem in Portugal. I visited there last year and it brought back fond memories!'
                  },
                  {
                    author: 8,
                    content: 'i think this is a great computer also...i didnt order it from amazon i got it from wal-mart for $399 and i\'m looking into getting another one for my son , we are tired of laptops LOL....i\'m really enjoying this'
                  }
                ]
              },
              {
                author: 3,
                stars: 1,
                isVerified: false,
                title: 'SLOW!!',
                content: 'Nice looking machine, but sooooo slow!!! Takes many, many minutes to load a page, unacceptable for a brand new computer. Not happy with it at all.',
                media: 1
              },
              {
                author: 5,
                stars: 3,
                isVerified: false,
                title: 'Very Stylish but Slow',
                content: 'I have been using this all-in-one computer for a few days now. It arrived perfectly in the box and setup was extremely easy. The computer itself is beautifully designed and stylish and the white color fits in very well. The screen is sleek and thin. The keyboard is wired and the keys are clunky and loud. I\'ll be purchasing a wireless soft/quiet key keyboard since I don\'t want everyone in the room hearing when I\'m typing. The downside to this computer is it is slow even for basic tasks. I\'m impatient and expect computers now to be responsive and not lag when multi-tasking. This computer does not multitask well even after uninstalling unnecessary programs. I have to End Task on several things that run in the background to help speed up the computer. It\'s a huge annoyance since even basic tasks like opening the email app and Google Chrome lag and going between apps there is a lag and programs are slow to open. If you\'re used to responsive computers, this one will test your patience, literally. If you\'re one who isn\'t impatient and doesn\'t mind waiting 30 seconds to a minute for things to open and run then this is a great computer that meets the basic needs. I love the design and how nicely it blends in with my home decor and doesn\'t stand out at all and isn\'t obtrusive and fits very nicely on my desk.',
                media: 0
              },
              {
                author: 7,
                stars: 4,
                isVerified: true,
                title: 'Home Office or Student is ok',
                content: 'It is a bit slow and you cannot have many open tabs,.',
                media: 0,
                comments: [
                  {
                    author: 8,
                    content: 'yah, windows 10 needs at least 8gigs or ram to run normal, having only 4 is like two flat tires.'
                  }
                ]
              }
            ]
          },
          {
            title: 'HP 22-inch All-in-One Desktop Computer, AMD Athlon Silver 3050U Processor, 4 GB RAM, 256 GB SSD, Windows 10 Home (22-dd0010, White), Snow White',
            price: 429.99,
            bullets: `Windows 10 Home: Do great things confidently with the familiar feel of Windows – only better
            Fast processor: AMD Athlon Silver 3050U Processor, Dual-Core, 2.30 GHz
            Memory and internal storage: 4 GB DDR4-2400 SDRAM (upgradable to 16 GB), 256 GB PCIe NVMe M.2 Solid State Drive
            Environmentally conscious: Low halogen, mercury-free display backlights, arsenic-free display glass
            Integrated display: 21.5" diagonal widescreen FHD (1920 x 1080) VA ZBD anti-glare WLED-backlit three-sided micro-edge monitor
            Stereo speakers: Pump up the volume to your favorite music, movie or game
            HP Privacy Camera: The pop-up webcam is only enabled when in use, securing your privacy

            Mouse and keyboard: USB white wired keyboard and mouse combo
            USB ports: 4 (2 USB 3.2 Gen 1, 2 USB 2.0)
            Warranty: One-year limited warranty`,
            description: 'With an AMD processor and up to 4 GB of RAM, seamlessly go from sending work emails to uploading vacation photos. This All-in-One PC displays more with a three-sided micro-edge display and has an adjustable tilt stand, allowing you to work from multiple perspectives. This PC includes an HD camera with a slide switch for privacy, plus built-in speakers and easy Wi-Fi connectivity. Now, you can stay in touch with family and friends while maintaining peace of mind.',
            stock: 5,
            media: 6,
            isAvailable: true,
            groupVariations: [
              { name: 'Style', value: '22-dd0010' }
            ],
            productParameters: [
              { name: 'Standing screen display size', value: '21.5 Inches' },
              { name: 'Screen Resolution', value: '1920 x 1080' },
              { name: 'Max Screen Resolution', value: '1920 x 1080 Pixels' },
              { name: 'Chipset Brand', value: 'AMD Radeon' },
              { name: 'Card Description', value: 'Integrated' },
              { name: 'Graphics Card Ram Size', value: '4 GB' },
              { name: 'Wireless Type', value: 'Bluetooth, 802.11ac' },
              { name: 'Number of USB 2.0 Ports', value: '2' },
              { name: 'Number of USB 3.0 Ports', value: '2' },
              { name: 'Brand', value: 'HP' },
              { name: 'Series', value: '9ED50AA#ABA' },
              { name: 'Item model number', value: '22-dd0010' },
              { name: 'Hardware Platform', value: 'PC' },
              { name: 'Operating System', value: 'Windows 10 Home' },
              { name: 'Item Weight', value: '16.17 pounds' },
              { name: 'Product Dimensions', value: '19.3 x 14.99 x 8.05 inches' },
              { name: 'Item Dimensions LxWxH', value: '19.3 x 14.99 x 8.05 inches' },
              { name: 'Color', value: 'Snow White' },
              { name: 'Processor Brand', value: 'AMD' },
              { name: 'Processor Count', value: '2' },
              { name: 'Computer Memory Type', value: 'DDR4 SDRAM' },
              { name: 'Flash Memory Size', value: '256' },
              { name: 'Hard Drive Interface', value: 'Solid State' },
              { name: 'Hard Drive Rotational Speed', value: '0.01 RPM' },
              { name: 'Optical Drive Type', value: 'DVD+RW ' }
            ],
            reviews: [
              {
                author: 0,
                stars: 5,
                isVerified: true,
                title: 'Perfect!',
                content: 'Love this all in one. Easy to set up and use. Camera and audio is great. Got it to work from home and I’m very pleased.',
                media: 0
              },
              {
                author: 1,
                stars: 5,
                isVerified: true,
                title: 'All-in-one compactness.',
                content: 'I am not computer smart, so I got my computer man to set-up and program whatever I needed, he was extremely complimentary.',
                media: 0
              },
              {
                author: 2,
                stars: 5,
                isVerified: true,
                title: 'Great PC gift for my mother',
                content: 'My mother mainly uses for Facebook, e-mails and some minor web searching',
                media: 0
              },
              {
                author: 6,
                stars: 5,
                isVerified: true,
                title: 'Great Gaming and Everyday Use.',
                content: 'Great product. I bought it for school and regular use. Good for everyday and gaming uses. Worth my money and is lasting long and still going fast.',
                media: 0
              },
              {
                author: 8,
                stars: 4,
                isVerified: true,
                title: 'So far So good',
                content: 'It’s looking good！',
                media: 0
              }
            ]
          }
        ]
      }
    ]
  },
  'Slow Cookers': {
    'Instant Pot': [
      {
        questions: [
          {
            author: 0,
            content: 'Can it be used for home canning? If so, how many quart mason jars fit in the 6 Quart?',
            answers: [
              {
                author: 2,
                content: 'I don’t know but Facebook has a group called Pressure Luck. It’s a friendly group, post your question there. Good luck.'
              },
              {
                author: 4,
                content: 'I understand it has been done, but that it isn’t suggested..'
              }
            ]
          },
          {
            author: 2,
            content: 'My cord to plug in my pot is missing. Anyone else have this problem?',
            answers: [
              {
                author: 8,
                content: 'No, my cord was included in the package. You could reorder from Amazon and return the one you have that is missing the cord.'
              },
              {
                author: 6,
                content: 'I didn’t have an issue with my Instant Pot.'
              },
              {
                author: 4,
                content: 'No.'
              }
            ]
          },
          {
            author: 6,
            content: 'Can you make cake? Is it more difficult if you don\'t have a cake button? Thank you',
            answers: [
              {
                author: 2,
                content: 'Yes you can make cake I suggest getting a pan that fits in the instant pot I think usually a 7 inch pan works but there are a lot of them on Amazon.com for sale'
              },
              {
                author: 8,
                content: 'I boughtbit as a gift i. Elementi my daughter has base a cake in it'
              }
            ]
          }
        ],
        products: [
          {
            title: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker, Slow Cooker, Rice Cooker, Steamer, Saute, Yogurt Maker, and Warmer, 6 Quart, Red, 14 One-Touch Programs',
            price: 99.99,
            bullets: `Most popular size: serves up to 6 people and perfect for everyday meals.
            Replaces up to 7 Appliances: combines 7 kitchen Appliances in 1 to save you space, including: pressure cooker, slow cooker, rice cooker, steamer, saute, yogurt maker, and warmer.
            Consistently great results: monitors pressure, temperature, keeps time, and adjusts heating intensity and duration to achieve your desired results every time.
            Accessories include – 1000+ recipe app, 250+ recipe and how-to online videos, 18/18 stainless steel inner pot, sealing ring, steam rack, Soup Spoon, rice paddle and lid holder. Accessories are dish washer safe.
            Easy to clean: fingerprint-resistant stainless steel body and components and accessories that are dishwasher safe: inner pot with 3-ply bottom for even cooking, steam rack with handles, serving Spoon, Soup Spoon, and measuring cup.
            Safety: 10 safety mechanisms for peace of mind
            Power supply 120V – 60Hz – Please check your voltage if not in North America.`,
            description: 'Instant Pot Duo 6 qt 7-in-1 multi-use programmable pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker and warmer, stainless steel and Red',
            stock: 2,
            media: 5,
            isAvailable: true,
            groupVariations: [
              { name: 'Color', value: 'Red' }
            ],
            productParameters: [
              { name: 'Product Dimensions', value: '13.39 x 12.2 x 12.48 inches' },
              { name: 'Item Weight', value: '14.57 pounds' },
              { name: 'Manufacturer', value: 'Instant Pot' },
              { name: 'Item model number', value: 'Duo Red 60               ' }
            ],
            reviews: [
              {
                author: 6,
                stars: 5,
                isVerified: true,
                title: 'Why don’t you have one of these yet?',
                content: `Absolutely LOVE this product. I’ve used it several times and have been happy with the results. I’ve never had a lot of luck with roasts & ribs - but the IP has changed all that. The meat literally falls apart and is so easy to chew-& is ready in 1/2 the time.
                Highly recommend this - particularly if you hate to cook as much as I do.`,
                media: 1,
                comments: [
                  {
                    author: 8,
                    content: 'great'
                  }
                ]
              },
              {
                author: 4,
                stars: 1,
                isVerified: true,
                title: 'Broken and unusable.',
                content: 'Purchased and didn’t unbox right away. Received all smashed up. Can’t use and can’t return. Learned my lesson, won’t be purchasing an appliance again. Very upset.',
                media: 1,
                comments: [
                  {
                    author: 2,
                    content: 'Really? The lesson you took away was "don\'t purchase an appliance?" Not, perhaps, "don\'t wait months to open a package?"'
                  },
                  {
                    author: 8,
                    content: 'Why couldn’t you return it?'
                  },
                  {
                    author: 6,
                    content: 'What was the reason you could not return it?'
                  },
                  {
                    author: 5,
                    content: 'What was the reason you could not return it?'
                  }
                ]
              }
            ]
          },
          {
            title: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker, Slow Cooker, Rice Cooker, Steamer, Saute, Yogurt Maker, and Warmer, 6 Quart, Teal, 14 One-Touch Programs',
            price: 77.34,
            bullets: `Most popular size: serves up to 6 people and perfect for everyday meals.
            Replaces up to 7 Appliances: combines 7 kitchen Appliances in 1 to save you space, including: pressure cooker, slow cooker, rice cooker, steamer, saute, yogurt maker, and warmer.
            Consistently great results: monitors pressure, temperature, keeps time, and adjusts heating intensity and duration to achieve your desired results every time.When opening the lid, the inner pot may adhere to the lid. This is caused by vacuum due to cooling. To release the vacuum, move the stream release handle to the Venting position
            Accessories include – 1000+ recipe app, 250+ recipe and how-to online videos, 18/18 stainless steel inner pot, sealing ring, steam rack, Soup Spoon, rice paddle and lid holder. Accessories are dish washer safe.
            Easy to clean: fingerprint-resistant stainless steel body and components and accessories that are dishwasher safe: inner pot with 3-ply bottom for even cooking, steam rack with handles, serving Spoon, Soup Spoon, and measuring cup.
            Safety: 10 safety mechanisms for peace of mind
            Power supply 120V – 60Hz – Please check your voltage if not in North America.`,
            description: 'Instant Pot Duo 6 qt 7-in-1 multi-use programmable pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker and warmer, stainless steel and Teal. The cooking programs have been lab-tested for optimal effect. These greatly improve cooking result and maintain consistence. Instant Pot is carefully designed to eliminate many common errors that may cause harm or spoil food. It passed the stringent UL certification giving you uncompromised safety and peace of mind and protects you with 10 proven safety mechanisms and patented technologies.',
            stock: 1,
            media: 6,
            isAvailable: true,
            groupVariations: [
              { name: 'Color', value: 'Teal' }
            ],
            productParameters: [
              { name: 'Product Dimensions', value: '13 x 12.6 x 12.2 inches' },
              { name: 'Item Weight', value: '14.27 pounds' },
              { name: 'Manufacturer', value: 'Instant Pot' },
              { name: 'Item model number', value: 'IP-DUO60TEAL' }
            ],
            reviews: [
              {
                author: 8,
                stars: 5,
                isVerified: true,
                title: 'Amazing (as always) and cute!',
                content: 'I want to quickly post this because there aren\'t currently any other photos of this color. I\'ve had a black Intstant Pot Duo for years and love it. I could go on and on about everything I use it for. I also have a mini that works just as well as the 6qt but for smaller tasks. When I saw this new color was available I knew I needed it. I\'ll be passing along my black one as they are identical and I have no need for two regular size ones (especially with pot in pot cooking), plus it would never get used because I\'d always want to pull this one out! ',
                media: 0,
                comments: [
                  {
                    author: 2,
                    content: 'Is there anything you can\'t do on this one that you could on your other instant pot?'
                  }
                ]
              },
              {
                author: 2,
                stars: 3,
                isVerified: true,
                title: 'Just okay',
                content: 'Not so instant instant pot. I’m keeping mine because of beans. You can cook beans in 60 minutes start to finish. No soaking overnight! Everything I’ve made in mine takes 40-60 minutes start to finish. I made risotto in 65 minutes start to finish and it was okay. Same time to cook normally on a stove. I’ve tried 15 different recipes and beans are the best thing so far. ',
                media: 0
              }
            ]
          },
          {
            title: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker, Slow Cooker, Rice Cooker, Steamer, Saute, Yogurt Maker, and Warmer, 6 Quart, White, 14 One-Touch Programs',
            price: 85.94,
            bullets: `Most popular size: serves up to 6 people and perfect for everyday meals.
            Replaces up to 7 Appliances: combines 7 kitchen Appliances in 1 to save you space, including: pressure cooker, slow cooker, rice cooker, steamer, saute, yogurt maker, and warmer.
            Consistently great results: monitors pressure, temperature, keeps time, and adjusts heating intensity and duration to achieve your desired results every time. A 24-hour delay start allows for delayed cooking
            Accessories include – 1000+ recipe app, 250+ recipe and how-to online videos, 18/18 stainless steel inner pot, sealing ring, steam rack, Soup Spoon, rice paddle and lid holder. Accessories are dish washer safe.
            Easy to clean: fingerprint-resistant stainless steel body and components and accessories that are dishwasher safe: inner pot with 3-ply bottom for even cooking, steam rack with handles, serving Spoon, Soup Spoon, and measuring cup.
            Safety: 10 safety mechanisms for peace of mind
            Power supply 120V – 60Hz – Please check your voltage if not in North America.`,
            description: 'Instant Pot Duo 6 qt 7-in-1 multi-use programmable pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker and warmer, stainless steel and White ',
            stock: 0,
            media: 6,
            isAvailable: true,
            groupVariations: [
              { name: 'Color', value: 'White' }
            ],
            productParameters: [
              { name: 'Product Dimensions', value: '13.39 x 12.2 x 12.48 inches' },
              { name: 'Item Weight', value: '14.32 pounds' },
              { name: 'Manufacturer', value: 'Instant Pot' },
              { name: 'Item model number', value: 'IP-DUO60WHITE ' }
            ],
            reviews: [
              {
                author: 7,
                stars: 4,
                isVerified: true,
                title: 'Be sure to add plenty of liquid',
                content: 'The other thing to be aware of is that at least on mine, the cord detaches from the pot rather easily',
                media: 0
              },
              {
                author: 5,
                stars: 4,
                isVerified: true,
                title: 'Bubbles under plastic button pad already',
                content: `I like the white. Takes a long time to heat up however and my beans are never cooked properly. Rice cooks well. Veggies great.

                The metal cooking pot is already quite tarnished and I havent had it for too long. Not too pleased with that.

                Biggest complaint is the there is already bubbling of the plastic in certain areas on the key pad. I hate when this happens. If I spend good money on something I expect some quality in the buttons. I have used it for a few months now, occasionally and I am quite surprised at the bubbling. Irritating.

                ** edit: the bubbling is on the "+" and "-" buttons the "cancel" button and the "start delay" button plus just below the delay start button. I hadnt added pictures. This was noticed on the first few uses and not after 6 months of use or anything.`,
                media: 5
              },
              {
                author: 0,
                stars: 1,
                isVerified: false,
                title: 'Base is not stable',
                content: 'It has a defect. The base of the pot is not stable. It can wiggle pretty significantly.',
                media: 0
              }
            ]
          }
        ]
      },
      {
        questions: [
          {
            author: 8,
            content: 'Can the Instant Pot be used for canning?',
            answers: [
              {
                author: 1,
                content: `The Instant Pot operates at 11.6 psi (about 242°F), whereas other pressure cookers tend to operate at a higher 15 psi (about 250°F). So when you're adjusting for a recipe that says 15 psi, just try cooking for a few extra minutes.
                Since Instant Pot reaches 242 degrees it is safe for canning per the USDA.
                https://nchfp.uga.edu/publications/usda/INTRO_HomeCanrev0715.pdf`
              },
              {
                author: 4,
                content: `There are two types of canning: boiling-water canning at 100°C/212°F (for acid fruits, tomatoes, pickles and jellied products) and pressure canning at 115~121°C/240~250°F (for low acid vegetables, meat and poultry). Please refer to "USDA Complete Guide to Home Canning" for more details.
                Instant Pot can be used for boiling-water canning. However, Instant Pot has not been tested for food safety in pressure canning by USDA. Due to the fact that programs in Instant Pot IP-CSG, IP-LUX and IP-DUO series are regulated by a pressure sensor instead of a thermometer, the elevation of your location may affect the actual cooking temperature. For now, we wouldn't recommend using Instant Pot for pressure canning purpose. Please note this correction to our early inaccurate information.`
              },
              {
                author: 6,
                content: `ABSOLUTELY NOT. It does not reach high enough pressure for it to be safe to follow the USDA tested recommendations for pressure canning. If you want to can, buy a REAL pressure canner. I've been canning for 56 years as of 2019. I won't even can with a boiling water bath anymore and haven't for years. Tomatoes were the only thing I ever canned that way and the vast majority of modern breeds are not naturally acidic enough for it to be safe. IMNSHO tomatoes were the ONLY thing that was ever safe to put in a boiling water bath. PRESSURE CANNERS MADE FOR THE PURPOSE ONLY.

                I used to seal jelly jars with a layer of paraffin wax and I don't do THAT anymore either.

                Be safe and Do It Right. This is a great kitchen tool for cooking. DO NOT EVEN THINK about trying to can in it. It is WAY too small for one thing, and it isn't safe (the more important reason NOT TO DO IT) for another.`
              },
              {
                author: 0,
                content: 'Please, please. please, do NOT try canning meats, fish, or low acid fruits and vegetables in an electric pressure cooker!!! As far as I know, none of the electric pressure cookers now on the American market can attain 15 p.s.i. pressure, which is needed to raise the temperature inside to 240°F, which is needed to kill botulism spores. Longer processing time at lower temperatures WILL NOT RELIABLY kill these spores! Don\'t take the chance! Even with modern medical procedures and a nearby emergency room, you may not survive botulism poisoning!'
              }
            ]
          },
          {
            author: 6,
            content: 'To those with 3qt size, are you happy with that size or would you have preferred the 6 qt size?',
            answers: [
              {
                author: 2,
                content: 'We\'re a family of two adults. I have both the 3qt and 6 qt. I had the 6qt for 2 years before the Mini came out, and thought I\'d use the Mini mostly for rice and potatoes. But now the 3qt is my mainstay, my workhorse. I\'ll use the big one when I want to batch cook something, like potatoes, stock, beans or a big pot of soup, but otherwise I rely almost entirely on the 3qt.'
              },
              {
                author: 8,
                content: 'Like others, I got the 6 quart, but found it kind of cumbersome, especially for my size kitchen and the fact that I only cook for 1 or 2 people, and even then not that often (microwave time!). The 3 quart size does the same things as the bigger ones, and is much more convenient. I gave the 6 quart one to a family of four that does a lot more cooking than I do.'
              },
              {
                author: 4,
                content: 'I have used my 6 qt Duo for over a year, and loved it. I wanted a smaller one and passed on the Mini 3 qt and bought a 2 qt Cosori, since IP does not make a 2 qt; which I also loved and used a lot. I now plan to purchase the IP Mini 3 qt. I am just one adult. There is a use for all three sizes as long as you can afford to own more than one. One thing to consider is that there are way more accessories to fit the 3 qt than there is for the 2 qt. What\'s not to love? Buy them both!'
              },
              {
                author: 0,
                content: 'I have both the 3 qt and the 6 quart. There are 3 of us. I use the 6 qt the most and tend to use the 3 qt for side dishes or if the 6 qt is tied up making yogurt. If I could only have 1 it would be the 6 qt. When making soups or stews, the 3 qt isn\'t quit big enough.'
              },
              {
                author: 5,
                content: `I bought both the 3 qt. and 6 qt. "Smart Pots" to try... and the 3 qt. is the clear winner!!! I come from a long line of pressure cooking women... that is how I came to own both 6 qt. and 8 qt. traditional stainless steel pressure cookers. I tend to use my 3 qt. Mini Smart Pot a LOT... and store it in a place where it's handy to grab (often). I like the mini b/c it is small and I like the convenience of the timer for most of the day-to-day things I do. And I agree with what everybody else here already stated... I also found the overall size of the 6 qt. Smart Pot TOO BIG… so I sold my 6 quart Smart Pot.

                When I need to cook something in larger portions, I always use my 8 qt. traditional pressure cooker (which isn't that often b/c I usually freeze the extra food into future mini-meals). A traditional pressure cooker PRESSURE COOKS THE SAME as a "Smart Pot" (minus the "timer"), but takes up a LOT LESS STORAGE SPACE -- that why I kept my 8 qt. traditional stainless steel pressure cooker. Yes, it is a pretty darn big pot, but it uses so little storage space (as compared to the larger "Smart Pots"). I also kept my 6 qt. traditional pressure cooker too, simply b/c it nests (stores) nicely inside my 8 qt. pot and does not take up any extra space.

                I should also mention that I only use my 3 qt. Smart Pot Mini Duo for pressure cooking. I was really excited about the idea that I could use one appliance for both pressuring cooking AND slow cooking. THAT is the primary reason why I tried the Smart Pot in the first place. However, I was really disappointed with the Smart Pot slow cooker feature, which does not do as good a job as a traditional slow cooker (b/c the Smart Pot has a small base and is tall vs. the slow cooker which has a very wide base/cooking surface).

                What do I cook in my Smart Pot 3 qt. mini? I frequently cook a 4 lb. whole chicken (or more, if the chicken is cut up), make bone broth, rice or hard boiled eggs. Otherwise, I make anything that you would make with the larger models… I just cut the ingredient list down to fit my smaller machine. Note – personally, I think a traditional rice cooker, hands down makes better rice than a Smart Pot, but when making rice, just for me, I like the convenience of the Smart Pot. However, if I were making rice for company, I definitely use my rice cooker.

                I LOVE my Smart Pot 3 qt. mini – it is small and convenient to use. But the truth about this appliance is (as is also true for ANY size Smart Pot) that, if you are only going to use the pressure cooker feature (which is all I use), the only real difference in function vs. a traditional pressure cooker is “the timer”. And that is, I gotta admit, a nice feature. And that is also why I love my Mini… but it is not enough of a benefit for me to trade-off much needed kitchen space for any of the larger 6 or 8 qt. Smart Pot models which take up a BIGGER amount of space. It’s a tradeoff. And that is also why I am super happy with my Smart Pot 3 qt. Mini and use a traditional 8 qt. pressure cooker when I need to cook MORE.

                I highly recommend the following book whether you are considering purchasing a multicooker or even if you already have one and just want to understand it better: Multicooker Perfection: Cook it Fast or Cook it Slow – You Decide by America’s Test Kitchen (Cooks Illustrated). The book was well organized and a simple read, yet loaded with detailed testing of different Multicooker models, as well as the “pros and cons” of each multicooker feature, along with the even more important “how and why” explanation of their opinion. I got this book at my library, but found it to be so fundamentally valuable that I still went out and bought a copy to own.`
              },
              {
                author: 7,
                content: `The thing is this....
                You can make 6 qts in the 6 qt Instant
                You can make 3 qts in the 6 qt.
                You can’t make 6 qts in the 3 qt.
                Buy what you can afford. It is worth it. I hope this helped.`
              }
            ]
          },
          {
            author: 4,
            content: 'How to make rice? there is no water marking for rice in the pot..',
            answers: [
              {
                author: 0,
                content: 'The older IPs have water markings for rice cooking like a rice cooker (mine for instance does - bought in 2016), the newer ones don\'t because people got confused about it and didn\'t know what it was supposed to be. So IP did away with the markings. ItThe Instant Pot still works very well for cooking rice, though - you will have to find out about time and rice to water ratio yourself, because not everybody likes his rice the same way. For measuring rice and water use the small plastic cup that comes with the IP (same type that comes with rice cookers). With white rice you can use the "rice" setting, with all types of brown rice use the "pressure cook" setting. I like my rice moist and soft so I use 1 cup of rice to two cups of water for brown rice and cook for 22 min.'
              }
            ]
          },
          {
            author: 6,
            content: 'how much can the 3 Quart Hold? I am single and cooking for one..',
            answers: [
              {
                author: 2,
                content: 'We (2, plus occasional grown kids and small grandkids = 7) started with a 6 quart, and always had too many leftovers to want to eat the same thing every night for a week. Plus it took up a lot of counter space. We got a 3 quart and it\'s great - not too intrusive on the countertop, and we cook plenty for the two of us and the occasional invasion of grown kids/grandkids, even leftovers, but we\'re not drowning in leftovers now'
              },
              {
                author: 0,
                content: 'I have both, cooking for one. I use the 6 mostly but the 3 is great for sides.'
              }
            ]
          },
          {
            author: 8,
            content: 'How much meat can fit into the 8 quart Instant Pot? Looking to understand how many pounds of common meats like, chicken,pork,or a chuck roast will fit',
            answers: [
              {
                author: 6,
                content: 'I haven\'t cooked any roasts in mine, yet. I have been cooking all kinds of stews, curries, rice dishes, pastas, etc. I will say, my instant pot would easily hold a 5 lb roast. The roast may need to be trimmed a tad bit to accommodate the shape of the Instant Pot, since it is not oval like many crock pots. I made a stew last night made with 12 chicken drumsticks last night with 10 cups of vegetable broth, potatoes, carrots, and mushrooms.'
              },
              {
                author: 4,
                content: 'I cooked a 7.75 pound turkey breast in my six quart with the trivet in place for Thanksgiving. It was thoroughly thawed. I put 12 ounces of chicken broth in the pot and rubbed the turkey with a packet of onion soup mix. Cooked at high pressure for 30 minutes and let it release pressure naturally for 30 minutes. Absolutely the moistest turkey I’ve ever made and great flavor.'
              },
              {
                author: 0,
                content: 'I have the 8 qt. I have never tried to measure it poundage wise. I have jammed large roasts in it that were 5 our six pounds and could probably do 8 or ten. The problem is when you do a frozen roast and it is really tall. A thawed roast can be folded. But, I have had to saw a really long frozen roast to get it to fit. Frozen doesn\'t really seem to add a lot of time if it is short enough to fit.'
              }
            ]
          }
        ],
        products: [
          {
            title: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker, Sterilizer, Slow Cooker, Rice Cooker, Steamer, Saute, Yogurt Maker, and Warmer, 8 Quart, 14 One-Touch Programs',
            price: 99,
            bullets: `Best selling model: America’s most loved multi cooker, built with the latest 3rd generation technology, the microprocessor monitors pressure, temperature, keeps time, and adjusts heating intensity and duration to achieve desired results every time
            Cooks fast and saves time: The Instant Pot Duo multi-cooker combines 7 appliances in one: pressure cooker, slow cooker, rice cooker, steamer, saute pan, yogurt maker and warmer – and cooks up to 70% faster
            Consistently delicious: 14 one-touch smart programs put cooking ribs, soups, beans, rice, poultry, yogurt, desserts and more on autopilot – with tasty results
            Easy to clean: Fingerprint-resistant stainless steel lid and components and accessories are dishwasher safe
            Plenty of recipes: Free Instant Pot app on iOS and Android devices is, loaded with hundreds of recipes for any cuisine to get you started on your culinary adventure. Millions of users provide support and guidance in the many Instant Pot online communities
            Advanced safety protection: The 10+ built-in safety features, including overheat protection, safety lock and more to ensure safe pressure cooking
            Largest size capacity: 8-quart large capacity cooks for up to 8 people – perfect for families, and also great for meal prepping and batch cooking for singles and smaller households
            Stainless steel inner pot: The instant pot stainless steel inner pot is made with a 3-ply bottom for durability and is healthy and dishwasher-safe`,
            description: 'Instant Pot is a smart Electric Pressure Cooker designed by Canadians aiming to be safe, convenient and dependable. It speeds up cooking by 2-6 times using up to 70% less energy and, above all, produces nutritious healthy food in a convenient and consistent fashion. Instant Pot Duo 8 Quart is a 7-in-1 programmable cooker, it replaces 7 kitchen appliances as it has the functions of a pressure cooker, slow cooker, rice cooker, steamer, saute, yogurt maker & warmer. 14 built-in smart programs (Soup, Meat/Stew, Bean/Chili, Poultry, saute, Steam, Rice, Porridge, Multigrain, Slow Cook, Keep-Warm, Yogurt, Pasteurize & Jiu Niang) cook your favorite dishes with the press of a button. A 24-hour timer allows for delayed cooking. Automatic keep-warm holds the temperature of the food until you serve it. Instant Pot generates almost no noise and leaks no steam. It traps all the aromas in the food without heating up the kitchen. The 3-ply bottom stainless steel inner pot is extremely durable and leaves no health concerns associated with non-stick coatings. The slim body design has lid holders for both left and right handed users. The brushed stainless steel exterior is finger print resistant. Its elegant and durable design makes it easy to clean and pleasurable to use for the years to come. Instant Pot Duo 8 Quart uses the latest 3rd generation technology with an embedded microprocessor, which monitors the pressure and temperature, keeps time and adjusts heating intensity. The cooking programs have been lab-tested hundreds of times for optimal effect. These greatly improve cooking result and maintain consistence. Instant Pot is carefully designed to eliminate many common errors that could cause harm or spoil food. It passed the stringent UL certification giving you uncompromised safety and peace of mind and protects you with 10 proven safety mechanisms and patented technologies. NOTE: This product is 110v and for use in North America, if you live in Europe or other 220-240v territories this product will not operate. Position the steam release handle to the venting position to release the internal pressure. Open the lid after the pressure is completely released. Power supply: 120V – 60Hz, Power: 1200 watts.',
            stock: 47,
            media: 6,
            isAvailable: true,
            groupVariations: [
              { name: 'Size', value: '8-QT' },
              { name: 'Style', value: 'Duo' }
            ],
            productParameters: [
              { name: 'Product Dimensions', value: '14.8 x 13.18 x 10.4 inches' },
              { name: 'Item Weight', value: '10.14 pounds' },
              { name: 'Department', value: 'Unisex-adult' },
              { name: 'Manufacturer', value: 'Instant Pot' },
              { name: 'Item model number', value: 'IP-DUO80 ' }
            ],
            reviews: [
              {
                author: 2,
                stars: 1,
                isVerified: true,
                title: 'Bad customer service!',
                content: `I was loving my instant pot, bragging to all about it. Making my dogs food was so easy! I put in the food and the water, pressed pressure cook and like magic it was just done when it beeped. Getting used to the pressurization wasn't hard at all. It wasn't really difficult to use.

                Until last week... My pot just didn't turn on! I tried other outlets and other electronics so it was not the outlet. I moved the pot to a different outlet, nothing. It was the pot. The manual gave explicit troubleshooting directions based on what is wrong. Not turning on meant that the circuit board blew and it advised to call support, which I did. When you call, an automated message tells you to go online and put in a ticket- because this is clearly a company that doesn't want to be bothered 'talking' to their customers. So I do this. A day later no response! So I email again asking for help. This time I email them the same information. Didn't hear from them until Friday! I needed my pot fixed on Tuesday.... On Thursday though I had had enough and called Amazon who thankfully knows how to treat customers and were able to refund me the product and I shipped it back to them. The pot was less than a year of purchase and within warranty after all! Even Amazon tried getting ahold of the company and they couldn't get a response!

                Beware of this brand! I would look for another pressure cooker because when it breaks, and it likely will, you won't be getting help for days....

                My first attempt to post this review Amazon blocked for an unknown reason. It should be posted though people should know what kind of company this is...`,
                media: 0,
                comments: [
                  {
                    author: 0,
                    content: 'I have had a complete different experience from Instant Pot. Their customer service is amazing, my pot had a slight damage and when I approached them within the warranty period, they replaced it with a new one. Of course it takes time to follow up and everything but let\'s accept the fact that I am not the only customer for Instant Pot. This is a MUST HAVE IN THE KITCHEN PRODUCT.'
                  },
                  {
                    author: 8,
                    content: 'What on earth does this have to do with the Air Fryer lid? You had a problem with the Instant Pot itself, not this product.'
                  },
                  {
                    author: 4,
                    content: 'I like this product very much. I use it every day. I love the  Kitchen Wall Paper Oil Proof Sticker . It is easy to operate, fashionable and generous, and it goes well with the overall style of my room My friends all say that I have good taste'
                  },
                  {
                    author: 6,
                    content: `Things don't just happen immediately because you think they should. Waiting a few days for help with something won't kill you, and isn't unreasonable. What do you expect? Someone from Insta-Pot personally drives to your house 5 minutes after you email to fix it for you?

                    If you're going to get this upset because you couldn't get your Insta-Pot fixed in a couple days, that's a reflection of you - not Insta-Pot.

                    (Not an employee, just a consumer who thinks this review is full of absurd expectations)`
                  },
                  {
                    author: 9,
                    content: 'You both work for engineering companies, but you can\'t figure out why they are not compatible. Please post the name of the companies so I will know to avoid.'
                  },
                  {
                    author: 7,
                    content: 'lmao',
                    replyTo: 4
                  },
                  {
                    author: 1,
                    content: `I'm getting the same run-around from their customer service. No return messages. I bought the Instant Pot Max for my wife then she told me she had heard of the Air Fryer that sits on top & wanted that as well. So I just ordered it. We love both the products.

                    However, I recently noticed the Air Fryer is not compatible with the Instant Pot MAX. I sent them 2 messages just asking why are they not compatible. It's not like I'm even planning to return the Air Fryer. It's working great with our MAX. But I want to know why they are not compatible. It could be a fire issue, it could be it causes one or the other to fail an early life, I don't know. But I don't want to burn our house down.

                    A simple response from the customer service as to why they are not compatible is all I need. If it's a fire issue we'll quit using them together. If it is a "early failure" by using them together then we'll decide if it's worth it.

                    The products are great but they need to do something about the customer service. If & when they respond they'll probably use the Corona Virus as the excuse. My wife & I both work for engineering companies & we are responding to customer questions from home every day. Go figure why Instant Pot can't do the same.`
                  }
                ]
              }
            ]
          },
          {
            title: 'Instant Pot Duo Nova Pressure Cooker 7 in 1, 10 Qt, Best for Beginners',
            price: 149.99,
            bullets: `The largest Instant Pot: An upgrade to the all-time bestseller Instant Pot Duo series, the Duo Nova combines 7 appliances in 1: Pressure cooker, slow cooker, rice cooker, steamer, Saute pan, food warmer, and yogurt maker. Clear the clutter from your counter and do it all with just one tool
            Bigger, healthier family meals fast: This massive 10 Quart Duo Nova is Instant Pot’s largest pressure cooker yet. With more cooking capacity than ever before, it is perfect for preparing larger meals up to 10 servings, ideal for feeding a roomful of guests or prepping meals for the entire week. And it cooks food up to 70% faster than other methods
            Smart lid: The new easy seal lid gives you one less thing to worry about because it automatically seals your Instant Pot. Steam release is also a breeze with a fast, safe push of the quick release button. And it even comes with a bonus sealing ring
            Worry-free cooking: 10+ safety features with UL certification let you “set it and forget it. ” You’re free to do other things while the Duo Nova cooks your dinner safely and quickly, with minimal mess and easy clean up. The Duo Nova’s food-grade stainless steel 304 (18/8) cooking pot is dishwasher-safe and durable, with no chemical coating
            Clear, simple controls: Elegant blue LCD intuitively indicates the cooking process of the multicooker. Convenient one-touch control of 13 programs can be customized to remember the way you like to cook.Power:1440W
            Plenty of recipes: The free Instant Pot recipes app on iOS and Android devices has 1000+ recipes to get you started on your culinary adventure. Join the millions of other Instant Pot users who share support, guidance, and the joy of cooking in the many Instant Pot online communities
            A name you can trust: The Instant Pot Duo Nova family shares the most trusted name in cookers, bringing all the quality and convenience you’ve come to expect from Instant Pot`,
            description: `The Instant Pot Duo Nova is the updated Duo. Duo Nova upgrades include the EasySeal Lid to automatically seal when pressure cooking and a cooking progress indicator, so you know when cooking begins. Plus, Duo Nova includes a bonus sealing ring.

            The Instant Pot Duo Nova 7-in-1, One-Touch multi-tasking, space-saving, time-saving appliance that pressure cooks, Sautes, steams, slow cooks, warms, and makes delicious meats, eggs, rice, soup, yogurt and more — all in one healthy, dishwasher safe, stainless steel pot. With 12 Smart Programs — ranging from meats, soup, stew, beans, chili, poultry, rice and yogurt, to multigrain, porridge and slow cook — it puts cooking on autopilot.

            The Poultry Smart Program cooks moist and tender chicken, turkey and other poultry, even from frozen. The Bean/Chili Program takes dried, unsoaked beans to flavorful cooked beans in no time.

            The Meat/Stew Smart Program cooks beef and pork anywhere from rare to fall-off-the-bone. Three customizable temperature settings across each Smart Program let you program your Duo Nova to your preferences. For example, with the Saute function, you can set to simmer, sear or thicken pressure cook your dish to completion — all in one easy-to-clean pot.

            Make your favorite slow cooker recipes in your Instant Pot. With the Slow Cook function with three settings (low, medium and high heat), you no longer need an extra slow cooker.

            Easy-to-use controls and new easy-to-read icons that indicate cooking progress make selecting Smart Programs and making adjustments simple — even during cooking. The Duo Nova is equipped with dual-pressure settings, giving you the option to cook at Low or High pressure. High pressure can reduce the cooking time by 2 to 6 times, while Low pressure prevents delicate foods from overcooking. It also has both automatic and manual Keep Warm programming to ensure that dishes are kept at ready-to-eat temperatures.

            A free Instant Pot app is available on iOS and Android mobiles, loaded with hundreds of easy recipes for almost all cuisines with plenty of great ideas to start your culinary venture.`,
            stock: 37,
            media: 6,
            isAvailable: true,
            groupVariations: [
              { name: 'Size', value: '10-QT' },
              { name: 'Style', value: 'Duo nova' }
            ],
            productParameters: [
              { name: 'Product Dimensions', value: '16.8 x 15.31 x 16.34 inches' },
              { name: 'Item Weight', value: '28 pounds' },
              { name: 'Manufacturer', value: 'Instant Pot' },
              { name: 'Item model number', value: 'Duo Nova ' }
            ],
            reviews: [
              {
                author: 6,
                stars: 4,
                isVerified: false,
                title: 'Feed the team!',
                content: `I got the 10 qt and was delighted by the size. It is quite large, which is great when you need to cook for a large group. The inner pot is 6.5" deep (which isn't much difference from a smaller unit) however it is 11" wide on the interior and 12" across on the exterior lip of the stainless pot. Without the lid on the unit it around 10.5" tall, and with the lid it is somewhere between 13-14".

                In regards to features it has plenty, however I was a bit sad it doesn't have the egg feature. But given how many times I have used the function on my smaller Instant Pot, I know it is just 5 minutes high pressure and 5 minutes until I release the pressure.

                I love the new pressure valve. Now I don't have to turn it and make sure it is set properly for the pressure to build. The whole unit is great BUT, the trivet! Seriously the trivet is the same size that comes with the 6qt and comes nowhere close to covering the bottom of the unit. They clearly should have designed a trivet to fit this very large unit. I'm docking one star for that because I find it to be annoying.

                Overall, I'm pleased with this unit and think it is great size that offers a lot of flexibility.`,
                media: 6
              },
              {
                author: 4,
                stars: 3,
                isVerified: false,
                title: 'Very few accessories for the 10 quart model.',
                content: `I bought the 10 quart model. I like to cook ribs in the pot and the 6 quart is a little tight with 2 racks of ribs. The 10 quart has plenty of room. The reason I gave this 3 stars instead of 5 is due to the lack of accessories for the pot.

                The rack that comes with the pot is the same size as the one that comes with the 6 quart model. If they’re going to make a bigger pot, they should make accessories to match instead of just sending the same accessories.

                With the 6 quart model I was able to purchase a glass lid in order to use it as a slow cooker. I didn’t find a glass lid on the instant pot site for the 10 quart model.`,
                media: 0
              }
            ]
          },
          {
            title: 'Instant Pot Duo Mini 7-in-1 Electric Pressure Cooker, Sterilizer, Slow Cooker, Rice Cooker, Steamer, Saute, Yogurt Maker, and Warmer, 3 Quart, 11 One-Touch Programs',
            listPrice: 79.95,
            price: 59.99,
            bullets: `Compact size: Great size for small households and side dishes, or anywhere space is limited. Has all the features of the Duo60 in a compact size.
            Replaces up to 7 appliances: combines 7 kitchen appliances in 1 to save you space, including: pressure cooker, slow cooker, rice cooker, steamer, saute, yogurt maker, and warmer.
            14 one touch cooking presets for quicker cooking: soup/broth, meat/stew, bean/chili, poultry, saute/searing, steam, rice, porridge, steam, slow cook, keep Warm, yogurt, manual, and pressure cook.
            Best selling model: monitors pressure, temperature, keeps time, and adjusts heating intensity and duration to achieve your desired results every time. Prepare dishes up to 70% faster.
            Easy to clean: fingerprint-resistant stainless steel lid and components and accessories that are dishwasher safe.`,
            description: 'Instant Pot Duo Mini is the ideal companion to the Duo 6 Quart, 7-in-1 programmable multi-cooker replaces 7 kitchen appliances, combines the functions of a Rice Cooker, Pressure Cooker, Slow Cooker, Steamer, saute, Yogurt Maker, and Warmer. 11 smart built-in programs – Rice, Soup/Broth, Meat/Stew, Bean/Chili, saute, Steam, Porridge, Yogurt, Slow Cook, and Keep Warm, your favorite dishes are as easy as pressing a button. The Instant Pot Duo Mini Rice Cooker Function cooks up to 6 cups of uncooked rice (12 cups cooked rice), the rice cooker function can cook all types of rice including white rice, brown rice, wild rice, sushi rice, risotto rice and more. Accessories include a stainless steel steam rack with handles and condensation collector. The Duo Mini is versatile it can be used at home to make a small dish for two, side dish or while traveling such as camping, traveling by RV, boating, sailing, hotel excursions etc.. A 24-hour delay start timer for delayed cooking is great for busy families allowing you to have your food ready when you get home from a busy day at work. Automatic keep warm holds the temperature of the dish until you serve. NOTE: This product is 110v and for use in North America, if you live in Europe or other 220-240v territories this product will not operate. When installing the sealing ring, make sure the sealing ring rack is completely set in the groove on the inside of the sealing ring.',
            stock: 5,
            media: 6,
            isAvailable: true,
            groupVariations: [
              { name: 'Size', value: '3-QT' },
              { name: 'Style', value: 'Duo' }
            ],
            productParameters: [
              { name: 'Product Dimensions', value: '11.81 x 10.51 x 10.98 inches' },
              { name: 'Item Weight', value: '8.65 pounds' },
              { name: 'Manufacturer', value: 'Instant Pot' },
              { name: 'Item model number', value: 'Duo Mini' }
            ],
            reviews: [
              {
                author: 8,
                stars: 5,
                isVerified: true,
                title: 'Perfect Tiny Living appliance',
                content: `I use this for everything! How did I live without this before???

                I live in a Sprinter van full-time and was using an induction burner for cooking, but since I've gotten this little gem, I haven't used the induction burner once!

                This is so easy to use, and it's the perfect size for one or two people. I've been making a lot of stews, and I'll saute the onions, carrots, and meat (if I'm using meat) then add everything else, seal it, and set it for 7 minutes on high pressure. I let it release naturally and have a perfectly cooked, tasty meal every time. This gives me enough for 4 or 5 servings.

                I also quick soaked beans the other day by covering them with water, hitting pressure for 5 min. then letting it release naturally and let it sit (not on keep warm) for a couple of hours.

                I'll often make dinner right after I reheat my lunch, and make sure the keep warm function is on. I'm able to drive with it in my sink and have a hot, healthy, delicious meal waiting for me when I'm done driving.

                I've even baked banana bread in it!!! So exciting, because I don't have an oven. It turned out SO good! I used one of the containers and the lid from my To-Go Ware stainless steel lunch container to bake it in on the rack.

                Because this cooks so quickly, it is very easy on my solar system. I can reheat leftovers on saute in 4 minutes, and it's only drawing 67a while it's on.

                I did have a VitaClay, that I absolutely loved for making beans, and especially bone broth, but it takes much longer to cook and is heavier. So, more battery drain, more storage space, and more weight as compared to the Instant Pot Mini and the Mini wins on each count!`,
                media: 1,
                comments: [
                  {
                    author: 2,
                    content: 'Very good, I very like it, this is a great value product, I also bought the Silicone Ice Cube Tray to make ice cube for keeping my drinks chilled, They are all great works and practical.'
                  },
                  {
                    author: 0,
                    content: 'Hi, I\'m curious what solar/power system you have in your van to power this. I have 500w solar and a 200Ah battery in mine and there\'s no way I could power this cooker. Thanks!'
                  },
                  {
                    author: 6,
                    content: 'Exactly my thoughts. I live part time in a Sprinter van as well, and have a robust solar/battery system that would never be able to support, well....anything that draws 67 amps. Requesting The Galavan to clarify his amp draw post...',
                    replyTo: 1
                  },
                  {
                    author: 7,
                    content: 'I got this at Costco, very handy, easy to use. '
                  },
                  {
                    author: 3,
                    content: 'Good review'
                  }
                ]
              },
              {
                author: 0,
                stars: 2,
                isVerified: true,
                title: 'Float valve doesn\'t pop up on its own.',
                content: `We're using this pot to cook for two and it does a great job, save for one problem--the little float valve in the lid does not pop up on its own.

                In order to get the float valve to pop up, I have to tap on it or grab the lid and press down on it once enough pressure has been built up inside the pot.

                I can't tell if this is a design flaw or a fault of the valve--it's a pretty basic little thing and unless the valve is catching on a rough bore in the lid or something, I don't see why it won't raise up on its own. Once I get it to pop up, the unit works like a charm.

                I was hoping it was user error, but after four months of using the pot almost weekly and experimenting with advice from online, I'm pretty sure this isn't right. Maybe I should contact the manufacturer, because right now, I have to watch the pot to ensure it will build pressure.`,
                media: 0
              }
            ]
          }
        ]
      }
    ],
    'Hamilton Beach': [
      {
        questions: [
          {
            author: 0,
            content: 'Product description is for a proctor silex waffle baker???',
            answers: [
              {
                author: 2,
                content: 'I ordered this straight off the screen and received the Slow Cooker - not a waffle baker.'
              },
              {
                author: 4,
                content: 'Yes, I also noticed that. Seems to be a mistake by Amazon. Not very helpful.'
              },
              {
                author: 6,
                content: 'No'
              }
            ]
          },
          {
            author: 2,
            content: 'Does the lid have a rubber gasket ( seal)around it?',
            answers: [
              {
                author: 8,
                content: 'The rubber gasket on the lid is this removable?'
              },
              {
                author: 4,
                content: 'no'
              }
            ]
          }
        ],
        products: [
          {
            title: 'Hamilton Beach 4-Quart Slow Cooker with Dishwasher-Safe Stoneware Crock & Lid, Stainless Steel (33140V)',
            listPrice: 39.76,
            price: 26.99,
            bullets: `Dishwasher safe stoneware & lid for fast, easy cleanup
            4 settings include off, low, high & warm
            Perfect size for a 4 lb chicken or two 2 lb roasts
            Stoneware is stainproof and removable for tabletop serving
            Stoneware is suitable for refrigerator storage`,
            description: 'Hamilton Beach 4-Quart Slow Cooker with Dishwasher-Safe Stoneware Crock & Lid Stoneware is stainproof and removable for tabletop serving or refrigerator storage',
            stock: 7,
            media: 4,
            isAvailable: true,
            productParameters: [
              { name: 'Product Dimensions', value: '12.2 x 9.4 x 12.4 inches' },
              { name: 'Item Weight', value: '9.25 pounds' },
              { name: 'Department', value: 'Kitchen Appliances' },
              { name: 'Manufacturer', value: 'Hamilton Beach' },
              { name: 'Item model number', value: '33140V ' }
            ],
            reviews: [
              {
                author: 0,
                stars: 1,
                isVerified: false,
                title: 'Don\'t buy cheap product.',
                content: 'This crock pot leaked the first and only time I used it. I suspect it was not properly packed. Although the ceramic pot looked fine when I started using it to cook my black eyed peas for my New Year\'s dinner, by the time they were done pot was cracked. I didn\'t want to believe it, but tried it again a month later with just water to confirm the leak. I guess I was amazed because my previous crock pot last me over 30 years and multiple moves. I guess they just don\'t make products like they used to. I added pictures of the crack and of the pot so you can see that the pot has not been used (or abused). ',
                media: 2,
                comments: [
                  {
                    author: 8,
                    content: 'What brand was the one that you had for 30 years?'
                  }
                ]
              },
              {
                author: 6,
                stars: 5,
                isVerified: true,
                title: 'Bachelor guidance',
                content: `My ex couldn't make a roast to save her life. I don't know why I thought I could, but it turns out I can roast up some bliss...

                For frame of reference (and to learn from my experiences) here's what you'll probably care about. When you buy a 4 quart slow cooker, that's good for about a 4 pound roast. You could maybe fit a 4.5 pounder in there, but it'll be mighty snug and may not work as well as you'd like. I have kids with hollow legs, and think I'll soon be looking for a 6 quart slow cooker. Also- if you're doing a roast, put it on the low heat and give it 8 hours. Yes, sure- you could use the higher heat and get the interior to 160F and eat it, but it won't be the same. Trust me on this. I've taken notes.

                As far as the cooker goes, I like it a lot- easy to clean, convenient size, and versatile. The only thing I'd ask Hamilton Beach to change is to add a power LED or something that will make it clear from across the room if it's on.`,
                media: 0,
                comments: [
                  {
                    author: 4,
                    content: 'Others do want to know more details, Marie, no need to be rude.'
                  },
                  {
                    author: 2,
                    content: 'I only wanted to know about the crock pot - not his life story! But good advice on temperature control'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        questions: [
          {
            author: 4,
            content: 'does this cooker auto switch to warm when food is done?',
            answers: [
              {
                author: 2,
                content: 'No it does not. The temperature setting (HIGH, LOW and WARM) are a manual dial that you must physically turn to change.'
              },
              {
                author: 0,
                content: 'as far as I know it does not maybe I didn\'t read enough about the poduct'
              },
              {
                author: 8,
                content: 'No it does not.'
              },
              {
                author: 6,
                content: 'No'
              }
            ]
          },
          {
            author: 4,
            content: 'can we cook rice and beans on this?',
            answers: [
              {
                author: 2,
                content: 'I have done beans but not rice and it was good. I did bean soup.'
              }
            ]
          },
          {
            author: 6,
            content: 'Does the plug have 3 prongs?',
            answers: [
              {
                author: 8,
                content: 'No it is only a 2 prong.'
              },
              {
                author: 2,
                content: 'no it\'s a 2 prong plug'
              },
              {
                author: 0,
                content: 'No'
              }
            ]
          },
          {
            author: 4,
            content: 'Are there heating elements on the sides as well as the bottom? ',
            answers: [
              {
                author: 0,
                content: 'Yes. I think so'
              }
            ]
          }
        ],
        products: [
          {
            title: 'Hamilton Beach Extra-Large Stay or Go Portable 10-Quart Slow Cooker With Lid Lock, Dishwasher-Safe Crock, Black (33195)',
            listPrice: 59.99,
            price: 49.99,
            bullets: `Extra-Large Capacity. 10 Quart Capacity Fits a 10 Pounds Turkey or 12 Pounds Roast
            3 Temperature Settings. Cook on Low or High and Then Switch to Warm When Your Meal Is Done Cooking
            Clip-Tight Sealed Lid. the Tight Seal Helps Prevent Messy Spills on the Way to a Potluck or Tailgate
            Full-Grip Handles. Thoughtful Handle Design Makes for Easy Carrying
            Simple to Clean. Stoneware Crock & Glass Lid Are Dishwasher Safe`,
            description: 'Dinner for the whole family doesn\'t have to be a chore. With the Hamilton Beach 10 quart slow cooker, It can be as easy as putting a few ingredients in the Crock before work and turning it on. By the time you come home, a warm, delicious, home-cooked meal will be waiting.',
            stock: 25,
            media: 7,
            isAvailable: true,
            productParameters: [
              { name: 'Product Dimensions', value: '12.5 x 15.75 x 11.5 inches' },
              { name: 'Item Weight', value: '16.91 pounds' },
              { name: 'Manufacturer', value: 'Hamilton Beach' },
              { name: 'Item model number', value: '33195 ' }
            ],
            reviews: [
              {
                author: 4,
                stars: 5,
                isVerified: true,
                title: 'Great for Slow Cocking Turkey!',
                content: 'This size crockpot fitted my 12lbs perfectly with some room for vegetables too! Love it!',
                media: 1,
                comments: [
                  {
                    author: 2,
                    content: 'I would not cook in plastic! That puts plastic in your food!'
                  },
                  {
                    author: 8,
                    content: 'Well, who doesn\'t love a slow cocked turkey!!! OMG! LOL!'
                  }
                ]
              },
              {
                author: 8,
                stars: 1,
                isVerified: true,
                title: 'Major Disappointment',
                content: `UPDATED REVIEW:
                I returned the first crock (because of the problems listed below) but was so in love with the size (large family here) that I decided to give a replacement another try. This one still has gaps in the lid. All I can imagine is that this will increase cooking times significantly! Also, there are pitting in the second crock (see photos). When I contacted Hamilton Beach about this problem, they informed me that it was a "normal" part of the process and that the crock would perform just fine. I have had many crocks over the years (mainly Crock Pot brand) and never have they had this pitting. Hamilton Beach refused to do anything about this pitting problem. Their customer service is pathetic! Unhappy to say the least! Please do NOT purchase this crockpot/slow cooker. You will be disappointed.
                ~~~~~~~~~~~~~~~~~~~~~
                The lid does not fit the crock. On both ends, there is air space of approx 1/4" to 1/2" where the lid does not lie flat on the crock. Instructions say don't cook with lid locked but the air space unlocked will cause the cooking time to increase dramatically. Very poor quality! I'm going to return it.`,
                media: 2
              },
              {
                author: 6,
                stars: 3,
                isVerified: true,
                title: 'Not 10 quart capacity',
                content: 'This is very nice but it is only 8 quarts. It states that it is 10 quarts on the Amazon website & on the packing box, model #33195. We measured the capacity and when filled with 8 quarts of water, the water level was at the maximum fill line. Adding the 9th quart of water caused it to almost spill over the top. It is also advertised as a 10 quart model on the Hamilton Beach website and there is another 10-quart model advertised on the Hamilton Beach website Model # 33191. I\'m reluctant to order the #33191 as it may not have a 10 quart capacity either ',
                media: 0,
                comments: [
                  {
                    author: 2,
                    content: 'Always, for any receptacle that will hold liquids, the capacity is given with consideration that there must be a safe space to avoid spilling. I always count on leaving 2" - 3" minimum from the top for cold liquids, 4" - 6" for hot liquids and/or for cooking. Capacity for solids is exact.'
                  },
                  {
                    author: 0,
                    content: 'Sad to hear that, still thank you so much for your sharing. Oh, I also bought the Privacy Window Film , which provides TWO Way Privacy but allows plenty of natural light to filter through, easy to install, works very well. I\'ll buy more! Highly recommend!'
                  },
                  {
                    author: 4,
                    content: 'Thanks for your post. I\'m comparing the dimensions to the 7 qt. model and was wondering how they could be so close in size.'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        questions: [
          {
            author: 0,
            content: 'Does the hole for the probe in this crockpot really not cause any problems while cooking? I was always under the impression any leaks/holes are bad',
            answers: [
              {
                author: 2,
                content: 'Look at other slow cookers, not many have what you\'d call a tight-fitting lid. It\'s usually just a thin glass lid that can rattle a bit when cooking on Highl. I have an earlier HB Stay or Go non-programmable model with a hole, no probe, no problems. There\'s no stream of steam that escapes, nothing seems to come out of it, even cooking on High.'
              },
              {
                author: 6,
                content: `I have been using this crock pot for several months now, both with and without the temperature probe inserted. I have not had a problem either way. There are two (2) tiny vent holes where the handle attaches anyway -- if you didn't have those the lid would pop up when steam/heat pressure built up. Some people have complained that too much steam/heat escapes when the probe is not in use; you can resolve that (if it bothers you) with a small piece of aluminum foil rolled into a plug.
                This is a GREAT crock pot. I make everything from whole chicken, baby back ribs, chicken soup, and pasta sauce in it. I can't say enough good things about it. (Except the cord is about 4 inches too short. LOL I fixed that with a 6 inch extension cord -- works great!)`
              },
              {
                author: 8,
                content: `I owned this Crick pot for years and used it several times a week , it finally died after my kitchen suffered electrical issues and surges .
                I've never had a problem with the tiny vent hole , quite the oposite , I always found this model to cook far better than any other I've used before or since .
                I'm reordering this one now`
              },
              {
                author: 4,
                content: 'Ive had mine for at least 3 years now and I rarely use the probe, I\'ve never had any issues with the hole. This is the best crockpot I\'ve ever owned.'
              }
            ]
          },
          {
            author: 8,
            content: 'does that have a delay start feature',
            answers: [
              {
                author: 4,
                content: 'Sorry Kim, but you can\'t set this cooker to turn on later in the day. For the meals that I cook in this unit that\'s never been a problem--for example, a pot roast that requires a 6-hour cooking time on the low setting will still be perfect after 8 or 10 hours because there\'s simply no evaporation to allow the food to dry out. If you\'re making a casserole that only needs to "bake" for a couple hours, and you want to serve after an 8-hour workday, you\'ll need to use the timed feature on your regular oven. I\'m not aware of any slow cookers that have a delayed start feature for that very reason; they simply don\'t allow food to dry out. So as long as you cook your food for the minimum required time, extending the length of cooking time for hours, even, is never a problem. This slow cooker will automatically switch to the warm setting after the cook time that you programmed has elapsed, or the probe registers that the food is cooked. I\'ve used quite a few different slow cookers, and this one (and its\' smaller cousin) are by far my favorites. If you spent 10 times the amount of money, this would still be the best slow cooker of all, in my opinion.'
              }
            ]
          },
          {
            author: 6,
            content: 'Can the interior pan be removed for easier cleaning, or for serving/',
            answers: [
              {
                author: 2,
                content: 'If your talking about the "ceramic crock" that you place your food in then yes, its removable. It is also microwave-safe and oven proof.'
              }
            ]
          }
        ],
        products: [
          {
            title: 'Hamilton Beach Portable 6-Quart Digital Programmable Slow Cooker With Temp Tracking Temperature Probe to Braise, Sous Vide, Make Fondue & Yogurt, Lid Lock, Black Stainless (33866)',
            price: 69.99,
            bullets: `Integrated Temperature Probe: Track Your Food’s Temperature With the Probe, Minimizing the Chances of Overcooking and Helping to Ensure Food Safety When Cooking Beef, Pork & Poultry
            Multiple Cooking Functions: Cook on Low, Medium or High With or Without the Probe; When the Food Is Ready, the Slow Cooker Shifts to Keep Warm or Holds It at the Selected Temperature
            Expand Your Cooking Options: Hold Temperature Function Lets You Sous Vide, Prepare Yogurt, Poach, Simmer, Braise, Make Fondue & More
            Digital Display: Countdown Timer Displays Remaining Cooking Time and Toggles Between the Selected Food Temperature and a Current Internal Temperature When the Probe Is in Use
            6 Quart Capacity: Perfect Size for a 6 LB. Chicken or 4 LB. Roast`,
            description: 'Hamilton Beach slow cookers take the convenience of slow-cooked dishes A giant step further. Even if you typically use your slow cooker at home, you\'ll be impressed by the attractive design, easy-to-use features and simple Dishwasher cleanup that a Hamilton Beach slow cooker offers you.',
            stock: 13,
            media: 7,
            isAvailable: true,
            productParameters: [
              { name: 'Product Dimensions', value: '12 x 17 x 11.87 inches' },
              { name: 'Item Weight', value: '13.05 pounds' },
              { name: 'Manufacturer', value: 'Hamilton Beach' },
              { name: 'Item model number', value: '33866 ' }
            ],
            reviews: [
              {
                author: 2,
                stars: 5,
                isVerified: true,
                title: 'Best slow cooker.',
                content: 'Love it. The temperature probe works wonderfully. Cleans up easily.',
                media: 1
              },
              {
                author: 4,
                stars: 1,
                isVerified: false,
                title: 'It\'s not all that.',
                content: `I use my slow cooker all the time, so when it finally conked out, it was almost like losing a best friend. After many hours of research and reading reviews, I finally settled on this model due to the temp probe. Awesome idea, and that feature does work. However, there were a number of issues that had me packing this puppy up and shipping it back.

                1. Yes, the lid does smell like the food you cooked. I read that in the other reviews, and at first I'm like, so what? If I had a guest that was sniffing the lid, I'd politely escort them out the door and they'd be a guest no more, right? Well, I get it now. I keep my cooker in a cabinet, and when I opened the cabinet to take it out, the odor just wafted out. Yuck.
                2. I don't know if it's a defect or maybe it was operator error, but I couldn't change the temp during the cook. The first meal I cooked was a large batch of 15 bean soup with ham hocks. I started it on Hi with Hold Temp on and set to 180, as that's what the chart says is "Simmer". Okay. At 109 degrees my soup was boiling and I tried to turn it to Low and it wouldn't let me. So I had to cancel the cook and reprogram it. Really? (Glad I was home to catch it.) I set it to Low without Hold Temp, then the soup wasn't bubbling at all. Now I'm frustrated. Why oh why did my old cooker have to die??
                3. The backlit display turns off, and you can't really see the status of your cook. I was afraid to touch the dial for fear of cancelling it. It's a small matter, I know. But still, slow cooking should be a stress free experience.
                4. The glass lid would be awesome to peek at how your cook is going, if you could see through it. The condensation gets so bad you can't see through it. I even tried tapping on the lid to knock some of the moisture off, but it made little difference. Grrr...
                5. As you may be able to tell in the pics, the crock discolored after my second cook. I hand washed and dried both the lid and the crock, so I'm not sure why it became so cloudy.
                6. The metal hinges you use to lock down the lid for transport are pretty flimsy.

                Too many little things were enough to have me saying "sayonara" Hamilton Beach and "hello" Aicok.`,
                media: 3
              },
              {
                author: 6,
                stars: 5,
                isVerified: false,
                title: 'Awesome Slow Cooker',
                content: 'This cooker is awesome! I love to cook and this makes it so easy. The temperature probe allows you to select your final temperature, when your meal reaches set point temperature you have the option to have your meal stay at that temperature or keep it warm. You can even set how long to keep it warm or at set point temperature. It is also fast, put a roast in and in a few hours it’s done. The display also tell you the current temperature. If your looking for a cooker this is it and for a few dollars more you get it all. I included a few photos of delicious meals made in this slow cooker.',
                media: 2
              },
              {
                author: 8,
                stars: 2,
                isVerified: true,
                title: 'Strong on bells & whistles, weak on basic cooking',
                content: 'We bought this crockpot with hopes it would replace our very old classic crockpot. The locking lid and built-in thermometer are great feature additions. But, I\'m sorry to say it hasn\'t replaced our classic crockpot. The \'low\' setting boils meals just like \'high\' does. The timer function is both good and bad. We cook some things for 2-3 days (broth), and have to remember to reset the timer every day or this unit will shut off. And now the "cancel\' button text has come off after 2 months of use. Quality, performance, and attention to detail on this crockpot are sub-par. ',
                media: 1
              },
              {
                author: 0,
                stars: 1,
                isVerified: false,
                title: 'Worst Product',
                content: 'Bought in September new. Lasted till January. Worst quality. Digital controls a hazard and does not work half the time. Too late to return. We should have returned when we saw the controls were confusing and would not work. Do not buy. Hamilton Beach crockpots are the worst. This is the second one I went thru in 2 years. Customer service the worst and arrogant. Told me they could repair or replace for more money than I paid for it. Done with Hamilton Beach. Be prepared for 1 hour hold times on customer service. They even say its 5o minutes at beginning of hold. Very poor.',
                media: 0
              },
              {
                author: 3,
                stars: 5,
                isVerified: true,
                title: 'Wedding gift for son and my new daughter',
                content: 'Purchased in June 2019 as a wedding gift. My son and his wife are very busy (as most folks these days) and use this slow cooker at least 4 times a week. They love it! My wife and I have the same brand, albeit 10 years older, and have had no issues. My new daughter is always telling us how it\'s the best gift they received. They have cooked small whole turkeys, too Irish stew, to chili, to chicken n dumplings, and all the normal type of stuff. Would recommend to anyone needing to have good, healthy, fresh meals ready when coming home from a long days work.',
                media: 0
              },
              {
                author: 1,
                stars: 2,
                isVerified: true,
                title: 'I will get my old one out of the attic!',
                content: `The control knobs, setting etc. are almost impossible to just turn to low, med or high.
                Hate those lock down things, the temp probe, all make it more difficult to clean and store.
                Seriously I have an old one with a slight crack in the crock. I will get it out of the attic and try to send this back. Bad recommendation from HotWire`,
                media: 0
              },
              {
                author: 5,
                stars: 3,
                isVerified: true,
                title: 'Cooks too hot!',
                content: 'I bought this because the crock in my old crock pot kept cracking. I have not really liked it at all. It cooks extremely hot leaving food dry and/or burnt. The shell is really flimsy and will dent with the lightest touch. I’d rather purchase my old crock pot and just buy a new one every few years than stick with this one.',
                media: 0
              }
            ]
          }
        ]
      }
    ]
  },
  Dresses: {
    'Calvin Klein': [
      {
        products: [
          {
            title: 'Calvin Klein Women\'s Short Shoulder Sheath with Flutter Sleeves',
            price: 151.3,
            bullets: `94% polyester, 6% spandex
            Imported
            Zipper closure
            Dry Clean Only
            Flattering fit
            Zipper closure`,
            description: 'A glamorous off-the-shoulder Dress that is perfect for a night out',
            productSizes: [
              { name: '2', qty: 3 },
              { name: '4', qty: 2 },
              { name: '6', qty: 0 },
              { name: '8', qty: 8 },
              { name: '10', qty: 1 },
              { name: '12', qty: 8 },
              { name: '14', qty: 3 },
              { name: '16', qty: 4 }
            ],
            media: 4,
            isAvailable: true,
            groupVariations: [
              { name: 'Color', value: 'Black' }
            ],
            reviews: [
              {
                author: 0,
                stars: 5,
                isVerified: true,
                title: 'Love this dress',
                content: 'Very nice dress! Fits perfect ',
                media: 0
              }
            ]
          },
          {
            title: 'Calvin Klein Women\'s Short Shoulder Sheath with Flutter Sleeves',
            price: 157.3,
            bullets: `94% polyester, 6% spandex
            Imported
            Zipper closure
            Dry Clean Only
            Flattering fit
            Zipper closure`,
            description: 'A glamorous off-the-shoulder Dress that is perfect for a night out',
            productSizes: [
              { name: '2', qty: 2 },
              { name: '4', qty: 2 },
              { name: '6', qty: 1 },
              { name: '8', qty: 8 },
              { name: '10', qty: 4 },
              { name: '12', qty: 1 },
              { name: '14', qty: 0 },
              { name: '16', qty: 4 }
            ],
            media: 4,
            isAvailable: true,
            groupVariations: [
              { name: 'Color', value: 'Aubergine' }
            ]
          },
          {
            title: 'Calvin Klein Women\'s Short Shoulder Sheath with Flutter Sleeves',
            price: 158.3,
            bullets: `94% polyester, 6% spandex
            Imported
            Zipper closure
            Dry Clean Only
            Flattering fit
            Zipper closure`,
            description: 'A glamorous off-the-shoulder Dress that is perfect for a night out',
            productSizes: [
              { name: '2', qty: 2 },
              { name: '4', qty: 3 },
              { name: '6', qty: 7 },
              { name: '8', qty: 13 },
              { name: '10', qty: 15 },
              { name: '12', qty: 3 },
              { name: '14', qty: 2 },
              { name: '16', qty: 0 }
            ],
            media: 4,
            isAvailable: true,
            groupVariations: [
              { name: 'Color', value: 'Jazzberry' }
            ],
            reviews: [
              {
                author: 2,
                stars: 3,
                isVerified: true,
                title: 'Great dress, poor packaging',
                content: 'This is a beautiful dress as expected by Calvin Klein. The color is fantastic and the designer dress is perfect for cocktails. I was extremely upset that when the dress arrived, I expected to be able to pull it out, put it on and go, like other clothing I’ve been able to do. Unfortunately this dress arrived extremely wrinkled while attached to the hanger which was broken in half. It appeared the dress was wadded up and thrown into the box. I needed to dry clean this dress before being able to wear it out. 2 stars deducted for poor packaging and the extra cost to clean it before wearing.',
                media: 0
              }
            ]
          }
        ]
      },
      {
        questions: [
          {
            author: 4,
            content: 'What color is aubergine?',
            answers: [
              {
                author: 6,
                content: 'Aubergine is deep purple'
              },
              {
                author: 8,
                content: 'Aubergine is lila'
              }
            ]
          },
          {
            author: 2,
            content: 'Im 5\'3, how far do you think the dress will come down to? ',
            answers: [
              {
                author: 4,
                content: 'Truly, It depends on your proportions. I am 5\'6" , have long legs and a shorter torso. My dress is a size 4. The skirt length, below the waist, which sits a tad higher than most, is 22" long and the bottom hits me mid-knee. It looks short on the photo model. It\'s a nice dress, try it. you can always return it if it doesn\'t hang right on you.'
              },
              {
                author: 6,
                content: 'My daughter is 5’6 Size 14 and it came to the knee so it would depend on the size of the dress but it would be below the knee for you'
              },
              {
                author: 8,
                content: `The dress will come just 3cm over the knee.
                It is a wonderful dress and high quality`
              },
              {
                author: 4,
                content: 'I’m 5’4” and my dress comes to the top of my knee.'
              },
              {
                author: 6,
                content: 'Same as in photo'
              }
            ]
          },
          {
            author: 4,
            content: 'Which one is white? Cream or deep cream? ',
            answers: [
              {
                author: 3,
                content: 'White'
              },
              {
                author: 0,
                content: 'It\'s white.'
              },
              {
                author: 8,
                content: 'I got this in a different color. Sorry I can’t help.'
              }
            ]
          },
          {
            author: 8,
            content: 'How much does the dress weigh?',
            answers: [
              {
                author: 6,
                content: 'I don’t know exactly what you are asking but I would describe it is a medium thickness fabric and hangs nicely. It’s not light and flowy, blow away fabric.'
              },
              {
                author: 2,
                content: 'If you are asking for the shipping weight, my package was 2 pounds'
              }
            ]
          },
          {
            author: 0,
            content: 'Can it be shortened by having a tailor cut the bottom "sheer insert" off and re-hem if necessary?',
            answers: [
              {
                author: 4,
                content: 'I bought the regular size and the petite size to see which was better for me. I like the petite for me. I returned the regular size that didn\'t work- easy to do. I would not buy the dress to tailor it. The dress is beautiful as it is. Get regular and petite and see what you like on yourself.'
              },
              {
                author: 2,
                content: 'I am honestly not sure, but when I wore the dress it feel like the sheer part was a separate piece, so I think it might be possible.'
              },
              {
                author: 8,
                content: 'you\'ll love the dress- I do'
              }
            ]
          }
        ],
        products: [
          {
            title: 'Calvin Klein Women\'s Sleeveless Round Neck Fit and Flare Dress ',
            listPrice: 89.98,
            price: 77.13,
            bullets: `94% Polyester, 6% Spandex
            Imported
            Zipper closure
            Dry Clean Only
            Flattering fit
            Zipper closure`,
            description: 'Sleeveless round neck fit and flare dress with sheer inserts at hem',
            productSizes: [
              { name: '2', qty: 3 },
              { name: '4', qty: 2 },
              { name: '6', qty: 4 },
              { name: '8', qty: 8 },
              { name: '10', qty: 3 },
              { name: '12', qty: 2 },
              { name: '14', qty: 1 },
              { name: '16', qty: 0 }
            ],
            media: 3,
            isAvailable: true,
            groupVariations: [
              { name: 'Color', value: 'Cream' }
            ],
            reviews: [
              {
                author: 2,
                stars: 5,
                isVerified: true,
                title: 'Simple but chic',
                content: 'Beautiful, high-quality, simple but chic dress that I wore for my city hall wedding. Very figure-flattering, stylish and modest.',
                media: 0
              }
            ]
          },
          {
            title: 'Calvin Klein Women\'s Sleeveless Round Neck Fit and Flare Dress ',
            listPrice: 89.98,
            price: 60,
            bullets: `94% Polyester, 6% Spandex
            Imported
            Zipper closure
            Dry Clean Only
            Flattering fit
            Zipper closure`,
            description: 'Sleeveless round neck fit and flare dress with sheer inserts at hem',
            productSizes: [
              { name: '2', qty: 0 },
              { name: '4', qty: 0 },
              { name: '6', qty: 4 },
              { name: '8', qty: 0 },
              { name: '10', qty: 3 },
              { name: '12', qty: 1 },
              { name: '14', qty: 0 },
              { name: '16', qty: 0 }
            ],
            media: 3,
            isAvailable: true,
            groupVariations: [
              { name: 'Color', value: 'Indigo' }
            ],
            reviews: [
              {
                author: 4,
                stars: 5,
                isVerified: true,
                title: 'Classic, beautiful, flattering',
                content: `This dress looked bit plain to be honest online. I had recently lost a good deal of weight and wasnt sure what size to get. I had a dress from when I was heavier that was a 14 that was now quite big. So I ordered 3 different dresses, a 12, and two size 10's all Calvin Klein, but different styles. This was my "safe" dress.
                I put this one on last, and instantly my husband who had really liked the first one was like, "that's the one." My friend said basically the same. It was so classy looking, the navy just enough to give it a pop of suprise, so it was more than just a plain little black dress. I wore it to a wedding, where I saw people who I hadn't seen in months. The dress highlighted my weight loss and I recieved so many compliments on that, and the dress, and those who disnt know me before complimented the dress itself.
                I paired it with nude heels and a nude purse and honestly I felt great. This is truly a beautiful dress. Excellent quality, simple but the color and sheer detail at the hem give it just enough to be special. I highly recommend it.`,
                media: 2
              }
            ]
          }
        ]
      }
    ],
    SheIn: [
      {
        questions: [
          {
            author: 2,
            content: 'im 5\'3 and 99 lbs, what size should i get?',
            answers: [
              {
                author: 4,
                content: 'I would guess an extra small.'
              }
            ]
          },
          {
            author: 4,
            content: 'I\'m 5\'9" and 140lbs, what size would you recommend? i usually wear a us size 4-6, but sometimes dresses don\'t have the length i need.',
            answers: [
              {
                author: 2,
                content: 'I’m 5’0. And I had about 4 inches off the bottom and wore 6 inch heels so I think you’ll be fine for length. I would suggest either small or extra small. I got an extra small and it fit perfectly.'
              },
              {
                author: 8,
                content: 'To be honest, i bought a xs and it\'s perfect for me (5\' and 130lbs)'
              }
            ]
          },
          {
            author: 8,
            content: 'I’m 6 ft, how can I make the length longer',
            answers: [
              {
                author: 2,
                content: 'If you don’t mind the top of the dress being a little lower the length can be adjusted slightly with the top strings'
              }
            ]
          },
          {
            author: 4,
            content: 'Hi. i’m a breastfeeding mother and i need a dress where my breasts are easily available. would i be able to pop a titty out real quick?',
            answers: [
              {
                author: 6,
                content: 'Yes ! Lol this will work make sure you have good padding in case of leakage because the material will def show if it’s wet.'
              },
              {
                author: 0,
                content: 'yes'
              }
            ]
          }
        ],
        products: [
          {
            title: 'SheIn Women\'s Sexy Satin Deep V Neck Backless Maxi Party Evening Dress',
            price: 28.99,
            bullets: `Material:100% Polyster. The material is very soft and smooth, Size runs large, P.S. Please check the SIZE CHART before your purchase.
            Plunge neck, spaghetti strap, side slit, maxi evening gown. The halter strings can be circled for one or more circles around the waist.
            Sexy, formal, vintage.Great for party, cocktail, wedding, club, homecoming, prom.
            It is recommended to iron the dress before you wear it.
            Please refer to the size measurement below.`,
            productSizes: [
              { name: 'X-Small', qty: 3 },
              { name: 'Small', qty: 6 },
              { name: 'Medium', qty: 2 },
              { name: 'Large', qty: 3 },
              { name: 'X-Large', qty: 1 },
              { name: 'XX-Large', qty: 0 }
            ],
            media: 5,
            isAvailable: true,
            groupVariations: [
              { name: 'Color', value: 'Dark Green' }
            ],
            reviews: [
              {
                author: 8,
                stars: 5,
                isVerified: true,
                title: 'STUNNING go one size smaller',
                content: `You must buy!!! THIS DRESS IS STUNNING!!!! I got so many compliments on it for both men and women. The material is thin but not sheer. Go one size smaller than you would usually go. I read comments that suggested that and I was glad I followed them.
                I bought a small but usually wear a medium.
                5’9
                145lbs
                32B bust`,
                media: 3
              },
              {
                author: 6,
                stars: 5,
                isVerified: true,
                title: 'An actual prom dress!',
                content: 'My daughter decided she wanted to get this dress for Prom. I actually tried to talk her out of it- Prom is a big deal! I wanted to see her in a high quality dress. But she was determined, so we ordered it. It arrived quickly, and came just as described. The emerald color was stunning. She is not tall, about 5\'4", and with 2" heels the length was perfect. It was very wrinkly, but a steamer quickly took the wrinkles out. I wish she had done a better job of steaming it, there were a few left on the bottom of the dress that show up in this photo. The fit is loose and drapes. She did have one problem with the chest, it was cut way too low for her. She remedied this easily with some double sided tape and had no problems with it the entire night. Also, it did not look odd with the double sided tape. The only thing that really bothered me was that the tag is sewn into the leg slit, so when she walked or when it was breezy, the tag showed. It really is a very thin material. She took the tag out easily with some sewing scissors. Is it a cheap dress? Absolutely. But it was the look, color, and fit that she wanted. She did buy some silicone "nipple shields" but had no problems with these. This is probably not a dress you can wear a bra with unless you have a sticker bra. My daughter is very small so it wasn\'t a problem. This dress will show body flaws or underwear lines easily, so if there\'s something you\'re not comfortable with, just be aware of this. All things considered, it was a pretty great look on her. She was very happy with it and was super happy to save so much money. She looked and felt beautiful. I had my doubts but she was right!',
                media: 2,
                comments: [
                  {
                    author: 4,
                    content: 'Wow excellent review!! Thank you for the details. I’m looking for a dress to wear to a wedding and you helped me decide to look for another.'
                  }
                ]
              }
            ]
          },
          {
            title: 'SheIn Women\'s Sexy Satin Deep V Neck Backless Maxi Party Evening Dress',
            price: 28.99,
            bullets: `Material:100% Polyster. The material is very soft and smooth, Size runs large, P.S. Please check the SIZE CHART before your purchase.
            Plunge neck, spaghetti strap, side slit, maxi evening gown. The halter strings can be circled for one or more circles around the waist.
            Sexy, formal, vintage.Great for party, cocktail, wedding, club, homecoming, prom.
            It is recommended to iron the dress before you wear it.
            Please refer to the size measurement below.`,
            productSizes: [
              { name: 'X-Small', qty: 4 },
              { name: 'Small', qty: 1 },
              { name: 'Medium', qty: 1 },
              { name: 'Large', qty: 2 },
              { name: 'X-Large', qty: 5 },
              { name: 'XX-Large', qty: 0 }
            ],
            media: 5,
            isAvailable: true,
            groupVariations: [
              { name: 'Color', value: 'Pink' }
            ],
            reviews: [
              {
                author: 4,
                stars: 4,
                isVerified: true,
                title: 'Really loose',
                content: `Ok I have no idea how anybody wore this outside without an entire chest balloon falling out but I’m still in love. It’s so dreamy you can help but love it. Just realize everyone at some point will see your nipples.
                I’m actually using it as my wedding dress, but I’m going to buy another (two in total) and make a whole new top because my C cups don’t stay in. At all. In the pictures it doesn’t look so bad, but honey, it is. Try me.
                The color is gorgeous and it’s not a cheap thin material that I expected. I got a blush color but it photographs in low light as a champagne so that’s fun.
                I’m 5’5” and it has a few inches past my feet so you can wear heels and it will still be long. I would even hem it but I like when it drags on the floor. So pretty.
                Love it even though it’s not even close to perfect.`,
                media: 2
              },
              {
                author: 0,
                stars: 2,
                isVerified: true,
                title: 'Best for a larger chest',
                content: 'This dress is probably best for someone with a larger chest. I\'m 5\'3", 145lbs, and 34B. The chest area seemed hopelessly baggy, no matter how many times I tried to tie and re-tie the strings. The slit was far too high and showed my underwear easily. The cut of the dress itself was a bit uneven. The material caught on literally everything and immediately started fuzzing / coming off from first contact with objects out of the bag it came in. I really wanted to like the dress and was hoping to wear it to a wedding, especially with the good reviews and how great everyone looked in it, but sadly it didn\'t seem to be the dress for me. ',
                media: 1,
                comments: [
                  {
                    author: 2,
                    content: 'it sounds like you were just wearing it higher than the girls modeling it- could that be why?'
                  },
                  {
                    author: 4,
                    content: 'What size did you get ? I\'m around your size & height !'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        questions: [
          {
            author: 4,
            content: 'Im 5\'2 and weigh about 116 what size should I get?',
            answers: [
              {
                author: 6,
                content: 'It runs big. I would consider an extra small if I were you.'
              }
            ]
          },
          {
            author: 8,
            content: 'Is this dress available in plus sizes?',
            answers: [
              {
                author: 2,
                content: 'We have XL size and it is the largest size for the dress. Thanks.'
              }
            ]
          },
          {
            author: 6,
            content: 'I am a size 2/4 and run between an xs and s. would you recommend the small or extra small? chest is 34d. thanks!',
            answers: [
              {
                author: 4,
                content: 'I am a 34 G and got a L, which fit perfect...the medium was a little too tight across the chest and just a tad too short for my liking and the large fixes both these issues with out getting too much bigger anywhere else. So I’d say go with a medium!'
              },
              {
                author: 0,
                content: 'sorry can\'t help bought it as a gift .'
              }
            ]
          }
        ],
        products: [
          {
            title: 'SheIn Women\'s Crochet Pom-pom Sheer Lace Bell Sleeve Dress',
            price: 43.99,
            bullets: `Materials: 100% Nylon; Fabric has no stretch. White one would be a little see through.
            Hollow out, long sleeve, see through, round neck
            Shift, keyhole back, casual, elegant, boho
            Soft and comfortable; suitable for wearing in Spring, Fall or Winter
            Model Measurement: Height: 175cm/5'9", Bust: 85cm/33", Waist: 61cm/24", Hip: 93cm/37", Wear: S"; Please refer to the size measurement below. Length of dress would be a little short.`,
            productSizes: [
              { name: 'X-Small', qty: 7 },
              { name: 'Small', qty: 3 },
              { name: 'Medium', qty: 1 },
              { name: 'Large', qty: 2 },
              { name: 'X-Large', qty: 5 },
              { name: 'XX-Large', qty: 3 }
            ],
            media: 6,
            isAvailable: true,
            groupVariations: [
              { name: 'Color', value: 'Off White' }
            ],
            reviews: [
              {
                author: 0,
                stars: 5,
                isVerified: false,
                title: 'Sized up for the win',
                content: 'This dress was perfect for my fiesta bridal shower! I originally ordered a medium but found it to be a little tight through the chest area so I ordered a large which fit much better (not tight and a little longer). I am 5’4 155lbs and a 32G. Dress is fairly see through, So I wore a slip under mine. Overall very happy with this purchase!',
                media: 1
              },
              {
                author: 2,
                stars: 5,
                isVerified: false,
                title: 'White party success!!',
                content: 'My boss told me last min I was going to the annual realtor white party so what do I do... go to my handy dandy amazon! I’m a shift dress girl and when I saw this I was like well let me give it a chance. I’m about 160 pds and 5’2 usually between M-L, I ordered the large to be on the safe side and felt it was a bit big but in a comfy still fitting way, as in if I ordered the M it would have been too small. I did wear a slip under it as well just in case the light shined to hard, it wasn’t see through but I did notice with just a nude bra and panties you could kind of see it. All in all, I got so many compliments!',
                media: 1
              }
            ]
          },
          {
            title: 'SheIn Women\'s Crochet Pom-pom Sheer Lace Bell Sleeve Dress',
            price: 43.99,
            bullets: `Materials: 100% Nylon; Fabric has no stretch. White one would be a little see through.
            Hollow out, long sleeve, see through, round neck
            Shift, keyhole back, casual, elegant, boho
            Soft and comfortable; suitable for wearing in Spring, Fall or Winter
            Model Measurement: Height: 175cm/5'9", Bust: 85cm/33", Waist: 61cm/24", Hip: 93cm/37", Wear: S"; Please refer to the size measurement below. Length of dress would be a little short.`,
            productSizes: [
              { name: 'X-Small', qty: 1 },
              { name: 'Small', qty: 3 },
              { name: 'Medium', qty: 1 },
              { name: 'Large', qty: 2 },
              { name: 'X-Large', qty: 0 },
              { name: 'XX-Large', qty: 0 }
            ],
            media: 6,
            isAvailable: true,
            groupVariations: [
              { name: 'Color', value: 'Black' }
            ],
            reviews: [
              {
                author: 4,
                stars: 1,
                isVerified: true,
                title: 'Fit is all over the place!',
                content: 'I liked how the dress looked so I ordered an XS because that\'s what I usually wear and the dress had a great length but the shoulders were too tight, so I re-ordered one size larger, a small and it was HUGE! The length was too long and I swam in it. There shouldn\'t be that large of a difference between sizes. Save your money. ',
                media: 0
              },
              {
                author: 6,
                stars: 5,
                isVerified: true,
                title: 'Adorable',
                content: 'I purchased this dress to wear on vacation. It ended up being much colder than anticipated so I wasn\'t able to wear it however I am definitely excited to add it to my closet for the next time I need to dress up. This dress is comfortable and cute. It is very sheer but that\'s in the description so I can\'t take a star off for that. I would however recommend a thick slip with this dress. ',
                media: 0
              }
            ]
          }
        ]
      },
      {
        questions: [
          {
            author: 6,
            content: 'Which of the three reds is a bright red? I am guessing Red#3 however I know shades sometimes look different in pictures.',
            answers: [
              {
                author: 8,
                content: 'Red#3 is a bright red.'
              }
            ]
          },
          {
            author: 4,
            content: 'hi i’m 5’6 and a 36 B and i’m 150 what size would be best',
            answers: [
              {
                author: 2,
                content: 'I would say a large. I\'m 5\'2 and medium rests about 2-3 inches above the knee.'
              }
            ]
          },
          {
            author: 2,
            content: 'Hi! I’m 5’5 and weigh 145 lbs. what size do you think I should get?',
            answers: [
              {
                author: 4,
                content: 'We suggest M size.'
              }
            ]
          },
          {
            author: 8,
            content: 'I’m 5’3 and 125 what size do you suggest',
            answers: [
              {
                author: 6,
                content: 'My daughter is 5’5 125 and the medium fit her. It was pretty short and she ended up not wearing the dress.'
              },
              {
                author: 2,
                content: 'Small. I’m the same but with an athletic build. It is quite short though.'
              },
              {
                author: 4,
                content: 'Small'
              }
            ]
          },
          {
            author: 4,
            content: 'I’m 5’9” and 140 pounds what size would I get?',
            answers: [
              {
                author: 6,
                content: 'I got an extra large but I am 170 pounds and only 5 foot five. The material is somewhat stretchy. But it is going to be quite short on you. It’s pretty short on me. Like barely mid thigh.'
              }
            ]
          }
        ],
        products: [
          {
            title: 'SheIn Women\'s V Neck Adjustable Spaghetti Straps Sleeveless Sexy Backless Dress',
            price: 27.99,
            bullets: `95% polyester , 5% spandex
            Wrap closure
            95% Polyester, 5% Spandex, fabric has some stretch
            Dress length(inch): XS-26.4, S-26.8, M-27.2, L-27.6, XL-28.0
            Sleeveless, solid flared skater dress, wrap front dress, adjustble strappt, cami tank dress
            Women sexy cami mini dress`,
            productSizes: [
              { name: 'X-Small', qty: 1 },
              { name: 'Small', qty: 3 },
              { name: 'Medium', qty: 1 },
              { name: 'Large', qty: 2 },
              { name: 'X-Large', qty: 5 }
            ],
            media: 4,
            isAvailable: true,
            groupVariations: [
              { name: 'Color', value: 'Black' }
            ],
            reviews: [
              {
                author: 4,
                stars: 3,
                isVerified: true,
                title: 'Nice dress',
                content: `I bought this to wear to a little black dress charity event. I thought i had a better photo of it on. It was a little big and i ended up getting another dress. I just had a baby so i didn’t know what size i needed for sure. I got a large due to my chest being a 34G currently. (40 inches). The waist was big.
                My waist was 32in. I think i could have worn a medium easily. The material is stretchy. It’s a good dress for the price. Had i bought the right size i would have worn it.`,
                media: 1,
                comments: [
                  {
                    author: 2,
                    content: 'wow!!!'
                  },
                  {
                    author: 8,
                    content: 'My waist is 33in, and my chest is a 36C, do you think I should get a medium or a large?'
                  }
                ]
              },
              {
                author: 6,
                stars: 5,
                isVerified: true,
                title: 'Perfect little black dress for the price',
                content: 'Perfect little black dress. It\'s comfy too but fits just right. I\'m 5\'4" and float between 125-130 lbs (I am very active too, waist measures about 26.5" and stomach about 30"). It is short but that\'s what I was going for. Wore it out in Vegas to the club. Only complaint - straps to adjust are flimsy and hard to adjust. Luckily I didn\'t need to adjust it.',
                media: 1,
                comments: [
                  {
                    author: 2,
                    content: 'Wow. It looks amazing on you and you look amazing in it. Please. Please. More reviews.;)'
                  }
                ]
              }
            ]
          },
          {
            title: 'SheIn Women\'s V Neck Adjustable Spaghetti Straps Sleeveless Sexy Backless Dress',
            price: 27.99,
            bullets: `95% polyester , 5% spandex
            Wrap closure
            95% Polyester, 5% Spandex, fabric has some stretch
            Dress length(inch): XS-26.4, S-26.8, M-27.2, L-27.6, XL-28.0
            Sleeveless, solid flared skater dress, wrap front dress, adjustble strappt, cami tank dress
            Women sexy cami mini dress`,
            productSizes: [
              { name: 'X-Small', qty: 13 },
              { name: 'Small', qty: 13 },
              { name: 'Medium', qty: 21 },
              { name: 'Large', qty: 8 },
              { name: 'X-Large', qty: 1 }
            ],
            media: 5,
            isAvailable: true,
            groupVariations: [
              { name: 'Color', value: 'Drak Red' }
            ],
            reviews: [
              {
                author: 2,
                stars: 1,
                isVerified: true,
                title: 'Needs improvement',
                content: `I knew this dress would be on the sexier side due to my larger bust. I ordered a medium thinking it would contain the girls. I was wrong. Should’ve sized up. Might have been able to make it work if the straps were more adjustable but they were not.

                It’s also poor quality. The zipper kept getting stuck on the dress. It wasn’t because it was too tight. It was just because it was a cheap zipper.`,
                media: 1
              },
              {
                author: 8,
                stars: 4,
                isVerified: true,
                title: 'Cute dress but color doesn’t match and shows lots of cleavage!',
                content: `I ordered the red color and the photo looked a bit more purple-red which I would’ve preferred, the dress came more red red and it’s not bad just doesn’t match the pic! It is quite low cut so if you don’t like to show cleavage this is not the dress for you and the only bra I could wear with this is an adhesive strapless/backless bra.

                The fit is good, I ordered an XL and I wear a size 12 jeans normally and I am 5’6 and the dress isn’t too short but not too long either it’s a great length on me`,
                media: 1
              }
            ]
          }
        ]
      }
    ]
  }
}
