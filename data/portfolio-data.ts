export interface Project {
    id: string;
    slug: string; // URL-friendly identifier
    title: string;
    description: string;
    image: string;
    tags: string[];
    platform?: string;
    liveUrl?: string;
    playStoreUrl?: string;
    githubUrl?: string;
    featured?: boolean;
}

export interface Experience {
    id: string;
    role: string;
    company: string;
    period: string;
    description: string;
    current?: boolean;
}

export interface Skill {
    name: string;
    level: number;
}

export interface SocialLink {
    name: string;
    url: string;
    icon: string;
}

export const socialLinks: SocialLink[] = [
    {
        name: "Facebook",
        url: "https://www.facebook.com/yousef.sayed.98434",
        icon: "facebook",
    },
    {
        name: "GitHub",
        url: "https://github.com/Yousef-Sayed/",
        icon: "github",
    },
    {
        name: "Email",
        url: "mailto:youssefabdrabooh@gmail.com",
        icon: "mail",
    },
];

export const portfolioData = {
    en: {
        personalInfo: {
            name: "Youssef Abdrabboh",
            title: "Full Stack Developer",
            email: "youssefabdrabooh@gmail.com",
            location: "Cairo, Egypt",
            bio: "Passionate Full Stack Developer with experience in building scalable web applications using modern technologies.",
            avatar: "/my-image-without-background.png",
            resumeUrl: "/Youssef_Sayed_Backend.pdf",
        },
        navLinks: [
            { name: "Home", href: "#home" },
            { name: "About", href: "#about" },
            { name: "Portfolio", href: "#portfolio" },
            { name: "Contact", href: "#contact" },
        ],
        hero: {
            badge: "Available for freelance work",
            greeting: "Hello, I'm",
            contactBtn: "Contact Me",
            downloadBtn: "Download CV",
        },
        about: {
            title: "About Me",
            subtitle: "My professional journey and technical expertise.",
            experienceTitle: "Work Experience",
            skillsTitle: "My Skills",
            frontend: "Frontend",
            backend: "Backend",
        },
        portfolio: {
            title: "Featured Projects",
            subtitle: "A small selection of projects I've worked on recently.",
            allProjects: "All Projects",
            featured: "Featured",
            viewMore: "View More on GitHub",
        },
        contact: {
            title: "Get in Touch",
            subtitle: "Have a project in mind? Let's build something amazing together.",
            contactInfo: "Contact Information",
            followMe: "Follow Me",
            form: {
                name: "Name",
                email: "Email",
                message: "Message",
                send: "Send Message",
                sending: "Sending...",
                sent: "Message Sent",
            },
            footerCredit: "Site designed by Yousef Abdrabboh",
        },
        projects: [
            {
                id: "henta",
                slug: "henta",
                title: "Henta",
                platform: "Mobile App",
                description: "A professional mobile application for book management allowing users to browse, purchase, and organize collections. Features a multi-auth system and secure payment integration.",
                image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
                tags: ["Laravel", "PHP", "MySQL", "jQuery", "Bootstrap"],
                playStoreUrl: "https://play.google.com/store/apps/details?id=com.apphentaa.evyx&pcampaignid=web_share",
                featured: true,
            },
            {
                id: "egy-pin",
                slug: "egy-pin",
                title: "EGY-PIN",
                platform: "Website / Mobile App",
                description: "A comprehensive platform for exploring tourist attractions across Egypt. Supports paid subscriptions for spot listings and interactive mapping via Google Maps API.",
                image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800&q=80",
                tags: ["Laravel", "PHP", "Laravel Nova", "MySQL", "Google Maps"],
                liveUrl: "https://egy-pin.com/",
                playStoreUrl: "https://play.google.com/store/apps/details?id=com.egypin.evyx&pcampaignid=web_share",
                featured: true,
            },
            {
                id: "caeser",
                slug: "caeser",
                title: "Caeser",
                platform: "Mobile App",
                description: "Specialized marketplace for car spare parts. Features point rewards, location-based branch discovery, and roadside assistance services with full bilingual support.",
                image: "/caeser.svg",
                tags: ["Laravel", "PHP", "Laravel Nova", "Mobile API"],
                playStoreUrl: "https://play.google.com/store/apps/details?id=com.ceaser.evyx&pcampaignid=web_share",
                featured: true,
            },
            {
                id: "maxliss",
                slug: "maxliss",
                title: "Maxliss",
                platform: "Website / Mobile App",
                description: "Advanced booking platform for hair treatment specialists. Includes specialist tracking for safety, salon reservations, live chat, and SOS emergency features.",
                image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80",
                tags: ["Laravel", "PHP", "WebSocket", "Real-time Tracking"],
                liveUrl: "https://maxliss.evyx.lol/",
                playStoreUrl: "https://play.google.com/store/apps/details?id=com.maxliss.evyx&pcampaignid=web_share",
                featured: true,
            },
            {
                id: "hesperdes",
                slug: "hesperdes",
                title: "Hesperdes",
                platform: "Website",
                description: "University management system featuring a React frontend and Laravel backend. Includes a flexible CMS and a robust admin dashboard for academic administration.",
                image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
                tags: ["React", "Laravel", "PHP", "Laravel Nova", "API"],
                liveUrl: "https://hesperides-website.vercel.app/ar",
                featured: true,
            },
            {
                id: "al-omar",
                slug: "al-omar",
                title: "Al-Omar Law Firm",
                platform: "Website",
                description: "Official web presence for a prestigious law firm, designed with a professional legal aesthetic and structured content optimized for legal practitioners.",
                image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
                tags: ["Professional UI", "Responsive", "Law Firm"],
                liveUrl: "https://www.alomarlaw.com/",
                featured: true,
            },
        ] as Project[],
        experience: [
            {
                id: "al-omar",
                role: "Technical Lead / Technical Responsible",
                company: "Al-Omar Law Firm",
                period: "March 2025 - Present",
                description: "Leading the technical strategy and development for a prestigious law firm, overseeing system architecture and digital transformation.",
                current: true,
            },
            {
                id: "evyx",
                role: "Full-Stack Developer",
                company: "Evyx",
                period: "July 2024",
                description: "Developed and maintained full-stack applications with a focus on performance, scalability, and modern user experiences.",
            },
        ] as Experience[],
        skills: {
            frontend: [
                { name: "HTML / CSS", level: 95 },
                { name: "JavaScript / TypeScript", level: 90 },
                { name: "React / Next.js", level: 95 },
                { name: "Tailwind CSS", level: 95 },
                { name: "Bootstrap", level: 85 },
                { name: "jQuery", level: 80 },
            ],
            backend: [
                { name: "PHP / Laravel", level: 90 },
                { name: "Python", level: 85 },
                { name: "Node.js / Express", level: 85 },
                { name: "SQL / Database", level: 85 },
            ],
        }
    },
    ar: {
        personalInfo: {
            name: "يوسف عبدربه",
            title: "Full Stack Developer",
            email: "youssefabdrabooh@gmail.com",
            location: "القاهرة، مصر",
            bio: "مطور Full Stack شغوف بخبرة في بناء تطبيقات ويب قابلة للتطوير باستخدام أحدث التقنيات.",
            avatar: "/my-image-without-background.png",
            resumeUrl: "/Youssef_Sayed_Backend.pdf",
        },
        navLinks: [
            { name: "الرئيسية", href: "#home" },
            { name: "عني", href: "#about" },
            { name: "أعمالي", href: "#portfolio" },
            { name: "تواصل معي", href: "#contact" },
        ],
        hero: {
            badge: "متاح للعمل الحر",
            greeting: "مرحباً، أنا",
            contactBtn: "تواصل معي",
            downloadBtn: "تحميل السيرة الذاتية",
        },
        about: {
            title: "عني",
            subtitle: "رحلتي المهنية وخبراتي التقنية.",
            experienceTitle: "خبرات العمل",
            skillsTitle: "مهاراتي",
            frontend: "الواجهة الأمامية",
            backend: "الخلفية البرمجية",
        },
        portfolio: {
            title: "أعمال مميزة",
            subtitle: "مجموعة مختارة من المشاريع التي عملت عليها مؤخراً.",
            allProjects: "كل المشاريع",
            featured: "مميزة",
            viewMore: "عرض المزيد على GitHub",
        },
        contact: {
            title: "تواصل معي",
            subtitle: "هل لديك فكرة مشروع؟ دعنا نبني شيئاً مذهلاً معاً.",
            contactInfo: "معلومات التواصل",
            followMe: "تابعني",
            form: {
                name: "الاسم",
                email: "البريد الإلكتروني",
                message: "الرسالة",
                send: "إرسال الرسالة",
                sending: "جاري الإرسال...",
                sent: "تم الإرسال بنجاح",
            },
            footerCredit: "الموقع تم تصميمه بواسطة يوسف عبدربه",
        },
        projects: [
            {
                id: "henta",
                slug: "henta",
                title: "Henta",
                platform: "تطبيق موبايل",
                description: "تطبيق موبايل احترافي لإدارة الكتب يتيح للمستخدمين تصفح وشراء وتنظيم مجموعاتهم الخاصة. يتميز بنظام مصادقة متعدد الأدوار ونظام دفع آمن متكامل.",
                image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
                tags: ["لارافيل", "PHP", "MySQL", "jQuery", "Bootstrap"],
                playStoreUrl: "https://play.google.com/store/apps/details?id=com.apphentaa.evyx&pcampaignid=web_share",
                featured: true,
            },
            {
                id: "egy-pin",
                slug: "egy-pin",
                title: "EGY-PEN",
                platform: "موقع إلكتروني / تطبيق موبايل",
                description: "منصة شاملة لاستكشاف المعالم السياحية في جميع أنحاء مصر. تدعم الاشتراكات المدفوعة لإدراج الأماكن وخدمة خرائط تفاعلية عبر Google Maps API.",
                image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800&q=80",
                tags: ["لارافيل", "PHP", "Laravel Nova", "MySQL", "خرائط جوجل"],
                liveUrl: "https://egy-pin.com/",
                playStoreUrl: "https://play.google.com/store/apps/details?id=com.egypin.evyx&pcampaignid=web_share",
                featured: true,
            },
            {
                id: "caeser",
                slug: "caeser",
                title: "Caeser",
                platform: "تطبيق موبايل",
                description: "متجر متخصص لقطع غيار السيارات. يتميز بنظام نقاط ومكافآت، واكتشاف الفروع القريبة بناءً على الموقع، وخدمات إنقاذ الطرق مع دعم كامل للغتين.",
                image: "/caeser.svg",
                tags: ["لارافيل", "PHP", "Laravel Nova", "Mobile API"],
                playStoreUrl: "https://play.google.com/store/apps/details?id=com.ceaser.evyx&pcampaignid=web_share",
                featured: true,
            },
            {
                id: "maxliss",
                slug: "maxliss",
                title: "Maxliss",
                platform: "موقع إلكتروني / تطبيق موبايل",
                description: "منصة حجز متطورة لخبراء علاج الشعر. تتضمن تتبع المتخصصين لضمان السلامة، وحجز الصالونات، والدردشة المباشرة، وميزات طوارئ SOS.",
                image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80",
                tags: ["لارافيل", "PHP", "WebSocket", "تتبع مباشر"],
                liveUrl: "https://maxliss.evyx.lol/",
                playStoreUrl: "https://play.google.com/store/apps/details?id=com.maxliss.evyx&pcampaignid=web_share",
                featured: true,
            },
            {
                id: "hesperdes",
                slug: "hesperdes",
                title: "Hesperdes",
                platform: "موقع إلكتروني",
                description: "نظام إدارة جامعي يتميز بواجهة React وخلفية Laravel. يتضمن نظاماً مرناً لإدارة المحتوى ولوحة تحكم قوية للإدارة الأكاديمية.",
                image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
                tags: ["ريأكت", "لارافيل", "PHP", "Laravel Nova", "API"],
                liveUrl: "https://hesperides-website.vercel.app/ar",
                featured: true,
            },
            {
                id: "al-omar",
                slug: "al-omar",
                title: "مكتب العمر للمحاماة",
                platform: "موقع إلكتروني",
                description: "الموقع الرسمي لمكتب محاماة مرموق، مصمم بجمالية قانونية احترافية ومحتوى منظم مخصص للممارسين القانونيين.",
                image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
                tags: ["واجهة احترافية", "تصميم متجاوب", "مكتب محاماة"],
                liveUrl: "https://www.alomarlaw.com/",
                featured: true,
            },
        ] as Project[],
        experience: [
            {
                id: "al-omar",
                role: "قائد تقني / المسئول التقني",
                company: "مكتب العمر للمحاماة",
                period: "مارس 2025 - الآن",
                description: "قيادة الاستراتيجية التقنية والتطوير لمكتب محاماة مرموق، والإشراف على بنية الأنظمة والتحول الرقمي.",
                current: true,
            },
            {
                id: "evyx",
                role: "مطور ويب شامل (Full-Stack)",
                company: "Evyx",
                period: "يوليو 2024",
                description: "تطوير وصيانة تطبيقات الويب المتكاملة مع التركيز على الأداء والقابلية للتوسع وتجارب المستخدم الحديثة.",
            },
        ] as Experience[],
        skills: {
            frontend: [
                { name: "HTML / CSS", level: 95 },
                { name: "JavaScript / TypeScript", level: 90 },
                { name: "React / Next.js", level: 95 },
                { name: "Tailwind CSS", level: 95 },
                { name: "Bootstrap", level: 85 },
                { name: "jQuery", level: 80 },
            ],
            backend: [
                { name: "PHP / Laravel", level: 90 },
                { name: "Python", level: 85 },
                { name: "Node.js / Express", level: 85 },
                { name: "SQL / Database", level: 85 },
            ],
        }
    }
};
