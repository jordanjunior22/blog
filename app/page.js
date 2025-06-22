"use client"
import { UserProvider } from "@/context/userContext";
import Featured from "@/components/user/Featured";
import Hero from "@/components/user/Hero";
import LatestPost from "@/components/user/LatestPost";
import Quotes from "@/components/user/Quotes";
import Categories from "@/components/user/Categories";
import About from "@/components/user/About";
import SubscribeCTA from "@/components/SubscribeCTA";

export default function Home() {
  return (
    <div className="">
      <Hero />
      <Featured />
      <LatestPost />
      <Quotes />
      <Categories />
      <About />
      <SubscribeCTA/>
    </div>
  );
}
