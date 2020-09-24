export const initialUsers = [
  {
    email: 'bob@example.com',
    password: '0q7#Wy#WHyKX',
    name: 'Bob Smith',
    avatar: true,
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
    email: 'alice@example.com',
    password: '8I&o9FSv%VrU',
    name: 'Alice',
    avatar: true,
    info: 'Wife... & Mother of 3. Love Shopping ( mainly on Amazon!) and Crafting. Addicted to my Cricut, Home Renovation shows and my kiddos.'
  },
  {
    email: 'john@example.com',
    password: 'VgJ48q&8%^Dm',
    name: 'Jools',
    address: {
      country: 'United States',
      fullName: 'Jools Willow',
      streetAddressLine1: '12XC2+MJ',
      city: 'Jersey City',
      region: 'New Jersey',
      postalCode: 154898,
      phoneNumber: '01487755568'
    }
  },
  {
    email: 'mary@example.com',
    password: 'p2&MR5w$Z7pF',
    name: 'Marette',
    avatar: true,
    info: 'I run a home-based business. I don\'t have time to go to the store all the time so I shop on amazon. We donate a lot to our local animal shelter and help with fundraisers, so we are always in need of giveaways. Amazon is always our go-to for all our home, office needs, donation needs. Please do not contact me for doing reviews. I do reviews on what I purchase already.'
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
            author: 'todo',
            content: 'Is this a good computer for working with Photoshop and Manga Studio?',
            answers: [
              {
                author: 'todo',
                content: 'I haven\'t used Manga Studio, but I use it with Photoshop CS and it works well. I\'m guessing, if it works with PS it should work with MS.'
              }
            ]
          },
          {
            author: 'todo',
            content: 'Does the mouse comes with the receiver cant get it to work?',
            answers: [
              {
                author: 'todo',
                content: 'The dongle for the wireless mouse is located inside the battery compartment. If you still cannot locate the dongle, please contact Acer support at 866-695-2237.'
              },
              {
                author: 'todo',
                content: 'The mouse\'s receiver is actually inserted for you in the back. Just put in the batteries, turn the power bar over and you are good to go. There is a slot inside the mouse\'s cover to insert the receiver should you change mouses.'
              },
              {
                author: 'todo',
                content: 'The above English sentence makes no sense'
              },
              {
                author: 'todo',
                content: 'Do you actually expect someone to answer that question?? Correct English might get an answer.'
              }
            ]
          },
          {
            author: 'todo',
            content: 'Would this be good for light gaming? like if i just wanted to play world of warcraft?',
            answers: [
              {
                author: 'todo',
                content: 'I play many games with ease. The colors are fabulous.'
              },
              {
                author: 'todo',
                content: 'It is very fast if you get the version with the electronic hard drive and screen is big and very bright'
              }
            ]
          },
          {
            author: 'todo',
            content: 'Can more memory be added?',
            answers: [
              {
                author: 'todo',
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
                    author: 'todo',
                    content: 'Does the HDMI-In works, if Z24 is turned off? I don\'t want to turn it on every time I want to use Fire stick! My old Acer Z3 615 can be used as monitor in offline mode. '
                  }
                ]
              },
              {
                author: 'todo',
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
                author: 'todo',
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
                author: 'todo',
                stars: 3,
                isVerified: true,
                title: 'Terrible keyboard',
                content: 'The. Keyboard guy came with this computer is for a five-year-old child. Your size of the keys makes it difficult To hit only one key at a time. Worst keyboard I’ve ever seen I will now have to go out and get a new keyboard to use. I hope the rest of the computer doesn’t have any other surprises',
                media: 0,
                comments: [
                  {
                    author: 'todo',
                    content: 'how do you like the computer though?'
                  },
                  {
                    author: 'todo',
                    content: 'It came with a keyboard guy?'
                  },
                  {
                    author: 'todo',
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
                author: 'todo',
                stars: 3,
                isVerified: false,
                title: 'Feeling Misled',
                content: `I trade options so I should have gotten a multi-core processor anyways but the specs are showing 1.8GHz on my computer and it is advertised at 3.4GHz. I'm having slow processing issues that I probably wouldn't be experiencing with a 3.4GHz processor.

              Overall I still like the computer. Do yourself a favor and make sure you get an ssd hard drive. That's a must for an all in one computer like this.`,
                media: 0,
                comments: [
                  {
                    author: 'todo',
                    content: 'does this tilt the screen? '
                  },
                  {
                    author: 'todo',
                    content: 'The screen tilts, but cannot swivel.',
                    replyTo: 0
                  }
                ]
              },
              {
                author: 'todo',
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
            author: 'todo',
            content: 'cd/dvd? Sd card?',
            answers: [
              {
                author: 'todo',
                content: 'no'
              }
            ]
          },
          {
            author: 'todo',
            content: 'does it have a camera?',
            answers: [
              {
                author: 'todo',
                content: 'Yes, it has a camera.'
              }
            ]
          },
          {
            author: 'todo',
            content: 'can you add speakers if you want better sound ',
            answers: [
              {
                author: 'todo',
                content: 'Yes, i have a sound bar hooked up'
              }
            ]
          },
          {
            author: 'todo',
            content: 'Does this have a glossy or matte screen? ',
            answers: [
              {
                author: 'todo',
                content: 'NO TOUCH SCREEN... I had to send back.. I felt like it was opened as well, it had Firefox loaded, which is NOT from Microsoft or Acer... I think it was Matte'
              },
              {
                author: 'todo',
                content: 'Matte screen.'
              }
            ]
          },
          {
            author: 'todo',
            content: 'Does this have speakers?',
            answers: [
              {
                author: 'todo',
                content: 'You can hear sound but it’s minimal.'
              }
            ]
          },
          {
            author: 'todo',
            content: 'Is this a touch screen?',
            answers: [
              {
                author: 'todo',
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
                author: 'todo',
                stars: 5,
                isVerified: false,
                title: 'Excellent Fast All-in-One computer',
                content: 'WOW - this is fast, it’s All in One, so no “box” on the floor or where ever you stick yours. Looks nice on the desk top. Excellent image clarity - easy control screen options. Good sound - but if you like great sound to go with great picture you may want to add some USB connected speakers.',
                media: 0,
                comments: [
                  {
                    author: 'todo',
                    content: 'does this tilt the screen?'
                  }
                ]
              },
              {
                author: 'todo',
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
                author: 'todo',
                stars: 5,
                isVerified: true,
                title: 'Nice color and design, decent performance, current CPU and plenty fast.',
                content: 'These are solid AIO PCs with near-current Intel CPUs (8th-Gen) from 2018 and plenty of HD space and adequate RAM (8GB would be better, but it\'s a cheap upgrade later). The image is misleading - these are the current model 22-c0073w with the slim bezel and different stand made of metal). The serenity mint color is a pleasing break from gray and black and not as stark as white. I like it. Bought two of these for my small office in a strip mall and they work perfectly for the slim size and overall performance (it will take more than half a day to get to the current Windows 10 release 1903, though with all the updates). Can\'t believe these were being sold for $199 as "like new" because they look brand new and the plastic was still on both keyboards and mice (and this exact model sells at Wal-Mart for $399!). These literally look brand new. For $400 I have outfitted my office with all the PC power needed with a terabyte of disk space and access to OneDrive that syncs with my iPhone. Bargain city and fast shipping by the seller! ',
                media: 1
              },
              {
                author: 'todo',
                stars: 1,
                isVerified: true,
                title: 'Sent wrong color',
                content: 'The only reason I’m leaving one star is because when ordering it said the color was mint. I really wanted that color. When computer arrived it was white. I couldn’t send back because I needed the computer. So far it’s been good just really wanted mint green. It was the main reason I ordered this computer.',
                media: 0
              },
              {
                author: 'todo',
                stars: 2,
                isVerified: true,
                title: 'Happy Customer for two months',
                content: 'The computer is different from what is listed but it came like new even though it is, "used-very good" it was so much better than that. I am upgrading the memory and making it faster but its great for this Grad school student who works full time and needed a station in the house.Until it was time to work from home completely, just stopped working',
                media: 0
              },
              {
                author: 'todo',
                stars: 1,
                isVerified: true,
                title: 'Customer service, and they sucked this time.',
                content: 'I loved the computer I was disappointed with Amazon who would not exchange a damaged product they have always replaced products but I guess they didn\'t want to match the special price they rather disappoint a loyal customer instead. Very very disappointed customer.',
                media: 0
              },
              {
                author: 'todo',
                stars: 5,
                isVerified: true,
                title: 'Great looking and gets the job done!',
                content: 'Had to upgrade from windows 7 to windows 10. This computer was a good choice.',
                media: 0
              },
              {
                author: 'todo',
                stars: 4,
                isVerified: true,
                title: 'Wrong Color/picture on amazon',
                content: 'I love the computer itself, it is just when I ordered it the main reason I ordered it was because it was mint green. I also believe that the picture that it shows is the wrong picture for this device, it looks nothing like what I got. All together, a great computer, well worth the money!!!!',
                media: 0
              },
              {
                author: 'todo',
                stars: 5,
                isVerified: true,
                title: 'Very nice',
                content: 'Just great p.c.',
                media: 0
              },
              {
                author: 'todo',
                stars: 5,
                isVerified: true,
                title: 'Great Buy',
                content: 'No real directions but I figured it out. It\'s a great product for a great value. Came in the white color, the screen is perfect. It is a great addition to my room.',
                media: 0
              },
              {
                author: 'todo',
                stars: 3,
                isVerified: true,
                title: 'Screen',
                content: 'I do not like the fact that when I walk away from the screen for a few minutes, my page leaves; and I have log on again with my password.',
                media: 0
              },
              {
                author: 'todo',
                stars: 5,
                isVerified: true,
                title: 'Work good',
                content: 'I live it is slow but overall great computer...',
                media: 0
              },
              {
                author: 'todo',
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
            author: 'todo',
            content: 'Does this have a dvd player in it?',
            answers: [
              {
                author: 'todo',
                content: 'Yes'
              }
            ]
          },
          {
            author: 'todo',
            content: 'Is this pc strong enough to run Quickbooks?',
            answers: [
              {
                author: 'todo',
                content: 'Yes it is like many computers the more you add the slower it will get unless you add more RAM or buy a computer with faster processing. One user on quick books is fine 2 users you’ll need at least 2.5 Ghz.'
              }
            ]
          },
          {
            author: 'todo',
            content: 'Can any printer be hooked up to this?',
            answers: [
              {
                author: 'todo',
                content: 'I believe any printer can be hooked up to any all in one, When you go to hook it up and search for your printer if it doesn’t come up you just type it in'
              }
            ]
          },
          {
            author: 'todo',
            content: 'Does it have a built in webcam?',
            answers: [
              {
                author: 'todo',
                content: 'Yes. Worth to buy!'
              },
              {
                author: 'todo',
                content: 'Yes, it does'
              },
              {
                author: 'todo',
                content: 'Yes'
              }
            ]
          },
          {
            author: 'todo',
            content: 'Does it need a computer tower?',
            answers: [
              {
                author: 'todo',
                content: 'No, everything is built into the monitor, including a disk drive.'
              },
              {
                author: 'todo',
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
                author: 'todo',
                stars: 5,
                isVerified: true,
                title: 'Cool',
                content: 'The screen has damage in the top left corner. I\'ve only had my computer for three days. Right now no problems other than the damage to the screen.',
                media: 1
              },
              {
                author: 'todo',
                stars: 5,
                isVerified: true,
                title: 'Happy customer',
                content: 'Luv this pc.....it does so much.....great purchase...',
                media: 4
              },
              {
                author: 'todo',
                stars: 3,
                isVerified: true,
                title: 'Decent, but not great.',
                content: 'The computer is very slow and doesn\'t have a touch screen. My son has been using it for school and games and is constantly frustrated with it. It looks beautiful and is mostly functional. I should have saved up more to buy a better computer.',
                media: 4
              }
            ]
          }
        ]
      },
      {
        questions: [
          {
            author: 'todo',
            content: 'Can i install google play games on this pc? buying for my father and trying to see if golf master 3d can be put on it for him.',
            answers: [
              {
                author: 'todo',
                content: 'You cannot install games from the Google Play Store on this computer. This computer has Windows 10 Home. You may want to look at an HP Chromebook. The most current HP Chromebooks do have the Google Play Store installed.'
              },
              {
                author: 'todo',
                content: `I think any video game will play as long as the video card is powerful enough.
                this computer is not a gaming computer but a simple and cheap web surfing and office software computer.`
              },
              {
                author: 'todo',
                content: 'On the bottom of the screen left side. Is a spot where you can write questions in. I asked and the answers come up with instructions. How do I install it ..........'
              }
            ]
          },
          {
            author: 'todo',
            content: 'Has anyone used this pc for streaming movies & tv show’s ?.',
            answers: [
              {
                author: 'todo',
                content: 'I’ve watched Netflix on it and my son watches YouTube videos on it all the time. Works great. Never had any issues.'
              },
              {
                author: 'todo',
                content: ' no '
              }
            ]
          },
          {
            author: 'todo',
            content: 'im looking for a computer to use for work as i am currently looking for work at home jobs. Does this support most softwares?',
            answers: [
              {
                author: 'todo',
                content: 'This is a basic computer which can handle basic duties like surfing the internet. A computer with the Intel i5 or Ryzen 5 processor or better with 8 gigabytes of RAM can handle more programs.'
              },
              {
                author: 'todo',
                content: `Yes this computer is more than I expected
                It's a lot easier to get used to an its faster, than my other computer`
              }
            ]
          },
          {
            author: 'todo',
            content: 'Does it come with adobe flash?',
            answers: [
              {
                author: 'todo',
                content: 'Adobe Flash can be downloaded for free.'
              },
              {
                author: 'todo',
                content: 'No'
              }
            ]
          },
          {
            author: 'todo',
            content: 'Is it touchscrean',
            answers: [
              {
                author: 'todo',
                content: 'It is not.'
              },
              {
                author: 'todo',
                content: 'Unfortunately, it is not.'
              }
            ]
          },
          {
            author: 'todo',
            content: 'I’m not seeing an option for a warranty. Is there one available?',
            answers: [
              {
                author: 'todo',
                content: 'not sure'
              }
            ]
          },
          {
            author: 'todo',
            content: 'How wide or big is the stand?',
            answers: [
              {
                author: 'todo',
                content: 'The stand is actually just two thick, bent, wires so the footprint is not much thicker than the computer itself.'
              }
            ]
          },
          {
            author: 'todo',
            content: 'looking for a power cord',
            answers: [
              {
                author: 'todo',
                content: 'If you need a replacement AC adapter, here is the part number: L56998-800 and for the power cord: 213349-009. You should have gotten one in the box.'
              },
              {
                author: 'todo',
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
                author: 'todo',
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
                    author: 'todo',
                    content: 'So just hooking it up to ethernet made things better? I\'m on the hunt for a new computer and use multiple tabs constantly so this might be worth a try since I did notice slightly faster speeds hooking ethernet up to my laptop '
                  },
                  {
                    author: 'todo',
                    content: 'Have you tried it without being hooked up directly to the ethernet? I have high speed wireless, and I\'m a little hesitant to get this if I\'m not going to hook it up directly. I\'d love to hear your thoughts. '
                  },
                  {
                    author: 'todo',
                    content: 'Thanks for the detailed review! Loved the picture from Belem in Portugal. I visited there last year and it brought back fond memories!'
                  },
                  {
                    author: 'todo',
                    content: 'i think this is a great computer also...i didnt order it from amazon i got it from wal-mart for $399 and i\'m looking into getting another one for my son , we are tired of laptops LOL....i\'m really enjoying this'
                  }
                ]
              },
              {
                author: 'todo',
                stars: 1,
                isVerified: false,
                title: 'SLOW!!',
                content: 'Nice looking machine, but sooooo slow!!! Takes many, many minutes to load a page, unacceptable for a brand new computer. Not happy with it at all.',
                media: 1
              },
              {
                author: 'todo',
                stars: 3,
                isVerified: false,
                title: 'Very Stylish but Slow',
                content: 'I have been using this all-in-one computer for a few days now. It arrived perfectly in the box and setup was extremely easy. The computer itself is beautifully designed and stylish and the white color fits in very well. The screen is sleek and thin. The keyboard is wired and the keys are clunky and loud. I\'ll be purchasing a wireless soft/quiet key keyboard since I don\'t want everyone in the room hearing when I\'m typing. The downside to this computer is it is slow even for basic tasks. I\'m impatient and expect computers now to be responsive and not lag when multi-tasking. This computer does not multitask well even after uninstalling unnecessary programs. I have to End Task on several things that run in the background to help speed up the computer. It\'s a huge annoyance since even basic tasks like opening the email app and Google Chrome lag and going between apps there is a lag and programs are slow to open. If you\'re used to responsive computers, this one will test your patience, literally. If you\'re one who isn\'t impatient and doesn\'t mind waiting 30 seconds to a minute for things to open and run then this is a great computer that meets the basic needs. I love the design and how nicely it blends in with my home decor and doesn\'t stand out at all and isn\'t obtrusive and fits very nicely on my desk.',
                media: 1
              },
              {
                author: 'todo',
                stars: 4,
                isVerified: true,
                title: 'Home Office or Student is ok',
                content: 'It is a bit slow and you cannot have many open tabs,.',
                media: 0,
                comments: [
                  {
                    author: 'todo',
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
            media: 7,
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
                author: 'todo',
                stars: 5,
                isVerified: true,
                title: 'Perfect!',
                content: 'Love this all in one. Easy to set up and use. Camera and audio is great. Got it to work from home and I’m very pleased.',
                media: 0
              },
              {
                author: 'todo',
                stars: 5,
                isVerified: true,
                title: 'All-in-one compactness.',
                content: 'I am not computer smart, so I got my computer man to set-up and program whatever I needed, he was extremely complimentary.',
                media: 0
              },
              {
                author: 'todo',
                stars: 5,
                isVerified: true,
                title: 'Great PC gift for my mother',
                content: 'My mother mainly uses for Facebook, e-mails and some minor web searching',
                media: 0
              },
              {
                author: 'todo',
                stars: 5,
                isVerified: true,
                title: 'Great Gaming and Everyday Use.',
                content: 'Great product. I bought it for school and regular use. Good for everyday and gaming uses. Worth my money and is lasting long and still going fast.',
                media: 0
              },
              {
                author: 'todo',
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
  }
}
