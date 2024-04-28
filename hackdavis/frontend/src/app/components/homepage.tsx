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
                     <h2 className="text-sky-950 font-bold text-2xl">Make food choices with confidence.</h2>
                    <p className="py-3">Quickly check any product for allergens or dietary restrictions.</p>
                        <div className="flex flex-row space-x-4"> {/* Added flex container */}
                         <button className="text-yellow-400 bg-sky-950 rounded-xl border font-semibold px-6 py-1 transition duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1" onClick={doSomething}>
                          Scan an Item
                         </button>
                        <button className="text-yellow-400 bg-sky-950 rounded-xl border font-semibold px-6 py-1 transition duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1" onClick={doSomething}>
                           Search Database
                        </button>
                        </div>
                    </div>
                        <div className="flex-1 -mt-40">
                            <Image src="/diet-icon-new.jpg" width={450} height={450} alt="Aggie logo" />
                        </div>
                    </div>
                </section>


                <section className="bg-sky-950 text-white">
                    <div className="py-20 text-center">
                        <p className="font-bold text-4xl pb-5">What We Do</p>
                        <p className="font-semibold text-base">Making ingredient checking easier.</p>
                        <p>Scan barcodes to check for allergens or other dietary restrictions<br></br>or search an existing database.</p>
                    </div>
                </section>

                <section className="relative pb-20">
                    <p className="py-10 text-center text-4xl font-semibold">Features</p>

                    <div className="flex justify-between px-10 pt-24 pb-20">
                        <div onClick={doSomething} className="border flex flex-col items-center transition duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 rounded-3xl cursor-pointer">
                            <div className="flex flex-col justify-end h-[160px]"> 
                                <Image src="/file-plus.svg" width={107} height={107} alt="" />
                            </div>
                            <p className="pt-12 font-bold text-lg">Update Dietary Restrictions</p>
                            <p className="text-center px-5 pb-3">Enter allergies or other preferences.<br></br>Quickly filter using these fields.</p>
                        </div>
                        <div onClick={doSomething} className="border flex flex-col items-center transition duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 rounded-3xl cursor-pointer">
                            <div className="flex flex-col justify-end h-[160px]">
                                <Image src="/camera.svg" width={108} height={70} alt="" />
                            </div>
                            <p className="pt-12 font-bold text-lg">Scan Barcodes</p>
                            <p className="text-center px-5 pb-3">Take a picture to quickly determine<br></br>if an item meets your needs.</p>
                        </div>
                        <div onClick={doSomething} className="border flex flex-col items-center transition duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 rounded-3xl cursor-pointer">
                            <div className="flex flex-col justify-end h-[160px]">
                                <Image src="/search.svg" width={86} height={108} alt="" />
                            </div>
                            <p className="pt-12 font-bold text-lg">Search an Existing Database</p>
                            <p className="text-center px-5 pb-3">View entries scanned by other users.<br></br>Search by various filters.</p>
                        </div>
                        <div onClick={doSomething} className="border flex flex-col items-center transition duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 rounded-3xl cursor-pointer">
                            <div className="flex flex-col justify-end h-[160px]">
                                <Image src="/rotate-ccw.svg" width={86} height={108} alt="" />
                            </div>
                            <p className="pt-12 font-bold text-lg">View Past Scans</p>
                            <p className="text-center px-5 pb-3">Review scans you have previously<br></br>uploaded, in order.</p>
                        </div>
                    </div>



                    {/* <div className="flex px-32 py-24 space-x-12">
                        <div className="flex-shrink-0">
                            <Image src="/codelab-group-photo.png" width={535} height={337} alt="" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <p className="font-bold text-4xl pb-7">Who we are</p>
                            <p className="text-left" style={{ textAlign: "justify" }}>CodeLab is an organization at UC Davis working to provide students with real-world experience in the software industry. CodeLab members develop their technical skills by working in interdisciplinary teams on projects over the course of one or more academic quarters.</p>
                        </div>  
                    </div> */}
                </section>
            </main>

            <Footer />
        </div>
    );
}