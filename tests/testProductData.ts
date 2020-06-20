import { ProductCreateInput } from '../src/types'

export const products: Omit<ProductCreateInput, 'categoryID' | 'vendorID' | 'groupID'>[] = [
  {
    title: 'Acer Aspire Z24-890-UA91 AIO Desktop, 23.8 inches Full HD, 9th Gen Intel Core i5-9400T, 12GB DDR4, 512GB SSD, 802.11ac Wifi, USB 3.1 Type C, Wireless Keyboard and Mouse, Windows 10 Home, Silver',
    listPrice: 79999,
    price: 68615,
    description: '9th Generation Intel Core i5 9400T Processor (Up to 3.4GHz)\n23.8 inches Full HD (1920 x 1080) widescreen Edge to Edge LED Back lit Display\n12GB DDR4 Memory, 512GB SSD & 8x DVD Writer Double Layer Drive (DVD RW)\n802.11ac Wi Fi, Gigabit Ethernet LAN & Bluetooth 4.2LE\n2 Built in 2W Stereo Speakers| Built in 2.0MP Full HD (1080P) Webcam, Wireless Keyboard and Mouse, Windows 10 Home',
    brandSection: 'A Modern Design for...',
    stock: 21,
    isAvailable: true,
    variants: [
      { name: 'Style', value: 'No Touch Screen' },
      { name: 'Size', value: '12GB / 512GB SSD' }
    ],
    parameters: [
      { name: 'Screen Size', value: '23.8' },
      { name: 'Processor', value: '3.4 GHz Intel Core i5' },
      { name: 'RAM', value: '12 GB DDR4' },
      { name: 'Hard Drive', value: '512 GB Flash Memory Solid State' },
      { name: 'Card Description', value: 'Integrated' },
      { name: 'Graphics Card Ram Size', value: '0.1' },
      { name: 'Wireless Type', value: '802.11ab' },
      { name: 'Number of USB 2.0 Ports', value: '1' },
      { name: 'Number of USB 3.0 Ports', value: '4' },
      { name: 'Brand Name', value: 'Acer' },
      { name: 'Series', value: 'Z24-890-UA91' },
      { name: 'Product model number', value: 'Z24-890-UA91' },
      { name: 'Operating System', value: 'Windows 10 Home' },
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
    ]
  }
]
