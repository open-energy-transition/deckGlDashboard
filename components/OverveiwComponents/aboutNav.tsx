import Link from 'next/link'
import React from 'react'

export const AboutNav = () => {
  return (
    <>
    <Link href="/about/vision">vision</Link>
    <Link href="/about/method">methods</Link>
    <Link href="/about/limitations">limitations</Link>
    <Link href="/about/next-steps">next-steps</Link>
    </>
  )
}

