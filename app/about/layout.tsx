import { AboutNav } from '@/components/OverveiwComponents/aboutNav';
import React from 'react';

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
        <div className='mt-40'></div>
        {children}
        <AboutNav />
        </>      
    );
}