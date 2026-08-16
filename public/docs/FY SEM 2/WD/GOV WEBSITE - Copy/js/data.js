/**
 * KhelConnect - Data Module
 * Contains mock data for events, athletes, news, and medal tallies
 */

// Mock data for the application
const appData = {
    // Events data
    events: [
        {
            id: 1,
            title: "Indian Premier League 2025",
            description: "The biggest T20 cricket league in the world featuring international stars and domestic talent.",
            date: "2025-04-10",
            endDate: "2025-05-30",
            location: "Multiple Cities, India",
            venue: "Multiple Stadiums",
            sport: "Cricket",
            registrationOpen: false,
            registrationDeadline: "2024-12-15",
            image: "images/ipl-event.jpg",
            featured: true
        },
        {
            id: 2,
            title: "National Swimming Championship",
            description: "India's premier swimming competition featuring events across all categories and age groups.",
            date: "2025-05-15",
            endDate: "2025-05-25",
            location: "Bengaluru, Karnataka",
            venue: "Padukone-Dravid Centre for Sports Excellence",
            sport: "Swimming",
            registrationOpen: false,
            registrationDeadline: "2025-04-30",
            image: "images/swimming-event.jpg",
            featured: true
        },
        {
            id: 3,
            title: "Pro Kabaddi League Season 13",
            description: "India's professional kabaddi league featuring the country's top talent and international players.",
            date: "2025-05-01",
            endDate: "2025-06-15",
            location: "Multiple Cities, India",
            venue: "Multiple Indoor Stadiums",
            sport: "Kabaddi",
            registrationOpen: false,
            registrationDeadline: "2025-03-15",
            image: "images/kabaddi-event.jpg",
            featured: true
        },
        {
            id: 4,
            title: "National Cricket Championship",
            description: "The premier domestic cricket tournament featuring top teams from across the country.",
            date: "2025-06-15",
            endDate: "2025-06-30",
            location: "Mumbai, Maharashtra",
            venue: "Wankhede Stadium",
            sport: "Cricket",
            registrationOpen: true,
            registrationDeadline: "2025-06-01",
            image: "images/cricket-event.jpg",
            featured: true
        },
        {
            id: 5,
            title: "All India Athletics Meet",
            description: "National level athletics competition featuring track and field events for all age categories.",
            date: "2025-07-10",
            endDate: "2025-07-15",
            location: "New Delhi",
            venue: "Jawaharlal Nehru Stadium",
            sport: "Athletics",
            registrationOpen: true,
            registrationDeadline: "2025-06-25",
            image: "images/athletics-event.jpg",
            featured: true
        },
        {
            id: 6,
            title: "National Badminton Championship",
            description: "The country's most prestigious badminton tournament featuring singles and doubles competitions.",
            date: "2025-08-05",
            endDate: "2025-08-12",
            location: "Hyderabad, Telangana",
            venue: "Gachibowli Indoor Stadium",
            sport: "Badminton",
            registrationOpen: true,
            registrationDeadline: "2025-07-20",
            image: "images/badminton-event.jpg",
            featured: true
        },
        {
            id: 7,
            title: "National Swimming Championship",
            description: "Annual swimming competition featuring various swimming styles and categories.",
            date: "2025-09-10",
            endDate: "2025-09-15",
            location: "Bengaluru, Karnataka",
            venue: "Padukone-Dravid Centre for Sports Excellence",
            sport: "Swimming",
            registrationOpen: false,
            registrationDeadline: "2025-08-25",
            image: "images/swimming-event.jpg",
            featured: false
        },
        {
            id: 8,
            title: "All India Hockey Tournament",
            description: "Premier hockey tournament bringing together top teams from across the country to compete for national glory.",
            date: "2025-10-05",
            endDate: "2025-10-20",
            location: "Bhubaneswar, Odisha",
            venue: "Kalinga Stadium",
            sport: "Hockey",
            registrationOpen: true,
            registrationDeadline: "2025-09-15",
            image: "images/hockey-event.jpg",
            featured: true
        },
        {
            id: 9,
            title: "National Boxing Championship",
            description: "India's premier boxing event featuring elite boxers competing across various weight categories.",
            date: "2025-11-10",
            endDate: "2025-11-17",
            location: "Guwahati, Assam",
            venue: "Indira Gandhi Athletic Stadium",
            sport: "Boxing",
            registrationOpen: true,
            registrationDeadline: "2025-10-20",
            image: "images/boxing-event.jpg",
            featured: false
        },
        {
            id: 10,
            title: "Indian Open Golf Championship",
            description: "Prestigious golf tournament attracting top golfers from India and around the world.",
            date: "2025-12-03",
            endDate: "2025-12-07",
            location: "Gurugram, Haryana",
            venue: "DLF Golf and Country Club",
            sport: "Golf",
            registrationOpen: true,
            registrationDeadline: "2025-11-15",
            image: "images/golf-event.jpg",
            featured: false
        },
        {
            id: 11,
            title: "National Wrestling Championship",
            description: "Traditional and freestyle wrestling competition showcasing India's best wrestling talent.",
            date: "2026-01-15",
            endDate: "2026-01-20",
            location: "Sonipat, Haryana",
            venue: "SAI Training Centre",
            sport: "Wrestling",
            registrationOpen: true,
            registrationDeadline: "2025-12-30",
            image: "images/wrestling-event.jpg",
            featured: true
        },
        {
            id: 12,
            title: "Indian Grand Prix - Formula Racing",
            description: "High-octane motorsport event returning to India after a decade, featuring top international racing teams.",
            date: "2026-02-20",
            endDate: "2026-02-22",
            location: "Greater Noida, Uttar Pradesh",
            venue: "Buddh International Circuit",
            sport: "Motorsport",
            registrationOpen: false,
            registrationDeadline: "2026-01-15",
            image: "images/formula-event.jpg",
            featured: true
        },
        {
            id: 13,
            title: "National Archery Championship",
            description: "Precision archery competition featuring recurve and compound bow categories for men and women.",
            date: "2026-03-05",
            endDate: "2026-03-10",
            location: "Jamshedpur, Jharkhand",
            venue: "JRD Tata Sports Complex",
            sport: "Archery",
            registrationOpen: true,
            registrationDeadline: "2026-02-15",
            image: "images/archery-event.jpg",
            featured: false
        }
    ],
    
    // Athletes data
    athletes: [
        {
            id: 1,
            name: "Virat Kohli",
            sport: "Cricket",
            age: 36,
            state: "Delhi",
            achievements: ["ICC World Cup Winner", "Rajiv Gandhi Khel Ratna Award", "Padma Shri"],
            medals: {gold: 5, silver: 3, bronze: 1},
            bio: "One of India's most successful cricket captains and prolific batsmen in all formats of the game.",
            image: "images/athlete1.jpg",
            featured: true,
            socialMedia: {
                twitter: "https://twitter.com/imVkohli",
                instagram: "https://instagram.com/virat.kohli"
            }
        },
        {
            id: 2,
            name: "Neeraj Chopra",
            sport: "Javelin Throw",
            age: 27,
            state: "Haryana",
            achievements: ["Olympic Gold Medalist", "Asian Games Gold Medalist", "Arjuna Award"],
            medals: {gold: 8, silver: 2, bronze: 0},
            bio: "Olympic gold medalist in javelin throw and one of India's most celebrated track and field athletes.",
            image: "images/athlete2.jpg",
            featured: true,
            socialMedia: {
                twitter: "https://twitter.com/Neeraj_chopra1",
                instagram: "https://instagram.com/neeraj____chopra"
            }
        },
        {
            id: 3,
            name: "PV Sindhu",
            sport: "Badminton",
            age: 30,
            state: "Telangana",
            achievements: ["Olympic Silver & Bronze Medalist", "World Championship Gold", "Padma Bhushan"],
            medals: {gold: 6, silver: 7, bronze: 4},
            bio: "One of India's most successful badminton players with multiple Olympic medals to her name.",
            image: "images/athlete3.jpg",
            featured: true,
            socialMedia: {
                twitter: "https://twitter.com/Pvsindhu1",
                instagram: "https://instagram.com/pvsindhu1"
            }
        },
        {
            id: 4,
            name: "Saina Nehwal",
            sport: "Badminton",
            age: 35,
            state: "Haryana",
            achievements: ["Olympic Bronze Medalist", "World No. 1", "Padma Bhushan"],
            medals: {gold: 10, silver: 5, bronze: 3},
            bio: "Former world number one and Olympic bronze medalist who revolutionized badminton in India.",
            image: "images/athlete4.jpg",
            featured: false,
            socialMedia: {
                twitter: "https://twitter.com/NSaina",
                instagram: "https://instagram.com/nehwalsaina"
            }
        },
        {
            id: 5,
            name: "Mary Kom",
            sport: "Boxing",
            age: 42,
            state: "Manipur",
            achievements: ["Olympic Bronze Medalist", "6-time World Champion", "Padma Vibhushan"],
            medals: {gold: 14, silver: 3, bronze: 2},
            bio: "Legendary boxer who dominated women's boxing for nearly two decades and inspired countless young women.",
            image: "images/athlete5.jpg",
            featured: true,
            socialMedia: {
                twitter: "https://twitter.com/MangteC",
                instagram: "https://instagram.com/mcmary.kom"
            }
        },
        {
            id: 6,
            name: "Bajrang Punia",
            sport: "Wrestling",
            age: 30,
            state: "Haryana",
            achievements: ["Olympic Bronze Medalist", "World Championship Silver", "Asian Games Gold"],
            medals: {gold: 7, silver: 4, bronze: 3},
            bio: "One of India's most accomplished wrestlers with multiple medals in international competitions.",
            image: "images/athlete6.jpg",
            featured: false,
            socialMedia: {
                twitter: "https://twitter.com/BajrangPunia",
                instagram: "https://instagram.com/bajrangpunia60"
            }
        },
        {
            id: 7,
            name: "Mirabai Chanu",
            sport: "Weightlifting",
            age: 29,
            state: "Manipur",
            achievements: ["Olympic Silver Medalist", "World Championship Gold", "Khel Ratna Award"],
            medals: {gold: 5, silver: 6, bronze: 2},
            bio: "Olympic silver medalist who has broken multiple national records in weightlifting.",
            image: "images/athlete7.jpg",
            featured: true,
            socialMedia: {
                twitter: "https://twitter.com/mirabai_chanu",
                instagram: "https://instagram.com/mirabai_chanu"
            }
        },
        {
            id: 8,
            name: "Lovlina Borgohain",
            sport: "Boxing",
            age: 26,
            state: "Assam",
            achievements: ["Olympic Bronze Medalist", "World Championship Bronze", "Arjuna Award"],
            medals: {gold: 2, silver: 3, bronze: 5},
            bio: "Olympic bronze medalist who has emerged as one of India's top women boxers in recent years.",
            image: "images/athlete8.jpg",
            featured: false,
            socialMedia: {
                twitter: "https://twitter.com/LovlinaBorgohai",
                instagram: "https://instagram.com/lovlina_borgohain"
            }
        },
        {
            id: 9,
            name: "Ravi Kumar Dahiya",
            sport: "Wrestling",
            age: 28,
            state: "Haryana",
            achievements: ["Olympic Silver Medalist", "Asian Championship Gold", "Commonwealth Games Gold"],
            medals: {gold: 6, silver: 3, bronze: 1},
            bio: "Olympic silver medalist who has established himself as one of the world's best wrestlers in his weight category.",
            image: "images/athlete9.jpg",
            featured: false,
            socialMedia: {
                twitter: "https://twitter.com/ravidahiya60kg",
                instagram: "https://instagram.com/ravidahiya60"
            }
        },
        {
            id: 10,
            name: "Lakshya Sen",
            sport: "Badminton",
            age: 23,
            state: "Uttarakhand",
            achievements: ["World Championship Bronze", "All England Open Finalist", "Commonwealth Games Gold"],
            medals: {gold: 4, silver: 2, bronze: 3},
            bio: "Rising star of Indian badminton who has made rapid strides on the international circuit.",
            image: "images/athlete10.jpg",
            featured: false,
            socialMedia: {
                twitter: "https://twitter.com/lakshya_sen",
                instagram: "https://instagram.com/senlakshya"
            }
        },
        {
            id: 11,
            name: "Rohit Sharma",
            sport: "Cricket",
            age: 38,
            state: "Maharashtra",
            achievements: ["ICC World Cup Winner", "Most Double Centuries in ODIs", "Arjuna Award"],
            medals: {gold: 4, silver: 2, bronze: 1},
            bio: "Indian cricket team captain known for his elegant batting style and leadership skills.",
            image: "images/athlete11.jpg",
            featured: true,
            socialMedia: {
                twitter: "https://twitter.com/ImRo45",
                instagram: "https://instagram.com/rohitsharma45"
            }
        },
        {
            id: 12,
            name: "Vinesh Phogat",
            sport: "Wrestling",
            age: 31,
            state: "Haryana",
            achievements: ["World Championship Bronze", "Asian Games Gold", "Commonwealth Games Gold"],
            medals: {gold: 8, silver: 2, bronze: 3},
            bio: "One of India's most accomplished female wrestlers with multiple international medals.",
            image: "images/athlete12.jpg",
            featured: false,
            socialMedia: {
                twitter: "https://twitter.com/Phogat_Vinesh",
                instagram: "https://instagram.com/vineshphogat"
            }
        },
        {
            id: 13,
            name: "Amit Panghal",
            sport: "Boxing",
            age: 28,
            state: "Haryana",
            achievements: ["World Championship Silver", "Asian Games Gold", "Commonwealth Games Gold"],
            medals: {gold: 5, silver: 3, bronze: 2},
            bio: "World championship silver medalist and one of India's most promising boxers.",
            image: "images/athlete13.jpg",
            featured: false,
            socialMedia: {
                twitter: "https://twitter.com/Boxerpanghal",
                instagram: "https://instagram.com/amit_panghal1"
            }
        },
        {
            id: 14,
            name: "Sharath Kamal",
            sport: "Table Tennis",
            age: 42,
            state: "Tamil Nadu",
            achievements: ["Commonwealth Games Gold", "Asian Games Bronze", "Padma Shri"],
            medals: {gold: 7, silver: 3, bronze: 5},
            bio: "India's most decorated table tennis player with multiple Commonwealth Games medals.",
            image: "images/athlete14.jpg",
            featured: false,
            socialMedia: {
                twitter: "https://twitter.com/sharathkamal1",
                instagram: "https://instagram.com/sharathkamal"
            }
        },
        {
            id: 15,
            name: "Manika Batra",
            sport: "Table Tennis",
            age: 29,
            state: "Delhi",
            achievements: ["Commonwealth Games Gold", "Asian Games Bronze", "Khel Ratna Award"],
            medals: {gold: 4, silver: 2, bronze: 3},
            bio: "India's top female table tennis player who has achieved unprecedented success at the Commonwealth Games.",
            image: "images/athlete15.jpg",
            featured: false,
            socialMedia: {
                twitter: "https://twitter.com/manikabatra_TT",
                instagram: "https://instagram.com/manikabatra.tt"
            }
        },
        {
            id: 16,
            name: "Jasprit Bumrah",
            sport: "Cricket",
            age: 31,
            state: "Gujarat",
            achievements: ["ICC World Cup Winner", "World No. 1 ODI Bowler", "Arjuna Award"],
            medals: {gold: 3, silver: 2, bronze: 0},
            bio: "One of the world's premier fast bowlers known for his unique bowling action and yorkers.",
            image: "images/athlete16.jpg",
            featured: false,
            socialMedia: {
                twitter: "https://twitter.com/Jaspritbumrah93",
                instagram: "https://instagram.com/jaspritb1"
            }
        },
        {
            id: 17,
            name: "Aditi Ashok",
            sport: "Golf",
            age: 27,
            state: "Karnataka",
            achievements: ["Olympic 4th Place", "Ladies European Tour Winner", "Arjuna Award"],
            medals: {gold: 3, silver: 2, bronze: 1},
            bio: "India's top female golfer who has competed at the Olympics and won on the Ladies European Tour.",
            image: "images/athlete17.jpg",
            featured: false,
            socialMedia: {
                twitter: "https://twitter.com/aditigolf",
                instagram: "https://instagram.com/aditigolf"
            }
        },
        {
            id: 18,
            name: "Deepika Kumari",
            sport: "Archery",
            age: 30,
            state: "Jharkhand",
            achievements: ["World Cup Gold", "World No. 1", "Padma Shri"],
            medals: {gold: 9, silver: 5, bronze: 3},
            bio: "Former world number one archer who has won multiple medals in international competitions.",
            image: "images/athlete18.jpg",
            featured: false,
            socialMedia: {
                twitter: "https://twitter.com/ImDeepikaK",
                instagram: "https://instagram.com/dkumari"
            }
        },
        {
            id: 19,
            name: "Kidambi Srikanth",
            sport: "Badminton",
            age: 31,
            state: "Andhra Pradesh",
            achievements: ["World Championship Silver", "World No. 1", "Padma Shri"],
            medals: {gold: 6, silver: 4, bronze: 3},
            bio: "Former world number one and the first Indian male badminton player to achieve this ranking.",
            image: "images/athlete19.jpg",
            featured: false,
            socialMedia: {
                twitter: "https://twitter.com/srikidambi",
                instagram: "https://instagram.com/srikanth_kidambi"
            }
        },
        {
            id: 20,
            name: "Manu Bhaker",
            sport: "Shooting",
            age: 23,
            state: "Haryana",
            achievements: ["World Cup Gold", "Commonwealth Games Gold", "Arjuna Award"],
            medals: {gold: 7, silver: 2, bronze: 1},
            bio: "Young shooting prodigy who has won multiple World Cup and Commonwealth Games medals.",
            image: "images/athlete20.jpg",
            featured: false,
            socialMedia: {
                twitter: "https://twitter.com/realmanubhaker",
                instagram: "https://instagram.com/bhakermanu"
            }
        },
        {
            id: 21,
            name: "Shubhankar Sharma",
            sport: "Golf",
            age: 28,
            state: "Uttarakhand",
            achievements: ["European Tour Winner", "Asian Tour Order of Merit", "Arjuna Award"],
            medals: {gold: 2, silver: 1, bronze: 0},
            bio: "One of India's top professional golfers who has won on the European Tour.",
            image: "images/athlete21.jpg",
            featured: false,
            socialMedia: {
                twitter: "https://twitter.com/shubhankargolf",
                instagram: "https://instagram.com/shubhankargolf"
            }
        },
        {
            id: 22,
            name: "Saurabh Chaudhary",
            sport: "Shooting",
            age: 22,
            state: "Uttar Pradesh",
            achievements: ["Asian Games Gold", "World Cup Gold", "Arjuna Award"],
            medals: {gold: 5, silver: 2, bronze: 1},
            bio: "Young shooting sensation who has won multiple medals in international competitions.",
            image: "images/athlete22.jpg",
            featured: false,
            socialMedia: {
                twitter: "https://twitter.com/SaurabhChaudha5",
                instagram: "https://instagram.com/saurabh_chaudhary"
            }
        },
        {
            id: 23,
            name: "Hima Das",
            sport: "Athletics",
            age: 25,
            state: "Assam",
            achievements: ["World U20 Gold", "Asian Games Silver", "Arjuna Award"],
            medals: {gold: 4, silver: 3, bronze: 1},
            bio: "Sprinter known as the 'Dhing Express' who became the first Indian to win a gold medal in a track event at the IAAF World U20 Championships.",
            image: "images/athlete23.jpg",
            featured: false,
            socialMedia: {
                twitter: "https://twitter.com/HimaDas8",
                instagram: "https://instagram.com/hima_mon_das"
            }
        },
        {
            id: 24,
            name: "Ravindra Jadeja",
            sport: "Cricket",
            age: 36,
            state: "Gujarat",
            achievements: ["ICC World Cup Winner", "World No. 1 All-rounder", "Arjuna Award"],
            medals: {gold: 3, silver: 2, bronze: 1},
            bio: "One of the world's best all-rounders known for his exceptional fielding, accurate bowling, and batting abilities.",
            image: "images/athlete24.jpg",
            featured: false,
            socialMedia: {
                twitter: "https://twitter.com/imjadeja",
                instagram: "https://instagram.com/ravindra.jadeja"
            }
        },
        {
            id: 25,
            name: "Dutee Chand",
            sport: "Athletics",
            age: 29,
            state: "Odisha",
            achievements: ["Asian Games Silver", "National Record Holder", "Arjuna Award"],
            medals: {gold: 3, silver: 4, bronze: 2},
            bio: "Sprinter who has won multiple medals at the Asian Games and broken national records.",
            image: "images/athlete25.jpg",
            featured: false,
            socialMedia: {
                twitter: "https://twitter.com/DuteeChand",
                instagram: "https://instagram.com/duteechand"
            }
        },
        {
            id: 26,
            name: "Sakshi Malik",
            sport: "Wrestling",
            age: 32,
            state: "Haryana",
            achievements: ["Olympic Bronze Medalist", "Commonwealth Games Gold", "Padma Shri"],
            medals: {gold: 5, silver: 3, bronze: 4},
            bio: "Olympic bronze medalist who became the first Indian female wrestler to win an Olympic medal.",
            image: "images/athlete26.jpg",
            featured: false,
            socialMedia: {
                twitter: "https://twitter.com/SakshiMalik",
                instagram: "https://instagram.com/sakshimalik_"
            }
        },
        {
            id: 27,
            name: "Sunil Chhetri",
            sport: "Football",
            age: 40,
            state: "Delhi",
            achievements: ["AIFF Player of the Year", "Padma Shri", "Arjuna Award"],
            medals: {gold: 3, silver: 2, bronze: 1},
            bio: "India's all-time leading goal scorer and one of Asia's most accomplished footballers.",
            image: "images/athlete27.jpg",
            featured: true,
            socialMedia: {
                twitter: "https://twitter.com/chetrisunil11",
                instagram: "https://instagram.com/chetri_sunil11"
            }
        },
        {
            id: 28,
            name: "Sania Mirza",
            sport: "Tennis",
            age: 38,
            state: "Telangana",
            achievements: ["Grand Slam Winner", "World No. 1 in Doubles", "Padma Bhushan"],
            medals: {gold: 6, silver: 4, bronze: 2},
            bio: "Former world number one in doubles and the most successful Indian tennis player of all time.",
            image: "images/athlete28.jpg",
            featured: true,
            socialMedia: {
                twitter: "https://twitter.com/MirzaSania",
                instagram: "https://instagram.com/mirzasaniar"
            }
        },

        {
            id: 29,
            name: "Smriti Mandhana",
            sport: "Cricket",
            age: 28,
            state: "Maharashtra",
            achievements: ["ICC Women's Cricketer of the Year", "Arjuna Award", "World Cup Finalist"],
            medals: {gold: 2, silver: 3, bronze: 1},
            bio: "One of the world's premier batswomen known for her elegant stroke play and consistency.",
            image: "images/athlete29.jpg",
            featured: true,
            socialMedia: {
                twitter: "https://twitter.com/mandhana_smriti",
                instagram: "https://instagram.com/smriti_mandhana"
            }
        },
        {
            id: 30,
            name: "Nikhat Zareen",
            sport: "Boxing",
            age: 27,
            state: "Telangana",
            achievements: ["World Championship Gold", "Commonwealth Games Gold", "Arjuna Award"],
            medals: {gold: 5, silver: 2, bronze: 1},
            bio: "World champion boxer who has emerged as one of India's top female boxers in recent years.",
            image: "images/athlete30.jpg",
            featured: false,
            socialMedia: {
                twitter: "https://twitter.com/nikhat_zareen",
                instagram: "https://instagram.com/zareennikhat"
            }
        },

        {
            id: 31,
            name: "PR Sreejesh",
            sport: "Hockey",
            age: 36,
            state: "Kerala",
            achievements: ["Olympic Bronze Medalist", "Asian Games Gold", "Padma Shri"],
            medals: {gold: 4, silver: 2, bronze: 3},
            bio: "Veteran goalkeeper who played a crucial role in India's Olympic bronze medal in hockey after 41 years.",
            image: "images/athlete31.jpg",
            featured: false,
            socialMedia: {
                twitter: "https://twitter.com/16Sreejesh",
                instagram: "https://instagram.com/sreejesh_pr"
            }
        }
    ],
    
    // News data
    news: [
        {
            id: 1,
            title: "India to Host 2026 Commonwealth Games",
            summary: "The Commonwealth Games Federation has announced India as the host for the 2026 Commonwealth Games.",
            content: "In a major boost to India's sporting aspirations, the Commonwealth Games Federation (CGF) has officially announced India as the host nation for the 2026 Commonwealth Games. This marks the second time India will host the prestigious multi-sport event, following the successful Delhi Games in 2010. The event is expected to be held across multiple cities including New Delhi, Mumbai, and Bengaluru, showcasing India's world-class sporting infrastructure. The Sports Minister expressed delight at the announcement, stating that this would further enhance India's standing in the global sports community and inspire the next generation of athletes.",
            date: "2025-05-15",
            author: "Sports Department",
            image: "images/news1.jpg",
            category: "Announcement",
            featured: true
        },
        {
            id: 2,
            title: "National Sports Education Program Launched",
            summary: "Government launches comprehensive sports education program for schools across the country.",
            content: "The Sports Department of the Government of India has launched a nationwide Sports Education Program aimed at integrating sports into the school curriculum. The program will be implemented in over 10,000 schools across the country in its first phase. It includes specialized training for physical education teachers, development of sports infrastructure in schools, and a structured curriculum for various age groups. The initiative aims to identify and nurture sporting talent from a young age while promoting physical fitness and a healthy lifestyle among students. The program will cover both traditional Indian sports and popular international sports, ensuring a holistic approach to sports education.",
            date: "2025-05-10",
            author: "Education Division",
            image: "images/news2.jpg",
            category: "Education",
            featured: true
        },
        {
            id: 3,
            title: "Indian Athletes Begin Training for Asian Games",
            summary: "National camp starts for athletes preparing for the upcoming Asian Games.",
            content: "The national training camp for athletes representing India at the upcoming Asian Games has commenced at various Sports Authority of India (SAI) centers across the country. Over 300 athletes from 28 disciplines will undergo rigorous training under the guidance of Indian and international coaches. The Sports Department has allocated additional funds to ensure world-class training facilities and equipment for the athletes. Special focus is being given to sports where India has traditionally excelled, as well as emerging disciplines where Indian athletes have shown promise. The Asian Games are scheduled to be held later this year, and India aims to surpass its previous medal tally.",
            date: "2025-05-05",
            author: "Training Division",
            image: "images/news3.jpg",
            category: "Training",
            featured: true
        },
        {
            id: 4,
            title: "National Cricket Team Wins T20 World Cup",
            summary: "India clinches the T20 World Cup after a thrilling final against Australia.",
            content: "In a nail-biting finish, the Indian cricket team has won the T20 World Cup, defeating Australia by 6 runs in the final match. Chasing a target of 175, Australia was restricted to 168/8 in their 20 overs, thanks to an exceptional bowling performance by the Indian bowlers in the death overs. The captain led from the front with a match-winning 78 off 52 balls, earning him the Player of the Match award. This victory marks India's second T20 World Cup title, coming after a gap of 18 years. Thousands of fans gathered across the country to celebrate this historic win, with major cities witnessing jubilant celebrations late into the night. The team is scheduled to return home tomorrow and will be honored with a victory parade in New Delhi.",
            date: "2025-05-18",
            author: "Sports Department",
            image: "images/news4.jpg",
            category: "Results",
            featured: true
        },
        {
            id: 5,
            title: "New High-Performance Center Inaugurated in Pune",
            summary: "State-of-the-art training facility opened to nurture Olympic hopefuls.",
            content: "The Sports Authority of India (SAI) has inaugurated a new High-Performance Training Center in Pune, Maharashtra. The facility, built at a cost of ₹250 crores, is equipped with cutting-edge technology and infrastructure to train elite athletes for international competitions, particularly the Olympics. The center features specialized training areas for athletics, swimming, gymnastics, and combat sports, along with sports science laboratories, recovery facilities, and athlete accommodation. International coaches have been recruited to oversee the training programs, which will focus on scientific methods and personalized athlete development. The center will initially host 120 athletes identified through the Khelo India talent identification program, with plans to expand capacity in the coming years. This facility is part of the government's vision to establish India as a sporting powerhouse by the 2028 Olympics.",
            date: "2025-05-12",
            author: "Training Division",
            image: "images/news5.jpg",
            category: "Training",
            featured: false
        },
        {
            id: 6,
            title: "Sports Science Scholarship Program Announced",
            summary: "Government launches initiative to develop sports science expertise in the country.",
            content: "The Education Division of the Sports Department has announced a new scholarship program focused on sports science education. The program will sponsor 200 students annually to pursue specialized degrees in sports medicine, biomechanics, sports psychology, nutrition, and strength and conditioning at leading universities in India and abroad. Scholarship recipients will be required to work with national sports federations for a minimum of three years after completing their education, ensuring that their expertise benefits Indian athletes. The initiative aims to address the shortage of qualified sports science professionals in the country and create a robust support system for athletes at all levels. Applications for the first batch of scholarships will open next month, with selection based on academic merit and demonstrated interest in sports science.",
            date: "2025-05-08",
            author: "Education Division",
            image: "images/news6.jpg",
            category: "Education",
            featured: false
        },
        {
            id: 7,
            title: "National Sports Awards Ceremony Held",
            summary: "President honors outstanding athletes and coaches with prestigious awards.",
            content: "The annual National Sports Awards ceremony was held at the Rashtrapati Bhavan, with the President of India presenting honors to the country's top athletes and coaches. The Rajiv Gandhi Khel Ratna Award, India's highest sporting honor, was conferred upon Olympic gold medalist Neeraj Chopra and world champion boxer Nikhat Zareen. Thirty-five athletes received the Arjuna Award for consistent performances over the past four years, while ten coaches were honored with the Dronacharya Award for excellence in coaching. The Dhyan Chand Award for lifetime achievement was presented to five veteran sportspersons who have contributed significantly to their respective sports after retirement. The ceremony also saw the presentation of the Rashtriya Khel Protsahan Puruskar to organizations that have played a significant role in sports promotion and development.",
            date: "2025-04-29",
            author: "Sports Department",
            image: "images/news7.jpg",
            category: "Announcement",
            featured: false
        },
        {
            id: 8,
            title: "India Wins 45 Medals at Youth Asian Games",
            summary: "Young Indian athletes shine with record medal haul in Tashkent.",
            content: "The Indian contingent has returned from the Youth Asian Games in Tashkent with an impressive tally of 45 medals, including 15 gold, 18 silver, and 12 bronze. This represents India's best-ever performance at the Youth Asian Games, surpassing the previous record of 33 medals. The athletics team led the medal count with 12 medals, followed by wrestling (8), shooting (7), and swimming (6). Particularly noteworthy was the performance in track and field events, where Indian athletes set two new Youth Asian Games records. The success is being attributed to the systematic talent identification and development programs implemented over the past five years, particularly the Khelo India Youth Games and the Target Olympic Podium Scheme for juniors. The Sports Minister congratulated the young athletes, stating that their performance bodes well for India's prospects at the 2028 and 2032 Olympics.",
            date: "2025-04-22",
            author: "Sports Department",
            image: "images/news8.jpg",
            category: "Results",
            featured: false
        },
        {
            id: 9,
            title: "Traditional Sports Promotion Policy Unveiled",
            summary: "New initiative aims to preserve and popularize indigenous sports across India.",
            content: "The Sports Department has unveiled a comprehensive policy for the promotion of traditional and indigenous sports of India. The policy focuses on documenting, standardizing, and popularizing over 50 traditional sports from different regions of the country, including Kalaripayattu, Mallakhamb, Silambam, Kabaddi, Kho-Kho, and various tribal games. Key elements of the policy include the establishment of dedicated training centers in each state, integration of traditional sports into the school curriculum, organization of national championships, and financial support for athletes and coaches. The initiative also aims to create international platforms for these sports, with plans to host the first World Traditional Sports Games in India in 2027. The policy has been welcomed by cultural organizations and sports enthusiasts who have long advocated for greater recognition of India's sporting heritage.",
            date: "2025-04-15",
            author: "Sports Department",
            image: "images/news9.jpg",
            category: "Announcement",
            featured: false
        },
        {
            id: 10,
            title: "Sports Injury Prevention Workshop Series Launched",
            summary: "Nationwide program to educate coaches and athletes on injury prevention techniques.",
            content: "The Training Division has launched a series of workshops focused on sports injury prevention and management. The program will conduct over 100 workshops across the country, targeting coaches, physical education teachers, and athletes at various levels. The curriculum, developed in collaboration with leading sports medicine specialists, covers topics such as warm-up protocols, proper technique, overtraining prevention, nutrition for injury prevention, and early injury recognition. Participants will receive certification upon completion, with advanced modules available for those working with elite athletes. The initiative comes in response to data showing that preventable injuries account for a significant portion of career interruptions among Indian athletes. The workshops will be conducted by a mobile team of sports medicine doctors, physiotherapists, and strength and conditioning experts, ensuring that even remote areas have access to this crucial knowledge.",
            date: "2025-04-08",
            author: "Training Division",
            image: "images/news10.jpg",
            category: "Training",
            featured: false
        },
        {
            id: 11,
            title: "Sports Infrastructure Development Fund Established",
            summary: "₹5,000 crore fund to boost sports facilities across tier-2 and tier-3 cities.",
            content: "The Government of India has established a dedicated Sports Infrastructure Development Fund with an initial corpus of ₹5,000 crores to accelerate the creation and upgrade of sports facilities across the country. The fund will primarily focus on tier-2 and tier-3 cities, aiming to democratize access to quality sports infrastructure beyond metropolitan areas. Projects eligible for funding include multi-sport complexes, swimming pools, indoor halls, artificial turf fields, and athletics tracks. State governments and municipal corporations can apply for grants covering up to 70% of project costs, with the remainder to be arranged through public-private partnerships or state budgets. The fund will be managed by a committee comprising representatives from the Sports Department, Finance Ministry, and sports experts. The initiative is expected to create facilities for over 50 sports disciplines and benefit millions of young athletes over the next decade.",
            date: "2025-04-01",
            author: "Sports Department",
            image: "images/news11.jpg",
            category: "Announcement",
            featured: false
        },
        {
            id: 12,
            title: "National Sports University Expands Academic Programs",
            summary: "New courses in sports technology and management to be offered from next academic year.",
            content: "The National Sports University in Manipur has announced a significant expansion of its academic offerings, with the introduction of several new undergraduate and postgraduate programs from the upcoming academic year. The new courses include B.Tech in Sports Technology, MBA in Sports Management, M.Sc in Sports Nutrition, and Ph.D programs in Sports Biomechanics and Exercise Physiology. The university is also establishing a Center for Sports Artificial Intelligence and Data Analytics, which will focus on using advanced technologies for performance analysis and talent identification. To support this expansion, the university has recruited faculty members from prestigious institutions worldwide and signed memoranda of understanding with leading sports universities in Australia, the UK, and Germany for academic exchanges and collaborative research. The admission process for the new programs will begin in June, with approximately 500 seats available across all courses.",
            date: "2025-03-25",
            author: "Education Division",
            image: "images/news12.jpg",
            category: "Education",
            featured: false
        }
    ],
    
    // Medal tally data
    medalTally: [
        {
            sport: "Cricket",
            gold: 3,
            silver: 2,
            bronze: 1,
            total: 6
        },
        {
            sport: "Athletics",
            gold: 5,
            silver: 7,
            bronze: 9,
            total: 21
        },
        {
            sport: "Badminton",
            gold: 2,
            silver: 3,
            bronze: 4,
            total: 9
        },
        {
            sport: "Wrestling",
            gold: 4,
            silver: 3,
            bronze: 5,
            total: 12
        },
        {
            sport: "Shooting",
            gold: 7,
            silver: 4,
            bronze: 3,
            total: 14
        },
        {
            sport: "Hockey",
            gold: 1,
            silver: 0,
            bronze: 1,
            total: 2
        },
        {
            sport: "Boxing",
            gold: 2,
            silver: 3,
            bronze: 5,
            total: 10
        }
    ]
};

// Export the data for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = appData;
}
