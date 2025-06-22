import React from 'react'
import Hero from '@/components/user/Explore/Hero'
import Latest from '@/components/user/Explore/Latest'
import Categories from '@/components/user/Categories'
import SubscribeCTA from '@/components/SubscribeCTA'

function page() {
    return (
        <div>
            <Hero />
            <Latest/>
            <Categories/>
            <SubscribeCTA/>
        </div>
    )
}

export default page