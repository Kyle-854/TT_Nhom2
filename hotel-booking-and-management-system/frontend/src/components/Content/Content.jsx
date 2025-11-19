import React from 'react'
import HotelCard from './HotelCard'
import HotelDetails from './HotelDetails'
import { useState } from 'react'

const sampleHotels = [
  {
    "hotelId": 1,
    "name": "Vinpearl Resort & Spa Đà Nẵng",
    "slug": "vinpearl-da-nang",
    "description": "Khu nghỉ dưỡng cao cấp ven biển với hệ thống phòng & biệt thự sang trọng, nhiều tiện ích gồm spa, hồ bơi vô cực và nhà hàng quốc tế.",
    "address": "Đường Trường Sa, P. Phước Mỹ, Q. Sơn Trà, Đà Nẵng",
    "city": "Đà Nẵng",
    "country": "Việt Nam",
    "latitude": 16.0820,
    "longitude": 108.2810,
    "starRating": 5,
    "averageUserRating": 9.0,
    "reviewCount": 2560,
    "startingPrice": 2500000,
    "coverImageUrl": "https://dulichviet.com.vn/images/bandidau/DU%20L%E1%BB%8ACH%20T%E1%BB%B0%20CH%E1%BB%8CN%202019/VINPEARL/Vinpearl%20Resort%20%26%20Spa%20%C4%90%C3%A0%20N%E1%BA%B5ng/webp-net-resizeimage-77-1337432.jpg",
    "images": [
      {
        "url": "https://dulichviet.com.vn/images/bandidau/DU%20L%E1%BB%8ACH%20T%E1%BB%B0%20CH%E1%BB%8CN%202019/VINPEARL/Vinpearl%20Resort%20%26%20Spa%20%C4%90%C3%A0%20N%E1%BA%B5ng/webp-net-resizeimage-77-1337432.jpg",
        "altText": "Vinpearl Resort & Spa Đà Nẵng - view chính"
      }
    ],
    "amenities": [
      { "amenityId": 1, "name": "Free Wifi" },
      { "amenityId": 2, "name": "Hồ bơi ngoài trời" },
      { "amenityId": 3, "name": "Spa" },
      { "amenityId": 4, "name": "Nhà hàng" },
      { "amenityId": 5, "name": "Bãi đỗ xe" }
    ],
    "roomTypes": [
      {
        "roomTypeId": 101,
        "name": "Deluxe Sea View",
        "description": "Phòng Deluxe hướng biển với ban công rộng, giường king hoặc 2 giường đơn, phù hợp cặp đôi hoặc khách công tác.",
        "capacity": 2,
        "pricePerNight": 2500000,
        "images": [
          {
            "url": "https://dulichviet.com.vn/images/bandidau/DU%20L%E1%BB%8ACH%20T%E1%BB%B0%20CH%E1%BB%8CN%202019/VINPEARL/Vinpearl%20Resort%20%26%20Spa%20%C4%90%C3%A0%20N%E1%BA%B5ng/webp-net-resizeimage-77-1337432.jpg",
            "altText": "Deluxe Sea View - Vinpearl"
          }
        ],
        "amenities": [
          { "amenityId": 1, "name": "Free Wifi" },
          { "amenityId": 14, "name": "Ban công hướng biển" },
          { "amenityId": 15, "name": "TV truyền hình cáp" }
        ]
      },
      {
        "roomTypeId": 102,
        "name": "Premier Suite",
        "description": "Suite cao cấp với phòng khách riêng, view biển tuyệt đẹp, phòng tắm sang trọng và dịch vụ phòng 24/7.",
        "capacity": 3,
        "pricePerNight": 4800000,
        "images": [
          {
            "url": "https://dulichviet.com.vn/images/bandidau/DU%20L%E1%BB%8ACH%20T%E1%BB%B0%20CH%E1%BB%8CN%202019/VINPEARL/Vinpearl%20Resort%20%26%20Spa%20%C4%90%C3%A0%20N%E1%BA%B5ng/webp-net-resizeimage-77-1337432.jpg",
            "altText": "Premier Suite - Vinpearl"
          }
        ],
        "amenities": [
          { "amenityId": 3, "name": "Spa" },
          { "amenityId": 16, "name": "Dịch vụ phòng 24/7" },
          { "amenityId": 17, "name": "Mini bar" }
        ]
      },
      {
        "roomTypeId": 103,
        "name": "Family Villa",
        "description": "Biệt thự gia đình nhiều phòng ngủ, bếp nhỏ, sân vườn riêng, phù hợp nhóm/ gia đình lớn.",
        "capacity": 5,
        "pricePerNight": 9000000,
        "images": [
          {
            "url": "https://dulichviet.com.vn/images/bandidau/DU%20L%E1%BB%8ACH%20T%E1%BB%B0%20CH%E1%BB%8CN%202019/VINPEARL/Vinpearl%20Resort%20%26%20Spa%20%C4%90%C3%A0%20N%E1%BA%B5ng/webp-net-resizeimage-77-1337432.jpg",
            "altText": "Family Villa - Vinpearl"
          }
        ],
        "amenities": [
          { "amenityId": 18, "name": "Bếp nhỏ" },
          { "amenityId": 19, "name": "Sân vườn riêng" },
          { "amenityId": 5, "name": "Bãi đỗ xe" }
        ]
      }
    ]
  },
  {
    "hotelId": 2,
    "name": "Khách Sạn Mường Thanh Hội An",
    "slug": "muong-thanh-hoi-an",
    "description": "Khách sạn 4 sao tiện nghi, vị trí gần phố cổ Hội An, phù hợp cho du khách tham quan và nghỉ dưỡng.",
    "address": "Số 10, Đường Trần Phú, Phường Minh An, Hội An",
    "city": "Hội An",
    "country": "Việt Nam",
    "latitude": 15.8780,
    "longitude": 108.3330,
    "starRating": 4,
    "averageUserRating": 7.2,
    "reviewCount": 430,
    "startingPrice": 1200000,
    "coverImageUrl": "https://ticotravel.com.vn/wp-content/uploads/2022/04/Khach-san-Muong-Thanh-Hoi-An-1.jpg",
    "images": [
      {
        "url": "https://ticotravel.com.vn/wp-content/uploads/2022/04/Khach-san-Muong-Thanh-Hoi-An-1.jpg",
        "altText": "Khách Sạn Mường Thanh Hội An - mặt tiền"
      }
    ],
    "amenities": [
      { "amenityId": 1, "name": "Free Wifi" },
      { "amenityId": 6, "name": "Lễ tân 24/7" },
      { "amenityId": 7, "name": "Dịch vụ giặt ủi" },
      { "amenityId": 5, "name": "Bãi đỗ xe" }
    ],
    "roomTypes": [
      {
        "roomTypeId": 201,
        "name": "Standard Double",
        "description": "Phòng tiêu chuẩn cho 2 khách, giường đôi, tiện nghi cơ bản, phù hợp khách du lịch tiết kiệm.",
        "capacity": 2,
        "pricePerNight": 1200000,
        "images": [
          {
            "url": "https://ticotravel.com.vn/wp-content/uploads/2022/04/Khach-san-Muong-Thanh-Hoi-An-1.jpg",
            "altText": "Standard Double - Mường Thanh Hội An"
          }
        ],
        "amenities": [
          { "amenityId": 1, "name": "Free Wifi" },
          { "amenityId": 20, "name": "Điều hòa" }
        ]
      },
      {
        "roomTypeId": 202,
        "name": "Superior Twin",
        "description": "Phòng Superior 2 giường đơn, diện tích rộng hơn, có bàn làm việc và view thành phố.",
        "capacity": 2,
        "pricePerNight": 1400000,
        "images": [
          {
            "url": "https://ticotravel.com.vn/wp-content/uploads/2022/04/Khach-san-Muong-Thanh-Hoi-An-1.jpg",
            "altText": "Superior Twin - Mường Thanh Hội An"
          }
        ],
        "amenities": [
          { "amenityId": 1, "name": "Free Wifi" },
          { "amenityId": 21, "name": "Bàn làm việc" }
        ]
      }
    ]
  },
  {
    "hotelId": 3,
    "name": "InterContinental Đà Nẵng Sun Peninsula Resort",
    "slug": "intercontinental-danang-sun-peninsula",
    "description": "Resort sang trọng nằm trên bán đảo Sơn Trà với kiến trúc độc đáo, dịch vụ 6 sao, spa và ẩm thực cao cấp.",
    "address": "Bán đảo Sơn Trà, Khê Mỹ, Ngũ Hành Sơn, Đà Nẵng",
    "city": "Đà Nẵng",
    "country": "Việt Nam",
    "latitude": 16.0945,
    "longitude": 108.2497,
    "starRating": 5,
    "averageUserRating": 9.5,
    "reviewCount": 3400,
    "startingPrice": 6000000,
    "coverImageUrl": "https://diemdenantoan.sgtiepthi.vn/wp-content/uploads/2021/09/intercontinental-danang-5630627675-2x1-1.jpg",
    "images": [
      {
        "url": "https://diemdenantoan.sgtiepthi.vn/wp-content/uploads/2021/09/intercontinental-danang-5630627675-2x1-1.jpg",
        "altText": "InterContinental Đà Nẵng - toàn cảnh"
      }
    ],
    "amenities": [
      { "amenityId": 1, "name": "Free Wifi" },
      { "amenityId": 2, "name": "Hồ bơi vô cực" },
      { "amenityId": 3, "name": "Spa & Wellness" },
      { "amenityId": 8, "name": "Sân golf gần đó" },
      { "amenityId": 4, "name": "Nhà hàng cao cấp" }
    ],
    "roomTypes": [
      {
        "roomTypeId": 301,
        "name": "Sea View Suite",
        "description": "Suite cao cấp nhìn ra biển, phòng khách riêng, phòng tắm đá cẩm thạch, phục vụ VIP.",
        "capacity": 2,
        "pricePerNight": 6000000,
        "images": [
          {
            "url": "https://diemdenantoan.sgtiepthi.vn/wp-content/uploads/2021/09/intercontinental-danang-5630627675-2x1-1.jpg",
            "altText": "Sea View Suite - InterContinental"
          }
        ],
        "amenities": [
          { "amenityId": 16, "name": "Dịch vụ phòng 24/7" },
          { "amenityId": 3, "name": "Spa & Wellness" },
          { "amenityId": 22, "name": "Butler service" }
        ]
      },
      {
        "roomTypeId": 302,
        "name": "Ocean Villa",
        "description": "Villa riêng với hồ bơi nhỏ, sân hiên lớn, thích hợp khách muốn không gian riêng tư cao cấp.",
        "capacity": 4,
        "pricePerNight": 12500000,
        "images": [
          {
            "url": "https://diemdenantoan.sgtiepthi.vn/wp-content/uploads/2021/09/intercontinental-danang-5630627675-2x1-1.jpg",
            "altText": "Ocean Villa - InterContinental"
          }
        ],
        "amenities": [
          { "amenityId": 19, "name": "Sân vườn riêng" },
          { "amenityId": 18, "name": "Bếp nhỏ" },
          { "amenityId": 22, "name": "Butler service" }
        ]
      }
    ]
  },
  {
    "hotelId": 4,
    "name": "Crowne Plaza Đà Nẵng City Centre",
    "slug": "crowne-plaza-danang-city-centre",
    "description": "Khách sạn 5 sao nằm ngay trung tâm thành phố Đà Nẵng, thuận tiện cho công tác và du lịch, có phòng hội thảo lớn.",
    "address": "125 Trần Phú, Quận Hải Châu, Đà Nẵng",
    "city": "Đà Nẵng",
    "country": "Việt Nam",
    "latitude": 16.0678,
    "longitude": 108.2208,
    "starRating": 5,
    "averageUserRating": 9.1,
    "reviewCount": 1870,
    "startingPrice": 3000000,
    "coverImageUrl": "https://q-xx.bstatic.com/xdata/images/hotel/max500/480127951.jpg?k=18eff6478b28a5e23075843911d86e6e3769d9f57090904683ee0c367381751c&o=",
    "images": [
      {
        "url": "https://q-xx.bstatic.com/xdata/images/hotel/max500/480127951.jpg?k=18eff6478b28a5e23075843911d86e6e3769d9f57090904683ee0c367381751c&o=",
        "altText": "Crowne Plaza Đà Nẵng - mặt tiền"
      }
    ],
    "amenities": [
      { "amenityId": 1, "name": "Free Wifi" },
      { "amenityId": 9, "name": "Phòng họp & Sự kiện" },
      { "amenityId": 4, "name": "Nhà hàng" },
      { "amenityId": 2, "name": "Hồ bơi" }
    ],
    "roomTypes": [
      {
        "roomTypeId": 401,
        "name": "Standard King",
        "description": "Phòng tiêu chuẩn dành cho doanh nhân, giường king, bàn làm việc, truy cập Internet tốc độ cao.",
        "capacity": 2,
        "pricePerNight": 3000000,
        "images": [
          {
            "url": "https://q-xx.bstatic.com/xdata/images/hotel/max500/480127951.jpg?k=18eff6478b28a5e23075843911d86e6e3769d9f57090904683ee0c367381751c&o=",
            "altText": "Standard King - Crowne Plaza"
          }
        ],
        "amenities": [
          { "amenityId": 1, "name": "Free Wifi" },
          { "amenityId": 21, "name": "Bàn làm việc" },
          { "amenityId": 23, "name": "Dịch vụ in ấn" }
        ]
      },
      {
        "roomTypeId": 402,
        "name": "Executive Suite",
        "description": "Suite dành cho doanh nhân với khu vực tiếp khách, minibar và view thành phố.",
        "capacity": 3,
        "pricePerNight": 5200000,
        "images": [
          {
            "url": "https://q-xx.bstatic.com/xdata/images/hotel/max500/480127951.jpg?k=18eff6478b28a5e23075843911d86e6e3769d9f57090904683ee0c367381751c&o=",
            "altText": "Executive Suite - Crowne Plaza"
          }
        ],
        "amenities": [
          { "amenityId": 16, "name": "Dịch vụ phòng 24/7" },
          { "amenityId": 21, "name": "Bàn làm việc" },
          { "amenityId": 24, "name": "Két an toàn" }
        ]
      }
    ]
  },
  {
    "hotelId": 5,
    "name": "Melia Vinpearl Đà Nẵng Riverfront",
    "slug": "melia-vinpearl-danang-riverfront",
    "description": "Khách sạn cao cấp nằm bên sông Hàn, thiết kế hiện đại, phù hợp cho du lịch và hội họp.",
    "address": "Số 2, Bến Bạch Đằng, Quận Hải Châu, Đà Nẵng",
    "city": "Đà Nẵng",
    "country": "Việt Nam",
    "latitude": 16.0715,
    "longitude": 108.2200,
    "starRating": 5,
    "averageUserRating": 8.9,
    "reviewCount": 980,
    "startingPrice": 2800000,
    "coverImageUrl": "https://onlinebooking.vn/wp-content/uploads/Melia-Vinpearl-Danang-Riverfront-3.jpg",
    "images": [
      {
        "url": "https://onlinebooking.vn/wp-content/uploads/Melia-Vinpearl-Danang-Riverfront-3.jpg",
        "altText": "Melia Vinpearl Đà Nẵng Riverfront - view sông"
      }
    ],
    "amenities": [
      { "amenityId": 1, "name": "Free Wifi" },
      { "amenityId": 4, "name": "Nhà hàng" },
      { "amenityId": 2, "name": "Hồ bơi" },
      { "amenityId": 10, "name": "Dịch vụ đưa đón sân bay" }
    ],
    "roomTypes": [
      {
        "roomTypeId": 501,
        "name": "Riverside Deluxe",
        "description": "Phòng Deluxe hướng sông, nội thất hiện đại, cửa sổ lớn nhìn ra sông Hàn.",
        "capacity": 2,
        "pricePerNight": 2800000,
        "images": [
          {
            "url": "https://onlinebooking.vn/wp-content/uploads/Melia-Vinpearl-Danang-Riverfront-3.jpg",
            "altText": "Riverside Deluxe - Melia"
          }
        ],
        "amenities": [
          { "amenityId": 1, "name": "Free Wifi" },
          { "amenityId": 14, "name": "Ban công" }
        ]
      },
      {
        "roomTypeId": 502,
        "name": "Melia Suite",
        "description": "Suite sang trọng với phòng khách riêng, phù hợp cho khách công tác cao cấp hoặc cặp đôi muốn tiện nghi.",
        "capacity": 3,
        "pricePerNight": 5200000,
        "images": [
          {
            "url": "https://onlinebooking.vn/wp-content/uploads/Melia-Vinpearl-Danang-Riverfront-3.jpg",
            "altText": "Melia Suite - Melia Vinpearl"
          }
        ],
        "amenities": [
          { "amenityId": 16, "name": "Dịch vụ phòng 24/7" },
          { "amenityId": 17, "name": "Mini bar" }
        ]
      }
    ]
  },
  {
    "hotelId": 6,
    "name": "La Siesta Hội An Resort & Spa",
    "slug": "la-siesta-hoi-an-resort-spa",
    "description": "Khu nghỉ dưỡng boutique ở gần trung tâm Hội An, nổi bật với phong cách thiết kế truyền thống pha hiện đại và dịch vụ spa chất lượng.",
    "address": "Số 1, Đường Cửa Đại, Phường Cẩm Châu, Hội An",
    "city": "Hội An",
    "country": "Việt Nam",
    "latitude": 15.8831,
    "longitude": 108.3353,
    "starRating": 4,
    "averageUserRating": 9.8,
    "reviewCount": 1420,
    "startingPrice": 2200000,
    "coverImageUrl": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/22/23/81/new-wing-a-luxurious.jpg?w=900&h=500&s=1",
    "images": [
      {
        "url": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/22/23/81/new-wing-a-luxurious.jpg?w=900&h=500&s=1",
        "altText": "La Siesta Hội An Resort & Spa - hồ bơi"
      }
    ],
    "amenities": [
      { "amenityId": 1, "name": "Free Wifi" },
      { "amenityId": 3, "name": "Spa" },
      { "amenityId": 2, "name": "Hồ bơi" },
      { "amenityId": 11, "name": "Thuê xe đạp" }
    ],
    "roomTypes": [
      {
        "roomTypeId": 601,
        "name": "Deluxe Garden View",
        "description": "Phòng hướng vườn với không gian yên tĩnh, trang bị tiện nghi cao cấp và ban công nhìn ra khu vườn.",
        "capacity": 2,
        "pricePerNight": 2200000,
        "images": [
          {
            "url": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/22/23/81/new-wing-a-luxurious.jpg?w=900&h=500&s=1",
            "altText": "Deluxe Garden View - La Siesta"
          }
        ],
        "amenities": [
          { "amenityId": 1, "name": "Free Wifi" },
          { "amenityId": 14, "name": "Ban công hướng vườn" }
        ]
      },
      {
        "roomTypeId": 602,
        "name": "Family Suite",
        "description": "Suite cho gia đình gồm phòng ngủ chính và phòng khách tách biệt, phù hợp nhóm 3-4 người.",
        "capacity": 4,
        "pricePerNight": 3600000,
        "images": [
          {
            "url": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/22/23/81/new-wing-a-luxurious.jpg?w=900&h=500&s=1",
            "altText": "Family Suite - La Siesta"
          }
        ],
        "amenities": [
          { "amenityId": 18, "name": "Bếp nhỏ" },
          { "amenityId": 3, "name": "Spa" }
        ]
      }
    ]
  },
  {
    "hotelId": 7,
    "name": "RiverTown Hội An Resort & Spa",
    "slug": "rivertown-hoi-an-resort-spa",
    "description": "Resort ven sông mang phong cách thanh lịch, có nhiều tiện ích gia đình và dịch vụ đưa đón di tích phố cổ.",
    "address": "Khu phố ven sông, Phường Sơn Phong, Hội An",
    "city": "Hội An",
    "country": "Việt Nam",
    "latitude": 15.8820,
    "longitude": 108.3335,
    "starRating": 4,
    "averageUserRating": 8.5,
    "reviewCount": 610,
    "startingPrice": 1800000,
    "coverImageUrl": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/89/da/5d/getlstd-property-photo.jpg?w=800&h=500&s=1",
    "images": [
      {
        "url": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/89/da/5d/getlstd-property-photo.jpg?w=800&h=500&s=1",
        "altText": "RiverTown Hội An Resort & Spa - nhìn từ sông"
      }
    ],
    "amenities": [
      { "amenityId": 1, "name": "Free Wifi" },
      { "amenityId": 2, "name": "Hồ bơi" },
      { "amenityId": 12, "name": "Dịch vụ tour" },
      { "amenityId": 4, "name": "Nhà hàng" }
    ],
    "roomTypes": [
      {
        "roomTypeId": 701,
        "name": "Standard River View",
        "description": "Phòng tiêu chuẩn hướng sông, nội thất ấm cúng, ban công nhỏ nhìn ra bờ sông.",
        "capacity": 2,
        "pricePerNight": 1800000,
        "images": [
          {
            "url": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/89/da/5d/getlstd-property-photo.jpg?w=800&h=500&s=1",
            "altText": "Standard River View - RiverTown"
          }
        ],
        "amenities": [
          { "amenityId": 1, "name": "Free Wifi" },
          { "amenityId": 14, "name": "Ban công" }
        ]
      },
      {
        "roomTypeId": 702,
        "name": "Family Room",
        "description": "Phòng gia đình rộng rãi với giường phụ hoặc giường extra, phù hợp gia đình 3-4 người.",
        "capacity": 4,
        "pricePerNight": 2600000,
        "images": [
          {
            "url": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/89/da/5d/getlstd-property-photo.jpg?w=800&h=500&s=1",
            "altText": "Family Room - RiverTown"
          }
        ],
        "amenities": [
          { "amenityId": 11, "name": "Thuê xe đạp" },
          { "amenityId": 7, "name": "Dịch vụ giặt ủi" }
        ]
      }
    ]
  },
  {
    "hotelId": 8,
    "name": "Wyndham Garden Hội An Cửa Đại Beach",
    "slug": "wyndham-garden-hoi-an-cua-dai",
    "description": "Khách sạn biển cao cấp tại Cửa Đại, nổi bật với bãi biển riêng, phù hợp cho kỳ nghỉ gia đình và cặp đôi.",
    "address": "Cửa Đại, Xã Cẩm Thanh, Hội An",
    "city": "Hội An",
    "country": "Việt Nam",
    "latitude": 15.9150,
    "longitude": 108.3460,
    "starRating": 5,
    "averageUserRating": 8.8,
    "reviewCount": 1240,
    "startingPrice": 2500000,
    "coverImageUrl": "https://q-xx.bstatic.com/xdata/images/hotel/max500/495720737.jpg?k=e45e57c57b709cc5306d1c2b55e2313e46ed3300d2bfe11d43aa8df9faac3956&o=",
    "images": [
      {
        "url": "https://q-xx.bstatic.com/xdata/images/hotel/max500/495720737.jpg?k=e45e57c57b709cc5306d1c2b55e2313e46ed3300d2bfe11d43aa8df9faac3956&o=",
        "altText": "Wyndham Garden Hội An Cửa Đại - mặt biển"
      }
    ],
    "amenities": [
      { "amenityId": 1, "name": "Free Wifi" },
      { "amenityId": 2, "name": "Hồ bơi" },
      { "amenityId": 13, "name": "Bãi biển riêng" },
      { "amenityId": 4, "name": "Nhà hàng" }
    ],
    "roomTypes": [
      {
        "roomTypeId": 801,
        "name": "Beachfront Deluxe",
        "description": "Phòng Deluxe hướng biển với ban công lớn, thiết kế hiện đại, phục vụ bữa sáng buffet hàng ngày.",
        "capacity": 2,
        "pricePerNight": 2500000,
        "images": [
          {
            "url": "https://q-xx.bstatic.com/xdata/images/hotel/max500/495720737.jpg?k=e45e57c57b709cc5306d1c2b55e2313e46ed3300d2bfe11d43aa8df9faac3956&o=",
            "altText": "Beachfront Deluxe - Wyndham Garden"
          }
        ],
        "amenities": [
          { "amenityId": 13, "name": "Bãi biển riêng" },
          { "amenityId": 1, "name": "Free Wifi" }
        ]
      },
      {
        "roomTypeId": 802,
        "name": "Family Beach Suite",
        "description": "Suite gia đình với 2 phòng ngủ, phù hợp nhóm 4 người muốn nghỉ dưỡng ven biển.",
        "capacity": 4,
        "pricePerNight": 4200000,
        "images": [
          {
            "url": "https://q-xx.bstatic.com/xdata/images/hotel/max500/495720737.jpg?k=e45e57c57b709cc5306d1c2b55e2313e46ed3300d2bfe11d43aa8df9faac3956&o=",
            "altText": "Family Beach Suite - Wyndham Garden"
          }
        ],
        "amenities": [
          { "amenityId": 13, "name": "Bãi biển riêng" },
          { "amenityId": 18, "name": "Bếp nhỏ" }
        ]
      }
    ]
  },
  {
    "hotelId": 9,
    "name": "Hoi An Golden Holiday Hotel & Spa",
    "slug": "hoi-an-golden-holiday-hotel-spa",
    "description": "Khách sạn 4 sao với vị trí thuận tiện, gần phố cổ, cung cấp dịch vụ spa và tiện nghi hiện đại cho du lịch ngắn ngày.",
    "address": "Số 5, Đường Bạch Đằng, Phường Minh An, Hội An",
    "city": "Hội An",
    "country": "Việt Nam",
    "latitude": 15.8795,
    "longitude": 108.3338,
    "starRating": 4,
    "averageUserRating": 8.2,
    "reviewCount": 540,
    "startingPrice": 1600000,
    "coverImageUrl": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/a2/0a/ba/caption.jpg?w=900&h=500&s=1",
    "images": [
      {
        "url": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/a2/0a/ba/caption.jpg?w=900&h=500&s=1",
        "altText": "Hoi An Golden Holiday Hotel & Spa - sảnh"
      }
    ],
    "amenities": [
      { "amenityId": 1, "name": "Free Wifi" },
      { "amenityId": 3, "name": "Spa" },
      { "amenityId": 4, "name": "Nhà hàng" },
      { "amenityId": 7, "name": "Dịch vụ giặt ủi" }
    ],
    "roomTypes": [
      {
        "roomTypeId": 901,
        "name": "Standard Room",
        "description": "Phòng tiêu chuẩn sạch sẽ, trang bị Wifi, TV, minibar, phù hợp khách du lịch ngắn ngày.",
        "capacity": 2,
        "pricePerNight": 1600000,
        "images": [
          {
            "url": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/a2/0a/ba/caption.jpg?w=900&h=500&s=1",
            "altText": "Standard Room - Hoi An Golden Holiday"
          }
        ],
        "amenities": [
          { "amenityId": 1, "name": "Free Wifi" },
          { "amenityId": 20, "name": "Điều hòa" }
        ]
      },
      {
        "roomTypeId": 902,
        "name": "Superior Room",
        "description": "Phòng Superior rộng hơn, có thêm khu vực ngồi, phù hợp gia đình nhỏ hoặc khách muốn không gian rộng rãi hơn.",
        "capacity": 3,
        "pricePerNight": 1950000,
        "images": [
          {
            "url": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/a2/0a/ba/caption.jpg?w=900&h=500&s=1",
            "altText": "Superior Room - Hoi An Golden Holiday"
          }
        ],
        "amenities": [
          { "amenityId": 1, "name": "Free Wifi" },
          { "amenityId": 21, "name": "Bàn làm việc" }
        ]
      }
    ]
  },
  {
    "hotelId": 10,
    "name": "HaiAn Beach Hotel & Spa",
    "slug": "haian-beach-hotel-spa",
    "description": "Khách sạn 4 sao nằm gần bãi biển Mỹ Khê, cung cấp các dịch vụ spa, phòng họp và nhà hàng phục vụ ẩm thực địa phương.",
    "address": "Số 20, Đường Võ Nguyên Giáp, Quận Sơn Trà, Đà Nẵng",
    "city": "Đà Nẵng",
    "country": "Việt Nam",
    "latitude": 16.0480,
    "longitude": 108.2365,
    "starRating": 4,
    "averageUserRating": 8.0,
    "reviewCount": 670,
    "startingPrice": 1400000,
    "coverImageUrl": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/276219187.jpg?k=cdd54920ca9eda95f6b45c8dc27bde63f3e5b286a152943c7ee68c58beda39d7&o=",
    "images": [
      {
        "url": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/276219187.jpg?k=cdd54920ca9eda95f6b45c8dc27bde63f3e5b286a152943c7ee68c58beda39d7&o=",
        "altText": "HaiAn Beach Hotel & Spa - exterior"
      }
    ],
    "amenities": [
      { "amenityId": 1, "name": "Free Wifi" },
      { "amenityId": 2, "name": "Hồ bơi" },
      { "amenityId": 4, "name": "Nhà hàng" },
      { "amenityId": 10, "name": "Dịch vụ đưa đón sân bay" }
    ],
    "roomTypes": [
      {
        "roomTypeId": 1001,
        "name": "Superior Sea View",
        "description": "Phòng Superior với view biển, nội thất hiện đại, ban công và minibar.",
        "capacity": 2,
        "pricePerNight": 1400000,
        "images": [
          {
            "url": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/276219187.jpg?k=cdd54920ca9eda95f6b45c8dc27bde63f3e5b286a152943c7ee68c58beda39d7&o=",
            "altText": "Superior Sea View - HaiAn Beach Hotel"
          }
        ],
        "amenities": [
          { "amenityId": 1, "name": "Free Wifi" },
          { "amenityId": 14, "name": "Ban công" }
        ]
      },
      {
        "roomTypeId": 1002,
        "name": "Junior Suite",
        "description": "Junior Suite thoải mái với khu vực tiếp khách, thích hợp cho khách muốn không gian lớn hơn một phòng tiêu chuẩn.",
        "capacity": 3,
        "pricePerNight": 2100000,
        "images": [
          {
            "url": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/276219187.jpg?k=cdd54920ca9eda95f6b45c8dc27bde63f3e5b286a152943c7ee68c58beda39d7&o=",
            "altText": "Junior Suite - HaiAn Beach Hotel"
          }
        ],
        "amenities": [
          { "amenityId": 16, "name": "Dịch vụ phòng 24/7" },
          { "amenityId": 17, "name": "Mini bar" }
        ]
      }
    ]
  },
]

function formatPrice(value) {
  if (value === null || value === undefined) return null
  try {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)
  } catch {
    return String(value)
  }
}

const Content = () => {
  const [selectedHotel, setSelectedHotel] = useState(null)

  return (
    <main className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Danh sách khách sạn</h2>

      <div className="grid gap-6 grid-cols-1">
        {sampleHotels.map((hotel) => (
          <HotelCard
            key={hotel.hotelId}
            coverImageUrl={hotel.coverImageUrl || ''}
            name={hotel.name}
            starRating={hotel.starRating}
            city={hotel.city}
            country={hotel.country}
            averageUserRating={hotel.averageUserRating}
            startingPrice={formatPrice(hotel.startingPrice)}
            onClick={() => setSelectedHotel({
              hotelId: hotel.hotelId,
              name: hotel.name,
              slug: hotel.slug,
              description: hotel.description || '',
              address: hotel.address || '',
              city: hotel.city,
              country: hotel.country,
              latitude: hotel.latitude || 0,
              longitude: hotel.longitude || 0,
              starRating: hotel.starRating,
              averageUserRating: hotel.averageUserRating,
              reviewCount: hotel.reviewCount || 0,
              images: hotel.images || (hotel.coverImageUrl ? [{ url: hotel.coverImageUrl, altText: hotel.name }] : []),
              amenities: hotel.amenities || [],
              roomTypes: hotel.roomTypes || [],
            })}
          />
        ))}
      </div>

      {selectedHotel && (
        <HotelDetails hotel={selectedHotel} onClose={() => setSelectedHotel(null)} />
      )}
    </main>
  )
}

export default Content