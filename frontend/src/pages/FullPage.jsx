import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsGithub, BsLinkedin, BsPersonWorkspace, BsHeartFill } from 'react-icons/bs';
import { FaFacebook, FaTwitterSquare, FaCommentAlt, FaArrowRight, FaStackOverflow } from 'react-icons/fa';
import { FaXTwitter, FaArrowUp } from 'react-icons/fa6';
import { MdDownload, MdAlternateEmail } from 'react-icons/md';
import { RiContactsFill } from 'react-icons/ri';
import { SiLeetcode } from 'react-icons/si';
import { BiLogoLinkedin } from 'react-icons/bi';
import { CiLocationOn } from 'react-icons/ci';
import { IoLogoGithub, IoMdCall } from 'react-icons/io';
import { IoStar as IoStar5, } from "react-icons/io5";
import { CgGitFork } from 'react-icons/cg';
import { TbMailForward } from 'react-icons/tb';
import Marquee from 'react-fast-marquee';
import Lottie from 'lottie-react';

/* 
  INSTALL REQUIREMENTS:
  npm install react-icons react-fast-marquee lottie-react axios react-toastify
*/

// --- DATA ---
const personalData = {
    name: "ABU SAID",
    profile: '/profile.png',
    designation: "Software Developer",
    description: "My name is ABU SAID. I am a professional and enthusiastic programmer in my daily life. I am a quick learner with a self-learning attitude. I love to learn and explore new technologies and am passionate about problem-solving. I love almost all the stacks of web application development and love to make the web more open to the world. My core skill is based on JavaScript and I love to do most of the things using JavaScript. I am available for any kind of job opportunity that suits my skills and interests.",
    email: 'abusaid7388@gmail.com',
    phone: '+8801608797655',
    address: 'Middle Badda, Dhaka, Bangladesh - 1212',
    github: 'https://github.com/said7388',
    facebook: 'https://www.facebook.com/abusaid.riyaz/',
    linkedIn: 'https://www.linkedin.com/in/abu-said-bd/',
    twitter: 'https://twitter.com/said7388',
    stackOverflow: 'https://stackoverflow.com/users/16840768/abu-said',
    leetcode: "https://leetcode.com/said3812/",
    devUsername: "said7388",
    resume: "https://drive.google.com/file/d/1eyutpKFFhJ9X-qpQGKhUNnVRkB5Wer00/view?usp=sharing"
};

const skillsData = [
    'HTML', 'CSS', 'Javascript', 'Typescript', 'React', 'Next JS', 'Tailwind',
    'MongoDB', 'MySQL', 'PostgreSQL', 'Git', 'AWS', 'Bootstrap', 'Docker',
    'Go', 'Figma', 'Firebase', 'MaterialUI', 'Nginx', 'Strapi'
];

const projectsData = [
    {
        id: 1,
        name: 'AI Powered Financial App',
        description: "Me and my team built an AI-powered financial mobile application. I have developed API using Express, Typescript, OpenAI, AWS, and MongoDB. Used OTP via AWS SES, Google, and Facebook for the authentication system. Built AI assistants using OpenAI's latest model and trained using our dataset. Voice messages are converted to text using AWS Transcribe. The app fetches data from Google Sheets and generates a PDF term sheet, sent via AWS SES.",
        tools: ['Express', 'MongoDB', 'OpenAI API', 'AWS SES', 'AWS S3', 'Node Mailer', 'Joi', 'Puppeteer', 'EC2', 'PM2', 'Nginx'],
        role: 'Backend Developer',
    },
    {
        id: 2,
        name: 'Travel Agency App',
        description: 'I have designed and developed a full-stack web app for 2Expedition, a travel agency in Armenia. I created the UI using NextJS, Typescript, MUI, TailwindCSS, Google Maps, Sun-Editor, and React Slick. The app supports multiple languages and currencies. I developed the API using NestJS, Typescript, MySQL, TypeORM, AWS, and Nodemailer. I deployed the front-end app to AWS Amplify and the back-end app to AWS EC2.',
        tools: ['NextJS', 'Tailwind CSS', "Google Maps", "NestJS", "TypeScript", "MySQL", "AWS S3"],
        role: 'Full Stack Developer',
    },
    {
        id: 3,
        name: 'AI Powered Real Estate',
        description: 'My team built an AI-based real estate app using Replicate API and OpenAI. We used Express, Typescript, OpenAI, Replicate, Stripe, and Mongoose to develop the API. We utilized NextJS, Formik, TailwindCSS, and other npm libraries for the UI. We have trained multiple AI assistants using the latest GPT model and integrated Replicate API for image processing. We added role-based auth, subscription plans, Cron job scheduling, and payment integration with Stripe.',
        tools: ['React', 'Bootstrap', 'SCSS', 'Stripe', 'Express', 'TypeScript', 'MongoDB', 'Azure Blob', 'OpenAI API', 'Replicate AI', 'Cronjob', 'JWT'],
        role: 'Full Stack Developer',
    },
    {
        id: 4,
        name: 'Newsroom Management',
        description: "My team and I developed a newspaper management dashboard application called Newsroom Management. As a front-end developer, I worked on creating the dashboard using NextJS, Material UI, Redux, Calendar, and other necessary npm libraries. We used React Redux to manage the application's state and React-hook-form and Sun Editor to handle forms.",
        tools: ['NextJS', 'Material UI', 'Redux', 'Sun Editor', "Calendar"],
        role: 'Full Stack Developer',
    }
];

const experiences = [
    { id: 1, title: 'Software Engineer I', company: "Teton Private Ltd.", duration: "(Jan 2022 - Present)" },
    { id: 2, title: "FullStack Developer", company: "Fiverr (freelance)", duration: "(Jun 2021 - Jan 2022)" },
    { id: 3, title: "Self Employed", company: "Code and build something in everyday.", duration: "(Jan 2018 - Present)" }
];

const educations = [
    { id: 1, title: "Bachelor Degree", duration: "2020 - Present", institution: "National University of Bangladesh" },
    { id: 2, title: "Higher Secondary Certificate", duration: "2018 - 2020", institution: "Noakhali Islamia Kamil Madrasah" },
    { id: 3, title: "Secondary School Certificate", duration: "2008 - 2018", institution: "Baitus Saif Islamia Madrasah" }
];

const timeConverter = (isoTime) => {
    const currentTime = new Date();
    const pastTime = new Date(isoTime);
    const timeDifference = currentTime - pastTime;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 30) return `${days} days ago`;
    if (months < 12) return `${months} months ago`;
    return `${years} years ago`;
};

// Replace next/image path mapping logic with simple string paths or valid images
const skillsImage = (skill) => {
    const skillID = skill.toLowerCase().replace(/ \s/g, '-');
    return `/assets/svg/skills/${skillID}.svg`;
};

// --- COMPONENTS ---

// helper/glow-card.jsx
const GlowCard = ({ children, identifier }) => {
    useEffect(() => {
        const CONTAINER = document.querySelector(`.glow-container-${identifier}`);
        const CARDS = document.querySelectorAll(`.glow-card-${identifier}`);

        const CONFIG = {
            proximity: 40, spread: 80, blur: 12, gap: 32, vertical: false, opacity: 0,
        };

        const UPDATE = (event) => {
            for (const CARD of CARDS) {
                const CARD_BOUNDS = CARD.getBoundingClientRect();
                if (
                    event?.x > CARD_BOUNDS.left - CONFIG.proximity &&
                    event?.x < CARD_BOUNDS.left + CARD_BOUNDS.width + CONFIG.proximity &&
                    event?.y > CARD_BOUNDS.top - CONFIG.proximity &&
                    event?.y < CARD_BOUNDS.top + CARD_BOUNDS.height + CONFIG.proximity
                ) {
                    CARD.style.setProperty('--active', 1);
                } else {
                    CARD.style.setProperty('--active', CONFIG.opacity);
                }

                const CARD_CENTER = [
                    CARD_BOUNDS.left + CARD_BOUNDS.width * 0.5,
                    CARD_BOUNDS.top + CARD_BOUNDS.height * 0.5,
                ];

                let ANGLE = (Math.atan2(event?.y - CARD_CENTER[1], event?.x - CARD_CENTER[0]) * 180) / Math.PI;
                ANGLE = ANGLE < 0 ? ANGLE + 360 : ANGLE;
                CARD.style.setProperty('--start', ANGLE + 90);
            }
        };

        document.body.addEventListener('pointermove', UPDATE);
        const RESTYLE = () => {
            CONTAINER.style.setProperty('--gap', CONFIG.gap);
            CONTAINER.style.setProperty('--blur', CONFIG.blur);
            CONTAINER.style.setProperty('--spread', CONFIG.spread);
            CONTAINER.style.setProperty('--direction', CONFIG.vertical ? 'column' : 'row');
        };

        RESTYLE();
        UPDATE();
        return () => document.body.removeEventListener('pointermove', UPDATE);
    }, [identifier]);

    return (
        <div className={`glow-container-${identifier} glow-container`}>
            <article className={`glow-card glow-card-${identifier} h-fit cursor-pointer border border-[#2a2e5a] transition-all duration-300 relative bg-[#101123] text-gray-200 rounded-xl hover:border-transparent w-full`}>
                <div className="glows"></div>
                {children}
            </article>
        </div>
    );
};

// helper/animation-lottie.jsx
const AnimationLottie = ({ animationPath }) => {
    return <Lottie loop autoplay animationData={animationPath} style={{ width: '95%' }} />;
};

// helper/scroll-to-top.jsx
const ScrollToTop = () => {
    const [btnCls, setBtnCls] = useState("fixed bottom-8 right-6 z-50 flex items-center rounded-full bg-gradient-to-r from-pink-500 to-violet-600 p-4 hover:text-xl transition-all duration-300 ease-out hidden");

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setBtnCls(btnCls.replace(" hidden", ""));
            } else {
                if (!btnCls.includes("hidden")) setBtnCls(btnCls + " hidden");
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [btnCls]);

    return (
        <button className={btnCls} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <FaArrowUp />
        </button>
    );
};

// Components...
const Navbar = () => (
    <nav className="bg-transparent">
        <div className="flex items-center justify-between py-5">
            <div className="flex flex-shrink-0 items-center">
                <a href="/" className="text-[#16f2b3] text-3xl font-bold">ABU SAID</a>
            </div>
            <ul className="mt-4 flex h-screen max-h-0 w-full flex-col items-start text-sm opacity-0 md:mt-0 md:h-auto md:max-h-screen md:w-auto md:flex-row md:space-x-1 md:border-0 md:opacity-100" id="navbar-default">
                {["ABOUT", "EXPERIENCE", "SKILLS", "EDUCATION", "BLOGS", "PROJECTS"].map((item) => (
                    <li key={item}>
                        <a className="block px-4 py-2 no-underline outline-none hover:no-underline" href={`/#${item.toLowerCase()}`}>
                            <div className="text-sm text-white transition-colors duration-300 hover:text-pink-600">{item}</div>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    </nav>
);

const Footer = () => (
    <div className="relative border-t bg-[#0d1224] border-[#353951] text-white">
        <div className="mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem] py-6 lg:py-10">
            <div className="flex justify-center -z-40">
                <div className="absolute top-0 h-[1px] w-1/2 bg-gradient-to-r from-transparent via-violet-500 to-transparent"></div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between">
                <p className="text-sm">
                    © Developer Portfolio by <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/abu-said-bd/" className="text-[#16f2b3]">Abu Said</a>
                </p>
                <div className="flex items-center gap-5">
                    <a target="_blank" rel="noreferrer" href="https://github.com/said7388/developer-portfolio" className="flex items-center gap-2 uppercase hover:text-[#16f2b3]">
                        <IoStar5 /><span>Star</span>
                    </a>
                    <a target="_blank" rel="noreferrer" href="https://github.com/said7388/developer-portfolio/fork" className="flex items-center gap-2 uppercase hover:text-[#16f2b3]">
                        <CgGitFork /><span>Fork</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
);

const HeroSection = () => (
    <section className="relative flex flex-col items-center justify-between py-4 lg:py-12">
        <img src="/hero.svg" alt="Hero" className="absolute -top-[98px] -z-10 w-[1572px] h-[795px]" />
        <div className="grid grid-cols-1 items-start lg:grid-cols-2 lg:gap-12 gap-y-8">
            <div className="order-2 lg:order-1 flex flex-col items-start justify-center p-2 pb-20 md:pb-10 lg:pt-10">
                <h1 className="text-3xl font-bold leading-10 text-white md:font-extrabold lg:text-[2.6rem] lg:leading-[3.5rem]">
                    Hello, <br />This is <span className="text-pink-500">{personalData.name}</span>
                    {` , I'm a Professional `}<span className="text-[#16f2b3]">{personalData.designation}</span>.
                </h1>
                <div className="my-12 flex items-center gap-5">
                    <a href={personalData.github} target="_blank" rel="noreferrer" className="transition-all text-pink-500 hover:scale-125 duration-300"><BsGithub size={30} /></a>
                    <a href={personalData.linkedIn} target="_blank" rel="noreferrer" className="transition-all text-pink-500 hover:scale-125 duration-300"><BsLinkedin size={30} /></a>
                    <a href={personalData.facebook} target="_blank" rel="noreferrer" className="transition-all text-pink-500 hover:scale-125 duration-300"><FaFacebook size={30} /></a>
                    <a href={personalData.leetcode} target="_blank" rel="noreferrer" className="transition-all text-pink-500 hover:scale-125 duration-300"><SiLeetcode size={30} /></a>
                    <a href={personalData.twitter} target="_blank" rel="noreferrer" className="transition-all text-pink-500 hover:scale-125 duration-300"><FaTwitterSquare size={30} /></a>
                </div>
                <div className="flex items-center gap-3">
                    <a href="#contact" className="bg-gradient-to-r to-pink-500 from-violet-600 p-[1px] rounded-full transition-all duration-300 hover:from-pink-500 hover:to-violet-600">
                        <button className="px-3 text-xs md:px-8 py-3 md:py-4 bg-[#0d1224] rounded-full border-none text-center md:text-sm font-medium uppercase tracking-wider text-[#ffff] no-underline transition-all duration-200 ease-out md:font-semibold flex items-center gap-1 hover:gap-3">
                            <span>Contact me</span><RiContactsFill size={16} />
                        </button>
                    </a>
                    <a className="flex items-center gap-1 hover:gap-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-3 md:px-8 py-3 md:py-4 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out hover:text-white hover:no-underline md:font-semibold" role="button" target="_blank" rel="noreferrer" href={personalData.resume}>
                        <span>Get Resume</span><MdDownload size={16} />
                    </a>
                </div>
            </div>
            <div className="order-1 lg:order-2 from-[#0d1224] border-[#1b2c68a0] relative rounded-lg border bg-gradient-to-r to-[#0a0d37]">
                <div className="flex flex-row">
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-pink-500 to-violet-600"></div>
                    <div className="h-[1px] w-full bg-gradient-to-r from-violet-600 to-transparent"></div>
                </div>
                <div className="px-4 lg:px-8 py-5">
                    <div className="flex flex-row space-x-2">
                        <div className="h-3 w-3 rounded-full bg-red-400"></div>
                        <div className="h-3 w-3 rounded-full bg-orange-400"></div>
                        <div className="h-3 w-3 rounded-full bg-green-200"></div>
                    </div>
                </div>
                <div className="overflow-hidden border-t-[2px] border-indigo-900 px-4 lg:px-8 py-4 lg:py-8">
                    <code className="font-mono text-xs md:text-sm lg:text-base">
                        <div className="blink">
                            <span className="mr-2 text-pink-500">const</span>
                            <span className="mr-2 text-white">coder</span>
                            <span className="mr-2 text-pink-500">=</span>
                            <span className="text-gray-400">{'{'}</span>
                        </div>
                        <div>
                            <span className="ml-4 lg:ml-8 mr-2 text-white">name:</span>
                            <span className="text-gray-400">{`'`}</span><span className="text-amber-300">Abu Said</span><span className="text-gray-400">{`',`}</span>
                        </div>
                        <div className="ml-4 lg:ml-8 mr-2">
                            <span className="text-white">skills:</span><span className="text-gray-400">{`['`}</span>
                            <span className="text-amber-300">React</span><span className="text-gray-400">{"', '"}</span>
                            <span className="text-amber-300">NextJS</span><span className="text-gray-400">{"', '"}</span>
                            <span className="text-amber-300">Redux</span><span className="text-gray-400">{"', '"}</span>
                            <span className="text-amber-300">Express</span><span className="text-gray-400">{"', '"}</span>
                            <span className="text-amber-300">NestJS</span><span className="text-gray-400">{"', '"}</span>
                            <span className="text-amber-300">MySql</span><span className="text-gray-400">{"', '"}</span>
                            <span className="text-amber-300">MongoDB</span><span className="text-gray-400">{"', '"}</span>
                            <span className="text-amber-300">Docker</span><span className="text-gray-400">{"', '"}</span>
                            <span className="text-amber-300">AWS</span><span className="text-gray-400">{"'],"}</span>
                        </div>
                        <div>
                            <span className="ml-4 lg:ml-8 mr-2 text-green-400">hireable:</span>
                            <span className="text-orange-400">function</span><span className="text-gray-400">{'() {'}</span>
                        </div>
                        <div><span className="ml-8 lg:ml-16 mr-2 text-orange-400">return</span><span className="text-gray-400">{`(`}</span></div>
                        <div>
                            <span className="ml-12 lg:ml-24 text-cyan-400">this.</span>
                            <span className="mr-2 text-white">hardWorker</span><span className="text-amber-300">&amp;&amp;</span>
                        </div>
                        <div><span className="ml-8 lg:ml-16 mr-2 text-gray-400">{`);`}</span></div>
                        <div><span className="ml-4 lg:ml-8 text-gray-400">{`};`}</span></div>
                        <div><span className="text-gray-400">{`};`}</span></div>
                    </code>
                </div>
            </div>
        </div>
    </section>
);

const AboutSection = () => (
    <div id="about" className="my-12 lg:my-16 relative">
        <div className="hidden lg:flex flex-col items-center absolute top-16 -right-8">
            <span className="bg-[#1a1443] w-fit text-white rotate-90 p-2 px-5 text-xl rounded-md">ABOUT ME</span>
            <span className="h-36 w-[2px] bg-[#1a1443]"></span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            <div className="order-2 lg:order-1">
                <p className="font-medium mb-5 text-[#16f2b3] text-xl uppercase">Who I am?</p>
                <p className="text-gray-200 text-sm lg:text-lg">{personalData.description}</p>
            </div>
            <div className="flex justify-center order-1 lg:order-2">
                <img src={personalData.profile} alt="Abu Said" className="w-[280px] h-[280px] rounded-lg grayscale hover:grayscale-0 hover:scale-110 cursor-pointer object-cover transition-all duration-1000" />
            </div>
        </div>
    </div>
);

const Skills = () => (
    <div id="skills" className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
        <div className="w-[100px] h-[100px] bg-violet-100 rounded-full absolute top-6 left-[42%] translate-x-1/2 filter blur-3xl opacity-20"></div>
        <div className="flex justify-center -translate-y-[1px]">
            <div className="w-3/4"><div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent w-full" /></div>
        </div>
        <div className="flex justify-center my-5 lg:py-8">
            <div className="flex items-center">
                <span className="w-24 h-[2px] bg-[#1a1443]"></span>
                <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-xl rounded-md">Skills</span>
                <span className="w-24 h-[2px] bg-[#1a1443]"></span>
            </div>
        </div>
        <div className="w-full my-12">
            <Marquee gradient={false} speed={80} pauseOnHover={true} pauseOnClick={true} delay={0} play={true} direction="left">
                {skillsData.map((skill, id) => (
                    <div className="w-36 min-w-fit h-fit flex flex-col items-center justify-center transition-all duration-500 m-3 sm:m-5 rounded-lg group relative hover:scale-[1.15] cursor-pointer" key={id}>
                        <div className="h-full w-full rounded-lg border border-[#1f223c] bg-[#11152c] shadow-none shadow-gray-50 group-hover:border-violet-500 transition-all duration-500">
                            <div className="flex -translate-y-[1px] justify-center">
                                <div className="w-3/4"><div className="h-[1px] w-full bg-gradient-to-r from-transparent via-violet-500 to-transparent" /></div>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-3 p-6">
                                <div className="h-8 sm:h-10">
                                    <img src={skillsImage(skill)} alt={skill} className="h-full w-auto rounded-lg" />
                                </div>
                                <p className="text-white text-sm sm:text-lg">{skill}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </Marquee>
        </div>
    </div>
);

const Experience = () => (
    <div id="experience" className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
        <img src="/section.svg" alt="Hero" className="absolute top-0 -z-10 w-[1572px] h-[795px]" />
        <div className="flex justify-center my-5 lg:py-8">
            <div className="flex items-center">
                <span className="w-24 h-[2px] bg-[#1a1443]"></span>
                <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-xl rounded-md">Experiences</span>
                <span className="w-24 h-[2px] bg-[#1a1443]"></span>
            </div>
        </div>
        <div className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                <div className="flex justify-center items-start">
                    <div className="w-full h-full">
                        {/* Lottie JSON animation removed for brevity, replace with image or real code if necessary. Assuming user provides their own or you fetch it. */}
                        <div className="w-full h-64 bg-gray-800 animate-pulse rounded-lg flex items-center justify-center">Lottie Animation</div>
                    </div>
                </div>
                <div>
                    <div className="flex flex-col gap-6">
                        {experiences.map(experience => (
                            <GlowCard key={experience.id} identifier={`experience-${experience.id}`}>
                                <div className="p-3 relative">
                                    <img src="/blur-23.svg" alt="Hero" className="absolute bottom-0 opacity-80 w-[1080px] h-[200px]" />
                                    <div className="flex justify-center">
                                        <p className="text-xs sm:text-sm text-[#16f2b3]">{experience.duration}</p>
                                    </div>
                                    <div className="flex items-center gap-x-8 px-3 py-5">
                                        <div className="text-violet-500 transition-all duration-300 hover:scale-125">
                                            <BsPersonWorkspace size={36} />
                                        </div>
                                        <div>
                                            <p className="text-base sm:text-xl mb-2 font-medium uppercase">{experience.title}</p>
                                            <p className="text-sm sm:text-base">{experience.company}</p>
                                        </div>
                                    </div>
                                </div>
                            </GlowCard>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const Education = () => (
    <div id="education" className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
        <img src="/section.svg" alt="Hero" className="absolute top-0 -z-10 w-[1572px] h-[795px]" />
        <div className="flex justify-center -translate-y-[1px]">
            <div className="w-3/4"><div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent w-full" /></div>
        </div>
        <div className="flex justify-center my-5 lg:py-8">
            <div className="flex items-center">
                <span className="w-24 h-[2px] bg-[#1a1443]"></span>
                <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-xl rounded-md">Educations</span>
                <span className="w-24 h-[2px] bg-[#1a1443]"></span>
            </div>
        </div>
        <div className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                <div className="flex justify-center items-start">
                    <div className="w-3/4 h-3/4">
                        <div className="w-full h-64 bg-gray-800 animate-pulse rounded-lg flex items-center justify-center">Lottie Animation</div>
                    </div>
                </div>
                <div>
                    <div className="flex flex-col gap-6">
                        {educations.map(education => (
                            <GlowCard key={education.id} identifier={`education-${education.id}`}>
                                <div className="p-3 relative text-white">
                                    <img src="/blur-23.svg" alt="Hero" className="absolute bottom-0 opacity-80 w-[1080px] h-[200px]" />
                                    <div className="flex justify-center">
                                        <p className="text-xs sm:text-sm text-[#16f2b3]">{education.duration}</p>
                                    </div>
                                    <div className="flex items-center gap-x-8 px-3 py-5">
                                        <div className="text-violet-500 transition-all duration-300 hover:scale-125">
                                            <BsPersonWorkspace size={36} />
                                        </div>
                                        <div>
                                            <p className="text-base sm:text-xl mb-2 font-medium uppercase">{education.title}</p>
                                            <p className="text-sm sm:text-base">{education.institution}</p>
                                        </div>
                                    </div>
                                </div>
                            </GlowCard>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ProjectCard = ({ project }) => (
    <div className="from-[#0d1224] border-[#1b2c68a0] relative rounded-lg border bg-gradient-to-r to-[#0a0d37] w-full">
        <div className="flex flex-row">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-pink-500 to-violet-600"></div>
            <div className="h-[1px] w-full bg-gradient-to-r from-violet-600 to-transparent"></div>
        </div>
        <div className="px-4 lg:px-8 py-3 lg:py-5 relative">
            <div className="flex flex-row space-x-1 lg:space-x-2 absolute top-1/2 -translate-y-1/2">
                <div className="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-red-400"></div>
                <div className="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-orange-400"></div>
                <div className="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-green-200"></div>
            </div>
            <p className="text-center ml-3 text-[#16f2b3] text-base lg:text-xl">{project.name}</p>
        </div>
        <div className="overflow-hidden border-t-[2px] border-indigo-900 px-4 lg:px-8 py-4 lg:py-8">
            <code className="font-mono text-xs md:text-sm lg:text-base">
                <div className="blink">
                    <span className="mr-2 text-pink-500">const</span><span className="mr-2 text-white">project</span><span className="mr-2 text-pink-500">=</span><span className="text-gray-400">{'{'}</span>
                </div>
                <div>
                    <span className="ml-4 lg:ml-8 mr-2 text-white">name:</span><span className="text-gray-400">{`'`}</span><span className="text-amber-300">{project.name}</span><span className="text-gray-400">{`',`}</span>
                </div>
                <div className="ml-4 lg:ml-8 mr-2">
                    <span className="text-white">tools:</span><span className="text-gray-400">{` ['`}</span>
                    {project.tools.map((tag, i) => (
                        <React.Fragment key={i}>
                            <span className="text-amber-300">{tag}</span>
                            {project.tools?.length - 1 !== i && <span className="text-gray-400">{`', '`}</span>}
                        </React.Fragment>
                    ))}
                    <span className="text-gray-400">{"],"}</span>
                </div>
                <div>
                    <span className="ml-4 lg:ml-8 mr-2 text-white">myRole:</span><span className="text-orange-400">{project.role}</span><span className="text-gray-400">,</span>
                </div>
                <div className="ml-4 lg:ml-8 mr-2">
                    <span className="text-white">Description:</span><span className="text-cyan-400">{' ' + project.description}</span><span className="text-gray-400">,</span>
                </div>
                <div><span className="text-gray-400">{`};`}</span></div>
            </code>
        </div>
    </div>
);

const Projects = () => (
    <div id='projects' className="relative z-50 my-12 lg:my-24">
        <div className="sticky top-10">
            <div className="w-[80px] h-[80px] bg-violet-100 rounded-full absolute -top-3 left-0 translate-x-1/2 filter blur-3xl opacity-30"></div>
            <div className="flex items-center justify-start relative">
                <span className="bg-[#1a1443] absolute left-0 w-fit text-white px-5 py-3 text-xl rounded-md">PROJECTS</span>
                <span className="w-full h-[2px] bg-[#1a1443]"></span>
            </div>
        </div>
        <div className="pt-24">
            <div className="flex flex-col gap-6">
                {projectsData.slice(0, 4).map((project, index) => (
                    <div id={`sticky-card-${index + 1}`} key={index} className="sticky-card w-full mx-auto max-w-2xl sticky">
                        <div className="box-border flex items-center justify-center rounded shadow-[0_0_30px_0_rgba(0,0,0,0.3)] transition-all duration-[0.5s]">
                            <ProjectCard project={project} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const BlogCard = ({ blog }) => (
    <div className="border border-[#1d293a] hover:border-[#464c6a] transition-all duration-500 bg-[#1b203e] rounded-lg relative group">
        <div className="h-44 lg:h-52 w-auto cursor-pointer overflow-hidden rounded-t-lg">
            <img src={blog?.cover_image} alt="" className='h-full w-full group-hover:scale-110 transition-all duration-300 object-cover' />
        </div>
        <div className="p-2 sm:p-3 flex flex-col">
            <div className="flex justify-between items-center text-[#16f2b3] text-sm">
                <p>{timeConverter(blog.published_at)}</p>
                <div className="flex items-center gap-3">
                    <p className="flex items-center gap-1"><BsHeartFill /><span>{blog.public_reactions_count}</span></p>
                    {blog.comments_count > 0 && <p className="flex items-center gap-1"><FaCommentAlt /><span>{blog.comments_count}</span></p>}
                </div>
            </div>
            <a target='_blank' rel="noreferrer" href={blog.url}>
                <p className='my-2 lg:my-3 cursor-pointer text-lg text-white sm:text-xl font-medium hover:text-violet-500'>
                    {blog.title}
                </p>
            </a>
            <p className='mb-2 text-sm text-[#16f2b3]'>{`${blog.reading_time_minutes} Min Read`}</p>
            <p className='text-sm lg:text-base text-[#d3d8e8] pb-3 lg:pb-6 line-clamp-3'>{blog.description}</p>
        </div>
    </div>
);

const Blog = ({ blogs }) => (
    <div id='blogs' className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
        <div className="w-[100px] h-[100px] bg-violet-100 rounded-full absolute top-6 left-[42%] translate-x-1/2 filter blur-3xl opacity-20"></div>
        <div className="flex justify-center -translate-y-[1px]">
            <div className="w-3/4"><div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent w-full" /></div>
        </div>
        <div className="flex justify-center my-5 lg:py-8">
            <div className="flex items-center">
                <span className="w-24 h-[2px] bg-[#1a1443]"></span>
                <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-xl rounded-md">Blogs</span>
                <span className="w-24 h-[2px] bg-[#1a1443]"></span>
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 lg:gap-8 xl:gap-10">
            {blogs.slice(0, 6).map((blog, i) => blog?.cover_image && <BlogCard blog={blog} key={i} />)}
        </div>
        <div className="flex justify-center mt-5 lg:mt-12">
            <a className="flex items-center gap-1 hover:gap-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-3 md:px-8 py-3 md:py-4 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out hover:text-white hover:no-underline md:font-semibold" role="button" href="/blog">
                <span>View More</span><FaArrowRight size={16} />
            </a>
        </div>
    </div>
);

const ContactForm = () => {
    const [error, setError] = useState({ email: false, required: false });
    const [isLoading, setIsLoading] = useState(false);
    const [userInput, setUserInput] = useState({ name: "", email: "", message: "" });

    const isValidEmail = (email) => {
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    };

    const checkRequired = () => {
        if (userInput.email && userInput.message && userInput.name) {
            setError({ ...error, required: false });
        }
    };

    const handleSendMail = async (e) => {
        e.preventDefault();
        if (!userInput.email || !userInput.message || !userInput.name) {
            setError({ ...error, required: true });
            return;
        } else if (error.email) {
            return;
        } else {
            setError({ ...error, required: false });
        }

        try {
            setIsLoading(true);
            // Example dummy post using your personal email
            // In standalone React, without Next.js backend, you will need a real external endpoint like EmailJS, Formspree, etc.
            // const res = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/contact`, userInput);
            setTimeout(() => {
                toast.success("Message sent successfully!");
                setUserInput({ name: "", email: "", message: "" });
                setIsLoading(false);
            }, 1000);

        } catch (error) {
            toast.error(error?.response?.data?.message || "Error");
            setIsLoading(false);
        }
    };

    return (
        <div>
            <p className="font-medium mb-5 text-[#16f2b3] text-xl uppercase">Contact with me</p>
            <div className="max-w-3xl text-white rounded-lg border border-[#464c6a] p-3 lg:p-5">
                <p className="text-sm text-[#d3d8e8]">{"If you have any questions or concerns, please don't hesitate to contact me."}</p>
                <div className="mt-6 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-base">Your Name: </label>
                        <input className="bg-[#10172d] w-full border rounded-md border-[#353a52] focus:border-[#16f2b3] ring-0 outline-0 transition-all duration-300 px-3 py-2" type="text" maxLength="100" required={true} onChange={(e) => setUserInput({ ...userInput, name: e.target.value })} onBlur={checkRequired} value={userInput.name} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-base">Your Email: </label>
                        <input className="bg-[#10172d] w-full border rounded-md border-[#353a52] focus:border-[#16f2b3] ring-0 outline-0 transition-all duration-300 px-3 py-2" type="email" maxLength="100" required={true} value={userInput.email} onChange={(e) => setUserInput({ ...userInput, email: e.target.value })} onBlur={() => { checkRequired(); setError({ ...error, email: !isValidEmail(userInput.email) }); }} />
                        {error.email && <p className="text-sm text-red-400">Please provide a valid email!</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-base">Your Message: </label>
                        <textarea className="bg-[#10172d] w-full border rounded-md border-[#353a52] focus:border-[#16f2b3] ring-0 outline-0 transition-all duration-300 px-3 py-2" maxLength="500" name="message" required={true} onChange={(e) => setUserInput({ ...userInput, message: e.target.value })} onBlur={checkRequired} rows="4" value={userInput.message} />
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        {error.required && <p className="text-sm text-red-400">All fiels are required!</p>}
                        <button className="flex items-center gap-1 hover:gap-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-5 md:px-12 py-2.5 md:py-3 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out hover:text-white hover:no-underline md:font-semibold" role="button" onClick={handleSendMail} disabled={isLoading}>
                            {isLoading ? <span>Sending Message...</span> : <span className="flex items-center gap-1">Send Message <TbMailForward size={20} /></span>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ContactSection = () => (
    <div id="contact" className="my-12 lg:my-16 relative mt-24 text-white">
        <div className="hidden lg:flex flex-col items-center absolute top-24 -right-8">
            <span className="bg-[#1a1443] w-fit text-white rotate-90 p-2 px-5 text-xl rounded-md">CONTACT</span>
            <span className="h-36 w-[2px] bg-[#1a1443]"></span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <ContactForm />
            <div className="lg:w-3/4 ">
                <div className="flex flex-col gap-5 lg:gap-9">
                    <p className="text-sm md:text-xl flex items-center gap-3">
                        <MdAlternateEmail className="bg-[#8b98a5] p-2 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer" size={36} />
                        <span>{personalData.email}</span>
                    </p>
                    <p className="text-sm md:text-xl flex items-center gap-3">
                        <IoMdCall className="bg-[#8b98a5] p-2 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer" size={36} />
                        <span>{personalData.phone}</span>
                    </p>
                    <p className="text-sm md:text-xl flex items-center gap-3">
                        <CiLocationOn className="bg-[#8b98a5] p-2 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer" size={36} />
                        <span>{personalData.address}</span>
                    </p>
                </div>
                <div className="mt-8 lg:mt-16 flex items-center gap-5 lg:gap-10">
                    <a target="_blank" rel="noreferrer" href={personalData.github}><IoLogoGithub className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer" size={48} /></a>
                    <a target="_blank" rel="noreferrer" href={personalData.linkedIn}><BiLogoLinkedin className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer" size={48} /></a>
                    <a target="_blank" rel="noreferrer" href={personalData.twitter}><FaXTwitter className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer" size={48} /></a>
                    <a target="_blank" rel="noreferrer" href={personalData.stackOverflow}><FaStackOverflow className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer" size={48} /></a>
                    <a target="_blank" rel="noreferrer" href={personalData.facebook}><FaFacebook className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer" size={48} /></a>
                </div>
            </div>
        </div>
    </div>
);

export default function FullPage() {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        // Fetch blogs from dev.to as per Next.js original logic
        fetch(`https://dev.to/api/articles?username=${personalData.devUsername}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const filtered = data.filter((item) => item?.cover_image).sort(() => Math.random() - 0.5);
                    setBlogs(filtered);
                }
            })
            .catch(console.error);
    }, []);

    return (
        <div className="bg-[#0d1224] min-h-screen relative mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem] text-white">
            <ToastContainer />
            <Navbar />
            <HeroSection />
            <AboutSection />
            <Experience />
            <Skills />
            <Projects />
            <Education />
            <Blog blogs={blogs} />
            <ContactSection />
            <ScrollToTop />
            <Footer />
        </div>
    );
}
