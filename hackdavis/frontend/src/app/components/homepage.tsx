'use client'

import React from "react";
import "../globals.css"
import Image from "next/image";
import Header from "./header";
import Footer from "./footer";

export default function HomePage() {

    const doSomething = () => {
        console.log("Clicked");
    }

    return (
        <div>

            <Header />

            <main>
                <section className="pl-40 pt-44 flex flex-col items-center">
                    <div className="flex w-full">
                        <div className="flex-1">
                            <h2 className="text-blue-950 font-bold text-2xl">Navigate your degree with ease.</h2>
                            <p className="py-3">Coursetool aims to simplify the degree planning process.</p>
                            <button className="rounded-xl bg-yellow-400 px-4 py-1 text-blue-950 font-semibold transition duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1" onClick={doSomething}>
                                Create a Schedule
                            </button>
                            <br></br>
                            <div className="pt-4"></div>
                            <button className="text-blue-600 rounded-xl border font-semibold px-6 py-1 transition duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1" onClick={doSomething}>
                                Degree Mapper
                            </button>
                        </div>
                        <div className="flex-1 -mt-20">
                            <Image src="/aggie-logo.png" width={664} height={531} alt="Aggie logo" />
                        </div>
                    </div>
                </section>

                <div className="w-full flex justify-center pb-5">
                    <a href="#read-more" className="translate mt-4 flex flex-col items-center">
                        <p><u>Read More</u></p>
                        <p>&#9660;</p>
                    </a>
                </div>

                <section className="bg-blue-950 text-white">
                    <div className="py-20 text-center">
                        <p className="font-bold text-4xl pb-5">Our Mission</p>
                        <p className="font-semibold text-base">How can we help students alleviate stress in their class planning processes?</p>
                        <p>Course Tool provides tools for students to visualize their class schedules and <br></br>prerequisite requirements.</p>
                    </div>
                </section>

                <section className="relative pb-20">
                    <p className="py-10 text-center text-4xl font-semibold">Key Feature</p>
                    <div className="inline-flex items-center bg-blue-500 rounded-r-2xl px-20 py-3 text-white font-semibold">
                        <p id="read-more">Course Planner</p>
                    </div>

                    <div className="flex justify-between px-52 pt-24 pb-20">
                        <div onClick={doSomething} className="flex flex-col items-center transition duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 rounded-3xl cursor-pointer">
                            <div className="flex flex-col justify-end h-[108px]"> 
                                <Image src="/add_notes.png" width={107} height={107} alt="" />
                            </div>
                            <p className="pt-12 font-bold text-lg">Create New Worksheet</p>
                            <p className="text-center px-5 pb-3">Visualize your classes in one place.<br></br>Plan ahead for future quarters.</p>
                        </div>
                        <div onClick={doSomething} className="flex flex-col items-center transition duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 rounded-3xl cursor-pointer">
                            <div className="flex flex-col justify-end h-[108px]">
                                <Image src="/manage_search.png" width={108} height={70} alt="" />
                            </div>
                            <p className="pt-12 font-bold text-lg">Search for Classes</p>
                            <p className="text-center px-5 pb-3">Explore all UC Davis classes to<br></br>add to your worksheets.</p>
                        </div>
                        <div onClick={doSomething} className="flex flex-col items-center transition duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 rounded-3xl cursor-pointer">
                            <div className="flex flex-col justify-end h-[108px]">
                                <Image src="/task.png" width={86} height={108} alt="" />
                            </div>
                            <p className="pt-12 font-bold text-lg">Generate a Schedule</p>
                            <p className="text-center px-5 pb-3">Receive suggested classes and view<br></br>projected requirements.</p>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <div className="inline-flex items-center bg-blue-500 rounded-l-2xl px-20 py-3 text-white font-semibold">
                            <p>Degree Mapper</p>
                        </div>
                    </div>

                    <div className="flex justify-between px-40 pt-24 pb-32 border-b">
                        <div onClick={doSomething} className="flex flex-col items-center transition duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 rounded-3xl cursor-pointer">
                            <div className="flex flex-col justify-end h-[108px]"> 
                                <Image src="/checklist.png" width={94} height={68} alt="" />
                            </div>
                            <p className="pt-12 font-bold text-lg">See Course Prerequisites</p>
                            <p className="text-center px-5 pb-3">Access detailed information on the<br></br>requirements needed before enrolling in a course.</p>
                        </div>
                        <div onClick={doSomething} className="flex flex-col items-center transition duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 rounded-3xl cursor-pointer">
                            <div className="flex flex-col justify-end h-[108px]">
                                <Image src="/schema.png" width={91} height={118} alt="" />
                            </div>
                            <p className="pt-12 font-bold text-lg">Track Degree Progress</p>
                            <p className="text-center px-5 pb-3">See your exact degree completion<br></br>percentage and what classes you still need.</p>
                        </div>
                        <div onClick={doSomething} className="flex flex-col items-center transition duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 rounded-3xl cursor-pointer">
                            <div className="flex flex-col justify-end h-[108px]">
                                <Image src="/school.png" width={117} height={97} alt="" />
                            </div>
                            <p className="pt-12 font-bold text-lg">Customize Majors and Minors</p>
                            <p className="text-center px-5 pb-3">Browse through 100+ majors and minors<br></br>at UC Davis to see your transferable courses.</p>
                        </div>
                    </div>

                    <div className="flex px-32 py-24 space-x-12">
                        <div className="flex-shrink-0">
                            <Image src="/codelab-group-photo.png" width={535} height={337} alt="" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <p className="font-bold text-4xl pb-7">Who we are</p>
                            <p className="text-left" style={{ textAlign: "justify" }}>CodeLab is an organization at UC Davis working to provide students with real-world experience in the software industry. CodeLab members develop their technical skills by working in interdisciplinary teams on projects over the course of one or more academic quarters.</p>
                        </div>  
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}