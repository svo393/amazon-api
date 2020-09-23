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
    Acer: {
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
    }
  }
}
